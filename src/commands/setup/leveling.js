const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ChannelType 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leveling')
    .setDescription('⚙️ Configure Level Up announcements, role rewards, multipliers, and XP management')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName('config')
        .setDescription('⚙️ Enable/disable leveling, choose announcement channel, and set XP multiplier')
        .addBooleanOption(opt =>
          opt
            .setName('enabled')
            .setDescription('Enable or disable chat XP leveling')
            .setRequired(true)
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Channel to post level up announcements (leave blank for current channel)')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
        .addNumberOption(opt =>
          opt
            .setName('multiplier')
            .setDescription('XP rate multiplier (e.g. 1.0 for normal, 1.5, or 2.0 for double XP events)')
            .setRequired(false)
            .setMinValue(0.5)
            .setMaxValue(5.0)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('reward_add')
        .setDescription('🎁 Set an automatic role reward for reaching a specific level')
        .addIntegerOption(opt =>
          opt
            .setName('level')
            .setDescription('Level requirement (e.g. 5, 10, 20)')
            .setRequired(true)
            .setMinValue(1)
        )
        .addRoleOption(opt =>
          opt
            .setName('role')
            .setDescription('Role to grant upon reaching this level')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('reward_remove')
        .setDescription('❌ Remove a role reward for a level')
        .addIntegerOption(opt =>
          opt
            .setName('level')
            .setDescription('Level to remove reward for')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('set_level')
        .setDescription('⭐ Manually set a member’s level and XP')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('Member to modify')
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName('level')
            .setDescription('Target level')
            .setRequired(true)
            .setMinValue(0)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('reset_user')
        .setDescription('🔄 Reset a member’s XP and level to 0')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('Member to reset')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (subcommand === 'config') {
      const enabled = interaction.options.getBoolean('enabled');
      const channel = interaction.options.getChannel('channel');
      const multiplier = interaction.options.getNumber('multiplier');

      const updates = {
        enabled,
        channelId: channel ? channel.id : null
      };
      if (multiplier !== null) {
        updates.multiplier = multiplier;
      }

      const updated = DatabaseManager.setLevelConfig(guild.id, updates);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Leveling Settings Updated ⚙️',
            `• **Status:** ${enabled ? '✅ Enabled' : '❌ Disabled'}\n` +
            `• **Announcement Channel:** ${channel ? `<#${channel.id}>` : '*Current channel where member leveled up*'}\n` +
            `• **XP Multiplier:** \`${updated.multiplier || 1.0}x XP\``
          )
        ]
      });
    }

    if (subcommand === 'reward_add') {
      const level = interaction.options.getInteger('level');
      const role = interaction.options.getRole('role');

      // Bot hierarchy check
      const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
      if (botMember && botMember.roles.highest.position <= role.position) {
        return interaction.reply({
          embeds: [
            EmbedUtils.warning(
              'Role Hierarchy Warning',
              `Role <@&${role.id}> is higher than or equal to Hinata's highest role! Please move Hinata's role above <@&${role.id}> in Server Settings > Roles so the bot can assign it.`
            )
          ],
          ephemeral: true
        });
      }

      DatabaseManager.addLevelRoleReward(guild.id, level, role.id);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Role Reward Configured! 🎁',
            `Members who reach **Level ${level}** will now automatically receive the <@&${role.id}> role!`
          )
        ]
      });
    }

    if (subcommand === 'reward_remove') {
      const level = interaction.options.getInteger('level');
      const removed = DatabaseManager.removeLevelRoleReward(guild.id, level);

      if (!removed) {
        return interaction.reply({
          embeds: [EmbedUtils.info('Reward Not Found', `There is no configured role reward for Level ${level}.`)],
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [EmbedUtils.success('Reward Removed', `Removed the role reward for **Level ${level}**.`)]
      });
    }

    if (subcommand === 'set_level') {
      const targetUser = interaction.options.getUser('user');
      const targetLevel = interaction.options.getInteger('level');

      if (targetUser.bot) {
        return interaction.reply({
          content: '🤖 Cannot modify bot levels!',
          ephemeral: true
        });
      }

      DatabaseManager.setUserLevel(guild.id, targetUser.id, targetLevel, 0);
      const tier = DatabaseManager.getLevelTier(targetLevel);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Level Updated ⭐',
            `Successfully set <@${targetUser.id}> to **Level ${targetLevel}** (${tier.badge} ${tier.name} Tier)!`
          )
        ]
      });
    }

    if (subcommand === 'reset_user') {
      const targetUser = interaction.options.getUser('user');
      if (targetUser.bot) {
        return interaction.reply({
          content: '🤖 Cannot reset bots!',
          ephemeral: true
        });
      }

      DatabaseManager.resetUserLevel(guild.id, targetUser.id);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'User XP Reset 🔄',
            `Successfully reset <@${targetUser.id}>'s level and XP back to **Level 0 (0 XP)**.`
          )
        ]
      });
    }
  }
};
