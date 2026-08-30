const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const UpdateAnnouncer = require('../../utils/updateAnnouncer');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botupdate')
    .setDescription('📢 Post a bot update announcement to the official updates channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt
        .setName('title')
        .setDescription('Update title (e.g. Version 2.0 Released)')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt
        .setName('description')
        .setDescription('Description of the update / changelog notes')
        .setRequired(false)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    await interaction.deferReply({ ephemeral: true });

    if (title || description) {
      const success = await UpdateAnnouncer.sendManualAnnouncement(
        interaction.client,
        title || 'Hinata System Update',
        description || 'New improvements and fixes have been deployed!',
        []
      );

      if (success) {
        return interaction.editReply({
          embeds: [EmbedUtils.success('Announcement Sent', '📢 Successfully posted your update announcement to the updates channel!')]
        });
      } else {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Channel Error', 'Could not find or send messages to the configured update channel.')]
        });
      }
    } else {
      // Force trigger the automated commit update announcer
      await UpdateAnnouncer.checkAndSendUpdateAnnouncement(interaction.client);
      return interaction.editReply({
        embeds: [EmbedUtils.success('Update Check Complete', '✅ Checked and broadcasted latest deployment update announcement.')]
      });
    }
  }
};
