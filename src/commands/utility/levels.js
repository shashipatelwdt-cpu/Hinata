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
        const tier = entry.tier || DatabaseManager.getLevelTier(entry.level);
        return `${medal} <@${entry.userId}> — **Level ${entry.level}** (\`${entry.totalXp.toLocaleString()} XP\`) • ${tier.badge} *${tier.name}*`;
      });

      // User's own standing
      const callerData = DatabaseManager.getUserLevel(guild.id, interaction.user.id);
      const callerRank = DatabaseManager.getUserRank(guild.id, interaction.user.id);
      const callerTier = callerData.tier || DatabaseManager.getLevelTier(callerData.level);

      const totalRanked = Object.keys(guildLevelData.users || {}).length || 1;
      const totalGuildXp = Object.values(guildLevelData.users || {}).reduce((sum, u) => sum + (u.totalXp || 0), 0);

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name} • XP Leaderboard`, iconURL: guild.iconURL() || undefined })
        .setTitle('🏆 Top Active Members & Tier Rankings')
        .setDescription(
          lines.join('\n\n') +
          `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📌 **Your Standing:** \`#${callerRank}\` of \`${totalRanked}\` • **Level ${callerData.level}** (${callerTier.badge} ${callerTier.name}) • \`${callerData.totalXp.toLocaleString()} Total XP\``
        )
        .addFields(
          { name: '👥 Total Ranked Members', value: `\`${totalRanked.toLocaleString()}\``, inline: true },
          { name: '✨ Total Server XP', value: `\`${totalGuildXp.toLocaleString()} XP\``, inline: true },
          { name: '⚡ Server Multiplier', value: `\`${guildLevelData.config?.multiplier || '1.0'}x XP\``, inline: true }
        )
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: 'Earn 15-25 XP per chat message (60s cooldown) • Hinata Leveling' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'rewards') {
      const rewards = guildLevelData.config?.roleRewards || {};
      const entries = Object.entries(rewards);

      if (entries.length === 0) {
        return interaction.reply({
          content: '🎁 No role rewards have been configured yet! Server admins can set them with `/leveling reward_add`.',
          ephemeral: true
        });
      }

      // Sort by level ascending
      entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      const callerData = DatabaseManager.getUserLevel(guild.id, interaction.user.id);

      const lines = entries.map(([lvlStr, roleId]) => {
        const lvl = parseInt(lvlStr);
        const tier = DatabaseManager.getLevelTier(lvl);
        const isUnlocked = callerData.level >= lvl;
        const statusIcon = isUnlocked ? '✅' : '🔒';
        const statusText = isUnlocked ? '*Claimed*' : `*(${lvl - callerData.level} level${lvl - callerData.level === 1 ? '' : 's'} to go)*`;
        return `${statusIcon} **Level ${lvl}** (${tier.badge} ${tier.name}) ➔ <@&${roleId}> ${statusText}`;
      });

      const embed = new EmbedBuilder()
        .setAuthor({ name: `${guild.name} • Level Milestones`, iconURL: guild.iconURL() || undefined })
        .setTitle('🎁 Level Role Rewards & Roadmap')
        .setDescription(
          `Unlock special exclusive roles automatically as you level up in chat:\n\n` +
          lines.join('\n\n') +
          `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📌 **Your Current Level:** \`Level ${callerData.level}\` (${callerData.tier?.badge || '🥉'} ${callerData.tier?.name || 'Bronze'})`
        )
        .setColor(config.embedColors?.success || '#57F287')
        .setFooter({ text: 'Hinata Leveling Engine • Keep chatting to unlock next roles!' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  }
};
