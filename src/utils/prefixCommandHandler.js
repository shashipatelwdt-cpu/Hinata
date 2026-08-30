const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
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

    // List of accepted prefixes
    const prefixes = [
      customPrefix.toLowerCase(),
      'h ',
      'h!',
      'h.',
      'h-',
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
      if (matchedPrefix.trim().toLowerCase() === 'h' || matchedPrefix.startsWith('<@')) {
        const helpEmbed = new EmbedBuilder()
          .setTitle(`🎵 ${config.botName || 'Hinata'} Music & Prefix Commands`)
          .setDescription(
            `Hey ${message.author}! Use prefix commands starting with \`h \` or slash commands \`/\`.\n\n` +
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
            embeds: [EmbedUtils.error('Nothing Playing', 'Hinata is not currently playing music in this server!')]
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
            text: `Hinata Music System • ${queue.songs.length} song(s) in queue`,
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
          .setTitle('🎵 Hinata Master Music Panel')
          .setDescription(
            'Control high-fidelity music streaming with the buttons below or chat commands.\n\n' +
            '**Command Syntax:** `h play <song name or link>`\n' +
            '**Supported:** YouTube, Spotify, SoundCloud, Playlists'
          )
          .setColor(config.embedColors?.primary || '#5865F2')
          .setFooter({ text: 'Hinata Music • 24/7 High Quality Audio' });

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
          .setFooter({ text: 'Hinata Music Engine • AI Recommendations' })
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
            .setFooter({ text: 'Hinata Radio Engine • Spotify & YouTube Taste Algorithm' })
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
      // GHOSTPING COMMAND
      // ==========================================
      case 'ghostping':
      case 'gp':
      case 'ghost': {
        const result = SnipeManager.getGhostPing(message.channel.id, 0);
        if (!result) {
          return message.reply({
            embeds: [
              EmbedUtils.info('No Ghost Pings', `👻 No ghost pings recorded in <#${message.channel.id}>.`)
            ]
          });
        }

        const { ghostPing: record, index, total } = result;
        const userMentions = (record.ghostPing?.users || []).map(u => `<@${u.id}> (\`${u.tag || u.username}\`)`);
        const roleMentions = (record.ghostPing?.roles || []).map(r => `<@&${r.id}> (\`${r.name}\`)`);
        const everyoneMention = record.ghostPing?.hasEveryone ? ['`@everyone` / `@here`'] : [];
        const allMentionTargets = [...userMentions, ...roleMentions, ...everyoneMention].join('\n• ') || 'Unknown';

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
            { name: '👤 Ghost Pinger', value: `<@${record.author.id}>`, inline: true },
            { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
            { name: '⏰ Timing', value: `Sent <t:${Math.floor(record.sentAt / 1000)}:R>`, inline: true },
            { name: '🎯 Mentioned Targets', value: `• ${allMentionTargets}`, inline: false },
            { name: '📝 Message Content', value: record.content ? `>>> ${record.content.slice(0, 1000)}` : '*[No Text]*', inline: false }
          )
          .setFooter({ text: `Ghost Ping ${index} of ${total} • Type /ghostping for full details` })
          .setTimestamp(record.eventAt);

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
                  `• \`/announce send channel:#announcements message:Hello everyone! [ping:everyone/here/role]\`\n` +
                  `• \`/announce modal channel:#announcements\` *(Opens rich popup editor)*\n\n` +
                  `**⚡ Quick Prefix Syntax:**\n` +
                  `• \`h announce <#channel> <message>\`\n` +
                  `*Example:* \`h announce #announcements @everyone Server maintenance completed!\``
                )
                .setColor(config.embedColors?.primary || '#5865F2')
            ]
          });
        }

        const targetChannel = message.mentions.channels.first() || message.channel;
        const msgParts = args.filter(a => !a.startsWith('<#'));
        const announceText = msgParts.join(' ').trim();

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
        }

        const embed = new EmbedBuilder()
          .setTitle('📢 Server Announcement')
          .setDescription(cleanText)
          .setColor(config.embedColors?.primary || '#5865F2')
          .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
          .setThumbnail(message.guild.iconURL({ dynamic: true, size: 256 }))
          .setFooter({ text: `Announced by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
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
      // HELP COMMAND
      // ==========================================
      case 'help':
      case 'commands': {
        const helpEmbed = new EmbedBuilder()
          .setTitle(`🌟 ${config.botName || 'Hinata'} Command Guide`)
          .setDescription(
            `You can use both **Prefix Commands (\`h <command>\`)** and **Slash Commands (\`/<command>\`)**!\n\n` +
            `**🎵 Music Commands:**\n` +
            `• \`h play <song / url>\` — Play any song or playlist (\`h p <name>\`)\n` +
            `• \`h pause\` — Pause current music playback\n` +
            `• \`h resume\` — Resume paused track\n` +
            `• \`h skip [to]\` — Skip song or jump to queue track (\`h s\`)\n` +
            `• \`h stop\` — Stop music, clear queue & leave voice (\`h dc\`)\n` +
            `• \`h queue [page]\` — View songs queue (\`h q\`)\n` +
            `• \`h np\` — Now playing song info with control buttons\n` +
            `• \`h volume <0-150>\` — Set playback volume (\`h vol 80\`)\n` +
            `• \`h loop\` — Toggle song / queue loop mode\n` +
            `• \`h shuffle\` — Randomize songs in queue\n` +
            `• \`h lyrics [song]\` — Search song lyrics (\`h ly\`)\n` +
            `• \`h panel\` — Create interactive music control panel\n\n` +
            `**🛠️ Utility & Moderation Commands:**\n` +
            `• \`h ghostping\` — View who ghost pinged whom and what was the message\n` +
            `• \`h snipe\` — View recently deleted message in channel\n` +
            `• \`h announce\` — Send server announcements with custom embeds & pings\n` +
            `• \`h ping\` — Check bot latency & status\n` +
            `• \`h avatar [@user]\` — View user avatar\n` +
            `• \`h help\` — Show this help manual\n` +
            `• \`/setup\` — Server Auto-Setup & Templates\n` +
            `• \`/automod\` — Anti-Spam, Anti-Link & Bad Words filter`
          )
          .setColor(config.embedColors?.primary || '#5865F2')
          .setFooter({ text: 'Hinata Bot • Powered by Antigravity' })
          .setTimestamp();

        return message.reply({ embeds: [helpEmbed] });
      }

      default:
        return false;
    }
  }
}

module.exports = PrefixCommandHandler;
