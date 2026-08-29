const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🔓 Unlock a previously locked channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to unlock (defaults to current)').setRequired(false))
    .addStringOption(opt => opt.setName('reason').setDescription('Reason for unlocking').setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const reason = interaction.options.getString('reason') || 'Channel unlocked by moderator';

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null,
        AddReactions: null
      }, { reason: `${reason} | Unlocked by ${interaction.user.tag}` });

      await channel.send({
        embeds: [
          EmbedUtils.success(
            'Channel Unlocked 🔓',
            `This channel has been unlocked. You may now chat freely.\n**Reason:** ${reason}`
          )
        ]
      }).catch(() => null);

      await ModLogger.log(interaction.guild, {
        action: 'Channel Unlocked',
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors.success,
        fields: [{ name: '💬 Channel', value: `<#${channel.id}>`, inline: true }]
      });

      return interaction.reply({
        embeds: [EmbedUtils.success('Channel Unlocked', `Successfully unlocked <#${channel.id}>.`)],
        ephemeral: true
      });
    } catch (error) {
      console.error('[UNLOCK ERROR]', error);
      return interaction.reply({
        embeds: [EmbedUtils.error('Unlock Failed', `Could not unlock channel: \`${error.message}\``)],
        ephemeral: true
      });
    }
  }
};
