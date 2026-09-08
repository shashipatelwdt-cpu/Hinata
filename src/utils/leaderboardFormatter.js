const { EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../database/db');

const LEADERBOARD_COLOR = '#FEE75C'; // AmariBot Iconic Gold/Yellow

/**
 * Generate medal or rank badge (AmariBot style: 🥇 🔸, 🥈 🔸, 🥉 🔸, #4 🔸)
 * @param {number} index - 0-indexed rank position
 * @returns {string}
 */
function getRankBadge(index) {
  if (index === 0) return '🥇 🔸';
  if (index === 1) return '🥈 🔸';
  if (index === 2) return '🥉 🔸';
  return `**#${index + 1}** 🔸`;
}

/**
 * Format AmariBot-style Level / XP Leaderboard
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').User} [callerUser]
 * @param {number} [limit=10]
 * @returns {EmbedBuilder}
 */
function formatLevelLeaderboard(guild, callerUser = null, limit = 10) {
  const topUsers = DatabaseManager.getLevelLeaderboard(guild.id, limit);
  const guildIcon = guild.iconURL({ dynamic: true, size: 256 });

  if (!topUsers || topUsers.length === 0) {
    return new EmbedBuilder()
      .setTitle('Leaderboard')
      .setDescription(`**${guild.name}**\n\nNo members have earned XP in this server yet!\nStart chatting to claim your spot on the leaderboard.`)
      .setColor(LEADERBOARD_COLOR)
      .setThumbnail(guildIcon || null)
      .setFooter({ text: 'Leveling • 1 XP Per Word' });
  }

  const entries = topUsers.map((entry, index) => {
    const badge = getRankBadge(index);
    const needed = DatabaseManager.getXpNeededForLevel(entry.level);
    return `${badge} <@${entry.userId}>\nLevel: ${entry.level}\nExp: ${entry.xp}/${needed}`;
  });

  const embed = new EmbedBuilder()
    .setTitle('Leaderboard')
    .setDescription(
      `**${guild.name}**\n` +
      `Click [here](https://discord.com/channels/${guild.id}) for the complete leaderboard.\n\n` +
      entries.join('\n\n')
    )
    .setColor(LEADERBOARD_COLOR)
    .setThumbnail(guildIcon || null);

  if (callerUser) {
    const callerData = DatabaseManager.getUserLevel(guild.id, callerUser.id);
    const callerRank = DatabaseManager.getUserRank(guild.id, callerUser.id);
    embed.setFooter({
      text: `Your Rank: #${callerRank} • Level ${callerData.level} • 1 XP Per Word`,
      iconURL: callerUser.displayAvatarURL({ dynamic: true, size: 64 }) || undefined
    });
  } else {
    embed.setFooter({ text: `${guild.name} • 1 XP Per Word` });
  }

  return embed;
}

/**
 * Format AmariBot-style Invites Leaderboard
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').User} [callerUser]
 * @param {number} [limit=10]
 * @returns {EmbedBuilder}
 */
function formatInviteLeaderboard(guild, callerUser = null, limit = 10) {
  const topInviters = DatabaseManager.getInviteLeaderboard(guild.id, limit);
  const guildIcon = guild.iconURL({ dynamic: true, size: 256 });

  if (!topInviters || topInviters.length === 0) {
    return new EmbedBuilder()
      .setTitle('Leaderboard')
      .setDescription(`**${guild.name}**\n\nNo invite activity recorded yet for this server!\nShare your invite link to claim your spot on the leaderboard.`)
      .setColor(LEADERBOARD_COLOR)
      .setThumbnail(guildIcon || null)
      .setFooter({ text: 'Invite Tracker Leaderboard' });
  }

  const entries = topInviters.map((entry, index) => {
    const badge = getRankBadge(index);
    return `${badge} <@${entry.userId}>\nInvites: ${entry.total}\nStats: ${entry.regular} regular • ${entry.bonus} bonus • ${entry.leaves} left`;
  });

  const embed = new EmbedBuilder()
    .setTitle('Leaderboard')
    .setDescription(
      `**${guild.name}**\n` +
      `Top inviters in this server.\n\n` +
      entries.join('\n\n')
    )
    .setColor(LEADERBOARD_COLOR)
    .setThumbnail(guildIcon || null);

  if (callerUser) {
    const callerRank = DatabaseManager.getUserInviteRank(guild.id, callerUser.id);
    const callerInvites = DatabaseManager.getInvites(guild.id, callerUser.id);
    embed.setFooter({
      text: `Your Rank: #${callerRank || 'Unranked'} • ${callerInvites?.total || 0} Invites`,
      iconURL: callerUser.displayAvatarURL({ dynamic: true, size: 64 }) || undefined
    });
  } else {
    embed.setFooter({ text: `${guild.name} • Top Inviters` });
  }

  return embed;
}

/**
 * Format AmariBot-style Counting Game Leaderboard
 * @param {import('discord.js').Guild} guild
 * @param {import('discord.js').User} [callerUser]
 * @param {number} [limit=10]
 * @returns {EmbedBuilder}
 */
function formatCountingLeaderboard(guild, callerUser = null, limit = 10) {
  const topCounters = DatabaseManager.getCountingLeaderboard(guild.id, limit);
  const countingData = DatabaseManager.getCounting(guild.id);
  const guildIcon = guild.iconURL({ dynamic: true, size: 256 });

  if (!topCounters || topCounters.length === 0) {
    return new EmbedBuilder()
      .setTitle('Leaderboard')
      .setDescription(`**${guild.name}**\n\nNo counts recorded yet in this server!\nStart counting in the counting channel to claim the top spot.`)
      .setColor(LEADERBOARD_COLOR)
      .setThumbnail(guildIcon || null)
      .setFooter({ text: `Current Count: ${countingData.currentCount || 0} • High Score: ${countingData.highScore || 0}` });
  }

  const entries = topCounters.map((entry, index) => {
    const badge = getRankBadge(index);
    const total = (entry.counts || 0) + (entry.fails || 0);
    const acc = total > 0 ? Math.round((entry.counts / total) * 100) : 100;
    return `${badge} <@${entry.userId}>\nCounts: ${entry.counts.toLocaleString()}\nAccuracy: ${acc}%${entry.fails > 0 ? ` • ${entry.fails} ruins` : ''}`;
  });

  const embed = new EmbedBuilder()
    .setTitle('Leaderboard')
    .setDescription(
      `**${guild.name}**\n` +
      `Top counters in this server.\n\n` +
      entries.join('\n\n')
    )
    .setColor(LEADERBOARD_COLOR)
    .setThumbnail(guildIcon || null)
    .setFooter({
      text: `Current Streak: ${countingData.currentCount || 0} • High Score: ${countingData.highScore || 0}`
    });

  return embed;
}

module.exports = {
  LEADERBOARD_COLOR,
  getRankBadge,
  formatLevelLeaderboard,
  formatInviteLeaderboard,
  formatCountingLeaderboard
};
