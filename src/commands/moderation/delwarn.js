const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delwarn')
    .setDescription('🗑️ Delete a specific warning by its ID')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addIntegerOption(opt => opt.setName('id').setDescription('The ID of the warning to delete').setRequired(true)),

  async execute(interaction) {
    const warnId = interaction.options.getInteger('id');
    const success = DatabaseManager.deleteWarn(interaction.guild.id, warnId);

    if (!success) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Warning Not Found', `No warning found with ID \`#${warnId}\` in this server.`)],
        ephemeral: true
      });
    }

    await ModLogger.log(interaction.guild, {
      action: 'Warning Deleted',
      moderator: interaction.user,
      reason: `Deleted warning #${warnId}`,
      color: config.embedColors.info,
      fields: [{ name: '🆔 Warning ID', value: `#${warnId}`, inline: true }]
    });

    return interaction.reply({
      embeds: [EmbedUtils.success('Warning Deleted', `Successfully deleted warning \`#${warnId}\`.`)]
    });
  }
};
