const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('🎭 Add or remove a role from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(opt => opt.setName('user').setDescription('The member').setRequired(true))
    .addRoleOption(opt => opt.setName('role').setDescription('The role to give or remove').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ embeds: [EmbedUtils.error('User Not Found', 'That user is not in this server.')], ephemeral: true });
    }

    if (role.position >= interaction.guild.members.me.roles.highest.position) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'I cannot manage this role because it is higher than or equal to my highest role.')], 
        ephemeral: true 
      });
    }

    if (role.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'You cannot manage a role that is higher than or equal to your highest role.')], 
        ephemeral: true 
      });
    }

    try {
      const hasRole = member.roles.cache.has(role.id);

      if (hasRole) {
        await member.roles.remove(role, `Removed by ${interaction.user.tag}`);

        await ModLogger.log(interaction.guild, {
          action: 'Role Removed',
          target: user,
          moderator: interaction.user,
          reason: `Removed role @${role.name}`,
          color: config.embedColors.warning,
          fields: [{ name: '🎭 Role', value: `${role}`, inline: true }]
        });

        return interaction.reply({
          embeds: [EmbedUtils.success('Role Removed', `Removed ${role} from **${user.tag}**.`)]
        });
      } else {
        await member.roles.add(role, `Added by ${interaction.user.tag}`);

        await ModLogger.log(interaction.guild, {
          action: 'Role Added',
          target: user,
          moderator: interaction.user,
          reason: `Added role @${role.name}`,
          color: config.embedColors.success,
          fields: [{ name: '🎭 Role', value: `${role}`, inline: true }]
        });

        return interaction.reply({
          embeds: [EmbedUtils.success('Role Added', `Added ${role} to **${user.tag}**.`)]
        });
      }
    } catch (error) {
      console.error('[ROLE ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Role Error', `Could not update role: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
