const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const { formatLevelLeaderboard } = require('../../utils/leaderboardFormatter');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('levels')
    .setDescription('🏆 View server XP leaderboard, rankings, and level milestones')
    .addSubcommand(sub =>
      sub
        .setName('leaderboard')
        .setDescription('👑 Show the top 10 highest level members in this server (AmariBot Style)')
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
      const embed = formatLevelLeaderboard(guild, interaction.user, 10);
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
