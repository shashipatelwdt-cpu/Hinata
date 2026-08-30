const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('👋 Disconnect the bot from the voice channel and clear queue'),

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
    const connection = getVoiceConnection(interaction.guild.id);

    if (!queue && !connection) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Not Connected', 'Hinata is not currently connected to any voice channel in this server!')],
        ephemeral: true
      });
    }

    if (queue) {
      queue.stop();
    } else if (connection) {
      try { connection.destroy(); } catch {}
    }

    return interaction.reply({
      embeds: [EmbedUtils.success('Disconnected', '👋 Successfully left the voice channel.')]
    });
  }
};
