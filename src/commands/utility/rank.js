const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

function generateArcaneBar(current, total, barLength = 16) {
  if (total <= 0) return '░'.repeat(barLength) + ' 0%';
  const ratio = Math.min(1, Math.max(0, current / total));
  const filled = Math.round(barLength * ratio);
  const empty = Math.max(0, barLength - filled);
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const pct = Math.round(ratio * 100);
  return `\`[${bar}]\` **${pct}%**`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('🎖️ Check your or another member’s level, XP progress, and server rank (Arcane Style)')
    .addUserOption(opt =>
      opt
        .setName('user')
        .setDescription('Select a member to view their rank (defaults to you)')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt
        .setName('color')
        .setDescription('Customize your Rank Card accent color (Hex e.g. #5865F2, #00FFCC, or reset)')
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
          embeds: [EmbedUtils.success('Theme Reset', 'Your Rank Card accent color has been reset to Arcane default!')],
          ephemeral: true
        });
      }

      const hexRegex = /^#?([0-9A-Fa-f]{6})$/;
      const match = colorOpt.match(hexRegex);
      if (!match) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Invalid Hex Color', 'Please provide a valid 6-digit hex color code! Example: `/rank color:#5865F2` or `/rank color:#00D2FF`')],
          ephemeral: true
        });
      }

      const cleanHex = `#${match[1].toUpperCase()}`;
      DatabaseManager.setUserRankTheme(guild.id, interaction.user.id, { color: cleanHex });

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('🎨 Rank Card Color Updated!')
            .setDescription(`Your Arcane Rank Card accent color is now set to **\`${cleanHex}\`**!`)
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

    const userData = DatabaseManager.getUserLevel(guild.id, targetUser.id);
    const userRank = DatabaseManager.getUserRank(guild.id, targetUser.id);
    const guildLevelData = DatabaseManager.getLevelGuildData(guild.id);
    const userTheme = DatabaseManager.getUserRankTheme(guild.id, targetUser.id);

    const totalMembersRanked = Object.keys(guildLevelData.users || {}).length || 1;
    const progressBar = generateArcaneBar(userData.xp, userData.neededXp);
    const remainingXp = Math.max(0, userData.neededXp - userData.xp);

    // Upcoming Role Reward Check
    let nextRewardText = '✨ *All milestones completed!*';
    const rewards = guildLevelData.config?.roleRewards || {};
    const rewardLevels = Object.keys(rewards).map(Number).sort((a, b) => a - b);
    const nextRewardLevel = rewardLevels.find(lvl => lvl > userData.level);

    if (nextRewardLevel) {
      const roleId = rewards[String(nextRewardLevel)];
      const lvlsLeft = nextRewardLevel - userData.level;
      nextRewardText = `🎁 <@&${roleId}> at **Level ${nextRewardLevel}** (*${lvlsLeft} level${lvlsLeft === 1 ? '' : 's'} to go*)`;
    } else if (rewardLevels.length === 0) {
      nextRewardText = '🎁 *No role rewards configured on this server.*';
    }

    const cardColor = userTheme.color || config.embedColors?.primary || '#5865F2';

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: `${targetUser.username} • Arcane Leveling`, 
        iconURL: targetUser.displayAvatarURL({ dynamic: true }) 
      })
      .setTitle(`Rank Card • ${targetUser.tag || targetUser.username}`)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
      .setColor(cardColor)
      .setDescription(
        `🏆 **RANK:** \`#${userRank}\` of \`${totalMembersRanked}\`\n` +
        `⭐ **LEVEL:** \`${userData.level}\`\n` +
        `✨ **TOTAL XP:** \`${userData.totalXp.toLocaleString()} XP\`\n\n` +
        `**XP PROGRESS (Level ${userData.level} ➔ ${userData.level + 1}):**\n` +
        `${progressBar}\n` +
        `\`${userData.xp.toLocaleString()} / ${userData.neededXp.toLocaleString()} XP\` (*${remainingXp.toLocaleString()} XP needed*)\n\n` +
        `**NEXT MILESTONE:**\n` +
        `${nextRewardText}`
      )
      .setFooter({ 
        text: `Tip: Customize your card with /rank color:#hex • Arcane System`,
        iconURL: guild.iconURL() || undefined
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
