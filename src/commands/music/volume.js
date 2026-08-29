const { SlashCommandBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('🔊 Adjust audio playback volume')
    .addIntegerOption(opt =>
      opt
        .setName('percent')
        .setDescription('Volume level (1% - 150%)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(150)
    ),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to change the volume!')],
        ephemeral: true
      });
    }

    const queue = MusicManager.getQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Nothing Playing', 'There is no active music session in this server!')],
        ephemeral: true
      });
    }

    const newVol = interaction.options.getInteger('percent');
    queue.setVolume(newVol);

    return interaction.reply({
      embeds: [EmbedUtils.success('Volume Adjusted', `🔊 Set server music volume to **${newVol}%**.`)]
    });
  }
};
