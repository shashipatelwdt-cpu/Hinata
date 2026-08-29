const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const TimeUtils = require('../../utils/time');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('⏳ Mute/Timeout a member for a specified duration')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The member to timeout').setRequired(true))
    .addStringOption(opt => 
      opt.setName('duration')
        .setDescription('Duration of timeout (e.g. 60s, 5m, 10m, 1h, 1d, 7d - max 28d)')
        .setRequired(true)
    )
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the timeout').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const durationInput = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ embeds: [EmbedUtils.error('User Not Found', 'That user is not in this server.')], ephemeral: true });
    }

    if (user.id === interaction.user.id) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot timeout yourself.')], ephemeral: true });
    }

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot timeout the bot.')], ephemeral: true });
    }

    const durationMs = TimeUtils.parseDuration(durationInput);
    const maxTimeoutMs = 28 * 24 * 60 * 60 * 1000; // 28 days

    if (!durationMs || durationMs < 5000 || durationMs > maxTimeoutMs) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Invalid Duration', 'Please provide a valid duration between **5 seconds** and **28 days** (e.g., `10m`, `1h`, `1d`, `7d`).')], 
        ephemeral: true 
      });
    }

    if (!member.moderatable) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'I cannot timeout this member due to role hierarchy.')], 
        ephemeral: true 
      });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'You cannot timeout a member who has a role equal to or higher than yours.')], 
        ephemeral: true 
      });
    }

    try {
      await user.send({
        embeds: [
          EmbedUtils.warning(
            `You were timed out in ${interaction.guild.name}`,
            `**Duration:** ${TimeUtils.formatDuration(durationMs)}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
          )
        ]
      }).catch(() => null);
    } catch {}

    try {
      await member.timeout(durationMs, `${reason} | Timeout by ${interaction.user.tag}`);

      await ModLogger.log(interaction.guild, {
        action: 'Member Timed Out',
        target: user,
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors.warning,
        fields: [{ name: '⏱️ Duration', value: TimeUtils.formatDuration(durationMs), inline: true }]
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Member Timed Out',
            `Successfully timed out **${user.tag}** for **${TimeUtils.formatDuration(durationMs)}**.\n**Reason:** ${reason}`
          )
        ]
      });
    } catch (error) {
      console.error('[TIMEOUT ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Timeout Failed', `Could not timeout member: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
