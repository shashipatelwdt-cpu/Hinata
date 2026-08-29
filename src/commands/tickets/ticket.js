const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ChannelType
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('🎫 Support Ticket system management')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(sub =>
      sub
        .setName('panel')
        .setDescription('📌 Send the interactive ticket creation panel')
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send the ticket panel in').setRequired(false))
        .addChannelOption(opt => 
          opt.setName('category')
            .setDescription('Category where new ticket channels will be created')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(false)
        )
        .addRoleOption(opt => opt.setName('support_role').setDescription('Role pinged and granted access to tickets').setRequired(false))
    )
    .addSubcommand(sub =>
      sub
        .setName('close')
        .setDescription('🔒 Close and lock the current support ticket')
        .addStringOption(opt => opt.setName('reason').setDescription('Reason for closing').setRequired(false))
    )
    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('➕ Add a user to the current ticket')
        .addUserOption(opt => opt.setName('user').setDescription('User to add').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('➖ Remove a user from the current ticket')
        .addUserOption(opt => opt.setName('user').setDescription('User to remove').setRequired(true))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const guildSettings = DatabaseManager.getGuild(guild.id);
    const ticketConfig = { ...config.defaultSettings.tickets, ...(guildSettings.ticket || {}) };

    if (subcommand === 'panel') {
      const channel = interaction.options.getChannel('channel') || interaction.channel;
      const category = interaction.options.getChannel('category');
      const supportRole = interaction.options.getRole('support_role');

      const updated = {
        categoryId: category ? category.id : ticketConfig.categoryId,
        supportRoleId: supportRole ? supportRole.id : ticketConfig.supportRoleId
      };

      DatabaseManager.setTicketConfig(guild.id, updated);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle('🎫 Server Support & Help Desk')
        .setDescription(
          'Need assistance or want to contact server staff?\nClick one of the buttons below to open a private ticket channel.\n\n' +
          '📩 **General Support** - Questions, server help, or inquiries\n' +
          '🚨 **Report Player / Issue** - Report rule-breakers or bugs\n' +
          '💼 **Staff / Partnerships** - Business, staff applications, sponsorships'
        )
        .setFooter({ text: 'Please only open a ticket if you need genuine assistance.' })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_create_general')
          .setLabel('General Support')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('📩'),
        new ButtonBuilder()
          .setCustomId('ticket_create_report')
          .setLabel('Report Player / Issue')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🚨'),
        new ButtonBuilder()
          .setCustomId('ticket_create_business')
          .setLabel('Staff / Partnership')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('💼')
      );

      await channel.send({ embeds: [embed], components: [row] });

      return interaction.reply({
        embeds: [EmbedUtils.success('Ticket Panel Deployed', `Sent the interactive ticket panel to <#${channel.id}>.`)],
        ephemeral: true
      });
    }

    if (subcommand === 'close') {
      const ticket = DatabaseManager.getTicketByChannel(interaction.channelId);
      if (!ticket) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Not a Ticket', 'This channel is not an active ticket channel.')],
          ephemeral: true
        });
      }

      const reason = interaction.options.getString('reason') || 'Resolved by staff';

      await interaction.reply({
        embeds: [
          EmbedUtils.warning(
            'Ticket Closing 🔒',
            `This ticket is being closed by ${interaction.user}.\n**Reason:** ${reason}\n\n*Channel will be deleted in 5 seconds...*`
          )
        ]
      });

      DatabaseManager.closeTicket(interaction.channelId);

      setTimeout(async () => {
        try {
          await interaction.channel.delete(`Ticket closed by ${interaction.user.tag}`);
        } catch (e) {
          console.error('[TICKET CLOSE ERROR]', e);
        }
      }, 5000);
      return;
    }

    if (subcommand === 'add') {
      const ticket = DatabaseManager.getTicketByChannel(interaction.channelId);
      if (!ticket) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Not a Ticket', 'This command can only be used inside a ticket channel.')],
          ephemeral: true
        });
      }

      const targetUser = interaction.options.getUser('user');
      await interaction.channel.permissionOverwrites.edit(targetUser.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true
      });

      return interaction.reply({
        embeds: [EmbedUtils.success('User Added', `Added ${targetUser} to this ticket.`)]
      });
    }

    if (subcommand === 'remove') {
      const ticket = DatabaseManager.getTicketByChannel(interaction.channelId);
      if (!ticket) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Not a Ticket', 'This command can only be used inside a ticket channel.')],
          ephemeral: true
        });
      }

      const targetUser = interaction.options.getUser('user');
      await interaction.channel.permissionOverwrites.delete(targetUser.id);

      return interaction.reply({
        embeds: [EmbedUtils.success('User Removed', `Removed ${targetUser} from this ticket.`)]
      });
    }
  }
};
