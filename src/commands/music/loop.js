const { SlashCommandBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('🔁 Toggle or set repeat loop mode')
    .addStringOption(opt =>
      opt
        .setName('mode')
        .setDescription('Loop mode')
        .setRequired(false)
        .addChoices(
          { name: '❌ Off (No Loop)', value: 'off' },
          { name: '🔂 Single Track (Repeat Current Song)', value: 'track' },
          { name: '🔁 Entire Queue (Repeat All Songs)', value: 'queue' }
        )
    ),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to change loop mode!')],
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

    const choice = interaction.options.getString('mode');
    if (choice) {
      queue.loopMode = choice;
    } else {
      queue.toggleLoop();
    }

    const loopLabels = {
      'off': '❌ **Loop Disabled**',
      'track': '🔂 **Looping Current Song**',
      'queue': '🔁 **Looping Entire Queue**'
    };

    return interaction.reply({
      embeds: [EmbedUtils.success('Loop Mode Updated', loopLabels[queue.loopMode] || `Loop is now \`${queue.loopMode}\``)]
    });
  }
};
