const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('levels')
    .setDescription('🏆 View server XP leaderboard, rankings, and level milestones')
    .addSubcommand(sub =>
      sub
        .setName('leaderboard')
        .setDescription('👑 Show the top 10 highest level members in this server')
    )
    .addSubcommand(sub =>
      sub
        .setName('rewards')
        .setDescription('🎁 Show all role rewards and your personal roadmap')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const guildLevelData = DatabaseManager.getLevelGuildData(guild.id);

    if (subcommand === 'leaderboard') {
      const topUsers = DatabaseManager.getLevelLeaderboard(guild.id, 10);

      if (!topUsers || topUsers.length === 0) {
        return interaction.reply({
          content: '📜 No members have earned XP in this server yet! Start chatting to gain XP.',
          ephemeral: true
        });
      }

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
      const lines = topUsers.map((entry, index) => {
        const medal = medals[index] || `\`#${index + 1}\``;
        return `${medal} <@${entry.userId}> — **Level ${entry.level}** (\`${entry.totalXp.toLocaleString()} XP\`)`;
      });

      // User's own standing
      const callerData = DatabaseManager.getUserLevel(guild.id, interaction.user.id);
      const callerRank = DatabaseManager.getUserRank(guild.id, interaction.user.id);

      const totalRanked = Object.keys(guildLevelData.users || {}).length || 1;
      const totalGuildXp = Object.values(guildLevelData.users || {}).reduce((sum, u) => sum + (u.totalXp || 0), 0);

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name} • XP Leaderboard`, iconURL: guild.iconURL() || undefined })
        .setTitle('🏆 Top Active Members')
        .setDescription(
          lines.join('\n\n') +
          `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📌 **Your Rank:** \`#${callerRank}\` of \`${totalRanked}\` • **Level ${callerData.level}** • \`${callerData.totalXp.toLocaleString()} XP\``
        )
        .addFields(
          { name: '👥 Ranked Members', value: `\`${totalRanked.toLocaleString()}\``, inline: true },
          { name: '✨ Server XP', value: `\`${totalGuildXp.toLocaleString()} XP\``, inline: true },
          { name: '⚡ Rate Multiplier', value: `\`${guildLevelData.config?.multiplier || '1.0'}x XP\``, inline: true }
        )
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: 'Earn 15-25 XP per minute chatting • Arcane Leveling' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'rewards') {
      const rewards = guildLevelData.config?.roleRewards || {};
      const entries = Object.entries(rewards);

      if (entries.length === 0) {
        return interaction.reply({
          content: '🎁 No role rewards have been configured yet! Server admins can add them with `/leveling reward_add`.',
          ephemeral: true
        });
      }

      // Sort by level ascending
      entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      const callerData = DatabaseManager.getUserLevel(guild.id, interaction.user.id);

      const lines = entries.map(([lvlStr, roleId]) => {
        const lvl = parseInt(lvlStr);
        const isUnlocked = callerData.level >= lvl;
        const statusIcon = isUnlocked ? '✅' : '🔒';
        const statusText = isUnlocked ? '*Unlocked*' : `*(${lvl - callerData.level} level${lvl - callerData.level === 1 ? '' : 's'} away)*`;
        return `${statusIcon} **Level ${lvl}** ➔ <@&${roleId}> ${statusText}`;
      });

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name} • Role Rewards`, iconURL: guild.iconURL() || undefined })
        .setTitle('🎁 Level Milestones & Role Rewards')
        .setDescription(
          `Unlock server roles automatically as you chat and level up:\n\n` +
          lines.join('\n\n') +
          `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📌 **Your Level:** \`Level ${callerData.level}\` (\`${callerData.totalXp.toLocaleString()} XP\`)`
        )
        .setColor(config.embedColors?.success || '#57F287')
        .setFooter({ text: 'Arcane Leveling Engine • Chat actively to unlock roles!' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  }
};
