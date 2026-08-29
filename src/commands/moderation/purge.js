const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('🧹 Bulk delete messages with smart filters')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(opt =>
      opt.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('filter')
        .setDescription('Filter messages to delete')
        .setRequired(false)
        .addChoices(
          { name: '🤖 Bot Messages Only', value: 'bots' },
          { name: '👤 Human Users Only', value: 'humans' },
          { name: '🔗 Messages With Links', value: 'links' },
          { name: '🖼️ Messages With Attachments/Images', value: 'attachments' }
        )
    )
    .addUserOption(opt =>
      opt.setName('target_user')
        .setDescription('Delete messages only from this specific user')
        .setRequired(false)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const filter = interaction.options.getString('filter');
    const targetUser = interaction.options.getUser('target_user');

    await interaction.deferReply({ ephemeral: true });

    try {
      const messages = await interaction.channel.messages.fetch({ limit: 100 });
      let filtered = messages;

      if (targetUser) {
        filtered = filtered.filter(m => m.author.id === targetUser.id);
      }

      if (filter === 'bots') {
        filtered = filtered.filter(m => m.author.bot);
      } else if (filter === 'humans') {
        filtered = filtered.filter(m => !m.author.bot);
      } else if (filter === 'links') {
        filtered = filtered.filter(m => /(https?:\/\/[^\s]+)/gi.test(m.content));
      } else if (filter === 'attachments') {
        filtered = filtered.filter(m => m.attachments.size > 0 || m.embeds.length > 0);
      }

      // Slice to requested amount and filter messages older than 14 days
      const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      const toDelete = filtered.filter(m => m.createdTimestamp > fourteenDaysAgo).first(amount);

      if (toDelete.length === 0) {
        return interaction.editReply({
          embeds: [EmbedUtils.warning('No Messages Deleted', 'No matching messages found within the last 14 days.')]
        });
      }

      const deleted = await interaction.channel.bulkDelete(toDelete, true);

      await ModLogger.log(interaction.guild, {
        action: 'Messages Purged',
        moderator: interaction.user,
        reason: `Bulk deleted ${deleted.size} messages in #${interaction.channel.name}`,
        color: config.embedColors.neutral,
        fields: [
          { name: '💬 Channel', value: `<#${interaction.channel.id}>`, inline: true },
          { name: '📊 Amount', value: `${deleted.size}`, inline: true },
          { name: '🔍 Filter', value: filter || targetUser ? `${filter || 'None'} / ${targetUser?.tag || 'Any'}` : 'None', inline: true }
        ]
      });

      return interaction.editReply({
        embeds: [
          EmbedUtils.success(
            'Purge Completed',
            `🧹 Successfully deleted **${deleted.size}** message(s) in <#${interaction.channel.id}>.`
          )
        ]
      });
    } catch (error) {
      console.error('[PURGE ERROR]', error);
      return interaction.editReply({
        embeds: [EmbedUtils.error('Purge Failed', `Could not purge messages: \`${error.message}\``)]
      });
    }
  }
};
