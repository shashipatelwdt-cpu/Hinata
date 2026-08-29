const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const SnipeManager = require('../../utils/snipeManager');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearsnipe')
    .setDescription('🧹 Clear snipe and editsnipe history for a channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel to clear snipe history from (defaults to current channel)')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;

    const clearedCount = SnipeManager.clear(targetChannel.id);

    await ModLogger.log(interaction.guild, {
      action: 'Snipes Cleared',
      moderator: interaction.user,
      reason: `Cleared snipe cache in #${targetChannel.name}`,
      color: config.embedColors.warning,
      fields: [
        { name: '💬 Channel', value: `<#${targetChannel.id}>`, inline: true },
        { name: '🗑️ Cleared Records', value: `${clearedCount} messages`, inline: true }
      ]
    });

    return interaction.reply({
      embeds: [
        EmbedUtils.success(
          'Snipe Cache Cleared',
          `Successfully cleared all deleted & edited message records for <#${targetChannel.id}>.`
        )
      ],
      ephemeral: true
    });
  }
};
