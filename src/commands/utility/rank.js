const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const { generateRankCard } = require('../../utils/rankCardGenerator');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('🎖️ Check your or another member’s level, XP progress, and server rank (AmariBot Card)')
    .addUserOption(opt =>
      opt
        .setName('user')
        .setDescription('Select a member to view their rank (defaults to you)')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt
        .setName('color')
        .setDescription('Customize your Rank Card accent color (Hex e.g. #f4c444, #5865F2, or reset)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const guild = interaction.guild;
    const colorOpt = interaction.options.getString('color');

    // Handle Rank Card Color Customization
    if (colorOpt) {
      if (colorOpt.toLowerCase() === 'reset') {
        DatabaseManager.setUserRankTheme(guild.id, interaction.user.id, { color: null });
        return interaction.reply({
          embeds: [EmbedUtils.success('Theme Reset', 'Your Rank Card accent color has been reset to default (#f4c444)!')],
          ephemeral: true
        });
      }

      const hexRegex = /^#?([0-9A-Fa-f]{6})$/;
      const match = colorOpt.match(hexRegex);
      if (!match) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Invalid Hex Color', 'Please provide a valid 6-digit hex color code! Example: `/rank color:#f4c444` or `/rank color:#5865F2`')],
          ephemeral: true
        });
      }

      const cleanHex = `#${match[1].toUpperCase()}`;
      DatabaseManager.setUserRankTheme(guild.id, interaction.user.id, { color: cleanHex });

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🎨 Rank Card Color Updated!')
            .setDescription(`Your Rank Card accent color is now set to **\`${cleanHex}\`**!`)
            .setColor(cleanHex)
        ],
        ephemeral: true
      });
    }

    // View Rank Card
    const targetUser = interaction.options.getUser('user') || interaction.user;
    if (targetUser.bot) {
      return interaction.reply({
        content: '🤖 Bots do not earn XP or levels!',
        ephemeral: true
      });
    }

    // Defer immediately to prevent Discord 3-second interaction timeouts
    await interaction.deferReply();

    try {
      const userData = DatabaseManager.getUserLevel(guild.id, targetUser.id);
      const userRank = DatabaseManager.getUserRank(guild.id, targetUser.id);
      const weeklyRank = DatabaseManager.getUserWeeklyRank(guild.id, targetUser.id);
      const userTheme = DatabaseManager.getUserRankTheme(guild.id, targetUser.id);
      const cardColor = userTheme.color || '#f4c444';

      const avatarUrl = targetUser.displayAvatarURL({ extension: 'png', size: 256, forceStatic: true });
      const cardBuffer = await generateRankCard({
        username: targetUser.username,
        avatarUrl,
        serverRank: userRank,
        weeklyRank: weeklyRank,
        weeklyXp: userData.weeklyXp || 0,
        level: userData.level || 0,
        currentXp: userData.xp || 0,
        neededXp: userData.neededXp || 100,
        accentColor: cardColor
      });

      const attachment = new AttachmentBuilder(cardBuffer, { name: 'rank.png' });
      return await interaction.editReply({ files: [attachment] });
    } catch (err) {
      console.error('[RANK COMMAND ERROR]:', err);
      return await interaction.editReply({
        content: `❌ An error occurred while generating the rank card: ${err.message}`
      });
    }
  }
};
