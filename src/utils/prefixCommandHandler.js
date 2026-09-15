const { EmbedBuilder, PermissionFlagsBits, ChannelType, AttachmentBuilder } = require('discord.js');
const { generateRankCard } = require('./rankCardGenerator');
const { formatLevelLeaderboard, formatInviteLeaderboard, formatCountingLeaderboard } = require('./leaderboardFormatter');
const MusicManager = require('../music/MusicManager');
const SnipeManager = require('./snipeManager');
const EmbedUtils = require('./embeds');
const config = require('../../config.json');
const { DatabaseManager } = require('../../database/db');

class PrefixCommandHandler {
  /**
   * Check if a message is a prefix command and execute it
   * @param {import('discord.js').Message} message
   * @param {import('discord.js').Client} client
   */
  static async handleMessage(message, client) {
    if (!message.guild || message.author.bot) return false;

    const content = message.content.trim();
    if (!content) return false;

    const guildSettings = DatabaseManager.getGuild(message.guild.id);
    const customPrefix = guildSettings.prefix || config.defaultPrefix || 'h';

    // List of accepted prefixes (supports both r and h)
    const prefixes = [
      customPrefix.toLowerCase(),
      'r ',
      'r!',
      'r.',
      'r-',
      'raw ',
      'raw!',
      'h ',
      'h!',
      'h.',
      'h-',
      'r',
      'h'
    ];

    let matchedPrefix = null;
    const lowerContent = content.toLowerCase();

    // Check bot mention as prefix
    const botMention1 = `<@${client.user.id}>`;
    const botMention2 = `<@!${client.user.id}>`;
    if (lowerContent.startsWith(botMention1.toLowerCase())) {
      matchedPrefix = content.slice(0, botMention1.length);
    } else if (lowerContent.startsWith(botMention2.toLowerCase())) {
      matchedPrefix = content.slice(0, botMention2.length);
    } else {
      // Check standard prefixes
      for (const p of prefixes) {
        if (lowerContent.startsWith(p)) {
          matchedPrefix = content.slice(0, p.length);
          break;
        }
      }
    }

    if (!matchedPrefix) return false;

    // Extract command and arguments
    const rawWithoutPrefix = content.slice(matchedPrefix.length).trim();
    if (!rawWithoutPrefix) {
      // User just typed 'h' or mentioned bot -> show quick help
      if (matchedPrefix.trim().toLowerCase() === 'h' || matchedPrefix.trim().toLowerCase() === 'r' || matchedPrefix.startsWith('<@')) {
        const helpEmbed = new EmbedBuilder()
          .setTitle(`🎵 ${config.botName || 'RAW'} Music & Prefix Commands`)
          .setDescription(
            `Hey ${message.author}! Use prefix commands starting with \`r \` (or \`h \`) or slash commands \`/\`.\n\n` +
            `**🎶 Music Commands:**\n` +
            `• \`h play <song / url>\` — Play music from YouTube, Spotify or SoundCloud\n` +
            `• \`h pause\` / \`h resume\` — Pause or unpause track\n` +
            `• \`h skip [to]\` — Skip current song or skip to queue index\n` +
            `• \`h stop\` — Stop music, clear queue & leave voice\n` +
            `• \`h queue [page]\` — View songs in queue\n` +
            `• \`h np\` — View now playing track & control buttons\n` +
            `• \`h volume <1-150>\` — Set or view playback volume\n` +
            `• \`h loop\` — Toggle song / queue loop\n` +
            `• \`h autoplay [on/off]\` — Toggle Smart Spotify/YouTube taste autoplay\n` +
            `• \`h radio <song/artist>\` — Start 24/7 continuous radio station\n` +
            `• \`h shuffle\` — Shuffle songs in queue\n` +
            `• \`h lyrics [song]\` — Search song lyrics\n` +
            `• \`h panel\` — Spawn persistent music player panel\n\n` +
            `**⚡ Utility Commands:**\n` +
            `• \`h ping\` • \`h avatar [@user]\` • \`h userinfo\` • \`h serverinfo\` • \`h help\``
          )
          .setColor(config.embedColors?.primary || '#5865F2')
          .setFooter({ text: `Type 'h play <song name>' to start playing!` });
        await message.reply({ embeds: [helpEmbed] }).catch(() => null);
        return true;
      }
      return false;
    }

    const args = rawWithoutPrefix.split(/\s+/);
    const cmd = args.shift().toLowerCase();
    const query = args.join(' ').trim();

    switch (cmd) {
      // ==========================================
      // PLAY COMMAND
      // ==========================================
      case 'play':
      case 'p':
      case 'search': {
        const member = message.member;
        const voiceChannel = member?.voice?.channel;

        if (!voiceChannel) {
          return message.reply({
            embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to play music!')]
          });
        }

        const botMember = message.guild.members.me || await message.guild.members.fetchMe().catch(() => null);
        const permissions = voiceChannel.permissionsFor(botMember);
        if (!permissions?.has(PermissionFlagsBits.Connect) || !permissions?.has(PermissionFlagsBits.Speak)) {
          return message.reply({
            embeds: [EmbedUtils.error('Missing Permissions', `I need **Connect** and **Speak** permissions in <#${voiceChannel.id}> to play music!`)]
          });
        }

        if (!query) {
          const usageEmbed = new EmbedBuilder()
            .setTitle('🎵 How to use `h play`')
            .setDescription(
              `Please provide a song name, YouTube URL, Spotify link or SoundCloud link!\n\n` +
              `**💡 Examples:**\n` +
              `• \`h play Kesariya\`\n` +
              `• \`h play Arijit Singh Lofi\`\n` +
              `• \`h play https://www.youtube.com/watch?v=...\`\n` +
              `• \`h play https://open.spotify.com/track/...\`\n` +
              `• \`h play https://soundcloud.com/...\``
            )
            .setColor(config.embedColors?.info || '#00B0FF');
          return message.reply({ embeds: [usageEmbed] });
        }

        const searchMsg = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`🔎 **Searching:** \`${query.length > 80 ? query.substring(0, 77) + '...' : query}\`...`)
              .setColor(config.embedColors?.primary || '#5865F2')
          ]
        }).catch(() => null);

        try {
          const tracks = await MusicManager.search(query, message.author);

          if (!tracks || tracks.length === 0) {
            const errorEmbed = EmbedUtils.error('Not Found', `No results found for **${query}**.`);
            if (searchMsg) {
              return searchMsg.edit({ embeds: [errorEmbed] });
            }
            return message.reply({ embeds: [errorEmbed] });
          }

          const queue = MusicManager.createQueue(message.guild, voiceChannel, message.channel);

          if (tracks.length === 1) {
            const song = tracks[0];
            queue.songs.push(song);

            if (!queue.isPlaying) {
              if (searchMsg) {
                await searchMsg.delete().catch(() => null);
              }
              queue.playNext();
            } else {
              const embed = new EmbedBuilder()
                .setTitle('➕ Added to Queue')
                .setDescription(`**[${song.title}](${song.url})**`)
                .addFields(
                  { name: '⏱️ Duration', value: `\`${song.duration || 'Unknown'}\``, inline: true },
                  { name: '📍 Position in Queue', value: `\`#${queue.songs.length}\``, inline: true },
                  { name: '👤 Requester', value: `<@${message.author.id}>`, inline: true }
                )
                .setColor(config.embedColors?.success || '#57F287');

              if (song.thumbnail) embed.setThumbnail(song.thumbnail);

              if (searchMsg) {
                await searchMsg.edit({ embeds: [embed] }).catch(() => null);
              } else {
                await message.reply({ embeds: [embed] }).catch(() => null);
              }
            }
          } else {
            // Playlist added
            for (const track of tracks) {
              queue.songs.push(track);
            }

            const embed = new EmbedBuilder()
              .setTitle('📑 Playlist Added to Queue')
              .setDescription(`Successfully enqueued **${tracks.length} songs** from playlist.`)
              .addFields(
                { name: '🎵 First Song', value: `**[${tracks[0].title}](${tracks[0].url})**`, inline: false },
                { name: '📊 Total in Queue', value: `\`${queue.songs.length} tracks\``, inline: true },
                { name: '👤 Requested By', value: `<@${message.author.id}>`, inline: true }
              )
              .setColor(config.embedColors?.success || '#57F287');

            if (searchMsg) {
              await searchMsg.edit({ embeds: [embed] }).catch(() => null);
            } else {
              await message.reply({ embeds: [embed] }).catch(() => null);
            }

            if (!queue.isPlaying) {
              queue.playNext();
            }
          }
        } catch (err) {
          console.error('[PREFIX PLAY ERROR]', err);
          const errEmbed = EmbedUtils.error('Playback Error', `An error occurred while trying to play: \`${err.message}\``);
          if (searchMsg) {
            await searchMsg.edit({ embeds: [errEmbed] }).catch(() => null);
          } else {
            await message.reply({ embeds: [errEmbed] }).catch(() => null);
          }
        }
        return true;
      }

      // ==========================================
      // SKIP COMMAND
      // ==========================================
      case 'skip':
      case 's':
      case 'next': {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
          return message.reply({
            embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to use music commands!')]
          });
        }

        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue || (!queue.isPlaying && queue.songs.length === 0)) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'There is no music in queue to skip!')]
          });
        }

        const toIndex = parseInt(args[0], 10);
        if (!isNaN(toIndex) && toIndex > 1) {
          if (toIndex > queue.songs.length) {
            return message.reply({
              embeds: [EmbedUtils.error('Invalid Track', `Queue only has ${queue.songs.length} song(s)!`)]
            });
          }
          queue.songs.splice(0, toIndex - 1);
        }

        const skippedSong = queue.currentSong?.title || 'Current Song';
        queue.skip();

        return message.reply({
          embeds: [EmbedUtils.success('Song Skipped', `⏭️ Skipped **${skippedSong}**!`)]
        });
      }

      // ==========================================
      // STOP / LEAVE / DC COMMAND
      // ==========================================
      case 'stop':
      case 'dc':
      case 'leave':
      case 'disconnect': {
        const voiceChannel = message.member?.voice?.channel;
        if (!voiceChannel) {
          return message.reply({
            embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to use music commands!')]
          });
        }

        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', `${config.botName || 'RAW'} is not currently playing music in this server!`)]
          });
        }

        queue.stop();
        return message.reply({
          embeds: [EmbedUtils.success('Music Stopped', '⏹️ Cleared the queue and disconnected from the voice channel.')]
        });
      }

      // ==========================================
      // PAUSE COMMAND
      // ==========================================
      case 'pause': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue || !queue.isPlaying) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'There is no music currently playing to pause!')]
          });
        }

        if (queue.isPaused) {
          return message.reply({
            embeds: [EmbedUtils.warning('Already Paused', 'Music is already paused! Use `h resume` to unpause.')]
          });
        }

        queue.pause();
        return message.reply({
          embeds: [EmbedUtils.success('Music Paused', `⏸️ Paused **${queue.currentSong?.title || 'current song'}**.`)]
        });
      }

      // ==========================================
      // RESUME COMMAND
      // ==========================================
      case 'resume':
      case 'unpause': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'There is no active music queue in this server!')]
          });
        }

        if (!queue.isPaused) {
          return message.reply({
            embeds: [EmbedUtils.warning('Not Paused', 'Music is already playing!')]
          });
        }

        queue.resume();
        return message.reply({
          embeds: [EmbedUtils.success('Music Resumed', `▶️ Resumed **${queue.currentSong?.title || 'current song'}**.`)]
        });
      }

      // ==========================================
      // QUEUE COMMAND
      // ==========================================
      case 'queue':
      case 'q':
      case 'list': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue || (!queue.currentSong && queue.songs.length === 0)) {
          return message.reply({
            embeds: [EmbedUtils.error('Empty Queue', 'There are no songs in the queue right now! Use `h play <song>` to add songs.')]
          });
        }

        const page = parseInt(args[0], 10) || 1;
        const itemsPerPage = 10;
        const totalPages = Math.max(1, Math.ceil(queue.songs.length / itemsPerPage));

        if (page > totalPages || page < 1) {
          return message.reply({
            embeds: [EmbedUtils.error('Invalid Page', `Queue only has **${totalPages}** page(s)!`)]
          });
        }

        const startIdx = (page - 1) * itemsPerPage;
        const currentList = queue.songs.slice(startIdx, startIdx + itemsPerPage);

        let desc = '';
        if (queue.currentSong) {
          desc += `**💿 Currently Playing:**\n` +
                  `[${queue.currentSong.title}](${queue.currentSong.url}) | \`${queue.currentSong.duration || 'Unknown'}\` | <@${queue.currentSong.requester?.id}>\n\n` +
                  `**📑 Up Next (${queue.songs.length} total tracks):**\n`;
        }

        if (currentList.length === 0) {
          desc += '*No additional songs waiting in queue.*';
        } else {
          desc += currentList.map((song, i) => {
            const num = startIdx + i + 1;
            return `\`${num}.\` **[${song.title.substring(0, 50)}](${song.url})** | \`${song.duration || '?'}\` (by <@${song.requester?.id}>)`;
          }).join('\n');
        }

        const loopStatus = queue.loopMode === 'track' ? '🔂 Track' : queue.loopMode === 'queue' ? '🔁 Queue' : '❌ Off';

        const embed = new EmbedBuilder()
          .setTitle(`🎵 ${message.guild.name} • Music Queue`)
          .setDescription(desc)
          .addFields(
            { name: '🔊 Volume', value: `\`${queue.volume}%\``, inline: true },
            { name: '🔁 Loop Mode', value: `\`${loopStatus}\``, inline: true },
            { name: '📄 Page', value: `\`${page} / ${totalPages}\``, inline: true }
          )
          .setColor(config.embedColors?.primary || '#5865F2')
          .setFooter({
            text: `${config.botName || 'RAW'} Music System • ${queue.songs.length} song(s) in queue`,
            iconURL: message.guild.iconURL()
          })
          .setTimestamp();

        return message.reply({ embeds: [embed] });
      }

      // ==========================================
      // NOW PLAYING / NP COMMAND
      // ==========================================
      case 'np':
      case 'nowplaying':
      case 'song':
      case 'current': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue || !queue.currentSong) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'There is no song currently playing in this server!')]
          });
        }

        const embed = queue.buildNowPlayingEmbed();
        const rows = queue.buildControlsRow();

        return message.reply({
          embeds: [embed],
          components: rows
        });
      }

      // ==========================================
      // VOLUME COMMAND
      // ==========================================
      case 'volume':
      case 'vol':
      case 'v': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'No active music queue in this server!')]
          });
        }

        if (!args[0]) {
          return message.reply({
            embeds: [EmbedUtils.info('Current Volume', `🔊 The current playback volume is **${queue.volume}%**.\nUse \`h volume <0-150>\` to change it.`)]
          });
        }

        const newVol = parseInt(args[0], 10);
        if (isNaN(newVol) || newVol < 0 || newVol > 200) {
          return message.reply({
            embeds: [EmbedUtils.error('Invalid Volume', 'Please provide a valid volume level between **0** and **200**%!')]
          });
        }

        queue.setVolume(newVol);
        return message.reply({
          embeds: [EmbedUtils.success('Volume Adjusted', `🔊 Playback volume set to **${newVol}%**.`)]
        });
      }

      // ==========================================
      // LOOP COMMAND
      // ==========================================
      case 'loop':
      case 'l':
      case 'repeat': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'No active music queue in this server!')]
          });
        }

        const mode = queue.toggleLoop();
        const loopLabels = {
          'off': '❌ Loop Disabled',
          'track': '🔂 Looping Current Song',
          'queue': '🔁 Looping Entire Queue'
        };

        return message.reply({
          embeds: [EmbedUtils.success('Loop Mode Updated', `${loopLabels[mode] || `Loop is ${mode}`}`)]
        });
      }

      // ==========================================
      // SHUFFLE COMMAND
      // ==========================================
      case 'shuffle':
      case 'sh':
      case 'mix': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue || queue.songs.length < 2) {
          return message.reply({
            embeds: [EmbedUtils.error('Cannot Shuffle', 'Queue must have at least **2** songs to shuffle!')]
          });
        }

        queue.shuffle();
        return message.reply({
          embeds: [EmbedUtils.success('Queue Shuffled', `🔀 Successfully shuffled **${queue.songs.length}** songs in queue!`)]
        });
      }

      // ==========================================
      // LYRICS COMMAND
      // ==========================================
      case 'lyrics':
      case 'ly': {
        let songQuery = query;
        if (!songQuery) {
          const queue = MusicManager.getQueue(message.guild.id);
          if (queue && queue.currentSong) {
            songQuery = queue.currentSong.title;
          }
        }

        if (!songQuery) {
          return message.reply({
            embeds: [EmbedUtils.error('No Song Specified', 'Please provide a song title or play music first: `h lyrics <song name>`')]
          });
        }

        const cleanTitle = songQuery
          .replace(/\(Official.*?\)/gi, '')
          .replace(/\[Official.*?\]/gi, '')
          .replace(/\(Music Video.*?\)/gi, '')
          .replace(/\[Music Video.*?\]/gi, '')
          .replace(/\(Audio.*?\)/gi, '')
          .replace(/\(Lyric.*?\)/gi, '')
          .replace(/\[Lyric.*?\]/gi, '')
          .replace(/\b(HD|4K|1080p)\b/gi, '')
          .trim();

        const searchEmbed = await message.reply({
          embeds: [new EmbedBuilder().setDescription(`🎤 Searching lyrics for **${cleanTitle}**...`).setColor('#5865F2')]
        }).catch(() => null);

        try {
          const apiUrl = `https://some-random-api.com/lyrics?title=${encodeURIComponent(cleanTitle)}`;
          const res = await fetch(apiUrl);
          if (!res.ok) throw new Error('Not found');

          const data = await res.json();
          if (!data || !data.lyrics) throw new Error('No lyrics');

          const lyricsText = data.lyrics.length > 3900
            ? data.lyrics.substring(0, 3900) + '...\n\n*(Lyrics truncated due to length)*'
            : data.lyrics;

          const embed = new EmbedBuilder()
            .setTitle(`🎤 ${data.title} — ${data.author}`)
            .setDescription(lyricsText)
            .setThumbnail(data.thumbnail?.genius || null)
            .setColor(config.embedColors?.primary || '#5865F2')
            .setFooter({ text: 'Lyrics powered by Genius / SomeRandomAPI' })
            .setTimestamp();

          if (searchEmbed) {
            return searchEmbed.edit({ embeds: [embed] });
          }
          return message.reply({ embeds: [embed] });
        } catch {
          const errEmbed = EmbedUtils.error('Lyrics Not Found', `Could not find lyrics for **${cleanTitle}**. Try \`h lyrics Artist - Song Name\`.`);
          if (searchEmbed) {
            return searchEmbed.edit({ embeds: [errEmbed] });
          }
          return message.reply({ embeds: [errEmbed] });
        }
      }

      // ==========================================
      // MUSIC PANEL COMMAND
      // ==========================================
      case 'panel':
      case 'musicpanel': {
        const embed = new EmbedBuilder()
          .setTitle(`🎵 ${config.botName || 'RAW'} Master Music Panel`)
          .setDescription(
            'Control high-fidelity music streaming with the buttons below or chat commands.\n\n' +
            '**Command Syntax:** `r play <song name or link>` (or `h play`)\n' +
            '**Supported:** YouTube, Spotify, SoundCloud, Playlists'
          )
          .setColor(config.embedColors?.primary || '#5865F2')
          .setFooter({ text: `${config.botName || 'RAW'} Music • 24/7 High Quality Audio` });

        const queue = MusicManager.getQueue(message.guild.id);
        const rows = queue ? queue.buildControlsRow() : MusicManager.createQueue(message.guild, message.member?.voice?.channel || { id: '0' }, message.channel).buildControlsRow();

        return message.reply({
          embeds: [embed],
          components: rows
        });
      }

      // ==========================================
      // AUTOPLAY COMMAND
      // ==========================================
      case 'autoplay':
      case 'ap':
      case 'auto': {
        const queue = MusicManager.getQueue(message.guild.id);
        if (!queue) {
          return message.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'No active music queue in this server! Use `h play` or `h radio` first.')]
          });
        }

        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on' || sub === 'enable' || sub === '1') {
          queue.autoplay = true;
        } else if (sub === 'off' || sub === 'disable' || sub === '0') {
          queue.autoplay = false;
        } else {
          queue.toggleAutoplay();
        }

        const isEnabled = queue.autoplay;
        const embed = new EmbedBuilder()
          .setTitle(isEnabled ? '📻 Smart Autoplay Enabled' : '📻 Smart Autoplay Disabled')
          .setDescription(
            isEnabled
              ? '✨ **Smart Autoplay is now ON!**\nWhen the queue ends, the bot will automatically detect your musical taste and queue similar songs non-stop (like Spotify Radio / YouTube Mix).'
              : '❌ **Smart Autoplay is now OFF.**\nThe bot will stop when the queue finishes.'
          )
          .setColor(isEnabled ? (config.embedColors?.success || '#57F287') : (config.embedColors?.danger || '#ED4245'))
          .setFooter({ text: `${config.botName || 'RAW'} Music Engine • AI Recommendations` })
          .setTimestamp();

        if (queue.nowPlayingMessage) {
          queue.sendNowPlaying().catch(() => null);
        }

        return message.reply({ embeds: [embed] });
      }

      // ==========================================
      // RADIO COMMAND
      // ==========================================
      case 'radio':
      case 'station': {
        const member = message.member;
        const voiceChannel = member?.voice?.channel;

        if (!voiceChannel) {
          return message.reply({
            embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to start a radio station!')]
          });
        }

        if (!query) {
          return message.reply({
            embeds: [EmbedUtils.error('Seed Required', 'Please specify a song name or artist to tune into: `h radio <song or artist>`')]
          });
        }

        const searchMsg = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`📻 **Tuning Radio Station:** \`${query}\`...`)
              .setColor(config.embedColors?.primary || '#5865F2')
          ]
        }).catch(() => null);

        try {
          const tracks = await MusicManager.search(query, message.author);

          if (!tracks || tracks.length === 0) {
            const errorEmbed = EmbedUtils.error('Not Found', `Could not find any starting track for **${query}**.`);
            if (searchMsg) return searchMsg.edit({ embeds: [errorEmbed] });
            return message.reply({ embeds: [errorEmbed] });
          }

          const queue = MusicManager.createQueue(message.guild, voiceChannel, message.channel);
          queue.autoplay = true;

          const startingTrack = tracks[0];
          queue.songs = [startingTrack];

          const embed = new EmbedBuilder()
            .setTitle('📻 Tuned In: Smart Radio Station Started!')
            .setDescription(
              `**Station Seed:** [${startingTrack.title}](${startingTrack.url})\n` +
              `**Artist / Channel:** \`${startingTrack.author || 'Music'}\`\n` +
              `**Voice Channel:** <#${voiceChannel.id}>\n\n` +
              `✨ **Smart Taste Matching is ON!**\n` +
              `The bot will continuously stream seamless songs matching this vibe and genre non-stop!`
            )
            .setColor(config.embedColors?.primary || '#5865F2')
            .setFooter({ text: `${config.botName || 'RAW'} Radio Engine • Spotify & YouTube Taste Algorithm` })
            .setTimestamp();

          if (startingTrack.thumbnail) {
            embed.setThumbnail(startingTrack.thumbnail);
          }

          if (searchMsg) {
            await searchMsg.edit({ embeds: [embed] });
          } else {
            await message.reply({ embeds: [embed] });
          }

          if (!queue.isPlaying) {
            queue.playNext();
          } else {
            queue.skip();
          }
        } catch (err) {
          const errEmbed = EmbedUtils.error('Radio Error', `Failed to start radio: \`${err.message}\``);
          if (searchMsg) return searchMsg.edit({ embeds: [errEmbed] });
          return message.reply({ embeds: [errEmbed] });
        }
        return true;
      }

      // ==========================================
      // PING COMMAND
      // ==========================================
      case 'ping': {
        const sent = await message.reply('🏓 Pinging...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        const wsPing = client.ws.ping;

        const pingEmbed = new EmbedBuilder()
          .setTitle('🏓 Pong!')
          .addFields(
            { name: '📶 Message Latency', value: `\`${latency}ms\``, inline: true },
            { name: '🌐 WebSocket Ping', value: `\`${wsPing}ms\``, inline: true }
          )
          .setColor(config.embedColors?.success || '#57F287')
          .setTimestamp();

        return sent.edit({ content: null, embeds: [pingEmbed] });
      }

      // ==========================================
      // AVATAR COMMAND
      // ==========================================
      case 'avatar':
      case 'av': {
        const target = message.mentions.users.first() || message.author;
        const avatarEmbed = new EmbedBuilder()
          .setTitle(`🖼️ Avatar • ${target.tag}`)
          .setImage(target.displayAvatarURL({ size: 1024, dynamic: true }))
          .setColor(config.embedColors?.primary || '#5865F2')
          .setFooter({ text: `Requested by ${message.author.tag}` });

        return message.reply({ embeds: [avatarEmbed] });
      }

      // ==========================================
      // ==========================================
      // SPOTIFY-STYLE USER PLAYLIST COMMANDS
      // ==========================================
      case 'playlist':
      case 'pl': {
        const plAction = (args[0] || '').toLowerCase();
        const userId = message.author.id;

        if (!plAction || plAction === 'help') {
          const plHelp = new EmbedBuilder()
            .setTitle('🎵 Personal Spotify-Style Playlists')
            .setDescription(
              `Create and listen to your own custom personal playlists:\n\n` +
              `• \`h pl create <name> [description]\` — Create a new playlist\n` +
              `• \`h pl add <name> <song / URL>\` — Add song to playlist\n` +
              `• \`h pl addcurrent <name>\` — Save current playing song to playlist\n` +
              `• \`h pl play <name> [shuffle]\` — Play your playlist in voice\n` +
              `• \`h pl list\` — View all your playlists\n` +
              `• \`h pl view <name> [page]\` — View songs in playlist\n` +
              `• \`h pl remove <name> <track#>\` — Remove a song by number\n` +
              `• \`h pl delete <name>\` — Delete playlist\n` +
              `• \`h pl clear <name>\` — Clear all tracks\n\n` +
              `*You can also use Slash Command: \`/playlist\`*`
            )
            .setColor(config.embedColors?.primary || '#5865F2')
            .setFooter({ text: `${config.botName || 'RAW'} Music • Spotify Playlists` });
          return message.reply({ embeds: [plHelp] });
        }

        // CREATE
        if (plAction === 'create' || plAction === 'new' || plAction === 'make') {
          const plName = args[1];
          if (!plName) {
            return message.reply({
              embeds: [EmbedUtils.error('Missing Name', 'Please specify a name for your playlist!\n*Usage:* `h pl create <name> [description]`')]
            });
          }
          const plDesc = args.slice(2).join(' ').trim();
          const res = DatabaseManager.createPlaylist(userId, plName, plDesc);
          if (!res.success) {
            return message.reply({ embeds: [EmbedUtils.error('Creation Failed', res.message)] });
          }
          return message.reply({
            embeds: [
              EmbedUtils.success('Playlist Created! ✨', `Successfully created **${res.playlist.name}**!\nAdd tracks with \`h pl add ${res.playlist.name} <song name>\``)
            ]
          });
        }

        // ADD
        if (plAction === 'add') {
          const plName = args[1];
          const songQuery = args.slice(2).join(' ').trim();
          if (!plName || !songQuery) {
            return message.reply({
              embeds: [EmbedUtils.error('Invalid Syntax', 'Usage: `h pl add <playlist_name> <song title or URL>`')]
            });
          }

          const pl = DatabaseManager.getPlaylist(userId, plName);
          if (!pl) {
            return message.reply({
              embeds: [EmbedUtils.error('Playlist Not Found', `You do not have a playlist named **${plName}**.\nCreate one with \`h pl create ${plName}\``)]
            });
          }

          const loading = await message.reply({ embeds: [EmbedUtils.info('Searching...', `🔍 Searching for **${songQuery}**...`)] });
          const tracks = await MusicManager.search(songQuery, message.author);
          if (!tracks || tracks.length === 0) {
            return loading.edit({ embeds: [EmbedUtils.error('Not Found', `Could not find any song matching **${songQuery}**.`)] });
          }

          const toAdd = tracks[0];
          const res = DatabaseManager.addTrackToPlaylist(userId, plName, toAdd);
          if (!res.success) {
            return loading.edit({ embeds: [EmbedUtils.error('Failed to Add', res.message)] });
          }

          const embed = new EmbedBuilder()
            .setTitle('➕ Added to Playlist')
            .setDescription(`Added **[${toAdd.title}](${toAdd.url})** to **${pl.name}**!\n• **Duration:** \`${toAdd.duration}\`\n• **Total Songs:** \`${res.totalTracks}\``)
            .setColor(config.embedColors?.success || '#57F287');
          if (toAdd.thumbnail) embed.setThumbnail(toAdd.thumbnail);

          return loading.edit({ embeds: [embed] });
        }

        // ADDCURRENT
        if (plAction === 'addcurrent' || plAction === 'save') {
          const plName = args[1];
          if (!plName) {
            return message.reply({
              embeds: [EmbedUtils.error('Missing Name', 'Usage: `h pl addcurrent <playlist_name>`')]
            });
          }
          const pl = DatabaseManager.getPlaylist(userId, plName);
          if (!pl) {
            return message.reply({
              embeds: [EmbedUtils.error('Playlist Not Found', `You do not have a playlist named **${plName}**.`)]
            });
          }

          const queue = MusicManager.getQueue(message.guild.id);
          if (!queue || !queue.currentSong) {
            return message.reply({
              embeds: [EmbedUtils.warning('Nothing Playing', 'No song is currently playing in this server!')]
            });
          }

          const res = DatabaseManager.addTrackToPlaylist(userId, plName, queue.currentSong);
          if (!res.success) {
            return message.reply({ embeds: [EmbedUtils.error('Failed to Add', res.message)] });
          }

          return message.reply({
            embeds: [
              EmbedUtils.success('Song Saved!', `💾 Saved **[${queue.currentSong.title}](${queue.currentSong.url})** to **${pl.name}** (\`${res.totalTracks} tracks\`)!`)
            ]
          });
        }

        // PLAY
        if (plAction === 'play' || plAction === 'p' || plAction === 'load') {
          const plName = args[1];
          if (!plName) {
            return message.reply({
              embeds: [EmbedUtils.error('Missing Name', 'Usage: `h pl play <playlist_name> [shuffle]`')]
            });
          }

          const voiceChannel = message.member?.voice?.channel;
          if (!voiceChannel) {
            return message.reply({
              embeds: [EmbedUtils.error('Voice Channel Required', 'You must join a voice channel to play your playlist!')]
            });
          }

          const pl = DatabaseManager.getPlaylist(userId, plName);
          if (!pl || !Array.isArray(pl.tracks) || pl.tracks.length === 0) {
            return message.reply({
              embeds: [EmbedUtils.warning('Empty Playlist', `Playlist **${plName}** is empty or does not exist!`)]
            });
          }

          const shuffle = (args[2] || '').toLowerCase() === 'shuffle' || (args[2] || '').toLowerCase() === 'sh';
          const queue = MusicManager.createQueue(message.guild, voiceChannel, message.channel);

          const tracksToQueue = pl.tracks.map(t => ({
            title: t.title,
            url: t.url,
            duration: t.duration,
            durationSec: t.durationSec,
            thumbnail: t.thumbnail,
            author: t.author,
            requester: message.author,
            source: 'user_playlist'
          }));

          if (shuffle) {
            for (let i = tracksToQueue.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [tracksToQueue[i], tracksToQueue[j]] = [tracksToQueue[j], tracksToQueue[i]];
            }
          }

          for (const t of tracksToQueue) {
            queue.songs.push(t);
          }

          const embed = new EmbedBuilder()
            .setTitle(`▶️ Playing Playlist • ${pl.name}`)
            .setDescription(`Enqueued **${tracksToQueue.length} songs** into the music queue!${shuffle ? ' *(Shuffled)*' : ''}`)
            .setColor(config.embedColors?.primary || '#5865F2')
            .setFooter({ text: `${pl.name} • ${config.botName || 'RAW'} Spotify-Style Queue` });

          await message.reply({ embeds: [embed] });

          if (!queue.isPlaying) {
            queue.playNext();
          }
          return;
        }

        // LIST
        if (plAction === 'list' || plAction === 'all') {
          const userPlaylists = DatabaseManager.getUserPlaylists(userId);
          if (!userPlaylists || userPlaylists.length === 0) {
            return message.reply({
              embeds: [
                EmbedUtils.info('No Playlists', 'You haven\'t created any playlists yet!\nCreate one using `h pl create <name>`')
              ]
            });
          }

          const embed = new EmbedBuilder()
            .setTitle(`🎵 ${message.author.username}'s Spotify Playlists`)
            .setColor(config.embedColors?.primary || '#5865F2');

          let desc = '';
          userPlaylists.forEach((pl, i) => {
            const count = pl.tracks?.length || 0;
            desc += `**${i + 1}. 📁 [${pl.name}]** • \`${count} tracks\`\n`;
            if (pl.description) desc += `> *${pl.description}*\n`;
            desc += '\n';
          });
          embed.setDescription(desc);
          return message.reply({ embeds: [embed] });
        }

        // VIEW
        if (plAction === 'view' || plAction === 'show') {
          const plName = args[1];
          if (!plName) {
            return message.reply({
              embeds: [EmbedUtils.error('Missing Name', 'Usage: `h pl view <playlist_name> [page]`')]
            });
          }

          const pl = DatabaseManager.getPlaylist(userId, plName);
          if (!pl) {
            return message.reply({
              embeds: [EmbedUtils.error('Not Found', `Playlist **${plName}** does not exist!`)]
            });
          }

          const tracks = pl.tracks || [];
          const page = parseInt(args[2], 10) || 1;
          const pageSize = 10;
          const totalPages = Math.max(1, Math.ceil(tracks.length / pageSize));
          const currentPage = Math.min(Math.max(1, page), totalPages);
          const startIdx = (currentPage - 1) * pageSize;
          const pageTracks = tracks.slice(startIdx, startIdx + pageSize);

          const embed = new EmbedBuilder()
            .setTitle(`📁 Playlist: ${pl.name}`)
            .setDescription(
              `${pl.description ? `*${pl.description}*\n\n` : ''}` +
              `• **Total Tracks:** \`${tracks.length} songs\`\n\n` +
              `**Track List (Page ${currentPage}/${totalPages}):**\n` +
              (pageTracks.length > 0
                ? pageTracks.map((t, idx) => `\`${startIdx + idx + 1}.\` **[${t.title.slice(0, 55)}](${t.url})** (\`${t.duration || 'Unknown'}\`)`).join('\n')
                : '*No tracks added yet.*')
            )
            .setColor(config.embedColors?.primary || '#5865F2')
            .setFooter({ text: `Page ${currentPage}/${totalPages} • Play with: h pl play ${pl.name}` });

          return message.reply({ embeds: [embed] });
        }

        // REMOVE
        if (plAction === 'remove' || plAction === 'delete-song') {
          const plName = args[1];
          const trackNum = parseInt(args[2], 10);
          if (!plName || isNaN(trackNum)) {
            return message.reply({
              embeds: [EmbedUtils.error('Invalid Syntax', 'Usage: `h pl remove <playlist_name> <track_number>`')]
            });
          }

          const res = DatabaseManager.removeTrackFromPlaylist(userId, plName, trackNum);
          if (!res.success) {
            return message.reply({ embeds: [EmbedUtils.error('Remove Failed', res.message)] });
          }

          return message.reply({
            embeds: [
              EmbedUtils.success('Track Removed', `Removed **${res.removedTrack.title}** from **${plName}** (\`${res.totalTracks} songs remaining\`)`)
            ]
          });
        }

        // DELETE
        if (plAction === 'delete' || plAction === 'remove-playlist') {
          const plName = args[1];
          if (!plName) {
            return message.reply({
              embeds: [EmbedUtils.error('Missing Name', 'Usage: `h pl delete <playlist_name>`')]
            });
          }

          const success = DatabaseManager.deletePlaylist(userId, plName);
          if (!success) {
            return message.reply({
              embeds: [EmbedUtils.error('Delete Failed', `Could not find a playlist named **${plName}**.`)]
            });
          }

          return message.reply({
            embeds: [EmbedUtils.success('Playlist Deleted', `🗑️ Successfully deleted playlist **${plName}**.`)]
          });
        }

        // CLEAR
        if (plAction === 'clear') {
          const plName = args[1];
          if (!plName) {
            return message.reply({
              embeds: [EmbedUtils.error('Missing Name', 'Usage: `h pl clear <playlist_name>`')]
            });
          }

          const success = DatabaseManager.clearPlaylist(userId, plName);
          if (!success) {
            return message.reply({
              embeds: [EmbedUtils.error('Clear Failed', `Could not find a playlist named **${plName}**.`)]
            });
          }

          return message.reply({
            embeds: [EmbedUtils.success('Playlist Cleared', `🧹 Cleared all tracks from playlist **${plName}**.`)]
          });
        }

        return message.reply({
          embeds: [EmbedUtils.error('Unknown Action', `Invalid sub-command \`${plAction}\`. Type \`h pl help\` for usage.`)]
        });
      }

      // ==========================================
      // GHOSTPING COMMAND
      // ==========================================
      case 'ghostping':
      case 'gp':
      case 'ghost': {
        let targetChannel = message.mentions.channels.first();
        let targetIndex = 0;

        for (const arg of args) {
          const num = parseInt(arg, 10);
          if (!isNaN(num) && num >= 1 && num <= 15) {
            targetIndex = num - 1;
          } else if (!targetChannel) {
            const ch = message.guild.channels.cache.get(arg.replace(/[<#>]/g, '')) ||
              message.guild.channels.cache.find(c => c.name.toLowerCase() === arg.toLowerCase());
            if (ch) targetChannel = ch;
          }
        }

        if (!targetChannel) targetChannel = message.channel;

        const result = SnipeManager.getGhostPing(targetChannel.id, targetIndex);
        if (!result) {
          return message.reply({
            embeds: [
              EmbedUtils.info(
                'No Ghost Pings Found',
                `👻 No ghost-pings recorded in <#${targetChannel.id}>${targetIndex > 0 ? ` at index ${targetIndex + 1}` : ''}.\n\n*Ghost pings are automatically captured when a message mentioning someone is deleted or edited.*`
              )
            ]
          });
        }

        const { ghostPing: record, index, total } = result;
        const userMentions = (record.ghostPing?.users || []).map(u => `<@${u.id}> (\`${u.tag || u.username}\`)`);
        const roleMentions = (record.ghostPing?.roles || []).map(r => `<@&${r.id}> (\`${r.name}\`)`);
        const everyoneMention = record.ghostPing?.hasEveryone ? ['`@everyone` / `@here`'] : [];
        const allMentionTargets = [...userMentions, ...roleMentions, ...everyoneMention].join('\n• ') || 'Unknown Mention';

        const isEdited = record.type === 'edited';
        const typeLabel = isEdited ? '✏️ Edited Message' : '🗑️ Deleted Message';

        const embed = new EmbedBuilder()
          .setColor(config.embedColors?.warning || '#FEE75C')
          .setTitle(`👻 Ghost Ping Detected • ${typeLabel}`)
          .setAuthor({
            name: `${record.author.tag} (${record.author.username})`,
            iconURL: record.author.avatar || message.guild.iconURL({ dynamic: true })
          })
          .addFields(
            { name: '👤 Ghost Pinger', value: `<@${record.author.id}> (\`${record.author.id}\`)`, inline: true },
            { name: '💬 Channel', value: `<#${targetChannel.id}>`, inline: true },
            { name: '⏰ Timing', value: `**Sent:** <t:${Math.floor(record.sentAt / 1000)}:R>\n**${isEdited ? 'Edited' : 'Deleted'}:** <t:${Math.floor(record.eventAt / 1000)}:R>`, inline: true },
            { name: '🎯 Mentioned Targets (Kisko Ping Kiya):', value: `• ${allMentionTargets}`, inline: false }
          )
          .setFooter({ text: `Ghost Ping ${index} of ${total} • Server: ${message.guild.name}` })
          .setTimestamp(record.eventAt);

        if (isEdited) {
          embed.addFields(
            { name: '⬅️ Original Content (Kya Bheja Tha):', value: record.content ? `>>> ${record.content.slice(0, 1000)}` : '*[No Text]*', inline: false },
            { name: '➡️ Edited Content (Badalkar Kya Kiya):', value: record.newContent ? `>>> ${record.newContent.slice(0, 1000)}` : '*[No Text]*', inline: false }
          );
        } else {
          embed.addFields({
            name: '📝 Message Content (Kya Bheja Tha):',
            value: record.content ? `>>> ${record.content.slice(0, 1000)}` : '*[No Text / Only Attachments]*',
            inline: false
          });
        }

        if (record.attachments && record.attachments.length > 0) {
          const firstImage = record.attachments.find(att =>
            att.contentType?.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(att.url)
          );
          if (firstImage) embed.setImage(firstImage.url);
        }

        return message.reply({ embeds: [embed] });
      }

      // ==========================================
      // SNIPE COMMAND
      // ==========================================
      case 'snipe': {
        const result = SnipeManager.getSnipe(message.channel.id, 0);
        if (!result) {
          return message.reply({
            embeds: [EmbedUtils.warning('No Snipes', `No recently deleted messages in <#${message.channel.id}>.`)]
          });
        }

        const { snipe, index, total } = result;
        const embed = new EmbedBuilder()
          .setColor(config.embedColors?.primary || '#5865F2')
          .setAuthor({
            name: `${snipe.author.tag} (${snipe.author.username})`,
            iconURL: snipe.author.avatar
          })
          .setDescription(snipe.content ? `>>> ${snipe.content}` : '*[No text content / Only attachments]*')
          .addFields(
            { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
            { name: '📅 Sent', value: `<t:${Math.floor(snipe.createdAt / 1000)}:R>`, inline: true },
            { name: '🗑️ Deleted', value: `<t:${Math.floor(snipe.deletedAt / 1000)}:R>`, inline: true }
          )
          .setFooter({ text: `Snipe ${index} of ${total} • Message ID: ${snipe.id}` })
          .setTimestamp(snipe.deletedAt);

        if (snipe.ghostPing) {
          const userMentions = (snipe.ghostPing.users || []).map(u => `<@${u.id}>`);
          const roleMentions = (snipe.ghostPing.roles || []).map(r => `<@&${r.id}>`);
          const everyoneMention = snipe.ghostPing.hasEveryone ? ['@everyone / @here'] : [];
          const allTargets = [...userMentions, ...roleMentions, ...everyoneMention].join(', ');

          embed.setColor(config.embedColors?.warning || '#FEE75C');
          embed.addFields({
            name: '👻 Ghost Ping Alert',
            value: allTargets || 'Unknown',
            inline: false
          });
        }

        if (snipe.attachments && snipe.attachments.length > 0) {
          const firstImage = snipe.attachments.find(att =>
            att.contentType?.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(att.url)
          );
          if (firstImage) embed.setImage(firstImage.url);
        }

        return message.reply({ embeds: [embed] });
      }

      // ==========================================
      // ANNOUNCE QUICK HELPER
      // ==========================================
      case 'announce':
      case 'announcement': {
        const canManage = message.member?.permissions.has(PermissionFlagsBits.ManageMessages);
        if (!canManage) {
          return message.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need **Manage Messages** permissions to send announcements!')]
          });
        }

        if (!query) {
          return message.reply({
            embeds: [
              new EmbedBuilder()
                .setTitle('📢 How to use Announcement Command')
                .setDescription(
                  `You can use either **Slash Command** (Recommended) or **Prefix Command**:\n\n` +
                  `**✨ Slash Command (Recommended):**\n` +
                  `• \`/announce send channel:#announcements message:Server update completed!\` *(Ping is optional)*\n` +
                  `• \`/announce modal channel:#announcements\` *(Opens rich popup editor)*\n\n` +
                  `**⚡ Quick Prefix Syntax:**\n` +
                  `• \`h announce <#channel> <message>\`\n` +
                  `*Example:* \`h announce #announcements Server maintenance completed!\``
                )
                .setColor(config.embedColors?.primary || '#5865F2')
            ]
          });
        }

        let targetChannel = message.mentions.channels.first();
        let msgWords = [...args];

        // Check if first argument was a channel mention, ID or name
        if (targetChannel && msgWords[0] && (msgWords[0].includes(targetChannel.id) || msgWords[0] === `<#${targetChannel.id}>`)) {
          msgWords.shift();
        } else if (!targetChannel && msgWords.length > 0) {
          const potentialChannel = message.guild.channels.cache.get(msgWords[0].replace(/[<#>]/g, '')) ||
            message.guild.channels.cache.find(c => c.name.toLowerCase() === msgWords[0].toLowerCase());
          if (potentialChannel && (potentialChannel.type === ChannelType.GuildText || potentialChannel.type === ChannelType.GuildAnnouncement || potentialChannel.isTextBased())) {
            targetChannel = potentialChannel;
            msgWords.shift();
          }
        }

        if (!targetChannel) targetChannel = message.channel;

        const announceText = msgWords.join(' ').trim();
        if (!announceText) {
          return message.reply({
            embeds: [EmbedUtils.error('Missing Message', 'Please provide the announcement message content!')]
          });
        }

        let pingContent = null;
        let cleanText = announceText;
        if (announceText.includes('@everyone')) {
          pingContent = '@everyone';
        } else if (announceText.includes('@here')) {
          pingContent = '@here';
        } else if (message.mentions.roles.size > 0) {
          const r = message.mentions.roles.first();
          pingContent = `<@&${r.id}>`;
        }

        const embed = new EmbedBuilder()
          .setTitle('📢 Server Announcement')
          .setDescription(cleanText)
          .setColor(config.embedColors?.primary || '#5865F2')
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 256 }))
          .setFooter({ text: `${message.guild.name} • Announced by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
          .setTimestamp();

        try {
          const sendPayload = { embeds: [embed] };
          if (pingContent) sendPayload.content = pingContent;

          const sent = await targetChannel.send(sendPayload);
          return message.reply({
            embeds: [
              EmbedUtils.success('Announcement Posted', `✅ Successfully broadcasted announcement to <#${targetChannel.id}>: [Jump to Message](${sent.url})`)
            ]
          });
        } catch (e) {
          return message.reply({
            embeds: [EmbedUtils.error('Announcement Failed', `Could not post to <#${targetChannel.id}>: \`${e.message}\``)]
          });
        }
      }

      // ==========================================
      // LEADERBOARD COMMAND (AmariBot UI)
      // ==========================================
      case 'leaderboard':
      case 'lb':
      case 'top': {
        const type = (args[0] || '').toLowerCase();
        if (type === 'invites' || type === 'inv' || type === 'invite') {
          const embed = formatInviteLeaderboard(message.guild, message.author, 10);
          await message.reply({ embeds: [embed] }).catch(() => null);
          return true;
        }
        if (type === 'counting' || type === 'count') {
          const embed = formatCountingLeaderboard(message.guild, message.author, 10);
          await message.reply({ embeds: [embed] }).catch(() => null);
          return true;
        }

        // Default: Chat XP / Level Leaderboard (AmariBot UI)
        const embed = formatLevelLeaderboard(message.guild, message.author, 10);
        await message.reply({ embeds: [embed] }).catch(() => null);
        return true;
      }

      // ==========================================
      // INVITES COMMAND
      // ==========================================
      case 'invites':
      case 'inv': {
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'lb' || sub === 'leaderboard' || sub === 'top') {
          const embed = formatInviteLeaderboard(message.guild, message.author, 10);
          await message.reply({ embeds: [embed] }).catch(() => null);
          return true;
        }
        const targetUser = message.mentions.users.first() || message.author;
        const stats = DatabaseManager.getInvites(message.guild.id, targetUser.id);
        const rank = DatabaseManager.getUserInviteRank(message.guild.id, targetUser.id);

        const embed = new EmbedBuilder()
          .setColor('#FEE75C')
          .setAuthor({
            name: `${targetUser.username}'s Invite Profile`,
            iconURL: targetUser.displayAvatarURL({ dynamic: true })
          })
          .setTitle(`📊 Total Net Invites: ${stats.total.toLocaleString()}`)
          .setDescription(
            `**Server Rank:** ${rank ? `🏅 **#${rank}** on Leaderboard` : '*Unranked*'}\n\n` +
            `• ✅ **Regular:** \`${stats.regular}\`\n` +
            `• ❌ **Left:** \`${stats.leaves}\`\n` +
            `• ⚠️ **Fake/Alt:** \`${stats.fake}\`\n` +
            `• 🎁 **Bonus:** \`${stats.bonus}\``
          )
          .setFooter({ text: `${message.guild.name} • Tip: 'h lb invites' for leaderboard` });

        await message.reply({ embeds: [embed] }).catch(() => null);
        return true;
      }

      // ==========================================
      // RANK & LEVEL COMMAND (AmariBot Style)
      // ==========================================
      case 'rank':
      case 'level':
      case 'lvl': {
        const targetUser = message.mentions.users.first() || message.author;
        if (targetUser.bot) {
          await message.reply({ content: '🤖 Bots do not earn XP or levels!' }).catch(() => null);
          return true;
        }

        try {
          const guildId = message.guild.id;
          const userData = DatabaseManager.getUserLevel(guildId, targetUser.id);
          const userRank = DatabaseManager.getUserRank(guildId, targetUser.id);
          const weeklyRank = DatabaseManager.getUserWeeklyRank(guildId, targetUser.id);
          const userTheme = DatabaseManager.getUserRankTheme(guildId, targetUser.id);
          const cardColor = userTheme.color || '#f4c444';

          const avatarUrl = targetUser.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true });
          const cardBuffer = await generateRankCard({
            username: targetUser.username,
            avatarUrl,
            serverRank: userRank,
            weeklyRank: weeklyRank,
            weeklyXp: userData.weeklyXp || 0,
            level: userData.level || 0,
            currentXp: userData.xp || 0,
            neededXp: userData.neededXp || 100,
            accentColor: cardColor
          });

          const attachment = new AttachmentBuilder(cardBuffer, { name: 'rank.png' });
          await message.reply({ files: [attachment] }).catch(() => null);
          return true;
        } catch (err) {
          console.error('[PREFIX RANK ERROR]:', err);
          await message.reply({ content: `❌ Error generating rank card: ${err.message}` }).catch(() => null);
          return true;
        }
      }

      // ==========================================
      // HONOR COMMANDS
      // ==========================================
      case 'honor':
      case 'rep': {
        const honorConfig = DatabaseManager.getHonorConfig(message.guild.id);
        if (honorConfig.enabled === false) {
          return message.reply({ embeds: [EmbedUtils.warning('Honor System Disabled', 'The Honor system is currently disabled on this server.')] });
        }

        const mentioned = message.mentions.users.first();
        if (!mentioned) {
          return message.reply({
            embeds: [
              EmbedUtils.info(
                'How to give Honor',
                `**Usage:** \`h honor @user [friendly | shotcaller | helpful | mvp] [reason]\`\n\n` +
                `**Examples:**\n` +
                `• \`h honor @Gamer friendly Great game!\`\n` +
                `• \`h honor @Pro mvp 1v4 clutch round!\`\n` +
                `• \`h honor @Friend helpful taught me the lineup\``
              )
            ]
          });
        }

        if (mentioned.id === message.author.id) {
          return message.reply({ embeds: [EmbedUtils.error('Action Denied', 'You cannot give Honor to yourself!')] });
        }
        if (mentioned.bot) {
          return message.reply({ embeds: [EmbedUtils.error('Action Denied', 'Bots cannot receive Honor.')] });
        }

        const validCategories = ['friendly', 'shotcaller', 'helpful', 'mvp'];
        let chosenCategory = 'friendly';
        let customReason = '';

        const tokens = args.filter(a => !a.startsWith('<@'));
        if (tokens.length > 0) {
          const firstToken = tokens[0].toLowerCase();
          if (validCategories.includes(firstToken)) {
            chosenCategory = firstToken;
            customReason = tokens.slice(1).join(' ');
          } else {
            customReason = tokens.join(' ');
          }
        }

        const result = DatabaseManager.addHonor(message.guild.id, mentioned.id, message.author.id, chosenCategory, customReason);
        if (!result.success) {
          if (result.error === 'NO_TOKENS') {
            const timeStr = `<t:${Math.floor((Date.now() + result.resetInMs) / 1000)}:R>`;
            return message.reply({ embeds: [EmbedUtils.warning('No Tokens Left', `You have used your **3 daily tokens**! They refresh ${timeStr}.`)] });
          }
          if (result.error === 'USER_COOLDOWN') {
            const timeStr = `<t:${Math.floor((Date.now() + result.resetInMs) / 1000)}:R>`;
            return message.reply({ embeds: [EmbedUtils.warning('Cooldown Active', `You recently honored **${mentioned.username}**! Cooldown ends ${timeStr}.`)] });
          }
          return message.reply({ embeds: [EmbedUtils.error('Honor Failed', 'Could not record honor commendation.')] });
        }

        const catEmojis = { friendly: '🤝', shotcaller: '🎯', helpful: '💡', mvp: '⚡' };
        const catTitles = { friendly: 'Friendly & Tilt-Proof', shotcaller: 'Shotcaller & Leader', helpful: 'Helpful & Mentor', mvp: 'Clutch & MVP' };

        const honorEmbed = new EmbedBuilder()
          .setColor('#57F287')
          .setTitle(`${catEmojis[chosenCategory]} Honor Commendation Sent!`)
          .setDescription(
            `**${message.author.username}** commended **${mentioned}** for **${catTitles[chosenCategory]}**!\n` +
            (customReason ? `> *"${customReason}"*\n\n` : '\n') +
            `• **Category:** ${catEmojis[chosenCategory]} \`${catTitles[chosenCategory]}\`\n` +
            `• **Total Honor:** \`${result.points}\` Points (Level ${result.level})\n` +
            `• **Tokens Left Today:** \`${result.tokensLeft}/3\``
          )
          .setFooter({ text: 'Play with honor • Earn community respect' })
          .setTimestamp();

        await message.reply({ embeds: [honorEmbed] });

        // Check level up and auto-role
        if (result.leveledUp) {
          const rewardRoleId = honorConfig.roles?.[String(result.level)];
          let unlockedRole = null;
          const targetMember = message.guild.members.cache.get(mentioned.id) || await message.guild.members.fetch(mentioned.id).catch(() => null);

          if (rewardRoleId && targetMember) {
            const roleObj = message.guild.roles.cache.get(rewardRoleId) || await message.guild.roles.fetch(rewardRoleId).catch(() => null);
            if (roleObj) {
              const botMem = message.guild.members.me || await message.guild.members.fetchMe().catch(() => null);
              if (botMem && botMem.permissions.has(PermissionFlagsBits.ManageRoles) && botMem.roles.highest.position > roleObj.position) {
                await targetMember.roles.add(roleObj, `Honor Level ${result.level}`).catch(() => null);
                unlockedRole = roleObj;
              }
            }
          }

          const promoEmbed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle(`👑 HONOR PROMOTION: LEVEL ${result.level}!`)
            .setDescription(
              `🌟 Congratulations ${mentioned}! You ascended to **Honor Level ${result.level}**!\n` +
              (unlockedRole ? `🎉 **Unlocked Role:** <@&${unlockedRole.id}>!` : '')
            )
            .setThumbnail(mentioned.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

          await message.channel.send({ content: `${mentioned}`, embeds: [promoEmbed] }).catch(() => null);
        }
        return true;
      }

      case 'honorprofile':
      case 'honorcard':
      case 'repcard': {
        const target = message.mentions.users.first() || message.author;
        const userData = DatabaseManager.getHonorUser(message.guild.id, target.id);
        const level = userData.level || 1;
        const points = userData.points || 0;
        const cats = userData.categories || { friendly: 0, shotcaller: 0, helpful: 0, mvp: 0 };
        const nextTier = DatabaseManager.getHonorPointsForNextLevel(level);
        const rank = DatabaseManager.getUserHonorRank(message.guild.id, target.id) || 'Unranked';

        const profileEmbed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle(`🎖️ Honor Profile • ${target.username}`)
          .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
          .setDescription(
            `**Honor Rank:** **Level ${level} — ${nextTier.title}**\n` +
            `**Total Honor Points:** \`${points}\` Points\n` +
            `**Server Rank:** \`#${rank}\`\n\n` +
            `### 📊 Commendations Breakdown:\n` +
            `• 🤝 **Friendly:** \`${cats.friendly || 0}\`\n` +
            `• 🎯 **Shotcaller:** \`${cats.shotcaller || 0}\`\n` +
            `• 💡 **Helpful:** \`${cats.helpful || 0}\`\n` +
            `• ⚡ **MVP / Clutch:** \`${cats.mvp || 0}\`\n\n` +
            `• 🪙 **Daily Tokens Left:** \`${userData.tokensRemaining ?? 3}/3\``
          )
          .setFooter({ text: 'Give honor with "h honor @user <category>"' })
          .setTimestamp();

        await message.reply({ embeds: [profileEmbed] });
        return true;
      }

      case 'honorlb':
      case 'honorleaderboard': {
        const topList = DatabaseManager.getHonorLeaderboard(message.guild.id, 10);
        if (topList.length === 0) {
          return message.reply({ embeds: [EmbedUtils.info('Honor Leaderboard Empty', 'No members have received Honor commendations yet! Use `h honor @user` to commend teammates.')] });
        }

        const lines = topList.map((entry, idx) => {
          const medal = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][idx] || `#${idx + 1}`;
          return `${medal} <@${entry.userId}> • **Level ${entry.level}** (\`${entry.points}\` Honor Points)`;
        });

        const lbEmbed = new EmbedBuilder()
          .setColor(config.embedColors?.primary || '#5865F2')
          .setTitle(`👑 ${message.guild.name} • Honor Leaderboard`)
          .setDescription(lines.join('\n\n'))
          .setFooter({ text: `${config.botName || 'RAW'} Honor Engine` })
          .setTimestamp();

        await message.reply({ embeds: [lbEmbed] });
        return true;
      }

      // ==========================================
      // MODERATION CASES & STRIKES COMMANDS
      // ==========================================
      case 'case': {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
          return message.reply({ embeds: [EmbedUtils.error('Permission Denied', 'You need the **Moderate Members** permission to view moderation cases.')] });
        }
        if (!args[0]) {
          return message.reply({ embeds: [EmbedUtils.warning('Usage', 'Please specify a Case ID: `h case <id>` (e.g. `h case 1001` or `h case CASE-1001`)')] });
        }
        const modCase = DatabaseManager.getCase(message.guild.id, args[0]);
        if (!modCase) {
          return message.reply({ embeds: [EmbedUtils.error('Not Found', `No case found matching \`${args[0]}\` in this server.`)] });
        }
        const statusEmoji = modCase.status === 'pardoned' ? '🕊️ Pardoned' : '⚡ Active Infraction';
        const caseEmbed = new EmbedBuilder()
          .setColor(modCase.status === 'pardoned' ? '#57F287' : '#ED4245')
          .setTitle(`📋 Case File: ${modCase.caseId}`)
          .addFields(
            { name: '👤 Target Member', value: `<@${modCase.userId}> (\`${modCase.userTag}\`)`, inline: true },
            { name: '🛡️ Enforcing Staff', value: modCase.modId === 'AUTOMOD' ? `🤖 ${config.botName || 'RAW'} HumanMod` : `<@${modCase.modId}> (\`${modCase.modTag}\`)`, inline: true },
            { name: '⚖️ Action Taken', value: `\`${modCase.action}\`${modCase.duration ? ` (${modCase.duration})` : ''}`, inline: true },
            { name: '📌 Status', value: statusEmoji, inline: true },
            { name: '📅 Date', value: `<t:${Math.floor(new Date(modCase.timestamp).getTime() / 1000)}:R>`, inline: true },
            { name: '⚡ Strike', value: modCase.strikeNumber ? `Strike #${modCase.strikeNumber}` : 'None', inline: true },
            { name: '📋 Primary Reason', value: modCase.reason || 'No reason provided', inline: false }
          );
        if (modCase.detail) {
          caseEmbed.addFields({ name: '📝 Incident Detail', value: `\`\`\`${modCase.detail.slice(0, 500)}\`\`\``, inline: false });
        }
        if (modCase.status === 'pardoned') {
          caseEmbed.addFields({ name: '🕊️ Pardon Reason', value: `Pardoned by **${modCase.pardonedBy}**: ${modCase.pardonReason || 'Discretionary pardon'}` });
        }
        caseEmbed.setFooter({ text: `${config.botName || 'RAW'} Disciplinary Records` });
        await message.reply({ embeds: [caseEmbed] });
        return true;
      }

      case 'cases':
      case 'modhistory': {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
          return message.reply({ embeds: [EmbedUtils.error('Permission Denied', 'You need the **Moderate Members** permission to view moderation history.')] });
        }
        const target = message.mentions.users.first() || (args[0] ? await message.client.users.fetch(args[0]).catch(() => null) : message.author);
        if (!target) {
          return message.reply({ embeds: [EmbedUtils.error('User Not Found', 'Could not locate that member. Usage: `h cases @user`')] });
        }
        const userCases = DatabaseManager.getCases(message.guild.id, target.id, 10);
        const activeStrikes = DatabaseManager.getActiveStrikes(message.guild.id, target.id);
        const threatWatch = DatabaseManager.getThreatWatch(message.guild.id, target.id);

        const histEmbed = new EmbedBuilder()
          .setColor(config.embedColors?.primary || '#5865F2')
          .setTitle(`📜 Disciplinary History: ${target.tag}`)
          .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
          .setDescription(
            `**User ID:** \`${target.id}\` • **Active Strikes:** **${activeStrikes.length}** • **Total Cases:** **${userCases.length}**` +
            (threatWatch ? `\n🛡️ **Threat Score:** \`${threatWatch.riskLevel || 'LOW'}\` (${threatWatch.score || 0}%)` : '')
          );

        if (userCases.length === 0) {
          histEmbed.addFields({ name: '🌟 Clean Record', value: 'This member has no recorded moderation cases on this server.' });
        } else {
          const lines = userCases.map(c => {
            const time = `<t:${Math.floor(new Date(c.timestamp).getTime() / 1000)}:R>`;
            const statusIcon = c.status === 'pardoned' ? '🕊️ [Pardoned]' : '⚡';
            return `**${statusIcon} ${c.caseId}** (${c.action}) — *${c.reason}* (${time})`;
          }).join('\n');
          histEmbed.addFields({ name: '📋 Recent Cases (Last 10)', value: lines });
        }
        histEmbed.setFooter({ text: `${config.botName || 'RAW'} Disciplinary Records` }).setTimestamp();
        await message.reply({ embeds: [histEmbed] });
        return true;
      }

      case 'strikes': {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
          return message.reply({ embeds: [EmbedUtils.error('Permission Denied', 'You need the **Moderate Members** permission to view member strikes.')] });
        }
        const target = message.mentions.users.first() || (args[0] ? await message.client.users.fetch(args[0]).catch(() => null) : message.author);
        if (!target) {
          return message.reply({ embeds: [EmbedUtils.error('User Not Found', 'Usage: `h strikes @user`')] });
        }
        const strikes = DatabaseManager.getActiveStrikes(message.guild.id, target.id);
        const strikeEmbed = new EmbedBuilder()
          .setColor(strikes.length > 0 ? '#ED4245' : '#57F287')
          .setTitle(`⚡ Active Strikes: ${target.tag}`)
          .setThumbnail(target.displayAvatarURL({ dynamic: true, size: 256 }))
          .setDescription(
            `**Active Strikes:** **${strikes.length}**\n` +
            `*Strikes decay automatically after 7 days of good behavior.*`
          );
        if (strikes.length === 0) {
          strikeEmbed.addFields({ name: '✨ Standing', value: 'Member currently has 0 active strikes and is in full good standing.' });
        } else {
          const lines = strikes.map((s, idx) => {
            const exp = `<t:${Math.floor(s.expiresAt / 1000)}:R>`;
            return `**Strike #${idx + 1}:** *${s.reason}* • Decays ${exp}`;
          }).join('\n');
          strikeEmbed.addFields({ name: '⏳ Expiration Timers', value: lines });
        }
        await message.reply({ embeds: [strikeEmbed] });
        return true;
      }

      case 'pardon': {
        if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
          return message.reply({ embeds: [EmbedUtils.error('Permission Denied', 'You need the **Moderate Members** permission to pardon cases.')] });
        }
        if (!args[0]) {
          return message.reply({ embeds: [EmbedUtils.warning('Usage', 'Usage: `h pardon <caseId> [reason]` (e.g. `h pardon CASE-1001 false positive`)')] });
        }
        const caseIdInput = args.shift();
        const reason = args.join(' ').trim() || 'Staff discretionary pardon';
        const modCase = DatabaseManager.getCase(message.guild.id, caseIdInput);
        if (!modCase) {
          return message.reply({ embeds: [EmbedUtils.error('Not Found', `No case found matching \`${caseIdInput}\`.`)] });
        }
        if (modCase.status === 'pardoned') {
          return message.reply({ embeds: [EmbedUtils.warning('Already Pardoned', `Case \`${modCase.caseId}\` was already pardoned.`)] });
        }
        DatabaseManager.pardonCase(message.guild.id, caseIdInput, message.author.id, message.author.tag, reason);
        try {
          const targetMem = await message.guild.members.fetch(modCase.userId).catch(() => null);
          if (targetMem && targetMem.isCommunicationDisabled()) {
            await targetMem.timeout(null, `Pardoned by ${message.author.tag}`);
          }
        } catch {}
        await ModLogger.log(message.guild, {
          action: 'Case Pardoned',
          target: { id: modCase.userId, tag: modCase.userTag },
          moderator: message.author,
          reason: reason,
          color: config.embedColors?.success || '#57F287',
          fields: [
            { name: '🆔 Case File', value: `\`${modCase.caseId}\``, inline: true },
            { name: '⚖️ Action', value: modCase.action, inline: true }
          ]
        }).catch(() => null);
        await message.reply({
          embeds: [EmbedUtils.success('Case Pardoned', `Successfully pardoned **\`${modCase.caseId}\`** for <@${modCase.userId}>.\n**Reason:** ${reason}`)]
        });
        return true;
      }

      // ==========================================
      // HELP COMMAND
      // ==========================================
      case 'help':
      case 'commands': {
        const helpEmbed = new EmbedBuilder()
          .setTitle(`🌟 ${config.botName || 'RAW'} Command Guide`)
          .setDescription(
            `You can use both **Prefix Commands (\`r <command>\` or \`h <command>\`)** and **Slash Commands (\`/<command>\`)**!\n\n` +
            `**🎵 Music Commands:**\n` +
            `• \`r play <song / url>\` — Play any song or playlist (\`r p <name>\`)\n` +
            `• \`r pause\` / \`r resume\` — Pause or unpause music playback\n` +
            `• \`r skip [to]\` — Skip song or jump to queue track (\`r s\`)\n` +
            `• \`r stop\` — Stop music, clear queue & leave voice (\`r dc\`)\n` +
            `• \`r queue [page]\` — View songs queue (\`r q\`)\n` +
            `• \`r np\` — Now playing song info with control buttons\n` +
            `• \`r volume <0-150>\` — Set playback volume (\`r vol 80\`)\n` +
            `• \`r loop\` — Toggle song / queue loop mode\n` +
            `• \`r shuffle\` — Randomize songs in queue\n` +
            `• \`r lyrics [song]\` — Search song lyrics (\`r ly\`)\n` +
            `• \`r panel\` — Create interactive music control panel\n\n` +
            `**🎖️ Honor & Reputation Commands:**\n` +
            `• \`r honor @user [category] [reason]\` — Commend teammate & grant Honor\n` +
            `• \`r honorprofile [@user]\` — View Honor level, badges & progress\n` +
            `• \`r honorlb\` — View Top 10 most honorable members\n\n` +
            `**🛠️ Utility & Moderation Commands:**\n` +
            `• \`r rank [@user]\` — View AmariBot-style Level & XP rank card\n` +
            `• \`r ghostping\` — View who ghost pinged whom\n` +
            `• \`r snipe\` — View recently deleted message in channel\n` +
            `• \`r announce\` — Send server announcements with custom embeds\n` +
            `• \`r ping\` — Check bot latency & status\n` +
            `• \`r avatar [@user]\` — View user avatar\n` +
            `• \`r help\` — Show this help manual\n` +
            `• \`/setup\` — Server Auto-Setup & Templates\n` +
            `• \`/automod\` — Anti-Spam, Anti-Link & Anti-Scam filter\n` +
            `• \`/honor setup\` — Configure Honor role rewards & auto-roles`
          )
          .setColor(config.embedColors?.primary || '#5865F2')
          .setFooter({ text: `${config.botName || 'RAW'} Bot • Powered by Antigravity` })
          .setTimestamp();

        return message.reply({ embeds: [helpEmbed] });
      }

      default:
        return false;
    }
  }
}

module.exports = PrefixCommandHandler;
