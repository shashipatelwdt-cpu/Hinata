const { 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus, 
  VoiceConnectionStatus, 
  entersState, 
  StreamType, 
  NoSubscriberBehavior 
} = require('@discordjs/voice');
const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  Routes
} = require('discord.js');
const { spawn } = require('child_process');
const path = require('path');

// Ensure FFmpeg is configured for audio decoding
try {
  const ffmpegStatic = require('ffmpeg-static');
  if (ffmpegStatic) {
    process.env.FFMPEG_PATH = ffmpegStatic;
    const ffmpegDir = path.dirname(ffmpegStatic);
    process.env.PATH = `${ffmpegDir}${path.delimiter}${process.env.PATH}`;
  }
} catch (e) {}

const play = require('play-dl');
const config = require('../../config.json');
const { getYtDlpPath } = require('./ytUtils');

function cleanSongTitle(title) {
  if (!title || typeof title !== 'string') return '';
  return title
    .replace(/\(Official.*?\)/gi, '')
    .replace(/\[Official.*?\]/gi, '')
    .replace(/\(Audio.*?\)/gi, '')
    .replace(/\[Audio.*?\]/gi, '')
    .replace(/\(Lyric.*?\)/gi, '')
    .replace(/\[Lyric.*?\]/gi, '')
    .replace(/\(4K.*?\)/gi, '')
    .replace(/\[4K.*?\]/gi, '')
    .replace(/\|.*$/g, '')
    .replace(/ft\..*$/gi, '')
    .replace(/feat\..*$/gi, '')
    .trim();
}

function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

class GuildQueue {
  constructor(manager, guild, voiceChannel, textChannel, connection) {
    this.manager = manager;
    this.guild = guild;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.connection = connection;

    // Create audio player with optimal buffering behavior
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
        maxMissedFrames: 500
      }
    });

    this.songs = [];
    this.currentSong = null;
    this.currentProcess = null;
    this.currentResource = null;
    this.loopMode = 'off'; // 'off', 'track', 'queue'
    this.volume = 100; // 0 - 200
    this.autoplay = true; // Smart recommendation on queue finish (like Spotify Radio)
    this.playedHistory = new Set(); // Track played IDs, URLs, and titles
    this.isPlaying = false;
    this.isPaused = false;
    this.idleTimer = null;
    this.emptyTimeout = null;
    this.progressInterval = null;
    this.nowPlayingMessage = null;

    if (this.connection && typeof this.connection.subscribe === 'function') {
      this.connection.subscribe(this.player);
    }
    this.client = this.guild?.client;
    this.lastPlayedSong = null;
    this.isFetchingAutoplay = false;
    this.consecutiveErrors = 0;
    this.isManuallySkipped = false;
    this.setupListeners();

    // Check if voice channel is initially empty
    if (this.voiceChannel && this.voiceChannel.members) {
      const nonBots = this.voiceChannel.members.filter(m => !m.user.bot);
      if (nonBots.size === 0) {
        this.startEmptyChannelTimer();
      }
    }
  }

  async setVoiceStatus(statusText) {
    try {
      const currentVC = this.guild?.members?.me?.voice?.channel || this.voiceChannel;
      if (!currentVC || !this.client?.rest) return;
      const cleanStatus = (statusText || '').slice(0, 100);
      await this.client.rest.put(Routes.channelVoiceStatus(currentVC.id), {
        body: { status: cleanStatus }
      }).catch(() => null);
    } catch (e) {}
  }

  async clearVoiceStatus() {
    try {
      const currentVC = this.guild?.members?.me?.voice?.channel || this.voiceChannel;
      if (!currentVC || !this.client?.rest) return;
      await this.client.rest.put(Routes.channelVoiceStatus(currentVC.id), {
        body: { status: '' }
      }).catch(() => null);
    } catch (e) {}
  }

  async checkAutoplayPrefetch() {
    if (!this.autoplay || this.isFetchingAutoplay) return;
    if (this.songs.length < 2 && (this.currentSong || this.lastPlayedSong)) {
      this.isFetchingAutoplay = true;
      try {
        const seedSong = this.songs[this.songs.length - 1] || this.currentSong || this.lastPlayedSong;
        const queuedUrls = this.songs.map(s => s.url);
        const recSong = await this.manager.getRecommendations(seedSong, Array.from(this.playedHistory), queuedUrls);
        if (recSong) {
          const alreadyQueued = this.songs.some(s => s.url === recSong.url || s.title.toLowerCase() === recSong.title.toLowerCase());
          if (!alreadyQueued && (!this.currentSong || this.currentSong.url !== recSong.url)) {
            this.songs.push(recSong);
            if (this.textChannel) {
              this.textChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('📻 Smart Autoplay • Matching Your Taste')
                    .setDescription(`Upcoming next track based on **${seedSong.title}**:\n**[${recSong.title}](${recSong.url})**`)
                    .setColor(config.embedColors?.primary || '#5865F2')
                    .setFooter({ text: `Hinata Smart Radio • ${recSong.author || 'Music'}` })
                ]
              }).then(m => setTimeout(() => m.delete().catch(() => null), 8000)).catch(() => null);
            }
          }
        }
      } catch (e) {
        console.warn('[AUTOPLAY PREFETCH ERROR]:', e.message);
      } finally {
        this.isFetchingAutoplay = false;
      }
    }
  }

  setupListeners() {
    // Reset consecutive error counter when audio is actively playing
    this.player.on(AudioPlayerStatus.Playing, () => {
      this.consecutiveErrors = 0;
    });

    // Player idle handling
    this.player.on(AudioPlayerStatus.Idle, async (oldState) => {
      if (oldState.status === AudioPlayerStatus.Playing || oldState.status === AudioPlayerStatus.Buffering) {
        const elapsed = this.currentSong?.startedAt ? (Date.now() - this.currentSong.startedAt) : 0;
        
        // Check if stream ended prematurely (< 2500ms) without manual skip
        if (elapsed < 2500 && this.currentSong && !this.isManuallySkipped) {
          this.consecutiveErrors = (this.consecutiveErrors || 0) + 1;
          console.warn(`[STREAM PREMATURE END] Song "${this.currentSong.title}" stream ended early (${elapsed}ms). Consecutive errors: ${this.consecutiveErrors}`);
          
          if (this.consecutiveErrors >= 4) {
            console.error('[AUTOPLAY CIRCUIT BREAKER]: 4 consecutive stream failures. Stopping autoplay loop.');
            this.isPlaying = false;
            this.stopLiveTimer();
            if (this.textChannel) {
              this.textChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setTitle('⚠️ Playback Paused')
                    .setDescription('Multiple audio streams could not be loaded due to network limits.\nAutoplay has been paused. Use `/play` to resume with a new track.')
                    .setColor(config.embedColors?.danger || '#ED4245')
                ]
              }).then(m => setTimeout(() => m.delete().catch(() => null), 12000)).catch(() => null);
            }
            this.currentSong = null;
            this.songs = [];
            return;
          }
        } else {
          this.consecutiveErrors = 0;
        }

        this.isManuallySkipped = false;
        this.isPlaying = false;
        this.stopLiveTimer();
        this.handleSongEnd();
      }
    });

    // Player error handling
    this.player.on('error', (error) => {
      console.error(`[MUSIC ERROR in Guild ${this.guild.id}]:`, error.message);
      this.consecutiveErrors = (this.consecutiveErrors || 0) + 1;
      this.stopLiveTimer();
      this.handleSongEnd();
    });

    // Connection state listeners
    if (this.connection && typeof this.connection.on === 'function') {
      this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000)
          ]);
        } catch {
          this.destroy();
        }
      });

      this.connection.on(VoiceConnectionStatus.Destroyed, () => {
        this.destroy();
      });
    }
  }

  parseDurationToSeconds(dur) {
    if (!dur || typeof dur !== 'string') return 0;
    const parts = dur.split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return 0;
  }

  /**
   * High-Performance Low-Latency Audio Stream Resolver
   * Utilizes FFmpeg native libopus encoding (160kbps stereo) with instant packet flushing
   * Eliminates JS Opus CPU stalls, audio frame drops, and latency bottlenecks
   */
  async getLiveAudioStream(song) {
    if (!song) return null;

    const ytDlpPath = getYtDlpPath();
    const ffmpegPath = require('ffmpeg-static') || process.env.FFMPEG_PATH || 'ffmpeg';
    const { PassThrough } = require('stream');
    const { execFile } = require('child_process');

    const volumeLevel = Math.max(0.05, Math.min(2.0, (this.volume || 100) / 100));

    const commonYtDlpArgs = [
      '--js-runtimes', 'node',
      '--no-playlist',
      '--no-check-certificates',
      '--no-warnings',
      '--prefer-free-formats',
      '--geo-bypass',
      '--socket-timeout', '10',
      '--no-cache-dir'
    ];

    // Method 0: Instant sub-second stream resolver via play-dl (SoundCloud & progressive CDN)
    const streamWithPlayDl = async (targetUrl) => {
      try {
        if (this.manager && typeof this.manager.initSoundCloud === 'function') {
          await this.manager.initSoundCloud();
        }
        const directStream = await play.stream(targetUrl);
        if (directStream && directStream.stream) {
          const ffmpegProc = spawn(ffmpegPath, [
            '-i', 'pipe:0',
            '-analyzeduration', '0',
            '-probesize', '32768',
            '-fflags', '+nobuffer+flush_packets',
            '-loglevel', '0',
            '-af', `volume=${volumeLevel}`,
            '-c:a', 'libopus',
            '-b:a', '160k',
            '-ar', '48000',
            '-ac', '2',
            '-f', 'ogg',
            'pipe:1'
          ], {
            stdio: ['pipe', 'pipe', 'ignore']
          });

          const passThrough = new PassThrough({ highWaterMark: 32 * 1024 });

          directStream.stream.on('error', () => {});
          ffmpegProc.stdin.on('error', () => {});
          ffmpegProc.stdout.on('error', () => {});
          passThrough.on('error', () => {});

          directStream.stream.pipe(ffmpegProc.stdin);
          ffmpegProc.stdout.pipe(passThrough);

          const cleanup = () => {
            try { directStream.stream.destroy(); } catch {}
            try { ffmpegProc.kill(); } catch {}
          };

          return new Promise((resolve) => {
            let isResolved = false;
            const timeout = setTimeout(() => {
              if (!isResolved) {
                isResolved = true;
                cleanup();
                resolve(null);
              }
            }, 15000);

            passThrough.once('data', (chunk) => {
              if (!isResolved) {
                isResolved = true;
                clearTimeout(timeout);
                passThrough.pause();
                passThrough.unshift(chunk);
                resolve({
                  stream: passThrough,
                  process: { kill: cleanup },
                  type: StreamType.OggOpus
                });
              }
            });

            ffmpegProc.on('error', () => {
              if (!isResolved) {
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve(null);
              }
            });

            ffmpegProc.on('close', (code) => {
              if (!isResolved && code !== 0) {
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve(null);
              }
            });
          });
        }
      } catch (err) {
        console.warn('[PLAY-DL DIRECT STREAM WARN]:', err.message);
      }
      return null;
    };

    // Method A: Pipe from yt-dlp through native FFmpeg libopus OggOpus
    const streamWithPipeline = async (target) => {
      if (!ytDlpPath || !target) return null;
      return new Promise((resolve) => {
        let isResolved = false;
        let ytProc = null;
        let ffmpegProc = null;

        const cleanup = () => {
          try { if (ytProc) ytProc.kill(); } catch {}
          try { if (ffmpegProc) ffmpegProc.kill(); } catch {}
        };

        try {
          ytProc = spawn(ytDlpPath, [
            target,
            ...commonYtDlpArgs,
            '-o', '-',
            '-f', '251/140/ba/b/bestaudio',
            '--limit-rate', '50M',
            '--buffer-size', '64K'
          ], {
            stdio: ['ignore', 'pipe', 'ignore']
          });

          ffmpegProc = spawn(ffmpegPath, [
            '-i', 'pipe:0',
            '-analyzeduration', '0',
            '-probesize', '32768',
            '-fflags', '+nobuffer+flush_packets',
            '-loglevel', '0',
            '-af', `volume=${volumeLevel}`,
            '-c:a', 'libopus',
            '-b:a', '160k',
            '-ar', '48000',
            '-ac', '2',
            '-f', 'ogg',
            'pipe:1'
          ], {
            stdio: ['pipe', 'pipe', 'ignore']
          });

          const passThrough = new PassThrough({ highWaterMark: 64 * 1024 });

          ytProc.stdout.on('error', () => {});
          ffmpegProc.stdin.on('error', () => {});
          ffmpegProc.stdout.on('error', () => {});
          passThrough.on('error', () => {});

          ytProc.stdout.pipe(ffmpegProc.stdin);
          ffmpegProc.stdout.pipe(passThrough);

          const timeout = setTimeout(() => {
            if (!isResolved) {
              isResolved = true;
              cleanup();
              resolve(null);
            }
          }, 20000);

          passThrough.once('data', (chunk) => {
            if (!isResolved) {
              isResolved = true;
              clearTimeout(timeout);
              passThrough.pause();
              passThrough.unshift(chunk);
              resolve({
                stream: passThrough,
                process: { kill: cleanup },
                type: StreamType.OggOpus
              });
            }
          });

          ytProc.on('error', (err) => {
            console.warn('[YT-DLP PROC ERROR]:', err.message);
            if (!isResolved) {
              isResolved = true;
              clearTimeout(timeout);
              cleanup();
              resolve(null);
            }
          });

          ffmpegProc.on('error', (err) => {
            console.warn('[FFMPEG PROC ERROR]:', err.message);
            if (!isResolved) {
              isResolved = true;
              clearTimeout(timeout);
              cleanup();
              resolve(null);
            }
          });

          ytProc.on('close', (code) => {
            if (!isResolved && code !== 0) {
              isResolved = true;
              clearTimeout(timeout);
              cleanup();
              resolve(null);
            }
          });
        } catch (e) {
          console.warn('[PIPELINE SPAWN ERROR]:', e.message);
          cleanup();
          resolve(null);
        }
      });
    };

    // Method B: Direct extracted media URL through native FFmpeg libopus OggOpus
    const streamWithExtractedUrl = async (target) => {
      if (!ytDlpPath || !target) return null;
      return new Promise((resolve) => {
        let isResolved = false;
        let ffmpegProc = null;

        const cleanup = () => {
          try { if (ffmpegProc) ffmpegProc.kill(); } catch {}
        };

        const timeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            cleanup();
            resolve(null);
          }
        }, 20000);

        try {
          execFile(ytDlpPath, [
            target,
            ...commonYtDlpArgs,
            '-g',
            '-f', '251/140/ba/b/bestaudio'
          ], { timeout: 12000 }, (err, stdout) => {
            if (err || !stdout || isResolved) {
              if (!isResolved) {
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve(null);
              }
              return;
            }

            const mediaUrl = stdout.trim().split('\n')[0].trim();
            if (!mediaUrl || !mediaUrl.startsWith('http')) {
              if (!isResolved) {
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve(null);
              }
              return;
            }

            ffmpegProc = spawn(ffmpegPath, [
              '-reconnect', '1',
              '-reconnect_streamed', '1',
              '-reconnect_delay_max', '4',
              '-i', mediaUrl,
              '-analyzeduration', '0',
              '-probesize', '32768',
              '-fflags', '+nobuffer+flush_packets',
              '-loglevel', '0',
              '-af', `volume=${volumeLevel}`,
              '-c:a', 'libopus',
              '-b:a', '160k',
              '-ar', '48000',
              '-ac', '2',
              '-f', 'ogg',
              'pipe:1'
            ], {
              stdio: ['ignore', 'pipe', 'ignore']
            });

            const passThrough = new PassThrough({ highWaterMark: 64 * 1024 });
            ffmpegProc.stdout.on('error', () => {});
            passThrough.on('error', () => {});
            ffmpegProc.stdout.pipe(passThrough);

            passThrough.once('data', (chunk) => {
              if (!isResolved) {
                isResolved = true;
                clearTimeout(timeout);
                passThrough.pause();
                passThrough.unshift(chunk);
                resolve({
                  stream: passThrough,
                  process: { kill: cleanup },
                  type: StreamType.OggOpus
                });
              }
            });

            ffmpegProc.on('error', () => {
              if (!isResolved) {
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve(null);
              }
            });

            ffmpegProc.on('close', (code) => {
              if (!isResolved && code !== 0) {
                isResolved = true;
                clearTimeout(timeout);
                cleanup();
                resolve(null);
              }
            });
          });
        } catch (e) {
          cleanup();
          resolve(null);
        }
      });
    };

    // 0. Instant Direct Stream for SoundCloud / progressive audio
    if (song.url && (song.url.includes('soundcloud.com') || song.source === 'soundcloud')) {
      const resDl = await streamWithPlayDl(song.url);
      if (resDl && resDl.stream) {
        this.currentProcess = resDl.process;
        return resDl;
      }
    }

    // 1. Direct song URL with yt-dlp + FFmpeg libopus pipe
    if (song.url && (song.url.startsWith('http://') || song.url.startsWith('https://'))) {
      const res = await streamWithPipeline(song.url);
      if (res && res.stream) {
        this.currentProcess = res.process;
        return res;
      }

      // Tier 2: Extracted CDN Media URL via yt-dlp -g
      const resUrl = await streamWithExtractedUrl(song.url);
      if (resUrl && resUrl.stream) {
        this.currentProcess = resUrl.process;
        return resUrl;
      }
    }

    // 3. Search-based yt-dlp stream (resolves tracks if URL was blocked or invalid)
    const cleanTitle = cleanSongTitle(song.title || '');
    if (cleanTitle) {
      const searchTarget = `ytsearch1:${cleanTitle} ${song.author || ''}`.trim();
      const res = await streamWithPipeline(searchTarget);
      if (res && res.stream) {
        this.currentProcess = res.process;
        return res;
      }

      const resUrl = await streamWithExtractedUrl(searchTarget);
      if (resUrl && resUrl.stream) {
        this.currentProcess = resUrl.process;
        return resUrl;
      }
    }

    // 4. SoundCloud fallback via yt-dlp
    if (cleanTitle) {
      const scTarget = song.url && song.url.includes('soundcloud.com') ? song.url : `scsearch1:${cleanTitle} ${song.author || ''}`.trim();
      const resSc = await streamWithPipeline(scTarget);
      if (resSc && resSc.stream) {
        this.currentProcess = resSc.process;
        return resSc;
      }
    }

    return null;
  }

  async playNext() {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }

    this.stopLiveTimer();

    if (this.currentProcess) {
      try { this.currentProcess.kill(); } catch {}
      this.currentProcess = null;
    }

    // 1. Check if voice channel exists
    const currentVC = this.guild?.members?.me?.voice?.channel || this.voiceChannel;
    if (!currentVC) {
      this.destroy();
      return;
    }

    const nonBots = currentVC.members ? currentVC.members.filter(m => !m.user.bot) : [];
    const humanCount = nonBots.size !== undefined ? nonBots.size : (Array.isArray(nonBots) ? nonBots.length : 0);

    if (humanCount === 0) {
      this.startEmptyChannelTimer(20000);
    } else {
      this.cancelEmptyChannelTimer();
    }

    // 2. If queue is empty, trigger Smart Autoplay / Radio (Spotify-like taste match)
    if (this.songs.length === 0 && this.autoplay && (this.currentSong || this.lastPlayedSong)) {
      const prevSong = this.currentSong || this.lastPlayedSong;
      try {
        const queuedUrls = this.songs.map(s => s.url);
        const recSong = await this.manager.getRecommendations(prevSong, Array.from(this.playedHistory), queuedUrls);
        if (recSong) {
          this.songs.push(recSong);
          this.consecutiveErrors = 0;
          if (this.textChannel) {
            this.textChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle('📻 Smart Autoplay • Matching Your Taste')
                  .setDescription(`Auto-queueing next track based on **${prevSong.title}**:\n**[${recSong.title}](${recSong.url})**`)
                  .setColor(config.embedColors?.primary || '#5865F2')
                  .setFooter({ text: `Hinata Smart Radio • ${recSong.author || 'Music'}` })
              ]
            }).then(m => setTimeout(() => m.delete().catch(() => null), 9000)).catch(() => null);
          }
        }
      } catch (recErr) {
        console.warn('[AUTOPLAY NEXT ERROR]:', recErr.message);
      }
    }

    if (this.songs.length === 0) {
      this.clearVoiceStatus();
      this.currentSong = null;
      this.isPlaying = false;
      
      // Auto-disconnect timer if idle for 3 minutes
      this.idleTimer = setTimeout(() => {
        if (this.songs.length === 0 && !this.isPlaying) {
          if (this.textChannel) {
            this.textChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setDescription('💤 **Queue finished! Left voice channel due to inactivity.**')
                  .setColor(config.embedColors?.neutral || '#2B2D31')
              ]
            }).catch(() => null);
          }
          this.destroy();
        }
      }, 180000);
      return;
    }

    this.currentSong = this.songs.shift();

    // Track history to avoid repetitions (up to 200 items)
    if (this.currentSong) {
      if (this.currentSong.url) this.playedHistory.add(this.currentSong.url.toLowerCase());
      if (this.currentSong.title) {
        this.playedHistory.add(this.currentSong.title.toLowerCase());
        this.playedHistory.add(cleanSongTitle(this.currentSong.title).toLowerCase());
      }
      const vId = extractYouTubeVideoId(this.currentSong.url);
      if (vId) this.playedHistory.add(vId.toLowerCase());

      if (this.playedHistory.size > 200) {
        const firstKey = this.playedHistory.values().next().value;
        this.playedHistory.delete(firstKey);
      }
    }

    try {
      // Ensure connection is in Ready status before starting playback
      if (this.connection.state.status !== VoiceConnectionStatus.Ready) {
        try {
          await entersState(this.connection, VoiceConnectionStatus.Ready, 15_000);
        } catch (connErr) {
          console.warn('[VOICE READY WARNING]:', connErr.message);
        }
      }

      this.connection.subscribe(this.player);

      const streamData = await this.getLiveAudioStream(this.currentSong);
      if (!streamData || !streamData.stream) {
        throw new Error('Could not resolve audio stream for track');
      }

      const isRawStream = streamData.type === StreamType.Raw;
      const resource = createAudioResource(streamData.stream, {
        inputType: streamData.type || StreamType.OggOpus,
        inlineVolume: isRawStream
      });

      if (resource.playStream) {
        resource.playStream.on('error', (err) => {
          console.warn('[AUDIO RESOURCE STREAM ERROR]:', err.message);
        });
      }

      if (resource.volume) {
        resource.volume.setVolume(this.volume / 100);
      }
      this.currentResource = resource;

      this.player.play(resource);
      this.isPlaying = true;
      this.isPaused = false;
      this.currentSong.startedAt = Date.now();
      this.lastPlayedSong = this.currentSong;

      // Update Discord Voice Channel Status (Song Name Under VC)
      this.setVoiceStatus(`🎵 ${this.currentSong.title}`);

      // Background pre-buffer next recommended song (like Spotify seamless radio)
      this.checkAutoplayPrefetch().catch(() => null);

      await this.sendNowPlaying();
      this.startLiveTimer();
    } catch (err) {
      console.error('[PLAY ERROR]', err);
      this.consecutiveErrors = (this.consecutiveErrors || 0) + 1;

      if (this.textChannel) {
        this.textChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('⚠️ Could Not Play Song')
              .setDescription(`Failed to stream **${this.currentSong?.title || 'Track'}**:\n\`${err.message}\`\n${this.consecutiveErrors >= 3 ? 'Playback stopped.' : 'Skipping to next track...'}`)
              .setColor(config.embedColors?.danger || '#ED4245')
          ]
        }).then(m => setTimeout(() => m.delete().catch(() => null), 8000)).catch(() => null);
      }

      if (this.consecutiveErrors < 3) {
        this.playNext();
      } else {
        this.isPlaying = false;
        this.currentSong = null;
      }
    }
  }

  handleSongEnd() {
    this.stopLiveTimer();

    if (this.currentProcess) {
      try { this.currentProcess.kill(); } catch {}
      this.currentProcess = null;
    }

    if (!this.currentSong) {
      this.playNext();
      return;
    }

    if (this.loopMode === 'track' && (this.consecutiveErrors || 0) === 0) {
      this.songs.unshift(this.currentSong);
    } else if (this.loopMode === 'queue' && (this.consecutiveErrors || 0) === 0) {
      this.songs.push(this.currentSong);
    }

    this.playNext();
  }

  buildNowPlayingEmbed() {
    if (!this.currentSong) return null;

    const current = this.currentSong;

    let elapsed = 0;
    if (this.currentResource && typeof this.currentResource.playbackDuration === 'number' && this.currentResource.playbackDuration > 0) {
      elapsed = Math.floor(this.currentResource.playbackDuration / 1000);
    } else if (current.startedAt && this.isPlaying && !this.isPaused) {
      elapsed = Math.floor((Date.now() - current.startedAt) / 1000);
    }

    const totalSec = current.durationSec || this.parseDurationToSeconds(current.duration) || 0;
    
    // Generate progress bar
    const barLength = 14;
    const progress = totalSec > 0 ? Math.min(Math.floor((elapsed / totalSec) * barLength), barLength) : 0;
    const progressBar = '▬'.repeat(Math.max(0, progress)) + '🔘' + '▬'.repeat(Math.max(0, barLength - progress - 1));
    const timeFormatted = `${this.formatTime(elapsed)} / ${current.duration || (totalSec > 0 ? this.formatTime(totalSec) : 'Live')}`;

    const loopStatus = this.loopMode === 'track' ? '🔂 Track' : this.loopMode === 'queue' ? '🔁 Queue' : '❌ Off';
    const autoplayStatus = this.autoplay ? '📻 ON' : '❌ OFF';
    const statusIcon = this.isPaused ? '⏸️ Paused' : '▶️ Playing';

    const requesterDisplay = current.source === 'autoplay'
      ? '🤖 Smart Autoplay (Taste Match)'
      : (current.requester ? `<@${current.requester.id}>` : 'Unknown');

    const embed = new EmbedBuilder()
      .setTitle(`🎵 ${current.title}`)
      .setURL(current.url)
      .setDescription(
        `**[${current.title}](${current.url})**\n\n` +
        `\`${progressBar}\` \`${timeFormatted}\`\n\n` +
        `**Status:** ${statusIcon} • **Volume:** \`${this.volume}%\` • **Loop:** \`${loopStatus}\` • **Autoplay:** \`${autoplayStatus}\`\n` +
        `**Channel:** ${this.voiceChannel ? `<#${this.voiceChannel.id}>` : 'Voice'} • **Queued:** \`${this.songs.length} track(s)\``
      )
      .addFields(
        { name: '👤 Source / Requester', value: requesterDisplay, inline: true },
        { name: '⏱️ Duration', value: `\`${current.duration || 'Unknown'}\``, inline: true },
        { name: '📺 Author / Channel', value: `\`${current.author || 'Music'}\``, inline: true }
      )
      .setColor(config.embedColors?.primary || '#5865F2')
      .setTimestamp();

    if (current.thumbnail) {
      embed.setThumbnail(current.thumbnail);
    }

    embed.setFooter({
      text: `Hinata Music Engine • Autoplay: ${this.autoplay ? 'ENABLED' : 'DISABLED'} • Loop: ${this.loopMode.toUpperCase()}`,
      iconURL: this.guild.client.user.displayAvatarURL()
    });

    return embed;
  }

  buildControlsRow() {
    const playPauseBtn = new ButtonBuilder()
      .setCustomId('music_play_pause')
      .setEmoji(this.isPaused ? '▶️' : '⏸️')
      .setStyle(this.isPaused ? ButtonStyle.Success : ButtonStyle.Primary);

    const skipBtn = new ButtonBuilder()
      .setCustomId('music_skip')
      .setEmoji('⏭️')
      .setStyle(ButtonStyle.Secondary);

    const stopBtn = new ButtonBuilder()
      .setCustomId('music_stop')
      .setEmoji('⏹️')
      .setStyle(ButtonStyle.Danger);

    const loopBtn = new ButtonBuilder()
      .setCustomId('music_loop')
      .setEmoji('🔁')
      .setStyle(this.loopMode !== 'off' ? ButtonStyle.Success : ButtonStyle.Secondary);

    const shuffleBtn = new ButtonBuilder()
      .setCustomId('music_shuffle')
      .setEmoji('🔀')
      .setStyle(ButtonStyle.Secondary);

    const row1 = new ActionRowBuilder().addComponents(playPauseBtn, skipBtn, stopBtn, loopBtn, shuffleBtn);

    const volDownBtn = new ButtonBuilder()
      .setCustomId('music_vol_down')
      .setEmoji('🔉')
      .setLabel('Vol -10%')
      .setStyle(ButtonStyle.Secondary);

    const volUpBtn = new ButtonBuilder()
      .setCustomId('music_vol_up')
      .setEmoji('🔊')
      .setLabel('Vol +10%')
      .setStyle(ButtonStyle.Secondary);

    const autoplayBtn = new ButtonBuilder()
      .setCustomId('music_autoplay')
      .setEmoji('📻')
      .setLabel(`Autoplay: ${this.autoplay ? 'ON' : 'OFF'}`)
      .setStyle(this.autoplay ? ButtonStyle.Success : ButtonStyle.Secondary);

    const queueBtn = new ButtonBuilder()
      .setCustomId('music_queue')
      .setEmoji('📜')
      .setLabel('Queue')
      .setStyle(ButtonStyle.Primary);

    const row2 = new ActionRowBuilder().addComponents(volDownBtn, volUpBtn, autoplayBtn, queueBtn);

    return [row1, row2];
  }

  startLiveTimer() {
    this.stopLiveTimer();
    this.progressInterval = setInterval(() => {
      if (this.isPlaying && !this.isPaused && this.nowPlayingMessage && this.currentSong) {
        const embed = this.buildNowPlayingEmbed();
        const rows = this.buildControlsRow();
        if (embed) {
          this.nowPlayingMessage.edit({ embeds: [embed], components: rows }).catch(() => null);
        }
      }
    }, 7000);
  }

  stopLiveTimer() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  async sendNowPlaying() {
    if (!this.textChannel || !this.currentSong) return;

    try {
      const embed = this.buildNowPlayingEmbed();
      const rows = this.buildControlsRow();

      if (this.nowPlayingMessage) {
        this.nowPlayingMessage.delete().catch(() => null);
      }

      this.nowPlayingMessage = await this.textChannel.send({
        embeds: [embed],
        components: rows
      });
    } catch (err) {
      console.error('[NOW PLAYING ERROR]', err);
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(200, vol));
    if (this.currentResource && this.currentResource.volume) {
      this.currentResource.volume.setVolume(this.volume / 100);
    }
    return this.volume;
  }

  pause() {
    if (this.isPlaying && !this.isPaused) {
      this.player.pause();
      this.isPaused = true;
      this.setVoiceStatus(`⏸️ Paused: ${this.currentSong?.title || 'Music'}`);
      return true;
    }
    return false;
  }

  resume() {
    if (this.isPaused) {
      this.player.unpause();
      this.isPaused = false;
      this.setVoiceStatus(`🎵 ${this.currentSong?.title || 'Music'}`);
      return true;
    }
    return false;
  }

  skip() {
    if (this.isPlaying || this.isPaused) {
      this.isManuallySkipped = true;
      this.player.stop();
      return true;
    }
    return false;
  }

  stop() {
    this.clearVoiceStatus();
    this.stopLiveTimer();
    if (this.currentProcess) {
      try { this.currentProcess.kill(); } catch {}
      this.currentProcess = null;
    }
    this.songs = [];
    this.currentSong = null;
    this.isPlaying = false;
    this.player.stop();
    this.destroy();
  }

  shuffle() {
    for (let i = this.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
    }
    return this.songs;
  }

  toggleLoop() {
    if (this.loopMode === 'off') this.loopMode = 'track';
    else if (this.loopMode === 'track') this.loopMode = 'queue';
    else this.loopMode = 'off';
    return this.loopMode;
  }

  toggleAutoplay() {
    this.autoplay = !this.autoplay;
    return this.autoplay;
  }

  startEmptyChannelTimer(timeoutMs = 15000) {
    if (this.emptyTimeout) return;

    this.emptyTimeout = setTimeout(() => {
      const currentVC = this.guild?.members?.me?.voice?.channel || this.voiceChannel;
      if (!currentVC) {
        this.destroy();
        return;
      }

      const currentChannel = this.guild.channels.cache.get(currentVC.id) || currentVC;
      const nonBots = currentChannel.members ? currentChannel.members.filter(m => !m.user.bot) : [];
      const humanCount = nonBots.size !== undefined ? nonBots.size : (Array.isArray(nonBots) ? nonBots.length : 0);

      if (humanCount === 0) {
        if (this.textChannel) {
          this.textChannel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle('👋 Voice Channel Inactive')
                .setDescription(`Disconnected from **${currentChannel.name || 'Voice Channel'}** because everyone left the channel.`)
                .setColor(config.embedColors?.neutral || '#2B2D31')
                .setFooter({ text: `${config.botName || 'Hinata'} • Auto Inactive Leave` })
            ]
          }).then(m => setTimeout(() => m.delete().catch(() => null), 15000)).catch(() => null);
        }
        this.destroy();
      } else {
        this.emptyTimeout = null;
      }
    }, timeoutMs);
  }

  cancelEmptyChannelTimer() {
    if (this.emptyTimeout) {
      clearTimeout(this.emptyTimeout);
      this.emptyTimeout = null;
    }
  }

  destroy() {
    this.clearVoiceStatus();
    this.cancelEmptyChannelTimer();
    this.stopLiveTimer();
    if (this.currentProcess) {
      try { this.currentProcess.kill(); } catch {}
      this.currentProcess = null;
    }
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    this.songs = [];
    this.currentSong = null;
    this.isPlaying = false;
    this.isPaused = false;
    try {
      this.player.stop(true);
      if (this.connection && this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
        this.connection.destroy();
      }
    } catch {}
    this.manager.destroyQueue(this.guild.id);
  }
}

module.exports = GuildQueue;
