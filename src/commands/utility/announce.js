const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ChannelType, 
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('📢 Send styled announcements with embeds, banners, and role/@everyone pings')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub =>
      sub.setName('send')
        .setDescription('📢 Instantly create and send a formatted announcement')
        .addChannelOption(opt =>
          opt.setName('channel')
            .setDescription('Target text or announcement channel to post in')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('message')
            .setDescription('The announcement content/message (supports Markdown bold, lists, links, emojis)')
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('title')
            .setDescription('Announcement title header (e.g. 📢 Important Server Update)')
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt.setName('ping')
            .setDescription('Who to ping for this announcement')
            .addChoices(
              { name: '❌ No Ping (Silent)', value: 'none' },
              { name: '🔔 @everyone', value: 'everyone' },
              { name: '🟡 @here', value: 'here' },
              { name: '👥 Specific Role (Select role option)', value: 'role' }
            )
            .setRequired(false)
        )
        .addRoleOption(opt =>
          opt.setName('role')
            .setDescription('Role to ping if ping option is set to Specific Role')
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt.setName('color')
            .setDescription('Hex color for embed (e.g. #5865F2, #FF0000, #57F287, #FEE75C, #EB459E)')
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt.setName('image')
            .setDescription('Banner / Image URL to display at the bottom of the announcement')
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt.setName('footer')
            .setDescription('Custom footer note (defaults to server name & sender)')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub.setName('modal')
        .setDescription('📝 Open multi-line interactive popup editor for lengthy announcements')
        .addChannelOption(opt =>
          opt.setName('channel')
            .setDescription('Target channel to post the announcement to')
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt.setName('ping')
            .setDescription('Who to ping for this announcement')
            .addChoices(
              { name: '❌ No Ping (Silent)', value: 'none' },
              { name: '🔔 @everyone', value: 'everyone' },
              { name: '🟡 @here', value: 'here' },
              { name: '👥 Specific Role (Select role option)', value: 'role' }
            )
            .setRequired(false)
        )
        .addRoleOption(opt =>
          opt.setName('role')
            .setDescription('Role to ping if ping option is set to Specific Role')
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const targetChannel = interaction.options.getChannel('channel');

    // 1. Check Bot Permissions in Target Channel
    const botMember = interaction.guild.members.me || await interaction.guild.members.fetchMe().catch(() => null);
    const channelPerms = targetChannel.permissionsFor(botMember);

    if (!channelPerms?.has(PermissionFlagsBits.ViewChannel) || !channelPerms?.has(PermissionFlagsBits.SendMessages) || !channelPerms?.has(PermissionFlagsBits.EmbedLinks)) {
      return interaction.reply({
        embeds: [
          EmbedUtils.error(
            'Missing Permissions',
            `I don't have permission to send messages and embeds in <#${targetChannel.id}>! Please grant me **View Channel**, **Send Messages**, and **Embed Links** permissions.`
          )
        ],
        ephemeral: true
      });
    }

    const pingType = interaction.options.getString('ping') || 'none';
    const targetRole = interaction.options.getRole('role');

    // ==========================================
    // MODAL BUILDER SUBCOMMAND
    // ==========================================
    if (sub === 'modal') {
      const pingId = pingType === 'role' && targetRole ? `role_${targetRole.id}` : pingType;
      const modal = new ModalBuilder()
        .setCustomId(`announce_modal_${targetChannel.id}_${pingId}`)
        .setTitle(`📢 Announce in #${targetChannel.name}`.slice(0, 45));

      const titleInput = new TextInputBuilder()
        .setCustomId('announce_title')
        .setLabel('Announcement Title')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('e.g. 📢 Important Server Update & Event Announcement')
        .setMaxLength(256)
        .setRequired(false);

      const messageInput = new TextInputBuilder()
        .setCustomId('announce_content')
        .setLabel('Announcement Message (Markdown Supported)')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Enter your full announcement message...\nUse **bold**, *italics*, bullet points (- item), or [links](url)...')
        .setMaxLength(4000)
        .setRequired(true);

      const colorInput = new TextInputBuilder()
        .setCustomId('announce_color')
        .setLabel('Hex Color (Optional, default: #5865F2)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('#5865F2')
        .setMaxLength(7)
        .setRequired(false);

      const imageInput = new TextInputBuilder()
        .setCustomId('announce_image')
        .setLabel('Banner / Image URL (Optional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('https://example.com/banner.png')
        .setRequired(false);

      const footerInput = new TextInputBuilder()
        .setCustomId('announce_footer')
        .setLabel('Footer Note (Optional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('e.g. Staff Team • discord.gg/example')
        .setMaxLength(200)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(messageInput),
        new ActionRowBuilder().addComponents(colorInput),
        new ActionRowBuilder().addComponents(imageInput),
        new ActionRowBuilder().addComponents(footerInput)
      );

      return interaction.showModal(modal);
    }

    // ==========================================
    // DIRECT SEND SUBCOMMAND
    // ==========================================
    await interaction.deferReply({ ephemeral: true });

    const rawMessage = interaction.options.getString('message');
    const rawTitle = interaction.options.getString('title') || '📢 Server Announcement';
    const rawColor = interaction.options.getString('color') || config.embedColors?.primary || '#5865F2';
    const imageUrl = interaction.options.getString('image');
    const footerText = interaction.options.getString('footer') || `${interaction.guild.name} • Announcement by ${interaction.user.tag}`;

    // Format Embed
    const embedColor = rawColor.startsWith('#') ? rawColor : `#${rawColor}`;
    const embed = new EmbedBuilder()
      .setTitle(rawTitle)
      .setDescription(rawMessage)
      .setColor(embedColor)
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true })
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
      .setFooter({
        text: footerText,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    if (imageUrl) {
      if (/^https?:\/\/.+/i.test(imageUrl)) {
        embed.setImage(imageUrl);
      }
    }

    // Determine Mention Ping Payload
    let pingContent = null;
    let pingLabel = 'No Ping';

    if (pingType === 'everyone') {
      pingContent = '@everyone';
      pingLabel = '🔔 @everyone';
    } else if (pingType === 'here') {
      pingContent = '@here';
      pingLabel = '🟡 @here';
    } else if (pingType === 'role' && targetRole) {
      pingContent = `<@&${targetRole.id}>`;
      pingLabel = `👥 <@&${targetRole.id}>`;
    }

    try {
      const sendPayload = {
        embeds: [embed]
      };
      if (pingContent) {
        sendPayload.content = pingContent;
      }

      const sentMessage = await targetChannel.send(sendPayload);

      // Audit Log in ModLogger
      await ModLogger.log(interaction.guild, {
        action: 'Announcement Sent',
        moderator: interaction.user,
        reason: `Posted announcement in #${targetChannel.name}`,
        color: config.embedColors?.primary || '#5865F2',
        fields: [
          { name: '💬 Channel', value: `<#${targetChannel.id}>`, inline: true },
          { name: '🔔 Mention Ping', value: pingLabel, inline: true },
          { name: '📝 Title', value: rawTitle, inline: true },
          { name: '🔗 Message Link', value: `[Jump to Announcement](${sentMessage.url})`, inline: false }
        ]
      });

      const successEmbed = new EmbedBuilder()
        .setTitle('✅ Announcement Successfully Posted!')
        .setDescription(
          `Your announcement has been broadcasted to <#${targetChannel.id}>.\n\n` +
          `**🔔 Mention Ping:** ${pingLabel}\n` +
          `**📝 Title:** ${rawTitle}\n` +
          `**🔗 Direct Link:** [Click here to view announcement](${sentMessage.url})`
        )
        .setColor(config.embedColors?.success || '#57F287')
        .setFooter({ text: 'Hinata Announcement System' })
        .setTimestamp();

      return interaction.editReply({ embeds: [successEmbed] });
    } catch (err) {
      console.error('[ANNOUNCE ERROR]', err);
      return interaction.editReply({
        embeds: [
          EmbedUtils.error(
            'Announcement Failed',
            `Could not post announcement to <#${targetChannel.id}>:\n\`${err.message}\``
          )
        ]
      });
    }
  }
};
