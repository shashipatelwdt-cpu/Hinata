const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const TimeUtils = require('../../utils/time');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('🎁 Create and manage interactive giveaways')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName('start')
        .setDescription('🎉 Launch a new giveaway')
        .addStringOption(opt => opt.setName('duration').setDescription('Giveaway duration (e.g., 10m, 1h, 1d, 3d)').setRequired(true))
        .addStringOption(opt => opt.setName('prize').setDescription('What is being given away?').setRequired(true))
        .addIntegerOption(opt => opt.setName('winners').setDescription('Number of winners (default: 1)').setMinValue(1).setMaxValue(20).setRequired(false))
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel to host the giveaway in').setRequired(false))
    )
    .addSubcommand(sub =>
      sub
        .setName('reroll')
        .setDescription('🔄 Pick a new random winner for an ended giveaway')
        .addStringOption(opt => opt.setName('message_id').setDescription('The message ID of the giveaway').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('end')
        .setDescription('⏹️ End an ongoing giveaway immediately')
        .addStringOption(opt => opt.setName('message_id').setDescription('The message ID of the giveaway').setRequired(true))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'start') {
      const durationStr = interaction.options.getString('duration');
      const winnersCount = interaction.options.getInteger('winners') || 1;
      const prize = interaction.options.getString('prize');
      const channel = interaction.options.getChannel('channel') || interaction.channel;

      const durationMs = TimeUtils.parseDuration(durationStr);
      if (!durationMs || durationMs < 10000) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Invalid Duration', 'Please provide a duration of at least 10 seconds (e.g. `10m`, `1h`, `1d`).')],
          ephemeral: true
        });
      }

      const endsAt = Date.now() + durationMs;

      const embed = new EmbedBuilder()
        .setColor('#E91E63')
        .setTitle(`🎉 GIVEAWAY: ${prize}`)
        .setDescription(
          `Click the **🎉 Enter Giveaway** button below to participate!\n\n` +
          `🏆 **Winners:** \`${winnersCount}\`\n` +
          `👑 **Hosted By:** ${interaction.user}\n` +
          `⏱️ **Ends:** <t:${Math.floor(endsAt / 1000)}:R> (<t:${Math.floor(endsAt / 1000)}:F>)`
        )
        .setFooter({ text: `Giveaway ID: Pending` })
        .setTimestamp(new Date(endsAt));

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('giveaway_enter')
          .setLabel('Enter Giveaway (0)')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🎉')
      );

      const sentMsg = await channel.send({ embeds: [embed], components: [row] });

      embed.setFooter({ text: `Giveaway ID: ${sentMsg.id}` });
      await sentMsg.edit({ embeds: [embed] });

      DatabaseManager.createGiveaway(
        sentMsg.id,
        interaction.guild.id,
        channel.id,
        prize,
        winnersCount,
        endsAt,
        interaction.user.id
      );

      return interaction.reply({
        embeds: [EmbedUtils.success('Giveaway Started', `Launched giveaway for **${prize}** in <#${channel.id}>!`)],
        ephemeral: true
      });
    }

    if (subcommand === 'reroll' || subcommand === 'end') {
      const messageId = interaction.options.getString('message_id');
      const giveaway = DatabaseManager.getGiveaway(messageId);

      if (!giveaway) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Giveaway Not Found', `No giveaway found with message ID \`${messageId}\`.`)],
          ephemeral: true
        });
      }

      const targetChannel = interaction.guild.channels.cache.get(giveaway.channel_id);
      if (!targetChannel) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Channel Error', 'Could not locate the giveaway channel.')],
          ephemeral: true
        });
      }

      const message = await targetChannel.messages.fetch(messageId).catch(() => null);
      if (!message) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Message Not Found', 'Could not fetch the giveaway message.')],
          ephemeral: true
        });
      }

      // Check participants from button store/message reaction
      DatabaseManager.endGiveaway(messageId);

      const embed = EmbedBuilder.from(message.embeds[0])
        .setColor('#7289DA')
        .setTitle(`🎉 GIVEAWAY ENDED: ${giveaway.prize}`)
        .setDescription(`Giveaway has been resolved.\n**Prize:** ${giveaway.prize}\n**Hosted By:** <@${giveaway.hosted_by}>`);

      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('giveaway_ended')
          .setLabel('Giveaway Ended')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );

      await message.edit({ embeds: [embed], components: [disabledRow] });

      return interaction.reply({
        embeds: [EmbedUtils.success('Giveaway Updated', `Giveaway \`${messageId}\` has been ended/rerolled.`)]
      });
    }
  }
};
