const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const SnipeManager = require('../../utils/snipeManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editsnipe')
    .setDescription('✏️ View the original version of recently edited messages')
    .addIntegerOption(opt =>
      opt.setName('index')
        .setDescription('Which edited message to view (1 = most recent, 2 = 2nd most recent, etc.)')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)
    )
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel to check edits in (defaults to current channel)')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
    const requestedIndex = (interaction.options.getInteger('index') || 1) - 1;

    const result = SnipeManager.getEditSnipe(targetChannel.id, requestedIndex);

    if (!result) {
      return interaction.reply({
        embeds: [
          EmbedUtils.warning(
            'No Edited Messages',
            `There are no recently edited messages recorded in <#${targetChannel.id}>.`
          )
        ],
        ephemeral: true
      });
    }

    const { editSnipe, index, total } = result;

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.warning || '#FEE75C')
      .setAuthor({
        name: `${editSnipe.author.tag} (${editSnipe.author.username})`,
        iconURL: editSnipe.author.avatar
      })
      .setDescription(
        `### ⬅️ Original Message (Before):\n>>> ${editSnipe.oldContent}\n\n` +
        `### ➡️ Edited Message (After):\n>>> ${editSnipe.newContent}`
      )
      .addFields(
        { name: '💬 Channel', value: `<#${targetChannel.id}>`, inline: true },
        { name: '📅 Sent', value: `<t:${Math.floor(editSnipe.createdAt / 1000)}:R>`, inline: true },
        { name: '✏️ Edited', value: `<t:${Math.floor(editSnipe.editedAt / 1000)}:R>`, inline: true }
      )
      .setFooter({
        text: `Edit Snipe ${index} of ${total} • Message ID: ${editSnipe.id}`,
        iconURL: interaction.guild.iconURL({ dynamic: true })
      })
      .setTimestamp(editSnipe.editedAt);

    if (editSnipe.url) {
      embed.addFields({ name: '🔗 Message Link', value: `[Jump to message](${editSnipe.url})`, inline: false });
    }

    return interaction.reply({ embeds: [embed] });
  }
};
