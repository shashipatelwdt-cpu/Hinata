const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder,
  ChannelType
} = require('discord.js');
const ChannelWiper = require('../../utils/channelWiper');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wipechannels')
    .setDescription('🗑️ Wipe all channels & categories cleanly from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(opt =>
      opt
        .setName('create_general')
        .setDescription('Create a clean #general text channel after wiping? (Default: True)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Guild Only', 'This command can only be used in a Discord server!')],
        ephemeral: true
      });
    }

    // Permission checks
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator) &&
        !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Permission Denied', 'You need **Administrator** or **Manage Channels** permissions to wipe channels.')],
        ephemeral: true
      });
    }

    const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
    if (!botMember || (!botMember.permissions.has(PermissionFlagsBits.ManageChannels) && !botMember.permissions.has(PermissionFlagsBits.Administrator))) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Missing Bot Permissions', 'I need **Administrator** or **Manage Channels** permission to delete channels.')],
        ephemeral: true
      });
    }

    const createGeneral = interaction.options.getBoolean('create_general') !== false;

    // Fetch existing channels
    const channels = await guild.channels.fetch().catch(() => guild.channels.cache);
    const categoryCount = channels.filter(c => c && c.type === ChannelType.GuildCategory).size;
    const channelCount = channels.size - categoryCount;

    const confirmBtn = new ButtonBuilder()
      .setCustomId('confirm_wipe_channels')
      .setLabel('Yes, Wipe All Channels!')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🗑️');

    const cancelBtn = new ButtonBuilder()
      .setCustomId('cancel_wipe_channels')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('✖️');

    const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

    const warnEmbed = new EmbedBuilder()
      .setColor(config.embedColors.danger || '#E74C3C')
      .setTitle('⚠️ Confirm Server Channel Wipe')
      .setDescription(
        `Are you sure you want to **wipe all channels and categories** in **${guild.name}**?\n\n` +
        `• 📁 **Categories to wipe:** \`${categoryCount}\`\n` +
        `• 💬 **Channels to wipe:** \`${channelCount}\`\n` +
        `• ➕ **Create Fresh #general:** \`${createGeneral ? 'YES' : 'NO'}\`\n\n` +
        `🚨 **WARNING:** This action is **irreversible**! All message history, voice channels, and categories will be permanently erased.`
      )
      .setFooter({ text: `${config.botName || 'Hinata'} • Irreversible Action • 45s Timeout` })
      .setTimestamp();

    const promptMsg = await interaction.reply({
      embeds: [warnEmbed],
      components: [row],
      fetchReply: true
    });

    const collector = promptMsg.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 45000,
      max: 1
    });

    collector.on('collect', async i => {
      if (i.customId === 'cancel_wipe_channels') {
        return i.update({
          embeds: [EmbedUtils.info('Cancelled', 'Channel wipe cancelled. No channels were deleted.')],
          components: []
        });
      }

      await i.deferUpdate();

      await ChannelWiper.wipeAllChannels({
        guild,
        user: interaction.user,
        createGeneral,
        callerChannelId: interaction.channelId,
        interaction: i
      });
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time' && collected.size === 0) {
        await interaction.editReply({
          embeds: [EmbedUtils.warning('Timed Out', 'Channel wipe confirmation timed out.')],
          components: []
        }).catch(() => null);
      }
    });
  }
};
