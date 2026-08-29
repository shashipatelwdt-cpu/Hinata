const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botunmute')
    .setDescription('🔊 Unmute a bot in a channel so it can be used again')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addUserOption(opt =>
      opt.setName('bot')
        .setDescription('The bot to unmute')
        .setRequired(true)
    )
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel to unmute the bot in (defaults to current channel)')
        .addChannelTypes(
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.GuildVoice,
          ChannelType.GuildStageVoice
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('bot');
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;

    try {
      await targetChannel.permissionOverwrites.delete(targetUser.id, `Channel Unmuted by ${interaction.user.tag}`).catch(() => null);

      DatabaseManager.removeMutedBot(interaction.guild.id, targetChannel.id, targetUser.id);

      await ModLogger.log(interaction.guild, {
        action: 'Bot Channel-Unmuted',
        moderator: interaction.user,
        target: targetUser,
        reason: `Unmuted in #${targetChannel.name}`,
        color: config.embedColors.success,
        fields: [
          { name: '🤖 Unmuted Bot', value: `<@${targetUser.id}> (\`${targetUser.tag || targetUser.username}\`)`, inline: true },
          { name: '💬 Channel', value: `<#${targetChannel.id}>`, inline: true }
        ]
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Bot Unmuted in Channel 🔊',
            `Successfully unmuted <@${targetUser.id}> in <#${targetChannel.id}>. Members can now use this bot in this channel again.`
          )
        ]
      });
    } catch (error) {
      console.error('[BOTUNMUTE ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Failed to Unmute Bot', `Could not restore channel permissions: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
