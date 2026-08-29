const { joinVoiceChannel } = require('@discordjs/voice');
const { spawn } = require('child_process');
const path = require('path');
const play = require('play-dl');
const ytSearch = require('yt-search');
const GuildQueue = require('./GuildQueue');
const { getYtDlpPath } = require('./ytUtils');

function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

function extractYouTubePlaylistId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/[?&]list=([^"&?\/\s]+)/i);
  return match ? match[1] : null;
}

function formatDurationSec(s) {
  const n = parseInt(s) || 0;
  const mins = Math.floor(n / 60);
  const secs = n % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

class MusicManager {
  constructor() {
    this.queues = new Map();
    this.initSoundCloud();
  }

  async initSoundCloud() {
    try {
      if (typeof play.getFreeClientID === 'function') {
        const clientID = await play.getFreeClientID().catch(() => null);
        if (clientID) {
          await play.setToken({ soundcloud: { client_id: clientID } }).catch(() => null);
        }
      }
    } catch {}
  }

  getQueue(guildId) {
    return this.queues.get(guildId);
  }

  createQueue(guild, voiceChannel, textChannel) {
    let queue = this.queues.get(guild.id);
    if (queue) {
      if (textChannel) queue.textChannel = textChannel;
      if (voiceChannel && queue.voiceChannel?.id !== voiceChannel.id) {
        queue.voiceChannel = voiceChannel;
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
          selfDeaf: true,
          selfMute: false
        });
        queue.connection = connection;
        connection.subscribe(queue.player);
      }
      return queue;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false
    });

    queue = new GuildQueue(this, guild, voiceChannel, textChannel, connection);
    this.queues.set(guild.id, queue);
    return queue;
  }

  destroyQueue(guildId) {
    this.queues.delete(guildId);
  }

  /**
   * Get smart recommendation / next song matching the current song's taste and genre
   * @param {Object} currentSong 
   * @param {Array<string>} playedHistory 
   * @param {Array<string>} queuedUrls 
   * @returns {Promise<Object|null>}
   */
  async getRecommendations(currentSong, playedHistory = [], queuedUrls = []) {
    if (!currentSong) return null;

    const videoId = extractYouTubeVideoId(currentSong.url);
    const historySet = new Set((playedHistory || []).map(x => String(x).toLowerCase()));
    if (videoId) historySet.add(videoId.toLowerCase());
    if (currentSong.title) historySet.add(currentSong.title.toLowerCase());
    for (const qUrl of (queuedUrls || [])) {
      const qId = extractYouTubeVideoId(qUrl);
      if (qId) historySet.add(qId.toLowerCase());
    }

    // 1. YouTube Mix Radio Algorithm via yt-dlp (RD<videoId>)
    if (videoId) {
      const ytDlpPath = getYtDlpPath();
      if (ytDlpPath) {
        try {
          const results = await new Promise((resolve) => {
            const p = spawn(ytDlpPath, [
              `https://www.youtube.com/watch?v=${videoId}&list=RD${videoId}`,
              '--flat-playlist',
              '--print', '%(title)s === %(id)s === %(duration)s === %(uploader)s',
              '--playlist-items', '2:25'
            ]);

            let output = '';
            p.stdout.on('data', d => output += d.toString());
            p.on('close', () => {
              const lines = output.split('\n').map(l => l.trim()).filter(Boolean);
              const tracks = [];
              for (const line of lines) {
                const parts = line.split(' === ');
                if (parts.length >= 2) {
                  const title = parts[0];
                  const id = parts[1];
                  const durSec = parseInt(parts[2]) || 0;
                  const uploader = parts[3] || 'YouTube';

                  // Prefer individual tracks (between 50s and 900s) and not in history
                  if (
                    id && id.length === 11 &&
                    !historySet.has(id.toLowerCase()) &&
                    !historySet.has(title.toLowerCase()) &&
                    (durSec === 0 || (durSec >= 50 && durSec <= 900))
                  ) {
                    tracks.push({
                      title,
                      url: `https://www.youtube.com/watch?v=${id}`,
                      duration: durSec > 0 ? formatDurationSec(durSec) : 'Unknown',
                      durationSec: durSec,
                      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                      author: uploader,
                      requester: { id: 'autoplay', username: 'Autoplay Engine' },
                      source: 'autoplay'
                    });
                  }
                }
              }
              resolve(tracks);
            });
            p.on('error', () => resolve([]));
            setTimeout(() => { try { p.kill(); } catch {} resolve([]); }, 6000);
          });

          if (results && results.length > 0) {
            return results[0];
          }
        } catch (e) {
          console.warn('[AUTOPLAY YTDLP ERROR]', e.message);
        }
      }
    }

    // 2. Intelligent Search Fallback with yt-search
    try {
      const cleanTitle = (currentSong.title || '')
        .replace(/\(Official.*?\)/gi, '')
        .replace(/\[Official.*?\]/gi, '')
        .replace(/\|.*$/g, '')
        .replace(/ft\..*$/gi, '')
        .trim();

      const searchQueries = [
        `${currentSong.author || ''} ${cleanTitle} similar songs`.trim(),
        `${currentSong.author || ''} songs`.trim(),
        `${cleanTitle} mix`.trim()
      ];

      for (const q of searchQueries) {
        if (!q) continue;
        const res = await ytSearch(q);
        if (res && res.videos && res.videos.length > 0) {
          for (const v of res.videos) {
            const vId = v.videoId;
            const sec = v.seconds || 0;
            if (
              vId &&
              !historySet.has(vId.toLowerCase()) &&
              !historySet.has(v.title.toLowerCase()) &&
              (sec === 0 || (sec >= 50 && sec <= 900))
            ) {
              return {
                title: v.title,
                url: v.url,
                duration: v.timestamp || 'Unknown',
                durationSec: v.seconds || 0,
                thumbnail: v.thumbnail || v.image,
                author: v.author?.name || 'YouTube',
                requester: { id: 'autoplay', username: 'Autoplay Engine' },
                source: 'autoplay'
              };
            }
          }
        }
      }
    } catch (e) {
      console.warn('[AUTOPLAY SEARCH ERROR]', e.message);
    }

    return null;
  }

  async search(query, requester) {
    if (!query || typeof query !== 'string') return [];

    const cleanQuery = query.trim();

    try {
      // 1. Spotify URL Handling (Track, Album, Playlist)
      if (cleanQuery.includes('spotify.com')) {
        try {
          // Public oEmbed resolution (zero config required)
          if (cleanQuery.includes('/track/')) {
            const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(cleanQuery)}`;
            const oembedRes = await fetch(oembedUrl).catch(() => null);
            if (oembedRes && oembedRes.ok) {
              const oembedData = await oembedRes.json();
              if (oembedData.title) {
                const searchKeyword = `${oembedData.title} ${oembedData.author_name || ''}`.trim();
                const ytResults = await ytSearch(searchKeyword);
                const first = ytResults?.videos?.[0];
                if (first) {
                  return [{
                    title: oembedData.title || first.title,
                    url: first.url,
                    duration: first.timestamp || 'Unknown',
                    durationSec: first.seconds || 0,
                    thumbnail: oembedData.thumbnail_url || first.thumbnail,
                    author: oembedData.author_name || first.author?.name || 'Spotify Track',
                    requester,
                    source: 'spotify'
                  }];
                }
              }
            }
          }

          const spType = play.sp_validate(cleanQuery);
          if (spType) {
            if (spType === 'track') {
              const spData = await play.spotify(cleanQuery);
              const ytResults = await ytSearch(`${spData.name} ${spData.artists ? spData.artists.map(a => a.name).join(' ') : ''}`);
              const first = ytResults?.videos?.[0];
              if (first) {
                return [{
                  title: spData.name || first.title,
                  url: first.url,
                  duration: first.timestamp || (spData.durationInSec ? `${Math.floor(spData.durationInSec / 60)}:${(spData.durationInSec % 60).toString().padStart(2, '0')}` : 'Unknown'),
                  durationSec: first.seconds || spData.durationInSec || 0,
                  thumbnail: spData.thumbnail?.url || first.thumbnail,
                  author: spData.artists?.[0]?.name || first.author?.name || 'Spotify Track',
                  requester,
                  source: 'spotify'
                }];
              }
            } else if (spType === 'playlist' || spType === 'album') {
              const spData = await play.spotify(cleanQuery);
              const tracks = await spData.all_tracks();
              const resolvedTracks = [];
              const limit = Math.min(tracks.length, 30);
              for (let i = 0; i < limit; i++) {
                const trk = tracks[i];
                const yt = await ytSearch(`${trk.name} ${trk.artists ? trk.artists.map(a => a.name).join(' ') : ''}`);
                const vid = yt?.videos?.[0];
                if (vid) {
                  resolvedTracks.push({
                    title: trk.name,
                    url: vid.url,
                    duration: vid.timestamp || `${Math.floor(trk.durationInSec / 60)}:${(trk.durationInSec % 60).toString().padStart(2, '0')}`,
                    durationSec: vid.seconds || trk.durationInSec || 0,
                    thumbnail: trk.thumbnail?.url || vid.thumbnail,
                    author: trk.artists?.[0]?.name || vid.author?.name || 'Spotify Track',
                    requester,
                    source: 'spotify'
                  });
                }
              }
              if (resolvedTracks.length > 0) return resolvedTracks;
            }
          }
        } catch (spErr) {
          console.warn('[SPOTIFY RESOLVE ERROR]:', spErr.message);
        }
      }

      // 2. YouTube Playlist Link
      const playlistId = extractYouTubePlaylistId(cleanQuery);
      if (playlistId && cleanQuery.includes('list=')) {
        try {
          const plResults = await ytSearch({ listId: playlistId });
          if (plResults && plResults.videos && plResults.videos.length > 0) {
            return plResults.videos.map(v => ({
              title: v.title || 'Untitled Track',
              url: `https://www.youtube.com/watch?v=${v.videoId}`,
              duration: v.duration?.timestamp || v.timestamp || 'Unknown',
              durationSec: v.duration?.seconds || v.seconds || 0,
              thumbnail: v.thumbnail || v.image,
              author: v.author?.name || 'YouTube',
              requester,
              source: 'youtube'
            }));
          }
        } catch (plErr) {
          console.warn('[YT PLAYLIST SEARCH ERROR]:', plErr.message);
        }
      }

      // 3. Direct YouTube Video Link or Short Link
      const videoId = extractYouTubeVideoId(cleanQuery);
      if (videoId) {
        try {
          const ytRes = await ytSearch({ videoId });
          if (ytRes) {
            return [{
              title: ytRes.title || 'YouTube Track',
              url: `https://www.youtube.com/watch?v=${videoId}`,
              duration: ytRes.duration?.timestamp || ytRes.timestamp || 'Unknown',
              durationSec: ytRes.duration?.seconds || ytRes.seconds || 0,
              thumbnail: ytRes.thumbnail || ytRes.image,
              author: ytRes.author?.name || 'YouTube',
              requester,
              source: 'youtube'
            }];
          }
        } catch (ytErr) {
          console.warn('[YT VIDEO ID SEARCH ERROR]:', ytErr.message);
        }
      }

      // 4. SoundCloud Track Link
      if (cleanQuery.includes('soundcloud.com')) {
        try {
          const scInfo = await play.soundcloud(cleanQuery);
          if (scInfo) {
            return [{
              title: scInfo.name || 'SoundCloud Track',
              url: scInfo.url || cleanQuery,
              duration: scInfo.durationInSec ? `${Math.floor(scInfo.durationInSec / 60)}:${(scInfo.durationInSec % 60).toString().padStart(2, '0')}` : 'Unknown',
              durationSec: scInfo.durationInSec || 0,
              thumbnail: scInfo.thumbnail,
              author: scInfo.user?.name || 'SoundCloud',
              requester,
              source: 'soundcloud'
            }];
          }
        } catch (scErr) {
          console.warn('[SOUNDCLOUD RESOLVE ERROR]:', scErr.message);
        }
      }

      // 5. Keyword / Search fallback with yt-search
      const searchResults = await ytSearch(cleanQuery);
      if (searchResults && searchResults.videos && searchResults.videos.length > 0) {
        const first = searchResults.videos[0];
        return [{
          title: first.title,
          url: first.url,
          duration: first.timestamp,
          durationSec: first.seconds,
          thumbnail: first.thumbnail,
          author: first.author?.name || 'YouTube',
          requester,
          source: 'youtube'
        }];
      }
    } catch (error) {
      console.error('[SEARCH ERROR]:', error.message);
      try {
        const yt = await ytSearch(cleanQuery);
        if (yt?.videos && yt.videos.length > 0) {
          const v = yt.videos[0];
          return [{
            title: v.title,
            url: v.url,
            duration: v.timestamp,
            durationSec: v.seconds,
            thumbnail: v.thumbnail,
            author: v.author?.name || 'YouTube',
            requester,
            source: 'youtube'
          }];
        }
      } catch {}
    }

    return [];
  }
}

// Global Singleton Instance
const managerInstance = new MusicManager();
module.exports = managerInstance;

