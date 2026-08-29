const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radio')
    .setDescription('📻 Start a 24/7 Smart Radio Station based on any song, artist, or vibe (Spotify Taste Engine)')
    .addStringOption(opt =>
      opt
        .setName('seed')
        .setDescription('Song name, artist, genre or mood (e.g. Arijit Singh, Romantic, Lofi, Pop)')
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
        name: `📻 Radio: ${v.title.substring(0, 75)}`,
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
        embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to start a radio station!')],
        ephemeral: true
      });
    }

    const botMember = interaction.guild.members.me || await interaction.guild.members.fetchMe().catch(() => null);
    const permissions = voiceChannel.permissionsFor(botMember);
    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Missing Permissions', `I need **Connect** and **Speak** permissions in <#${voiceChannel.id}>!`)],
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const seed = interaction.options.getString('seed');
    const tracks = await MusicManager.search(seed, interaction.user);

    if (!tracks || tracks.length === 0) {
      return interaction.editReply({
        embeds: [EmbedUtils.error('Radio Error', `Could not find any starting track for **${seed}**.`)]
      });
    }

    const queue = MusicManager.createQueue(interaction.guild, voiceChannel, interaction.channel);
    queue.autoplay = true; // Automatically lock on Smart Autoplay mode

    const startingTrack = tracks[0];
    queue.songs = [startingTrack]; // Focus radio station on this seed

    const embed = new EmbedBuilder()
      .setTitle('📻 Tuned In: Smart Radio Station Started!')
      .setDescription(
        `**Station Seed:** [${startingTrack.title}](${startingTrack.url})\n` +
        `**Artist / Channel:** \`${startingTrack.author || 'Music'}\`\n` +
        `**Voice Channel:** <#${voiceChannel.id}>\n\n` +
        `✨ **Smart Taste Matching is ON!**\n` +
        `The bot will continuously stream seamless songs matching this vibe, artist, and genre non-stop!`
      )
      .setColor(config.embedColors?.primary || '#5865F2')
      .setFooter({ text: 'Hinata Radio Engine • Spotify & YouTube Taste Algorithm' })
      .setTimestamp();

    if (startingTrack.thumbnail) {
      embed.setThumbnail(startingTrack.thumbnail);
    }

    await interaction.editReply({ embeds: [embed] });

    if (!queue.isPlaying) {
      queue.playNext();
    } else {
      queue.skip();
    }
  }
};
