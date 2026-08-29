const { SlashCommandBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('🎶 View details and control panel for the currently playing song'),

  async execute(interaction) {
    const queue = MusicManager.getQueue(interaction.guild.id);
    if (!queue || !queue.currentSong) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Nothing Playing', 'There is no song currently playing in this server!')],
        ephemeral: true
      });
    }

    const embed = queue.buildNowPlayingEmbed();
    const rows = queue.buildControlsRow();

    return interaction.reply({
      embeds: [embed],
      components: rows
    });
  }
};
