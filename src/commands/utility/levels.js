const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('levels')
    .setDescription('🏆 View server XP leaderboard and level milestones')
    .addSubcommand(sub =>
      sub
        .setName('leaderboard')
        .setDescription('👑 Show the top 10 highest level members in this server')
    )
    .addSubcommand(sub =>
      sub
        .setName('rewards')
        .setDescription('🎁 Show all role rewards unlocked at each level')
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
        return `${medal} <@${entry.userId}> — **Level ${entry.level}** (\`${entry.totalXp.toLocaleString()} Total XP\`)`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`🏆 ${guild.name} • XP Leaderboard`)
        .setDescription(lines.join('\n\n'))
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: 'Tip: Chat actively to climb the leaderboard! (60s cooldown)' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'rewards') {
      const rewards = guildLevelData.config.roleRewards || {};
      const entries = Object.entries(rewards);

      if (entries.length === 0) {
        return interaction.reply({
          content: '🎁 No role rewards have been configured yet! Server admins can set them with `/leveling reward_add`.',
          ephemeral: true
        });
      }

      // Sort by level ascending
      entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
      const lines = entries.map(([lvl, roleId]) => {
        return `• **Level ${lvl}** ➔ <@&${roleId}>`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`🎁 ${guild.name} • Level Role Rewards`)
        .setDescription(`Unlock these exclusive roles automatically as you level up:\n\n${lines.join('\n')}`)
        .setColor(config.embedColors?.success || '#57F287')
        .setFooter({ text: 'Hinata Leveling Engine' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  }
};
