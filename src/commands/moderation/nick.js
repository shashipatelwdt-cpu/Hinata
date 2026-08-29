const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nick')
    .setDescription('🏷️ Change or reset a member nickname')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(opt => opt.setName('user').setDescription('The member whose nickname to change').setRequired(true))
    .addStringOption(opt => opt.setName('nickname').setDescription('The new nickname (leave empty to reset)').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const newNick = interaction.options.getString('nickname') || null;
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ embeds: [EmbedUtils.error('User Not Found', 'That user is not in this server.')], ephemeral: true });
    }

    if (!member.manageable) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'I cannot change this member nickname due to role hierarchy.')], 
        ephemeral: true 
      });
    }

    const oldNick = member.displayName;

    try {
      await member.setNickname(newNick, `Changed by ${interaction.user.tag}`);

      await ModLogger.log(interaction.guild, {
        action: 'Nickname Changed',
        target: user,
        moderator: interaction.user,
        reason: newNick ? `Changed to "${newNick}"` : 'Reset to username',
        color: config.embedColors.neutral,
        fields: [
          { name: '⬅️ Old Name', value: oldNick, inline: true },
          { name: '➡️ New Name', value: newNick || user.username, inline: true }
        ]
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Nickname Updated',
            newNick 
              ? `Changed nickname for **${user.tag}** to **${newNick}**.`
              : `Reset nickname for **${user.tag}**.`
          )
        ]
      });
    } catch (error) {
      console.error('[NICK ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Nickname Error', `Could not update nickname: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
