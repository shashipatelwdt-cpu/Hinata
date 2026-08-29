const { SlashCommandBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('🔀 Randomize the waiting queue order'),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to shuffle the queue!')],
        ephemeral: true
      });
    }

    const queue = MusicManager.getQueue(interaction.guild.id);
    if (!queue || queue.songs.length < 2) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Not Enough Songs', 'You need at least 2 songs in the queue to shuffle!')],
        ephemeral: true
      });
    }

    queue.shuffle();

    return interaction.reply({
      embeds: [EmbedUtils.success('Queue Shuffled', `🔀 Successfully randomized **${queue.songs.length}** waiting songs!`)]
    });
  }
};
