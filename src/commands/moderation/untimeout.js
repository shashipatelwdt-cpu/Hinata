const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('🔊 Remove timeout / unmute a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The member to remove timeout from').setRequired(true))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for removing timeout').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
      return interaction.reply({ embeds: [EmbedUtils.error('User Not Found', 'That user is not in this server.')], ephemeral: true });
    }

    if (!member.communicationDisabledUntilTimestamp || member.communicationDisabledUntilTimestamp < Date.now()) {
      return interaction.reply({ embeds: [EmbedUtils.warning('Not Timed Out', 'This member is not currently timed out.')], ephemeral: true });
    }

    if (!member.moderatable) {
      return interaction.reply({ 
        embeds: [EmbedUtils.error('Permission Denied', 'I cannot manage this member due to role hierarchy.')], 
        ephemeral: true 
      });
    }

    try {
      await member.timeout(null, `${reason} | Removed by ${interaction.user.tag}`);

      await ModLogger.log(interaction.guild, {
        action: 'Timeout Removed',
        target: user,
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors.success
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Timeout Removed',
            `Successfully removed timeout for **${user.tag}**.\n**Reason:** ${reason}`
          )
        ]
      });
    } catch (error) {
      console.error('[UNTIMEOUT ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Untimeout Failed', `Could not remove timeout: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
