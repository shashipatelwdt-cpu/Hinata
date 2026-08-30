const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const InviteTracker = require('../../utils/inviteTracker');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invites-manage')
    .setDescription('⚙️ Admin commands to add bonus invites, remove invites, sync with Discord, or reset stats')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName('sync')
        .setDescription('🔄 Re-sync all active server invite links from Discord into the bot database')
    )
    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('🎁 Add bonus invites to a specific user')
        .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription('Number of bonus invites to add').setRequired(true).setMinValue(1).setMaxValue(10000))
    )
    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('➖ Deduct bonus invites from a specific user')
        .addUserOption(opt => opt.setName('user').setDescription('Target user').setRequired(true))
        .addIntegerOption(opt => opt.setName('amount').setDescription('Number of bonus invites to remove').setRequired(true).setMinValue(1).setMaxValue(10000))
    )
    .addSubcommand(sub =>
      sub
        .setName('reset-user')
        .setDescription('🔄 Reset all invite stats for a specific user')
        .addUserOption(opt => opt.setName('user').setDescription('Target user to reset').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('reset-all')
        .setDescription('⚠️ Reset ALL invite records and statistics for this server')
        .addBooleanOption(opt => opt.setName('confirm').setDescription('Confirm complete server invite wipe').setRequired(true))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const guildId = guild.id;

    // 0. SYNC ACTIVE DISCORD INVITES
    if (subcommand === 'sync') {
      await interaction.deferReply();
      const syncedCount = await InviteTracker.syncGuild(guild);
      const topInviters = DatabaseManager.getInviteLeaderboard(guildId, 5);

      return interaction.editReply({
        embeds: [
          EmbedUtils.success(
            'Invites Re-Synced! 🔄',
            `Successfully scanned all active Discord invite links for **${guild.name}** and reconciled records with the database!\n\n` +
            `• **Members Updated/Synced:** \`${syncedCount}\`\n` +
            `• **Top Inviters Tracked:** \`${topInviters.length}\`\n\n` +
            `*Tip: Run \`/invites leaderboard\` to view the full server rankings.*`
          )
        ]
      });
    }

    // 1. ADD BONUS INVITES
    if (subcommand === 'add') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      const updatedStats = DatabaseManager.addBonusInvites(guildId, targetUser.id, amount);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Bonus Invites Added! 🎁',
            `Successfully awarded **+${amount}** bonus invites to <@${targetUser.id}>.\n\n` +
            `• **Total Net Invites:** **${updatedStats.total}**\n` +
            `• **Breakdown:** ✅ \`${updatedStats.regular}\` regular | ❌ \`${updatedStats.leaves}\` left | ⚠️ \`${updatedStats.fake}\` fake | 🎁 \`${updatedStats.bonus}\` bonus`
          )
        ]
      });
    }

    // 2. REMOVE BONUS INVITES
    if (subcommand === 'remove') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      const updatedStats = DatabaseManager.addBonusInvites(guildId, targetUser.id, -amount);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Bonus Invites Deducted! ➖',
            `Successfully removed **${amount}** bonus invites from <@${targetUser.id}>.\n\n` +
            `• **Total Net Invites:** **${updatedStats.total}**\n` +
            `• **Breakdown:** ✅ \`${updatedStats.regular}\` regular | ❌ \`${updatedStats.leaves}\` left | ⚠️ \`${updatedStats.fake}\` fake | 🎁 \`${updatedStats.bonus}\` bonus`
          )
        ]
      });
    }

    // 3. RESET SINGLE USER
    if (subcommand === 'reset-user') {
      const targetUser = interaction.options.getUser('user');

      DatabaseManager.resetInvites(guildId, targetUser.id);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'User Invites Reset 🔄',
            `All invite statistics (regular, leaves, fake, bonus) for <@${targetUser.id}> have been reset to **0**.`
          )
        ]
      });
    }

    // 4. RESET ALL SERVER INVITES
    if (subcommand === 'reset-all') {
      const confirm = interaction.options.getBoolean('confirm');
      if (!confirm) {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Operation Cancelled', 'Server invite reset was not confirmed.')],
          ephemeral: true
        });
      }

      DatabaseManager.resetInvites(guildId, null);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Server Invites Reset 🧹',
            'All invite records and leaderboards for this server have been completely wiped and reset.'
          )
        ]
      });
    }
  }
};
