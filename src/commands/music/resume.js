const { SlashCommandBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('▶️ Resume paused music playback'),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to use music commands!')],
        ephemeral: true
      });
    }

    const queue = MusicManager.getQueue(interaction.guild.id);
    if (!queue || !queue.isPlaying) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Nothing Playing', 'There is no music currently playing!')],
        ephemeral: true
      });
    }

    if (!queue.isPaused) {
      return interaction.reply({
        embeds: [EmbedUtils.warning('Not Paused', 'Music is already playing!')],
        ephemeral: true
      });
    }

    queue.resume();
    return interaction.reply({
      embeds: [EmbedUtils.success('Music Resumed', `▶️ Resumed **${queue.currentSong?.title || 'current song'}**!`)]
    });
  }
};
