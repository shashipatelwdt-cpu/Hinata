const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Warn a member for rule infractions')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The member to warn').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the warning').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = interaction.guild.members.cache.get(user.id);

    if (user.id === interaction.user.id) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot warn yourself.')], ephemeral: true });
    }

    if (user.bot) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot warn bots.')], ephemeral: true });
    }

    if (member && member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'You cannot warn a member who has a role equal to or higher than yours.')], 
        ephemeral: true 
      });
    }

    const warnId = DatabaseManager.addWarn(interaction.guild.id, user.id, interaction.user.id, reason);
    const totalWarns = DatabaseManager.getWarnCount(interaction.guild.id, user.id);

    try {
      await user.send({
        embeds: [
          EmbedUtils.warning(
            `You received a warning in ${interaction.guild.name}`,
            `**Reason:** ${reason}\n**Warning ID:** \`#${warnId}\`\n**Total Warnings:** ${totalWarns}\n**Moderator:** ${interaction.user.tag}`
          )
        ]
      }).catch(() => null);
    } catch {}

    await ModLogger.log(interaction.guild, {
      action: 'Member Warned',
      target: user,
      moderator: interaction.user,
      reason: reason,
      color: config.embedColors.warning,
      fields: [
        { name: '🆔 Warning ID', value: `#${warnId}`, inline: true },
        { name: '📊 Total Warnings', value: `${totalWarns}`, inline: true }
      ]
    });

    return interaction.reply({
      embeds: [
        EmbedUtils.success(
          'Member Warned',
          `Successfully warned **${user.tag}** (\`#${warnId}\`).\n**Reason:** ${reason}\n**Total Warnings:** ${totalWarns}`
        )
      ]
    });
  }
};
