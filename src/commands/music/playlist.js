const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

function formatSeconds(totalSec) {
  const s = parseInt(totalSec) || 0;
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('🎵 Spotify-style personal playlists: Create, manage, and play your saved playlists')
    .addSubcommand(sub =>
      sub.setName('create')
        .setDescription('✨ Create a new personal playlist')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of your playlist (e.g. Favorites, Gym Workout, Chill Lo-Fi)')
            .setMaxLength(50)
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('description')
            .setDescription('Optional description for your playlist')
            .setMaxLength(200)
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('➕ Add a song or YouTube/Spotify link to your playlist')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of your playlist')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('song')
            .setDescription('Song title, YouTube URL, or Spotify track link')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('addcurrent')
        .setDescription('💾 Save the song currently playing in voice channel to your playlist')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of your playlist')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('play')
        .setDescription('▶️ Load and play your personal playlist in voice channel')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of your playlist')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addBooleanOption(opt =>
          opt.setName('shuffle')
            .setDescription('Shuffle the playlist order before playing?')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName('view')
        .setDescription('📜 View all songs and details inside a playlist')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of your playlist')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt.setName('page')
            .setDescription('Page number to view (10 songs per page)')
            .setMinValue(1)
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('📋 List all your personal playlists')
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('❌ Remove a song from your playlist by track number')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of your playlist')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt.setName('track_number')
            .setDescription('Track number from /playlist view')
            .setMinValue(1)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('🗑️ Delete a personal playlist')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of the playlist to delete')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('clear')
        .setDescription('🧹 Clear all tracks from a playlist without deleting it')
        .addStringOption(opt =>
          opt.setName('name')
            .setDescription('Name of the playlist to clear')
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),

  async autocomplete(interaction) {
    const focused = (interaction.options.getFocused() || '').toLowerCase();
    const userPlaylists = DatabaseManager.getUserPlaylists(interaction.user.id);
    const filtered = userPlaylists
      .filter(pl => pl.name.toLowerCase().includes(focused))
      .slice(0, 25)
      .map(pl => ({
        name: `📁 ${pl.name} (${pl.tracks?.length || 0} tracks)`,
        value: pl.name
      }));

    await interaction.respond(filtered).catch(() => null);
  },

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    // ==========================================
    // 1. CREATE PLAYLIST
    // ==========================================
    if (sub === 'create') {
      const name = interaction.options.getString('name').trim();
      const description = interaction.options.getString('description') || '';

      const res = DatabaseManager.createPlaylist(userId, name, description);
      if (!res.success) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Playlist Creation Failed', res.message)],
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('✨ Playlist Created!')
        .setDescription(
          `Successfully created **${res.playlist.name}**!\n\n` +
          `• **📝 Description:** ${res.playlist.description || '*None*'}\n` +
          `• **➕ Add Songs:** \`/playlist add name:${res.playlist.name} song:<name/url>\`\n` +
          `• **💾 Save Current Song:** \`/playlist addcurrent name:${res.playlist.name}\`\n` +
          `• **▶️ Play Playlist:** \`/playlist play name:${res.playlist.name}\``
        )
        .setColor(config.embedColors?.success || '#57F287')
        .setFooter({ text: 'Spotify-Style Playlists • Hinata Music' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // ==========================================
    // 2. ADD TRACK TO PLAYLIST
    // ==========================================
    if (sub === 'add') {
      const name = interaction.options.getString('name').trim();
      const songQuery = interaction.options.getString('song').trim();

      const pl = DatabaseManager.getPlaylist(userId, name);
      if (!pl) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Not Found', `You do not have a playlist named **${name}**.\nCreate one with \`/playlist create name:${name}\``)],
          ephemeral: true
        });
      }

      await interaction.deferReply();

      const tracks = await MusicManager.search(songQuery, interaction.user);
      if (!tracks || tracks.length === 0) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Track Not Found', `Could not find any song matching **${songQuery}**.`)]
        });
      }

      const toAdd = tracks[0];
      const res = DatabaseManager.addTrackToPlaylist(userId, name, toAdd);

      if (!res.success) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Failed to Add Track', res.message)]
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('➕ Song Added to Playlist')
        .setDescription(
          `Added **[${toAdd.title}](${toAdd.url})** to **${pl.name}**!\n\n` +
          `• **⏱️ Duration:** \`${toAdd.duration || 'Unknown'}\`\n` +
          `• **📊 Total Tracks in Playlist:** \`${res.totalTracks} songs\``
        )
        .setThumbnail(toAdd.thumbnail || interaction.user.displayAvatarURL())
        .setColor(config.embedColors?.success || '#57F287')
        .setFooter({ text: `${pl.name} • Hinata Playlists` });

      return interaction.editReply({ embeds: [embed] });
    }

    // ==========================================
    // 3. ADD CURRENT PLAYING SONG TO PLAYLIST
    // ==========================================
    if (sub === 'addcurrent') {
      const name = interaction.options.getString('name').trim();
      const pl = DatabaseManager.getPlaylist(userId, name);
      if (!pl) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Not Found', `You do not have a playlist named **${name}**.\nCreate one with \`/playlist create name:${name}\``)],
          ephemeral: true
        });
      }

      const queue = MusicManager.getQueue(interaction.guild.id);
      if (!queue || !queue.currentSong) {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Nothing Playing', 'There is no song currently playing in this server!')],
          ephemeral: true
        });
      }

      const current = queue.currentSong;
      const res = DatabaseManager.addTrackToPlaylist(userId, name, current);

      if (!res.success) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Failed to Add Track', res.message)],
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('💾 Saved Current Song to Playlist!')
        .setDescription(
          `Saved **[${current.title}](${current.url})** into your playlist **${pl.name}**!\n\n` +
          `• **⏱️ Duration:** \`${current.duration || 'Unknown'}\`\n` +
          `• **📊 Total in Playlist:** \`${res.totalTracks} tracks\``
        )
        .setThumbnail(current.thumbnail || interaction.user.displayAvatarURL())
        .setColor(config.embedColors?.success || '#57F287')
        .setFooter({ text: `${pl.name} • Saved from Server Now Playing` });

      return interaction.reply({ embeds: [embed] });
    }

    // ==========================================
    // 4. PLAY PERSONAL PLAYLIST
    // ==========================================
    if (sub === 'play') {
      const name = interaction.options.getString('name').trim();
      const shuffle = interaction.options.getBoolean('shuffle') || false;

      const member = interaction.member;
      const voiceChannel = member?.voice?.channel;
      if (!voiceChannel) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Voice Channel Required', 'You must join a voice channel to play your playlist!')],
          ephemeral: true
        });
      }

      const pl = DatabaseManager.getPlaylist(userId, name);
      if (!pl || !Array.isArray(pl.tracks) || pl.tracks.length === 0) {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Empty Playlist', `Your playlist **${name}** is empty or does not exist!\nAdd tracks with \`/playlist add name:${name} song:<query>\``)],
          ephemeral: true
        });
      }

      await interaction.deferReply();

      const queue = MusicManager.createQueue(interaction.guild, voiceChannel, interaction.channel);

      let tracksToQueue = pl.tracks.map(t => ({
        title: t.title,
        url: t.url,
        duration: t.duration,
        durationSec: t.durationSec,
        thumbnail: t.thumbnail,
        author: t.author,
        requester: interaction.user,
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

      const totalDurationSec = tracksToQueue.reduce((acc, cur) => acc + (cur.durationSec || 0), 0);

      const embed = new EmbedBuilder()
        .setTitle(`▶️ Playing Playlist • ${pl.name}`)
        .setDescription(
          `Loaded **${tracksToQueue.length} tracks** into the music queue!\n\n` +
          `• **⏱️ Total Duration:** \`${formatSeconds(totalDurationSec)}\`\n` +
          `• **🔀 Shuffled:** ${shuffle ? '✅ Yes' : '❌ No'}\n` +
          `• **🎵 First Track:** **[${tracksToQueue[0].title}](${tracksToQueue[0].url})**\n` +
          `• **👤 Loaded By:** <@${userId}>`
        )
        .setThumbnail(tracksToQueue[0].thumbnail || interaction.user.displayAvatarURL())
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: `${pl.name} • Hinata Spotify-Style Queue` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      if (!queue.isPlaying) {
        queue.playNext();
      }
      return;
    }

    // ==========================================
    // 5. LIST USER PLAYLISTS
    // ==========================================
    if (sub === 'list') {
      const userPlaylists = DatabaseManager.getUserPlaylists(userId);
      if (!userPlaylists || userPlaylists.length === 0) {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              'No Playlists Found',
              'You haven\'t created any playlists yet!\n\nCreate your first playlist using:\n`/playlist create name:Favorites description:My top songs`'
            )
          ],
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(`🎵 ${interaction.user.username}'s Spotify Playlists`)
        .setDescription(`You have **${userPlaylists.length} / 25 personal playlists**:\n\n`)
        .setColor(config.embedColors?.primary || '#5865F2')
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: 'Use /playlist view <name> to see songs • /playlist play <name> to listen' });

      let desc = '';
      userPlaylists.forEach((pl, i) => {
        const count = pl.tracks?.length || 0;
        const totalSec = (pl.tracks || []).reduce((acc, t) => acc + (t.durationSec || 0), 0);
        desc += `**${i + 1}. 📁 [${pl.name}]** • \`${count} songs\` • \`${formatSeconds(totalSec)}\`\n`;
        if (pl.description) desc += `> *${pl.description}*\n`;
        desc += '\n';
      });

      embed.setDescription(desc);
      return interaction.reply({ embeds: [embed] });
    }

    // ==========================================
    // 6. VIEW PLAYLIST DETAILS & TRACKS
    // ==========================================
    if (sub === 'view') {
      const name = interaction.options.getString('name').trim();
      const page = interaction.options.getInteger('page') || 1;

      const pl = DatabaseManager.getPlaylist(userId, name);
      if (!pl) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Not Found', `Playlist **${name}** does not exist!\nUse \`/playlist list\` to view your playlists.`)],
          ephemeral: true
        });
      }

      const tracks = pl.tracks || [];
      const pageSize = 10;
      const totalPages = Math.max(1, Math.ceil(tracks.length / pageSize));
      const currentPage = Math.min(page, totalPages);
      const startIdx = (currentPage - 1) * pageSize;
      const pageTracks = tracks.slice(startIdx, startIdx + pageSize);

      const totalDurationSec = tracks.reduce((acc, cur) => acc + (cur.durationSec || 0), 0);

      const embed = new EmbedBuilder()
        .setTitle(`📁 Playlist: ${pl.name}`)
        .setDescription(
          `${pl.description ? `*${pl.description}*\n\n` : ''}` +
          `• **📊 Total Tracks:** \`${tracks.length} songs\`\n` +
          `• **⏱️ Total Duration:** \`${formatSeconds(totalDurationSec)}\`\n` +
          `• **📅 Created:** <t:${Math.floor(new Date(pl.created_at).getTime() / 1000)}:R>\n\n` +
          `**🎵 Track List (Page ${currentPage}/${totalPages}):**\n` +
          (pageTracks.length > 0
            ? pageTracks.map((t, idx) => `\`${startIdx + idx + 1}.\` **[${t.title.slice(0, 55)}](${t.url})** (\`${t.duration || 'Unknown'}\`)`).join('\n')
            : '*No tracks added yet. Use `/playlist add` or `/playlist addcurrent` to add songs!*')
        )
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: `Page ${currentPage} of ${totalPages} • /playlist remove name:${pl.name} track_number:<#>` });

      if (tracks[0]?.thumbnail) {
        embed.setThumbnail(tracks[0].thumbnail);
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`pl_play_${pl.name}`)
          .setLabel('▶️ Play Playlist')
          .setStyle(ButtonStyle.Success)
          .setDisabled(tracks.length === 0),
        new ButtonBuilder()
          .setCustomId(`pl_shuffle_${pl.name}`)
          .setLabel('🔀 Shuffle Play')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(tracks.length === 0),
        new ButtonBuilder()
          .setCustomId(`pl_delete_${pl.name}`)
          .setLabel('🗑️ Delete Playlist')
          .setStyle(ButtonStyle.Danger)
      );

      return interaction.reply({ embeds: [embed], components: [row] });
    }

    // ==========================================
    // 7. REMOVE TRACK FROM PLAYLIST
    // ==========================================
    if (sub === 'remove') {
      const name = interaction.options.getString('name').trim();
      const trackNumber = interaction.options.getInteger('track_number');

      const res = DatabaseManager.removeTrackFromPlaylist(userId, name, trackNumber);
      if (!res.success) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Remove Failed', res.message)],
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('🗑️ Track Removed')
        .setDescription(
          `Removed **${res.removedTrack.title}** from playlist **${name}**.\n` +
          `• **📊 Remaining Tracks:** \`${res.totalTracks} songs\``
        )
        .setColor(config.embedColors?.success || '#57F287');

      return interaction.reply({ embeds: [embed] });
    }

    // ==========================================
    // 8. DELETE PLAYLIST
    // ==========================================
    if (sub === 'delete') {
      const name = interaction.options.getString('name').trim();
      const success = DatabaseManager.deletePlaylist(userId, name);

      if (!success) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Delete Failed', `Could not find a playlist named **${name}** to delete.`)],
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [EmbedUtils.success('Playlist Deleted', `🗑️ Successfully deleted playlist **${name}**.`)]
      });
    }

    // ==========================================
    // 9. CLEAR PLAYLIST
    // ==========================================
    if (sub === 'clear') {
      const name = interaction.options.getString('name').trim();
      const success = DatabaseManager.clearPlaylist(userId, name);

      if (!success) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Clear Failed', `Could not find a playlist named **${name}**.`)],
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [EmbedUtils.success('Playlist Cleared', `🧹 Cleared all tracks from playlist **${name}**.`)]
      });
    }
  }
};
