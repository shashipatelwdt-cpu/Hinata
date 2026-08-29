const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('👋 Configure goodbye / member leave messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('setup')
        .setDescription('⚙️ Setup or update the leave message channel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel where goodbye messages will be posted').setRequired(true))
        .addStringOption(opt =>
          opt.setName('custom_message')
            .setDescription('Custom text. Variables: {username}, {tag}, {server}, {count}')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('disable')
        .setDescription('❌ Turn off goodbye messages')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
    const leave = { ...config.defaultSettings.leave, ...(guildSettings.leave || {}) };

    if (subcommand === 'setup') {
      const channel = interaction.options.getChannel('channel');
      const customMessage = interaction.options.getString('custom_message');

      const updated = {
        enabled: true,
        channelId: channel.id,
        message: customMessage || leave.message || config.defaultSettings.leave.message
      };

      DatabaseManager.setLeaveConfig(interaction.guild.id, updated);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Leave Messages Configured',
            `Goodbye messages are now **ENABLED** in <#${channel.id}>.`
          )
        ]
      });
    }

    if (subcommand === 'disable') {
      leave.enabled = false;
      DatabaseManager.setLeaveConfig(interaction.guild.id, leave);

      return interaction.reply({
        embeds: [EmbedUtils.success('Leave Messages Disabled', 'Goodbye messages have been disabled.')]
      });
    }
  }
};
