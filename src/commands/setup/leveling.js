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
    .setDescription('⚙️ Configure Level Up announcements and role rewards')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName('config')
        .setDescription('⚙️ Enable/disable leveling and choose the announcement channel')
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
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (subcommand === 'config') {
      const enabled = interaction.options.getBoolean('enabled');
      const channel = interaction.options.getChannel('channel');

      DatabaseManager.setLevelConfig(guild.id, {
        enabled,
        channelId: channel ? channel.id : null
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Leveling Settings Updated',
            `• **Status:** ${enabled ? '✅ Enabled' : '❌ Disabled'}\n` +
            `• **Announcement Channel:** ${channel ? `<#${channel.id}>` : '*Current channel where member leveled up*'}`
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
  }
};
