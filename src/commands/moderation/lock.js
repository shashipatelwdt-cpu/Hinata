const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('🔒 Lock a channel to prevent @everyone from sending messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to lock (defaults to current)').setRequired(false))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for the lockdown').setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'Channel locked by moderator';

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
        AddReactions: false
      }, { reason: `${reason} | Locked by ${interaction.user.tag}` });

      await channel.send({
        embeds: [
          EmbedUtils.warning(
            'Channel Locked 🔒',
            `This channel has been locked by a moderator.\n**Reason:** ${reason}`
          )
        ]
      }).catch(() => null);

      await ModLogger.log(interaction.guild, {
        action: 'Channel Locked',
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors.warning,
        fields: [{ name: '💬 Channel', value: `<#${channel.id}>`, inline: true }]
      });

      return interaction.reply({
        embeds: [EmbedUtils.success('Channel Locked', `Successfully locked <#${channel.id}>.`)],
        ephemeral: true
      });
    } catch (error) {
      console.error('[LOCK ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Lock Failed', `Could not lock channel: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
