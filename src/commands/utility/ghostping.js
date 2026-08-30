const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const SnipeManager = require('../../utils/snipeManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ghostping')
    .setDescription('👻 View recently deleted or edited ghost-pings (who mentioned whom & message content)')
    .addIntegerOption(opt =>
      opt.setName('index')
        .setDescription('Which ghost-ping to view (1 = most recent, 2 = 2nd most recent, etc.)')
        .setMinValue(1)
        .setMaxValue(15)
        .setRequired(false)
    )
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel to check for ghost-pings (defaults to current channel)')
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
    const requestedIndex = (interaction.options.getInteger('index') || 1) - 1;

    const result = SnipeManager.getGhostPing(targetChannel.id, requestedIndex);

    if (!result) {
      return interaction.reply({
        embeds: [
          EmbedUtils.info(
            'No Ghost Pings Found',
            `👻 There are no recorded ghost-pings in <#${targetChannel.id}>.\n\n*Ghost-pings are captured automatically whenever someone pings a user, role, or @everyone and deletes or edits their message.*`
          )
        ],
        ephemeral: true
      });
    }

    const { ghostPing: record, index, total } = result;

    // Build Mention Targets String
    const userMentions = (record.ghostPing?.users || []).map(u => `<@${u.id}> (\`${u.tag || u.username}\`)`);
    const roleMentions = (record.ghostPing?.roles || []).map(r => `<@&${r.id}> (\`${r.name}\`)`);
    const everyoneMention = record.ghostPing?.hasEveryone ? ['`@everyone` / `@here`'] : [];

    const allMentionTargets = [...userMentions, ...roleMentions, ...everyoneMention].join('\n• ') || 'Unknown Mention';

    const isEdited = record.type === 'edited';
    const typeLabel = isEdited ? '✏️ Edited Message' : '🗑️ Deleted Message';

    const embed = new EmbedBuilder()
      .setColor(config.embedColors?.warning || '#FEE75C')
      .setTitle(`👻 Ghost Ping Detected • ${typeLabel}`)
      .setAuthor({
        name: `${record.author.tag} (${record.author.username})`,
        iconURL: record.author.avatar || interaction.guild.iconURL({ dynamic: true })
      })
      .addFields(
        {
          name: '👤 Ghost Pinger',
          value: `<@${record.author.id}> (\`${record.author.id}\`)`,
          inline: true
        },
        {
          name: '💬 Channel',
          value: `<#${targetChannel.id}>`,
          inline: true
        },
        {
          name: '⏰ Timing',
          value: `**Sent:** <t:${Math.floor(record.sentAt / 1000)}:R>\n**${isEdited ? 'Edited' : 'Deleted'}:** <t:${Math.floor(record.eventAt / 1000)}:R>`,
          inline: true
        },
        {
          name: '🎯 Mentioned Targets (Kisko Ping Kiya):',
          value: `• ${allMentionTargets}`,
          inline: false
        }
      )
      .setFooter({
        text: `Ghost Ping ${index} of ${total} • Server: ${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ dynamic: true })
      })
      .setTimestamp(record.eventAt);

    // Message Content
    if (isEdited) {
      embed.addFields(
        {
          name: '⬅️ Original Content (Kya Bheja Tha):',
          value: record.content ? `>>> ${record.content.slice(0, 1024)}` : '*[No Text Content]*',
          inline: false
        },
        {
          name: '➡️ Edited Content (Badalkar Kya Kiya):',
          value: record.newContent ? `>>> ${record.newContent.slice(0, 1024)}` : '*[No Text Content]*',
          inline: false
        }
      );
    } else {
      embed.addFields({
        name: '📝 Message Content (Kya Bheja Tha):',
        value: record.content ? `>>> ${record.content.slice(0, 1024)}` : '*[No Text Content / Only Attachments]*',
        inline: false
      });
    }

    // Attachments Handling
    if (record.attachments && record.attachments.length > 0) {
      const firstImage = record.attachments.find(att =>
        att.contentType?.startsWith('image/') ||
        /\.(png|jpe?g|gif|webp)$/i.test(att.url)
      );

      if (firstImage) {
        embed.setImage(firstImage.url);
      }

      const attachmentLinks = record.attachments.map((att, i) => `[Attachment ${i + 1}${att.name ? ` (${att.name})` : ''}](${att.url})`).join(' • ');
      embed.addFields({
        name: '📎 Attachments',
        value: attachmentLinks,
        inline: false
      });
    }

    return interaction.reply({ embeds: [embed] });
  }
};
