const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const SnipeManager = require('../../utils/snipeManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snipe')
    .setDescription('🎯 Retrieve recently deleted messages in the channel')
    .addIntegerOption(opt =>
      opt.setName('index')
        .setDescription('Which deleted message to view (1 = most recent, 2 = 2nd most recent, etc.)')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)
    )
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel to snipe from (defaults to current channel)')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
    const requestedIndex = (interaction.options.getInteger('index') || 1) - 1;

    const result = SnipeManager.getSnipe(targetChannel.id, requestedIndex);

    if (!result) {
      return interaction.reply({
        embeds: [
          EmbedUtils.warning(
            'No Snipes Available',
            `There are no recently deleted messages recorded in <#${targetChannel.id}>.`
          )
        ],
        ephemeral: true
      });
    }

    const { snipe, index, total } = result;

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary || '#5865F2')
      .setAuthor({
        name: `${snipe.author.tag} (${snipe.author.username})`,
        iconURL: snipe.author.avatar
      })
      .setDescription(snipe.content ? `>>> ${snipe.content}` : '*[No text content / Only attachments]*')
      .addFields(
        { name: '💬 Channel', value: `<#${targetChannel.id}>`, inline: true },
        { name: '📅 Sent', value: `<t:${Math.floor(snipe.createdAt / 1000)}:R>`, inline: true },
        { name: '🗑️ Deleted', value: `<t:${Math.floor(snipe.deletedAt / 1000)}:R>`, inline: true }
      )
      .setFooter({
        text: `Snipe ${index} of ${total} • Message ID: ${snipe.id}`,
        iconURL: interaction.guild.iconURL({ dynamic: true })
      })
      .setTimestamp(snipe.deletedAt);

    // If this snipe is a ghost-ping, highlight it prominently
    if (snipe.ghostPing) {
      const userMentions = (snipe.ghostPing.users || []).map(u => `<@${u.id}>`);
      const roleMentions = (snipe.ghostPing.roles || []).map(r => `<@&${r.id}>`);
      const everyoneMention = snipe.ghostPing.hasEveryone ? ['@everyone / @here'] : [];
      const allTargets = [...userMentions, ...roleMentions, ...everyoneMention].join(', ');

      embed.setColor(config.embedColors.warning || '#FEE75C');
      embed.addFields({
        name: '👻 Ghost Ping Alert (Mentioned Targets)',
        value: allTargets || 'Unknown Mention',
        inline: false
      });
    }

    // If attachments exist, show them
    if (snipe.attachments && snipe.attachments.length > 0) {
      const firstImage = snipe.attachments.find(att => 
        att.contentType?.startsWith('image/') || 
        /\.(png|jpe?g|gif|webp)$/i.test(att.url)
      );

      if (firstImage) {
        embed.setImage(firstImage.url);
      }

      const attachmentList = snipe.attachments.map((att, i) => `[Attachment ${i + 1}](${att.url})`).join(' • ');
      embed.addFields({ name: '📎 Attachments', value: attachmentList, inline: false });
    }

    return interaction.reply({ embeds: [embed] });
  }
};
