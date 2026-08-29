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
  ButtonStyle 
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

class GuildQueue {
  constructor(manager, guild, voiceChannel, textChannel, connection) {
    this.manager = manager;
    this.guild = guild;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.connection = connection;

    // Create player with NoSubscriberBehavior.Play so audio immediately starts without pausing
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
        maxMissedFrames: 250
      }
    });

    this.songs = [];
    this.currentSong = null;
    this.currentProcess = null;
    this.currentResource = null;
    this.loopMode = 'off'; // 'off', 'track', 'queue'
    this.volume = 100; // 0 - 200
    this.autoplay = true; // Smart recommendation on queue finish
    this.playedHistory = new Set(); // Track played URLs/titles
    this.isPlaying = false;
    this.isPaused = false;
    this.idleTimer = null;
    this.progressInterval = null;
    this.nowPlayingMessage = null;

    this.connection.subscribe(this.player);
    this.setupListeners();
  }

  setupListeners() {
    // Player idle -> only handle if we were previously playing a track
    this.player.on(AudioPlayerStatus.Idle, (oldState) => {
      if (oldState.status === AudioPlayerStatus.Playing || oldState.status === AudioPlayerStatus.Buffering) {
        this.isPlaying = false;
        this.stopLiveTimer();
        this.handleSongEnd();
      }
    });

    // Player error handling
    this.player.on('error', (error) => {
      console.error(`[MUSIC ERROR in Guild ${this.guild.id}]:`, error.message);
      this.stopLiveTimer();
      if (this.textChannel) {
        this.textChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('⚠️ Playback Error')
              .setDescription(`Encountered an issue playing **${this.currentSong ? this.currentSong.title : 'Track'}**:\n\`${error.message}\``)
              .setColor(config.embedColors?.danger || '#ED4245')
          ]
        }).catch(() => null);
      }
      this.handleSongEnd();
    });

    // Connection state listeners
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

  parseDurationToSeconds(dur) {
    if (!dur || typeof dur !== 'string') return 0;
    const parts = dur.split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 1) return parts[0];
    return 0;
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

    // If queue is empty, check if Smart Autoplay is enabled
    if (this.songs.length === 0 && this.autoplay && this.currentSong) {
      const prevSong = this.currentSong;
      try {
        const queuedUrls = this.songs.map(s => s.url);
        const recSong = await this.manager.getRecommendations(prevSong, Array.from(this.playedHistory), queuedUrls);
        if (recSong) {
          this.songs.push(recSong);
          if (this.textChannel) {
            this.textChannel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle('📻 Smart Autoplay • Matching Your Taste')
                  .setDescription(`Auto-queueing next track based on **${prevSong.title}**:\n**[${recSong.title}](${recSong.url})**`)
                  .setColor(config.embedColors?.primary || '#5865F2')
                  .setFooter({ text: `Hinata Smart Radio • ${recSong.author || 'YouTube'}` })
              ]
            }).then(m => setTimeout(() => m.delete().catch(() => null), 10000)).catch(() => null);
          }
        }
      } catch (recErr) {
        console.warn('[AUTOPLAY NEXT ERROR]:', recErr.message);
      }
    }

    if (this.songs.length === 0) {
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

    // Track history to avoid repetitions
    if (this.currentSong) {
      if (this.currentSong.url) this.playedHistory.add(this.currentSong.url);
      if (this.currentSong.title) this.playedHistory.add(this.currentSong.title);
      if (this.playedHistory.size > 80) {
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

      let audioStream = null;
      let streamType = StreamType.Arbitrary;

      // 1. Direct SoundCloud stream if URL is from soundcloud
      if (this.currentSong.url && this.currentSong.url.includes('soundcloud.com')) {
        try {
          await this.manager.initSoundCloud();
          const scStream = await play.stream(this.currentSong.url);
          if (scStream && scStream.stream) {
            audioStream = scStream.stream;
            streamType = scStream.type;
          }
        } catch (scErr) {
          console.warn('[SOUNDCLOUD DIRECT STREAM ERROR]:', scErr.message);
        }
      }

      // 2. High-performance yt-dlp streaming with mobile client bypass for datacenter IPs
      if (!audioStream) {
        const ytDlpPath = getYtDlpPath();
        if (ytDlpPath) {
          try {
            const ytProcess = spawn(ytDlpPath, [
              this.currentSong.url,
              '-o', '-',
              '-f', 'ba/b',
              '--extractor-args', 'youtube:player_client=android,mweb,web',
              '--no-playlist',
              '--no-check-certificates',
              '--no-warnings',
              '--limit-rate', '2M',
              '--buffer-size', '64K'
            ], {
              stdio: ['ignore', 'pipe', 'ignore']
            });

            ytProcess.on('error', (err) => {
              console.warn('[YT-DLP PROCESS ERROR]:', err.message);
            });

            this.currentProcess = ytProcess;
            audioStream = ytProcess.stdout;
          } catch (ytdlErr) {
            console.warn('[YT-DLP STREAM FALLBACK]:', ytdlErr.message);
          }
        }
      }

      // 3. Fallback to SoundCloud search & stream if yt-dlp was blocked
      if (!audioStream) {
        try {
          await this.manager.initSoundCloud();
          const searchKeyword = `${this.currentSong.title} ${this.currentSong.author || ''}`.trim();
          const scRes = await play.search(searchKeyword, { source: { soundcloud: 'tracks' }, limit: 1 });
          if (scRes && scRes.length > 0) {
            const scStream = await play.stream(scRes[0].url);
            if (scStream && scStream.stream) {
              audioStream = scStream.stream;
              streamType = scStream.type;
            }
          }
        } catch (fbErr) {
          console.warn('[SOUNDCLOUD FALLBACK STREAM ERROR]:', fbErr.message);
        }
      }

      const resource = createAudioResource(audioStream, {
        inputType: streamType,
        inlineVolume: true
      });

      if (resource.playStream) {
        resource.playStream.on('error', (err) => {
          console.warn('[AUDIO RESOURCE STREAM ERROR]:', err.message);
        });
      }

      resource.volume.setVolume(this.volume / 100);
      this.currentResource = resource;

      this.player.play(resource);
      this.isPlaying = true;
      this.isPaused = false;
      this.currentSong.startedAt = Date.now();

      await this.sendNowPlaying();
      this.startLiveTimer();
    } catch (err) {
      console.error('[PLAY ERROR]', err);
      if (this.textChannel) {
        this.textChannel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('⚠️ Could Not Play Song')
              .setDescription(`Failed to stream **${this.currentSong.title}**:\n\`${err.message}\``)
              .setColor(config.embedColors?.danger || '#ED4245')
          ]
        }).catch(() => null);
      }
      this.playNext();
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

    if (this.loopMode === 'track') {
      this.songs.unshift(this.currentSong);
    } else if (this.loopMode === 'queue') {
      this.songs.push(this.currentSong);
    }

    this.playNext();
  }

  buildNowPlayingEmbed() {
    if (!this.currentSong) return null;

    const current = this.currentSong;

    // Use resource playbackDuration if available for precise frame-accurate time
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
        { name: '📺 Author / Channel', value: `\`${current.author || 'Hinata Music'}\``, inline: true }
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
      return true;
    }
    return false;
  }

  resume() {
    if (this.isPaused) {
      this.player.unpause();
      this.isPaused = false;
      return true;
    }
    return false;
  }

  skip() {
    if (this.isPlaying || this.isPaused) {
      this.player.stop();
      return true;
    }
    return false;
  }

  stop() {
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

  destroy() {
    this.stopLiveTimer();
    if (this.currentProcess) {
      try { this.currentProcess.kill(); } catch {}
      this.currentProcess = null;
    }
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
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

