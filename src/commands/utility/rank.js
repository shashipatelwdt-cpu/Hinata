const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const config = require('../../../config.json');

function generateProgressBar(current, total, barLength = 16) {
  if (total <= 0) return '░'.repeat(barLength) + ' 0%';
  const percentage = Math.min(1, Math.max(0, current / total));
  const filledLength = Math.round(barLength * percentage);
  const emptyLength = Math.max(0, barLength - filledLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(emptyLength);
  const percentText = Math.round(percentage * 100);
  return `\`[${bar}]\` **${percentText}%**`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('🎖️ Check your or another member’s level, XP, and server rank')
    .addUserOption(opt =>
      opt
        .setName('user')
        .setDescription('Select a member to view their rank (defaults to you)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    if (targetUser.bot) {
      return interaction.reply({
        content: '🤖 Bot accounts do not earn XP or levels!',
        ephemeral: true
      });
    }

    const guild = interaction.guild;
    const userData = DatabaseManager.getUserLevel(guild.id, targetUser.id);
    const userRank = DatabaseManager.getUserRank(guild.id, targetUser.id);
    const progressBar = generateProgressBar(userData.xp, userData.neededXp);

    const embed = new EmbedBuilder()
      .setTitle(`🎖️ Rank Card • ${targetUser.username}`)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
      .setColor(config.embedColors?.primary || '#5865F2')
      .addFields(
        { name: '🏆 Server Rank', value: `\`#${userRank}\``, inline: true },
        { name: '⭐ Current Level', value: `\`Level ${userData.level}\``, inline: true },
        { name: '✨ Total XP', value: `\`${userData.totalXp.toLocaleString()} XP\``, inline: true },
        { 
          name: '📈 Level Progress', 
          value: `${progressBar}\n\`${userData.xp.toLocaleString()} / ${userData.neededXp.toLocaleString()} XP\` (*${(userData.neededXp - userData.xp).toLocaleString()} XP to Level ${userData.level + 1}*)`, 
          inline: false 
        }
      )
      .setFooter({ text: `Hinata XP & Leveling Engine • Server: ${guild.name}` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
