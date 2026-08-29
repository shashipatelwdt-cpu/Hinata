const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botmute')
    .setDescription('🔇 Mute/Block a specific bot in a specific channel so no one can use it')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(sub =>
      sub
        .setName('mute')
        .setDescription('Mute a bot in a channel')
        .addUserOption(opt =>
          opt.setName('bot')
            .setDescription('The bot to mute')
            .setRequired(true)
        )
        .addChannelOption(opt =>
          opt.setName('channel')
            .setDescription('Channel to mute the bot in (defaults to current channel)')
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
              ChannelType.GuildVoice,
              ChannelType.GuildStageVoice
            )
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt.setName('reason')
            .setDescription('Reason for muting the bot in this channel')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('unmute')
        .setDescription('Unmute a bot in a channel to restore usage')
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
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('List all muted bots in a channel or across the server')
        .addChannelOption(opt =>
          opt.setName('channel')
            .setDescription('Filter by specific channel (optional)')
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
              ChannelType.GuildVoice,
              ChannelType.GuildStageVoice
            )
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;

    // 1. MUTE SUBCOMMAND
    if (subcommand === 'mute') {
      const targetUser = interaction.options.getUser('bot');
      const reason = interaction.options.getString('reason') || 'Muted in channel by moderator';

      if (!targetUser.bot) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Invalid Target', `${targetUser} is not a bot. This command is specifically designed for muting bots in channels.`)],
          ephemeral: true
        });
      }

      if (targetUser.id === interaction.client.user.id) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Action Denied', `You cannot channel-mute ${interaction.client.user.username} itself.`)],
          ephemeral: true
        });
      }

      try {
        // Lock down channel permissions for the target bot
        await targetChannel.permissionOverwrites.edit(targetUser.id, {
          ViewChannel: false,
          SendMessages: false,
          SendMessagesInThreads: false,
          CreatePublicThreads: false,
          CreatePrivateThreads: false,
          UseApplicationCommands: false,
          AddReactions: false,
          Speak: false
        }, { reason: `${reason} | Channel Muted by ${interaction.user.tag}` });

        // Save into Database
        DatabaseManager.addMutedBot(interaction.guild.id, targetChannel.id, targetUser.id, {
          botTag: targetUser.tag || targetUser.username,
          reason: reason,
          modId: interaction.user.id
        });

        // Audit Log
        await ModLogger.log(interaction.guild, {
          action: 'Bot Channel-Muted',
          moderator: interaction.user,
          target: targetUser,
          reason: reason,
          color: config.embedColors.warning,
          fields: [
            { name: '🤖 Muted Bot', value: `<@${targetUser.id}> (\`${targetUser.tag || targetUser.username}\`)`, inline: true },
            { name: '💬 Channel', value: `<#${targetChannel.id}>`, inline: true },
            { name: '🔒 Restrictions', value: '`ViewChannel: ❌`, `SendMessages: ❌`, `UseApplicationCommands: ❌`', inline: false }
          ]
        });

        return interaction.reply({
          embeds: [
            EmbedUtils.success(
              'Bot Muted in Channel 🔇',
              `Successfully muted <@${targetUser.id}> in <#${targetChannel.id}>.\n\n` +
              `• **Target Bot:** <@${targetUser.id}> (\`${targetUser.tag || targetUser.username}\`)\n` +
              `• **Channel:** <#${targetChannel.id}>\n` +
              `• **Status:** No member can use this bot in this channel.\n` +
              `• **Reason:** *${reason}*`
            )
          ]
        });
      } catch (error) {
        console.error('[BOTMUTE ERROR]', error);
        return interaction.reply({
          embeds: [EmbedUtils.error('Failed to Mute Bot', `Could not update channel permissions: \`${error.message}\``)],
          ephemeral: true
        });
      }
    }

    // 2. UNMUTE SUBCOMMAND
    if (subcommand === 'unmute') {
      const targetUser = interaction.options.getUser('bot');

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

    // 3. LIST SUBCOMMAND
    if (subcommand === 'list') {
      const specifiedChannel = interaction.options.getChannel('channel');

      if (specifiedChannel) {
        const list = DatabaseManager.getMutedBots(interaction.guild.id, specifiedChannel.id);
        if (!list || list.length === 0) {
          return interaction.reply({
            embeds: [EmbedUtils.info('No Muted Bots', `There are no bots currently muted in <#${specifiedChannel.id}>.`)],
            ephemeral: true
          });
        }

        const desc = list.map((b, i) =>
          `**${i + 1}.** <@${b.botId}> (\`${b.botTag}\`)\n` +
          `   • **Reason:** ${b.reason}\n` +
          `   • **Muted By:** <@${b.modId}>\n` +
          `   • **Date:** <t:${Math.floor(new Date(b.mutedAt).getTime() / 1000)}:R>`
        ).join('\n\n');

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary || '#5865F2')
          .setTitle(`🔇 Muted Bots in #${specifiedChannel.name}`)
          .setDescription(desc)
          .setFooter({ text: `Total: ${list.length} muted bot(s)` });

        return interaction.reply({ embeds: [embed] });
      } else {
        const allMuted = DatabaseManager.getMutedBots(interaction.guild.id);
        const channelIds = Object.keys(allMuted || {});

        if (channelIds.length === 0) {
          return interaction.reply({
            embeds: [EmbedUtils.info('No Muted Bots', 'There are no channel-muted bots in this server.')],
            ephemeral: true
          });
        }

        let desc = '';
        for (const chId of channelIds) {
          const bots = allMuted[chId];
          if (bots && bots.length > 0) {
            desc += `### 💬 <#${chId}>\n`;
            bots.forEach((b, idx) => {
              desc += `• **${idx + 1}.** <@${b.botId}> (\`${b.botTag}\`) — *${b.reason}*\n`;
            });
            desc += '\n';
          }
        }

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary || '#5865F2')
          .setTitle('🔇 All Channel-Muted Bots in Server')
          .setDescription(desc || 'No muted bots found.')
          .setFooter({ text: 'Use /botmute unmute to restore bot access.' });

        return interaction.reply({ embeds: [embed] });
      }
    }
  }
};
