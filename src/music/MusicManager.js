const { joinVoiceChannel, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { spawn } = require('child_process');
const play = require('play-dl');
const ytSearch = require('yt-search');
const GuildQueue = require('./GuildQueue');
const { getYtDlpPath } = require('./ytUtils');
const { DatabaseManager } = require('../../database/db');
const config = require('../../config.json');

let InnertubeClass = null;
let UniversalCacheClass = null;
try {
  const youtubei = require('youtubei.js');
  InnertubeClass = youtubei.Innertube;
  UniversalCacheClass = youtubei.UniversalCache;
} catch (e) {
  try {
    const youtubeiPath = require.resolve('youtubei.js');
    const youtubei = require(youtubeiPath);
    InnertubeClass = youtubei.Innertube;
    UniversalCacheClass = youtubei.UniversalCache;
  } catch {}
}

function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
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

class MusicManager {
  constructor() {
    this.queues = new Map();
    this.searchCache = new Map();
    this.innertube = null;
    this.innertubePromise = null;
    this.scClientId = null;
    this.scInitPromise = null;
    this.initSoundCloud().catch(() => null);
    this.getInnertube().catch(() => null);
    this.startEmptyWatchdog();
  }

  startEmptyWatchdog() {
    setInterval(() => {
      try {
        for (const [guildId, queue] of this.queues.entries()) {
          const currentVC = queue.guild?.members?.me?.voice?.channel || queue.voiceChannel;
          if (!currentVC) {
            queue.destroy();
            continue;
          }

          const nonBots = currentVC.members ? currentVC.members.filter(m => !m.user.bot) : [];
          const humanCount = nonBots.size !== undefined ? nonBots.size : (Array.isArray(nonBots) ? nonBots.length : 0);

          if (humanCount === 0) {
            queue.startEmptyChannelTimer(20000);
          } else {
            queue.cancelEmptyChannelTimer();
          }
        }
      } catch (err) {
        console.warn('[WATCHDOG ERROR]:', err.message);
      }
    }, 5000);
  }

  async getInnertube() {
    if (this.innertube) return this.innertube;
    if (this.innertubePromise) return this.innertubePromise;

    if (!InnertubeClass) return null;

    this.innertubePromise = (async () => {
      try {
        const cache = UniversalCacheClass ? new UniversalCacheClass(false) : undefined;
        this.innertube = await InnertubeClass.create({
          cache,
          generate_session_locally: true
        });
        return this.innertube;
      } catch (err) {
        console.warn('[INNERTUBE INIT WARN]:', err.message);
        return null;
      } finally {
        this.innertubePromise = null;
      }
    })();

    return this.innertubePromise;
  }

  async initSoundCloud() {
    if (this.scClientId) return this.scClientId;
    if (this.scInitPromise) return this.scInitPromise;

    this.scInitPromise = (async () => {
      try {
        if (typeof play.getFreeClientID === 'function') {
          const clientID = await play.getFreeClientID().catch(() => null);
          if (clientID) {
            this.scClientId = clientID;
            await play.setToken({ soundcloud: { client_id: clientID } }).catch(() => null);
            return clientID;
          }
        }
      } catch (err) {
        console.warn('[SOUNDCLOUD INIT WARN]:', err.message);
      } finally {
        this.scInitPromise = null;
      }
      return null;
    })();

    return this.scInitPromise;
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

    const existingConn = getVoiceConnection(guild.id);
    if (existingConn && (existingConn.state.status === VoiceConnectionStatus.Destroyed || existingConn.state.status === VoiceConnectionStatus.Disconnected)) {
      try { existingConn.destroy(); } catch {}
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
   * Get smart recommendation / next song matching the current song's taste and genre (Spotify / YouTube Music Radio Algorithm)
   * Ensures 0 duplicates by checking against played history and current queue
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
    if (currentSong.title) historySet.add(cleanSongTitle(currentSong.title).toLowerCase());
    if (currentSong.url) historySet.add(currentSong.url.toLowerCase());

    for (const qUrl of (queuedUrls || [])) {
      const qId = extractYouTubeVideoId(qUrl);
      if (qId) historySet.add(qId.toLowerCase());
      if (qUrl) historySet.add(qUrl.toLowerCase());
    }

    // 1. YouTube Music Official Radio Engine (Innertube getUpNext - 50 curated tracks like Spotify Radio)
    if (videoId) {
      try {
        const yt = await this.getInnertube();
        if (yt && yt.music && typeof yt.music.getUpNext === 'function') {
          const upNext = await yt.music.getUpNext(videoId).catch(() => null);
          const contents = upNext?.contents || (Array.isArray(upNext) ? upNext : []);
          
          if (contents && contents.length > 0) {
            for (const item of contents) {
              const vId = item.video_id || item.id;
              const title = item.title?.text || item.title || item.name;
              if (!vId || !title) continue;

              const cleanTitle = cleanSongTitle(title).toLowerCase();
              const durSec = item.duration?.seconds || 0;

              // Filter out songs in played history or currently queued
              if (
                !historySet.has(vId.toLowerCase()) &&
                !historySet.has(cleanTitle) &&
                !historySet.has(`https://www.youtube.com/watch?v=${vId}`.toLowerCase()) &&
                (durSec === 0 || (durSec >= 45 && durSec <= 1200))
              ) {
                return {
                  title,
                  url: `https://www.youtube.com/watch?v=${vId}`,
                  duration: item.duration?.text || (durSec > 0 ? formatDurationSec(durSec) : 'Unknown'),
                  durationSec: durSec,
                  thumbnail: item.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`,
                  author: item.artists?.[0]?.name || item.author?.name || 'YouTube Music',
                  requester: { id: 'autoplay', username: 'Smart Autoplay' },
                  source: 'autoplay'
                };
              }
            }
          }
        }
      } catch (innertubeErr) {
        console.warn('[AUTOPLAY INNERTUBE ERROR]:', innertubeErr.message);
      }
    }

    // 2. YouTube Mix Radio via yt-dlp (RD<videoId> algorithm)
    if (videoId) {
      const ytDlpPath = getYtDlpPath();
      if (ytDlpPath) {
        try {
          const tracks = await new Promise((resolve) => {
            const p = spawn(ytDlpPath, [
              `https://www.youtube.com/watch?v=${videoId}&list=RD${videoId}`,
              '--flat-playlist',
              '--print', '%(title)s === %(id)s === %(duration)s === %(uploader)s',
              '--playlist-items', '2:30',
              '--no-warnings'
            ]);

            let output = '';
            p.stdout.on('data', d => output += d.toString());
            p.on('close', () => {
              const lines = output.split('\n').map(l => l.trim()).filter(Boolean);
              const list = [];
              for (const line of lines) {
                const parts = line.split(' === ');
                if (parts.length >= 2) {
                  const title = parts[0];
                  const id = parts[1];
                  const durSec = parseInt(parts[2]) || 0;
                  const uploader = parts[3] || 'YouTube';
                  const cleanTitle = cleanSongTitle(title).toLowerCase();

                  if (
                    id && id.length === 11 &&
                    !historySet.has(id.toLowerCase()) &&
                    !historySet.has(cleanTitle) &&
                    !historySet.has(`https://www.youtube.com/watch?v=${id}`.toLowerCase()) &&
                    (durSec === 0 || (durSec >= 45 && durSec <= 1200))
                  ) {
                    list.push({
                      title,
                      url: `https://www.youtube.com/watch?v=${id}`,
                      duration: durSec > 0 ? formatDurationSec(durSec) : 'Unknown',
                      durationSec: durSec,
                      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                      author: uploader,
                      requester: { id: 'autoplay', username: 'Smart Autoplay' },
                      source: 'autoplay'
                    });
                  }
                }
              }
              resolve(list);
            });
            p.on('error', () => resolve([]));
            setTimeout(() => { try { p.kill(); } catch {} resolve([]); }, 6000);
          });

          if (tracks && tracks.length > 0) {
            return tracks[0];
          }
        } catch (e) {
          console.warn('[AUTOPLAY YTDLP ERROR]', e.message);
        }
      }
    }

    // 3. Intelligent Search Fallback with yt-search
    try {
      const cleanTitle = cleanSongTitle(currentSong.title || '');
      const cleanAuthor = (currentSong.author || '').replace(/VEVO|Official|Topic|Channel/gi, '').trim();
      
      const searchQueries = [
        `${cleanAuthor} ${cleanTitle} song`.trim(),
        `${cleanAuthor} popular song`.trim(),
        `${cleanTitle} song`.trim(),
        `${cleanAuthor} latest track`.trim()
      ];

      const isCompilationTitle = (t) => {
        return /(jukebox|mashup|all songs|compilation|\b1\s*hour\b|\b2\s*hours\b|\b3\s*hours\b|playlist|mega\s*mix)/i.test(t);
      };

      for (const q of searchQueries) {
        if (!q || q.length < 3) continue;
        const res = await ytSearch(q);
        if (res && res.videos && res.videos.length > 0) {
          for (const v of res.videos) {
            const vId = v.videoId;
            const sec = v.seconds || 0;
            const cleanT = cleanSongTitle(v.title).toLowerCase();
            
            if (
              vId &&
              !historySet.has(vId.toLowerCase()) &&
              !historySet.has(cleanT) &&
              !historySet.has(v.url.toLowerCase()) &&
              !isCompilationTitle(v.title) &&
              (sec === 0 || (sec >= 45 && sec <= 600))
            ) {
              return {
                title: v.title,
                url: v.url,
                duration: v.timestamp || (sec > 0 ? formatDurationSec(sec) : 'Unknown'),
                durationSec: sec,
                thumbnail: v.thumbnail || v.image,
                author: v.author?.name || 'YouTube Music',
                requester: { id: 'autoplay', username: 'Smart Autoplay' },
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
    const cacheKey = cleanQuery.toLowerCase();

    // Check search memory cache (valid for 30 minutes)
    if (this.searchCache.has(cacheKey)) {
      const entry = this.searchCache.get(cacheKey);
      if (Date.now() - entry.time < 1800000 && Array.isArray(entry.results) && entry.results.length > 0) {
        return entry.results.map(r => ({ ...r, requester }));
      }
    }

    const setCache = (results) => {
      if (Array.isArray(results) && results.length > 0) {
        if (this.searchCache.size > 200) {
          const firstKey = this.searchCache.keys().next().value;
          this.searchCache.delete(firstKey);
        }
        this.searchCache.set(cacheKey, { time: Date.now(), results });
      }
      return results;
    };

    try {
      // 0. Custom User Playlist Reference (e.g. "playlist:myfavs" or "pl:chill" or direct playlist name)
      if (requester?.id) {
        const isExplicitPl = /^(playlist|pl):\s*/i.test(cleanQuery);
        const plName = cleanQuery.replace(/^(playlist|pl):\s*/i, '').trim();
        const userPl = DatabaseManager.getPlaylist(requester.id, plName);
        if (userPl && Array.isArray(userPl.tracks) && userPl.tracks.length > 0) {
          return userPl.tracks.map(t => ({
            title: t.title,
            url: t.url,
            duration: t.duration || 'Unknown',
            durationSec: t.durationSec || 0,
            thumbnail: t.thumbnail || `https://i.ytimg.com/vi/${extractYouTubeVideoId(t.url) || 'default'}/hqdefault.jpg`,
            author: t.author || userPl.name,
            requester,
            source: 'user_playlist'
          }));
        }
        if (isExplicitPl && (!userPl || !userPl.tracks.length)) {
          return [];
        }
      }

      // 1. Spotify URL Handling (Track, Album, Playlist)
      if (cleanQuery.includes('spotify.com')) {
        try {
          await this.initSoundCloud();
          let searchKeyword = '';
          let coverArt = null;

          if (cleanQuery.includes('/track/')) {
            const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(cleanQuery)}`;
            const oembedRes = await fetch(oembedUrl).catch(() => null);
            if (oembedRes && oembedRes.ok) {
              const oembedData = await oembedRes.json();
              if (oembedData.title) {
                searchKeyword = `${oembedData.title} ${oembedData.author_name || ''}`.trim();
                coverArt = oembedData.thumbnail_url;
              }
            }
          }

          if (!searchKeyword) {
            const spType = play.sp_validate(cleanQuery);
            if (spType === 'track') {
              const spData = await play.spotify(cleanQuery);
              searchKeyword = `${spData.name} ${spData.artists ? spData.artists.map(a => a.name).join(' ') : ''}`.trim();
              coverArt = spData.thumbnail?.url;
            }
          }

          if (searchKeyword) {
            // Fast SoundCloud resolution for Spotify tracks
            try {
              const scResults = await play.search(searchKeyword, { source: { soundcloud: 'tracks' }, limit: 1 });
              if (scResults && scResults.length > 0 && scResults[0]?.url) {
                const trk = scResults[0];
                return setCache([{
                  title: trk.name || searchKeyword,
                  url: trk.url,
                  duration: trk.durationInSec ? `${Math.floor(trk.durationInSec / 60)}:${(trk.durationInSec % 60).toString().padStart(2, '0')}` : 'Unknown',
                  durationSec: trk.durationInSec || 0,
                  thumbnail: coverArt || trk.thumbnail,
                  author: trk.user?.name || 'Spotify Track',
                  requester,
                  source: 'soundcloud'
                }]);
              }
            } catch {}

            // YouTube fallback for Spotify
            const ytResults = await ytSearch(searchKeyword);
            const first = ytResults?.videos?.[0];
            if (first) {
              return setCache([{
                title: first.title,
                url: first.url,
                duration: first.timestamp || 'Unknown',
                durationSec: first.seconds || 0,
                thumbnail: coverArt || first.thumbnail,
                author: first.author?.name || 'Spotify Track',
                requester,
                source: 'youtube'
              }]);
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
            return setCache(plResults.videos.map(v => ({
              title: v.title || 'Untitled Track',
              url: `https://www.youtube.com/watch?v=${v.videoId}`,
              duration: v.duration?.timestamp || v.timestamp || 'Unknown',
              durationSec: v.duration?.seconds || v.seconds || 0,
              thumbnail: v.thumbnail || v.image,
              author: v.author?.name || 'YouTube',
              requester,
              source: 'youtube'
            })));
          }
        } catch (plErr) {
          console.warn('[YT PLAYLIST SEARCH ERROR]:', plErr.message);
        }
      }

      // 3. Direct YouTube Video Link or Short Link
      const videoId = extractYouTubeVideoId(cleanQuery);
      if (videoId && (cleanQuery.includes('youtube.com') || cleanQuery.includes('youtu.be'))) {
        try {
          const ytRes = await ytSearch({ videoId });
          if (ytRes) {
            return setCache([{
              title: ytRes.title || 'YouTube Track',
              url: `https://www.youtube.com/watch?v=${videoId}`,
              duration: ytRes.duration?.timestamp || ytRes.timestamp || 'Unknown',
              durationSec: ytRes.duration?.seconds || ytRes.seconds || 0,
              thumbnail: ytRes.thumbnail || ytRes.image || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              author: ytRes.author?.name || 'YouTube',
              requester,
              source: 'youtube'
            }]);
          }
        } catch (ytErr) {
          console.warn('[YT VIDEO ID SEARCH ERROR]:', ytErr.message);
        }

        return setCache([{
          title: 'YouTube Track',
          url: `https://www.youtube.com/watch?v=${videoId}`,
          duration: 'Unknown',
          durationSec: 0,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          author: 'YouTube',
          requester,
          source: 'youtube'
        }]);
      }

      // 4. SoundCloud Direct Link
      if (cleanQuery.includes('soundcloud.com')) {
        try {
          await this.initSoundCloud();
          const scInfo = await play.soundcloud(cleanQuery);
          if (scInfo) {
            return setCache([{
              title: scInfo.name || 'SoundCloud Track',
              url: scInfo.url || cleanQuery,
              duration: scInfo.durationInSec ? `${Math.floor(scInfo.durationInSec / 60)}:${(scInfo.durationInSec % 60).toString().padStart(2, '0')}` : 'Unknown',
              durationSec: scInfo.durationInSec || 0,
              thumbnail: scInfo.thumbnail,
              author: scInfo.user?.name || 'SoundCloud',
              requester,
              source: 'soundcloud'
            }]);
          }
        } catch (scErr) {
          console.warn('[SOUNDCLOUD RESOLVE ERROR]:', scErr.message);
        }
      }

      // 5. Keyword Search: Instant Sub-Second Search Engine (SoundCloud HQ -> Fast YouTube Fallback)
      try {
        await this.initSoundCloud();
        const scResults = await play.search(cleanQuery, { source: { soundcloud: 'tracks' }, limit: 1 });
        if (scResults && scResults.length > 0 && scResults[0]?.url) {
          const track = scResults[0];
          return setCache([{
            title: track.name || cleanQuery,
            url: track.url,
            duration: track.durationInSec ? `${Math.floor(track.durationInSec / 60)}:${(track.durationInSec % 60).toString().padStart(2, '0')}` : 'Unknown',
            durationSec: track.durationInSec || 0,
            thumbnail: track.thumbnail || 'https://i.imgur.com/8Q7kYdY.png',
            author: track.user?.name || 'SoundCloud Artist',
            requester,
            source: 'soundcloud'
          }]);
        }
      } catch (scErr) {
        console.warn('[FAST SEARCH SOUNDCLOUD FALLBACK]:', scErr.message);
      }

      // YouTube Search Fallback
      const searchResults = await ytSearch(cleanQuery);
      if (searchResults && searchResults.videos && searchResults.videos.length > 0) {
        const first = searchResults.videos[0];
        return setCache([{
          title: first.title,
          url: first.url,
          duration: first.timestamp || 'Unknown',
          durationSec: first.seconds || 0,
          thumbnail: first.thumbnail || first.image,
          author: first.author?.name || 'YouTube',
          requester,
          source: 'youtube'
        }]);
      }
    } catch (error) {
      console.error('[SEARCH ERROR]:', error.message);
      try {
        const yt = await ytSearch(cleanQuery);
        if (yt?.videos && yt.videos.length > 0) {
          const v = yt.videos[0];
          return setCache([{
            title: v.title,
            url: v.url,
            duration: v.timestamp || 'Unknown',
            durationSec: v.seconds || 0,
            thumbnail: v.thumbnail || v.image,
            author: v.author?.name || 'YouTube',
            requester,
            source: 'youtube'
          }]);
        }
      } catch {}
    }

    return [];
  }
}

// Global Singleton Instance
const managerInstance = new MusicManager();
module.exports = managerInstance;
