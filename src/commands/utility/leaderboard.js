const { SlashCommandBuilder } = require('discord.js');
const { 
  formatLevelLeaderboard, 
  formatInviteLeaderboard, 
  formatCountingLeaderboard 
} = require('../../utils/leaderboardFormatter');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('🏆 View server rankings & leaderboards (AmariBot UI)')
    .addSubcommand(sub =>
      sub
        .setName('normal')
        .setDescription('👑 Show the top 10 highest level members in this server (Chat XP)')
    )
    .addSubcommand(sub =>
      sub
        .setName('levels')
        .setDescription('👑 Show the top 10 highest level members in this server (Chat XP)')
    )
    .addSubcommand(sub =>
      sub
        .setName('invites')
        .setDescription('📊 Show the top 10 inviters in this server')
    )
    .addSubcommand(sub =>
      sub
        .setName('counting')
        .setDescription('🔢 Show the top 10 counting game champions')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (subcommand === 'normal' || subcommand === 'levels') {
      const embed = formatLevelLeaderboard(guild, interaction.user, 10);
      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'invites') {
      const embed = formatInviteLeaderboard(guild, interaction.user, 10);
      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'counting') {
      const embed = formatCountingLeaderboard(guild, interaction.user, 10);
      return interaction.reply({ embeds: [embed] });
    }

    // Default fallback
    const embed = formatLevelLeaderboard(guild, interaction.user, 10);
    return interaction.reply({ embeds: [embed] });
  }
};
