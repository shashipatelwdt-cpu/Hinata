const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder 
} = require('discord.js');
const ServerStats = require('../../utils/serverStats');
const EmbedUtils = require('../../utils/embeds');
const { DatabaseManager } = require('../../../database/db');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverstats')
    .setDescription('📊 Manage dynamic live server stats voice counters')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub.setName('setup')
        .setDescription('🚀 Create and configure live server stats voice channels')
    )
    .addSubcommand(sub =>
      sub.setName('update')
        .setDescription('🔄 Force an immediate refresh of all stats counter channels')
    )
    .addSubcommand(sub =>
      sub.setName('status')
        .setDescription('ℹ️ View current server stats counter configuration')
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('🗑️ Delete stats channels and disable live counter system')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    // Check bot permissions
    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        embeds: [
          EmbedUtils.error(
            'Missing Permissions',
            'I need the **Manage Channels** permission to create and update server stats channels.'
          )
        ],
        ephemeral: true
      });
    }

    // 1. SETUP SUBCOMMAND
    if (subcommand === 'setup') {
      await interaction.deferReply();

      try {
        const result = await ServerStats.setupStats(guild);

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.success || '#57F287')
          .setTitle('📊 Live Server Stats Initialized!')
          .setDescription(
            `Successfully created the **SERVER STATS** category and **5 live voice counter channels**!\n\n` +
            `### 📈 Active Counters Created:\n` +
            `• ${result.names.totalMembers}\n` +
            `• ${result.names.humanMembers}\n` +
            `• ${result.names.botMembers}\n` +
            `• ${result.names.boosts}\n` +
            `• ${result.names.goal}\n\n` +
            `> 💡 *Note: Counter channels update automatically when members join/leave and sync periodically every 10 minutes.*`
          )
          .setFooter({ text: `${config.botName} Live Stats Engine` })
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      } catch (err) {
        console.error('[SERVER STATS SETUP ERROR]', err);
        return interaction.editReply({
          embeds: [EmbedUtils.error('Setup Failed', `Could not create server stats channels:\n\`${err.message}\``)]
        });
      }
    }

    // 2. UPDATE SUBCOMMAND
    if (subcommand === 'update') {
      await interaction.deferReply({ ephemeral: true });

      const currentConfig = DatabaseManager.getServerStats(guild.id);
      if (!currentConfig || !currentConfig.enabled) {
        return interaction.editReply({
          embeds: [
            EmbedUtils.warning(
              'Stats Not Configured',
              'Server stats counters are not set up on this server yet. Run `/serverstats setup` first.'
            )
          ]
        });
      }

      await ServerStats.updateGuildStats(guild);
      const stats = await ServerStats.calculateStats(guild);
      const names = ServerStats.getFormattedNames(stats);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.info || '#00B0FF')
        .setTitle('🔄 Server Stats Updated!')
        .setDescription(
          `All stat channel names have been refreshed with real-time server numbers:\n\n` +
          `• ${names.totalMembers}\n` +
          `• ${names.humanMembers}\n` +
          `• ${names.botMembers}\n` +
          `• ${names.boosts}\n` +
          `• ${names.goal}`
        )
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    }

    // 3. STATUS SUBCOMMAND
    if (subcommand === 'status') {
      const statsConfig = DatabaseManager.getServerStats(guild.id);
      const stats = await ServerStats.calculateStats(guild);
      const names = ServerStats.getFormattedNames(stats);

      const isEnabled = statsConfig && statsConfig.enabled;

      const embed = new EmbedBuilder()
        .setColor(isEnabled ? config.embedColors.primary : config.embedColors.warning)
        .setTitle(`📊 Server Stats Status - ${guild.name}`)
        .setDescription(
          `**Status:** ${isEnabled ? '🟢 **Active & Updating**' : '🔴 **Disabled** (Run `/serverstats setup`)'}\n` +
          `**Category:** ${statsConfig?.categoryId ? `<#${statsConfig.categoryId}>` : '*None*'}\n` +
          `**Last Sync:** ${statsConfig?.lastUpdated ? `<t:${Math.floor(statsConfig.lastUpdated / 1000)}:R>` : '*Never*'}\n\n` +
          `### 👥 Current Metrics:\n` +
          `• **Total Members:** \`${stats.totalMembers.toLocaleString()}\`\n` +
          `• **Human Members:** \`${stats.humanCount.toLocaleString()}\`\n` +
          `• **Bot Accounts:** \`${stats.botCount.toLocaleString()}\`\n` +
          `• **Server Boosts:** \`${stats.boostCount}\` (Tier ${stats.boostTier})\n` +
          `• **Next Member Milestone:** \`${stats.goal.toLocaleString()}\``
        )
        .setFooter({ text: `${config.botName} Live Stats` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 4. REMOVE SUBCOMMAND
    if (subcommand === 'remove') {
      await interaction.deferReply();

      try {
        await ServerStats.removeStats(guild);

        return interaction.editReply({
          embeds: [
            EmbedUtils.success(
              'Server Stats Removed',
              'Successfully deleted all stats channels and disabled the live counter system.'
            )
          ]
        });
      } catch (err) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Removal Failed', `Error removing stats channels:\n\`${err.message}\``)]
        });
      }
    }
  }
};
