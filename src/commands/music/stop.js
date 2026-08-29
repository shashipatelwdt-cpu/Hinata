const { SlashCommandBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('⏹️ Stop music playback, clear queue, and leave voice channel'),

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
    if (!queue) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Nothing Playing', 'Hinata is not currently playing music in this server!')],
        ephemeral: true
      });
    }

    queue.stop();

    return interaction.reply({
      embeds: [EmbedUtils.success('Music Stopped', '⏹️ Cleared the queue and disconnected from the voice channel.')]
    });
  }
};
