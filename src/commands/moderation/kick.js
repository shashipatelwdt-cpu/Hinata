const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Kick a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The member to kick').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the kick').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ embeds: [EmbedUtils.error('User Not Found', 'That user is not in this server.')], ephemeral: true });
    }

    if (user.id === interaction.user.id) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot kick yourself.')], ephemeral: true });
    }

    if (user.id === interaction.client.user.id) {
      return interaction.reply({ embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot kick the bot.')], ephemeral: true });
    }

    if (!member.kickable) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'I cannot kick this member due to role hierarchy.')], 
        ephemeral: true 
      });
    }

    if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'You cannot kick a member who has a role equal to or higher than yours.')], 
        ephemeral: true 
      });
    }

    try {
      await user.send({
        embeds: [
          EmbedUtils.warning(
            `You were kicked from ${interaction.guild.name}`,
            `**Reason:** ${reason}\n**Moderator:** ${interaction.user.tag}`
          )
        ]
      }).catch(() => null);
    } catch {}

    try {
      await member.kick(`${reason} | Kicked by ${interaction.user.tag}`);

      await ModLogger.log(interaction.guild, {
        action: 'Member Kicked',
        target: user,
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors.warning
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Member Kicked',
            `Successfully kicked **${user.tag}** (\`${user.id}\`).\n**Reason:** ${reason}`
          )
        ]
      });
    } catch (error) {
      console.error('[KICK ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Kick Failed', `Could not kick member: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
