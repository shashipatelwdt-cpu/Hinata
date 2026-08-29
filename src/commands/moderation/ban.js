const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🔨 Ban a user from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The user to ban').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the ban').setRequired(false))
    .addIntegerOption(opt => 
      opt.setName('delete_days')
        .setDescription('Number of days of message history to delete (0-7)')
        .setMinValue(0)
        .setMaxValue(7)
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const deleteDays = interaction.options.getInteger('delete_days') || 0;

    const member = interaction.guild.members.cache.get(user.id);

    if (user.id === interaction.user.id) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot ban yourself.')], ephemeral: true });
    }

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot ban the bot.')], ephemeral: true });
    }

    if (member) {
      if (!member.bannable) {
        return interaction.reply({ 
          embeds: [EmbedUtils.error('Permission Denied', 'I cannot ban this user because their role is higher than or equal to my highest role.')], 
          ephemeral: true 
        });
      }

      if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
        return interaction.reply({ 
          embeds: [EmbedUtils.error('Permission Denied', 'You cannot ban a member who has a role equal to or higher than yours.')], 
          ephemeral: true 
        });
      }
    }

    // Try sending DM to user
    try {
      await user.send({
        embeds: [
          EmbedUtils.error(
            `You were banned from ${interaction.guild.name}`,
            `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
          )
        ]
      }).catch(() => null);
    } catch {}

    try {
      await interaction.guild.members.ban(user.id, {
        reason: `${reason} | Banned by ${interaction.user.tag}`,
        deleteMessageSeconds: deleteDays * 86400
      });

      await ModLogger.log(interaction.guild, {
        action: 'Member Banned',
        target: user,
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors.danger,
        fields: [{ name: '🗑️ Deleted Messages', value: `${deleteDays} days`, inline: true }]
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Member Banned',
            `Successfully banned **${user.tag}** (\`${user.id}\`).\n**Reason:** ${reason}`
          )
        ]
      });
    } catch (error) {
      console.error('[BAN ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Ban Failed', `Could not ban the user: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
