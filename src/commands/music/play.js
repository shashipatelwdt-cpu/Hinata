const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('🎵 Play high quality music from YouTube, Spotify, SoundCloud or search query')
    .addStringOption(opt =>
      opt
        .setName('query')
        .setDescription('Song name, YouTube URL, Spotify link or SoundCloud link')
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused() || '';
    if (!focused || focused.trim().length < 2) {
      return interaction.respond([]).catch(() => null);
    }

    try {
      const results = await ytSearch(focused.trim());
      const choices = (results.videos || []).slice(0, 7).map(v => ({
        name: `🎵 ${v.title.substring(0, 80)} (${v.timestamp})`,
        value: v.url
      }));
      await interaction.respond(choices).catch(() => null);
    } catch {
      await interaction.respond([]).catch(() => null);
    }
  },

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to play music!')],
        ephemeral: true
      });
    }

    const botMember = interaction.guild.members.me || await interaction.guild.members.fetchMe().catch(() => null);
    const permissions = voiceChannel.permissionsFor(botMember);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Missing Permissions', `I need **Connect** and **Speak** permissions in <#${voiceChannel.id}> to play music!`)],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const query = interaction.options.getString('query');
    const tracks = await MusicManager.search(query, interaction.user);

    if (!tracks || tracks.length === 0) {
      return interaction.editReply({
        embeds: [EmbedUtils.error('Not Found', `No results found for **${query}**.`)]
      });
    }

    const queue = MusicManager.createQueue(interaction.guild, voiceChannel, interaction.channel);

    if (tracks.length === 1) {
      const song = tracks[0];
      queue.songs.push(song);

      if (!queue.isPlaying) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('🎶 Starting Playback')
              .setDescription(`Connecting to <#${voiceChannel.id}> and playing **[${song.title}](${song.url})**`)
              .setColor(config.embedColors?.primary || '#5865F2')
          ]
        });
        queue.playNext();
      } else {
        const embed = new EmbedBuilder()
          .setTitle('➕ Added to Queue')
          .setDescription(`**[${song.title}](${song.url})**`)
          .addFields(
            { name: '⏱️ Duration', value: `\`${song.duration || 'Unknown'}\``, inline: true },
            { name: '📍 Position in Queue', value: `\`#${queue.songs.length}\``, inline: true },
            { name: '👤 Requester', value: `<@${interaction.user.id}>`, inline: true }
          )
          .setColor(config.embedColors?.success || '#57F287');

        if (song.thumbnail) embed.setThumbnail(song.thumbnail);
        await interaction.editReply({ embeds: [embed] });
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
          { name: '👤 Requested By', value: `<@${interaction.user.id}>`, inline: true }
        )
        .setColor(config.embedColors?.success || '#57F287');

      await interaction.editReply({ embeds: [embed] });

      if (!queue.isPlaying) {
        queue.playNext();
      }
    }
  }
};
