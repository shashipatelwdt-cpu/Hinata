const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('💥 Clone and re-create current channel to wipe all messages (with confirmation)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const channel = interaction.channel;

    const confirmBtn = new ButtonBuilder()
      .setCustomId('confirm_nuke')
      .setLabel('Yes, Nuke Channel')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('💣');

    const cancelBtn = new ButtonBuilder()
      .setCustomId('cancel_nuke')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('✖️');

    const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

    const prompt = await interaction.reply({
      embeds: [
        EmbedUtils.warning(
          'Confirm Channel Nuke',
          `⚠️ Are you sure you want to **NUKE** <#${channel.id}>?\n\nThis will clone the channel settings and delete the old channel, **wiping all message history permanently**.`
        )
      ],
      components: [row],
      fetchReply: true
    });

    const collector = prompt.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 25000,
      max: 1
    });

    collector.on('collect', async i => {
      if (i.customId === 'cancel_nuke') {
        return i.update({
          embeds: [EmbedUtils.info('Cancelled', 'Nuke operation cancelled.')],
          components: []
        });
      }

      await i.update({
        embeds: [EmbedUtils.info('Nuking...', '💥 Recreating channel and deleting messages...')],
        components: []
      });

      try {
        const position = channel.position;
        const clonedChannel = await channel.clone({
          reason: `Nuked by ${interaction.user.tag}`
        });

        await clonedChannel.setPosition(position);
        await channel.delete(`Nuked by ${interaction.user.tag}`);

        await clonedChannel.send({
          embeds: [
            EmbedUtils.success(
              'Channel Nuked! 💣',
              `This channel was nuked and cleanly re-created by ${interaction.user}.`
            ).setImage('https://media.giphy.com/media/oe33xf3B50fsc/giphy.gif')
          ]
        });

        await ModLogger.log(interaction.guild, {
          action: 'Channel Nuked',
          moderator: interaction.user,
          reason: 'Channel cloned and purged via /nuke',
          color: config.embedColors.danger,
          fields: [{ name: '💬 Channel', value: `#${clonedChannel.name}`, inline: true }]
        });
      } catch (err) {
        console.error('[NUKE ERROR]', err);
      }
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time' && collected.size === 0) {
        await interaction.editReply({
          embeds: [EmbedUtils.warning('Timed Out', 'Nuke operation timed out.')],
          components: []
        }).catch(() => null);
      }
    });
  }
};
