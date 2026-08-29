const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invites-manage')
    .setDescription('⚙️ Admin commands to add bonus invites, remove invites or reset stats')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
    const guildId = interaction.guild.id;

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
