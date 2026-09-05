const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

function generatePremiumBar(current, total, barLength = 14) {
  if (total <= 0) return '▱'.repeat(barLength) + ' 0%';
  const ratio = Math.min(1, Math.max(0, current / total));
  const filled = Math.round(barLength * ratio);
  const empty = Math.max(0, barLength - filled);
  const bar = '▰'.repeat(filled) + '▱'.repeat(empty);
  const pct = Math.round(ratio * 100);
  return `\`${bar}\` **${pct}%**`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('🎖️ Check your or another member’s level, XP, tier badge, and server rank')
    .addUserOption(opt =>
      opt
        .setName('user')
        .setDescription('Select a member to view their rank (defaults to you)')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt
        .setName('color')
        .setDescription('Customize your Rank Card accent color (Hex e.g. #FF1493, #00FFCC, or reset)')
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
          embeds: [EmbedUtils.success('Theme Reset', 'Your Rank Card accent color has been reset to your Tier default!')],
          ephemeral: true
        });
      }

      const hexRegex = /^#?([0-9A-Fa-f]{6})$/;
      const match = colorOpt.match(hexRegex);
      if (!match) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Invalid Hex Color', 'Please provide a valid 6-digit hex color code! Example: `/rank color:#FF007F` or `/rank color:#00D2FF`')],
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
        content: '🤖 Bot accounts do not earn XP or levels!',
        ephemeral: true
      });
    }

    const userData = DatabaseManager.getUserLevel(guild.id, targetUser.id);
    const userRank = DatabaseManager.getUserRank(guild.id, targetUser.id);
    const guildLevelData = DatabaseManager.getLevelGuildData(guild.id);
    const userTheme = DatabaseManager.getUserRankTheme(guild.id, targetUser.id);
    const tier = userData.tier || DatabaseManager.getLevelTier(userData.level);

    const totalMembersRanked = Object.keys(guildLevelData.users || {}).length || 1;
    const percentile = Math.max(1, Math.min(100, Math.round((userRank / totalMembersRanked) * 100)));

    const progressBar = generatePremiumBar(userData.xp, userData.neededXp);
    const remainingXp = Math.max(0, userData.neededXp - userData.xp);

    // Next Role Reward Milestone
    let nextRewardText = '✨ *Max rank tier reached!*';
    const rewards = guildLevelData.config?.roleRewards || {};
    const rewardLevels = Object.keys(rewards).map(Number).sort((a, b) => a - b);
    const nextRewardLevel = rewardLevels.find(lvl => lvl > userData.level);

    if (nextRewardLevel) {
      const roleId = rewards[String(nextRewardLevel)];
      const lvlsLeft = nextRewardLevel - userData.level;
      nextRewardText = `🎁 <@&${roleId}> at **Level ${nextRewardLevel}** (*${lvlsLeft} level${lvlsLeft === 1 ? '' : 's'} to go!*)`;
    } else if (rewardLevels.length > 0 && userData.level >= Math.max(...rewardLevels)) {
      nextRewardText = '👑 **All Role Rewards Unlocked!**';
    } else {
      nextRewardText = '🎁 *No upcoming role rewards set.*';
    }

    const cardColor = userTheme.color || tier.color || config.embedColors?.primary || '#5865F2';

    const embed = new EmbedBuilder()
      .setAuthor({ 
        name: `${targetUser.username}'s Rank Card`, 
        iconURL: targetUser.displayAvatarURL({ dynamic: true }) 
      })
      .setTitle(`${tier.badge} ${tier.name} Tier • Level ${userData.level}`)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
      .setColor(cardColor)
      .setDescription(
        `🏆 **Server Rank:** \`#${userRank}\` *(Top ${percentile}% of ${totalMembersRanked} active)*\n` +
        `⭐ **Level:** \`${userData.level}\` • **Tier:** \`${tier.badge} ${tier.name}\`\n` +
        `✨ **Total XP:** \`${userData.totalXp.toLocaleString()} XP\`\n\n` +
        `**📈 Level Progress:**\n` +
        `${progressBar}\n` +
        `\`${userData.xp.toLocaleString()} / ${userData.neededXp.toLocaleString()} XP\` (*${remainingXp.toLocaleString()} XP to Level ${userData.level + 1}*)\n\n` +
        `**🎯 Milestone Roadmap:**\n` +
        `${nextRewardText}`
      )
      .setFooter({ 
        text: `Tip: Customize your rank color with /rank color:#HEX • Hinata Leveling`,
        iconURL: guild.iconURL() || undefined
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
