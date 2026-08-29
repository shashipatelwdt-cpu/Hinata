const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('⏱️ Set channel rate limit / slowmode')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(opt =>
      opt.setName('seconds')
        .setDescription('Slowmode delay in seconds (0 to disable, up to 21600 / 6 hours)')
        .setMinValue(0)
        .setMaxValue(21600)
        .setRequired(true)
    )
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to apply slowmode (defaults to current)').setRequired(false))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for slowmode').setRequired(false)),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await channel.setRateLimitPerUser(seconds, `${reason} | Set by ${interaction.user.tag}`);

      await ModLogger.log(interaction.guild, {
        action: 'Slowmode Updated',
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors.neutral,
        fields: [
          { name: '💬 Channel', value: `<#${channel.id}>`, inline: true },
          { name: '⏱️ Cooldown', value: seconds === 0 ? 'Disabled (0s)' : `${seconds} seconds`, inline: true }
        ]
      });

      const message = seconds === 0
        ? `Slowmode has been **disabled** for <#${channel.id}>.`
        : `Slowmode set to **${seconds} second(s)** for <#${channel.id}>.`;

      return interaction.reply({
        embeds: [EmbedUtils.success('Slowmode Updated', message)]
      });
    } catch (error) {
      console.error('[SLOWMODE ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Slowmode Failed', `Could not update slowmode: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
