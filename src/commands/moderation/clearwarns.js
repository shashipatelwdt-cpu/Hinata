const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarns')
    .setDescription('🧹 Clear all warnings for a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption(opt => opt.setName('user').setDescription('The member whose warnings to clear').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const removedCount = DatabaseManager.clearWarns(interaction.guild.id, user.id);

    if (removedCount === 0) {
      return interaction.reply({
        embeds: [EmbedUtils.info('No Warnings', `**${user.tag}** has no active warnings to clear.`)],
        ephemeral: true
      });
    }

    await ModLogger.log(interaction.guild, {
      action: 'Warnings Cleared',
      target: user,
      moderator: interaction.user,
      reason: `Cleared all warnings (${removedCount} removed)`,
      color: config.embedColors.success
    });

    return interaction.reply({
      embeds: [
        EmbedUtils.success(
          'Warnings Cleared',
          `Successfully cleared all **${removedCount}** warning(s) for **${user.tag}**.`
        )
      ]
    });
  }
};
