const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const UpdateAnnouncer = require('../../utils/updateAnnouncer');
const EmbedUtils = require('../../utils/embeds');
const { DatabaseManager } = require('../../../database/db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botupdate')
    .setDescription('📢 Post a bot update announcement or set the updates channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt =>
      opt
        .setName('channel')
        .setDescription('Target text/announcement channel to broadcast update or set as default')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    )
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
    const targetChannel = interaction.options.getChannel('channel');
    const title = interaction.options.getString('title');
    const description = interaction.options.getString('description');

    await interaction.deferReply({ ephemeral: true });

    if (targetChannel) {
      DatabaseManager.setMeta('update_announcement_channel', targetChannel.id);
    }

    if (title || description) {
      const success = await UpdateAnnouncer.sendManualAnnouncement(
        interaction.client,
        title || 'Hinata System Update',
        description || 'New improvements and fixes have been deployed!',
        [],
        targetChannel?.id || null
      );

      if (success) {
        return interaction.editReply({
          embeds: [EmbedUtils.success('Announcement Sent', `📢 Successfully posted update announcement to <#${targetChannel?.id || UpdateAnnouncer.getTargetChannelId()}>!`)]
        });
      } else {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Channel Error', 'Could not find or send messages to the update channel. Make sure I have Send Messages and Embed Links permissions.')]
        });
      }
    } else {
      // Force trigger the automated commit update announcer
      await UpdateAnnouncer.checkAndSendUpdateAnnouncement(interaction.client);
      return interaction.editReply({
        embeds: [EmbedUtils.success('Update Check Complete', `✅ Checked and broadcasted latest deployment update to <#${UpdateAnnouncer.getTargetChannelId()}>.`)]
      });
    }
  }
};

