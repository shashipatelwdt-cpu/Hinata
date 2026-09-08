const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ChannelType 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const { applyLevelingBundle } = require('../../utils/levelingBundle');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leveling')
    .setDescription('⚙️ Configure Arcane-style leveling, announcements, role rewards, and XP')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(sub =>
      sub
        .setName('bundle')
        .setDescription('🚀 1-Click Auto Setup: Creates Level Roles with Discord permissions & dedicated #level-ups channel')
    )
    .addSubcommand(sub =>
      sub
        .setName('config')
        .setDescription('⚙️ Configure announcement channel type, multipliers, and role stacking')
        .addBooleanOption(opt =>
          opt
            .setName('enabled')
            .setDescription('Enable or disable chat XP leveling')
            .setRequired(false)
        )
        .addStringOption(opt =>
          opt
            .setName('channel_type')
            .setDescription('Where to announce level ups (Arcane styles)')
            .setRequired(false)
            .addChoices(
              { name: 'Current Channel (Where user chats)', value: 'current' },
              { name: 'Custom Channel (Designated channel)', value: 'custom' },
              { name: 'Direct Message (Private DM)', value: 'dm' },
              { name: 'Silent (No message)', value: 'none' }
            )
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Announcement channel (Required if channel_type is set to Custom)')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
        .addNumberOption(opt =>
          opt
            .setName('multiplier')
            .setDescription('XP rate multiplier (e.g. 1.0 standard, 1.5, or 2.0 for double XP)')
            .setRequired(false)
            .setMinValue(0.5)
            .setMaxValue(5.0)
        )
        .addBooleanOption(opt =>
          opt
            .setName('stack_roles')
            .setDescription('Stack role rewards (True: keep previous roles, False: replace with newest role)')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('message')
        .setDescription('💬 Set custom level up message (Supports: {user}, {level}, {role}, {server})')
        .addStringOption(opt =>
          opt
            .setName('template')
            .setDescription('e.g. "GG {user}, you just leveled up to **level {level}**!"')
            .setRequired(true)
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
        .setName('ignore_channel')
        .setDescription('🚫 Blacklist a channel from awarding chat XP (e.g. spam, bot-commands)')
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Channel to blacklist')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('unignore_channel')
        .setDescription('✅ Allow a previously blacklisted channel to award chat XP')
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Channel to un-blacklist')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('ignore_role')
        .setDescription('🚫 Blacklist a role from earning chat XP (e.g. Bots, Muted)')
        .addRoleOption(opt =>
          opt
            .setName('role')
            .setDescription('Role to blacklist')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('unignore_role')
        .setDescription('✅ Allow members with this role to earn chat XP again')
        .addRoleOption(opt =>
          opt
            .setName('role')
            .setDescription('Role to un-blacklist')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('xp_add')
        .setDescription('⚡ Add XP points to a member')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('Member to give XP')
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName('amount')
            .setDescription('Amount of XP to add')
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('xp_remove')
        .setDescription('🔻 Remove XP points from a member')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('Member to deduct XP from')
            .setRequired(true)
        )
        .addIntegerOption(opt =>
          opt
            .setName('amount')
            .setDescription('Amount of XP to deduct')
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
        .setDescription('🔄 Reset a member’s XP and level back to 0')
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
    const guildLevelData = DatabaseManager.getLevelGuildData(guild.id);

    if (subcommand === 'bundle') {
      await interaction.deferReply();

      const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
      if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles) || !botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.editReply({
          embeds: [
            EmbedUtils.error(
              'Missing Permissions',
              'Hinata requires both **Manage Roles** and **Manage Channels** permissions to automatically create and configure the Leveling Bundle.'
            )
          ]
        });
      }

      try {
        const result = await applyLevelingBundle(guild);

        const summaryLines = result.roles.map(r => 
          `• **Level ${r.tier.level}** ➔ <@&${r.role.id}>\n  └ 🔓 *${r.tier.perks}*`
        ).join('\n\n');

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle('🚀 1-Click Leveling Bundle Successfully Configured!')
              .setDescription(
                `All level roles with escalating Discord permissions and the dedicated announcement channel have been created and mapped:\n\n` +
                `📢 **Announcement Channel:** <#${result.channel.id}>\n\n` +
                `### 🎁 Auto-Reward Milestones & Perks:\n` +
                `${summaryLines}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `✅ All level-ups will now automatically be announced in <#${result.channel.id}> and users will receive their roles upon chatting!`
              )
              .setColor('#57F287')
              .setFooter({ text: 'Arcane Leveling System • Fully Automated' })
              .setTimestamp()
          ]
        });
      } catch (err) {
        console.error('[LEVELING BUNDLE ERROR]', err);
        return interaction.editReply({
          embeds: [
            EmbedUtils.error(
              'Setup Error',
              `An error occurred while creating the leveling bundle: ${err.message}`
            )
          ]
        });
      }
    }

    if (subcommand === 'config') {
      const enabled = interaction.options.getBoolean('enabled');
      const channelType = interaction.options.getString('channel_type');
      const channel = interaction.options.getChannel('channel');
      const multiplier = interaction.options.getNumber('multiplier');
      const stackRoles = interaction.options.getBoolean('stack_roles');

      const updates = {};
      if (enabled !== null) updates.enabled = enabled;
      if (channelType !== null) updates.channelType = channelType;
      if (channel !== null) {
        updates.channelId = channel.id;
        updates.channelType = 'custom';
      }
      if (multiplier !== null) updates.multiplier = multiplier;
      if (stackRoles !== null) updates.stackRoles = stackRoles;

      const updated = DatabaseManager.setLevelConfig(guild.id, updates);

      const channelTypeNames = {
        current: 'Current Channel (Where message was sent)',
        custom: updated.channelId ? `<#${updated.channelId}>` : 'Custom Channel (None set)',
        dm: 'Direct Message (Private DM)',
        none: 'Silent (No announcement message)'
      };

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Arcane Leveling Configuration Updated ⚙️',
            `• **Leveling Engine:** ${updated.enabled !== false ? '✅ Enabled' : '❌ Disabled'}\n` +
            `• **Announcement Mode:** \`${channelTypeNames[updated.channelType || 'current']}\`\n` +
            `• **XP Rate Multiplier:** \`${updated.multiplier || 1.0}x XP\`\n` +
            `• **Role Stacking:** ${updated.stackRoles !== false ? '✅ Enabled (Keep previous roles)' : '❌ Disabled (Replace with highest role)'}\n` +
            `• **Custom Message:** \`${updated.message || 'GG {user}, you just leveled up to **level {level}**!'}\``
          )
        ]
      });
    }

    if (subcommand === 'message') {
      const template = interaction.options.getString('template');
      DatabaseManager.setLevelMessage(guild.id, template);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Level Up Message Updated 💬',
            `New Arcane announcement template configured:\n\n` +
            `> **${template}**\n\n` +
            `*Supported tags: \`{user}\` (mention), \`{level}\` (level number), \`{role}\` (unlocked role), \`{server}\` (server name).*`
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

    if (subcommand === 'ignore_channel') {
      const channel = interaction.options.getChannel('channel');
      const added = DatabaseManager.addIgnoredChannel(guild.id, channel.id);

      if (!added) {
        return interaction.reply({
          content: `⚠️ <#${channel.id}> is already in the No-XP blacklist!`,
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Channel Blacklisted 🚫',
            `Messages sent in <#${channel.id}> will no longer earn chat XP.`
          )
        ]
      });
    }

    if (subcommand === 'unignore_channel') {
      const channel = interaction.options.getChannel('channel');
      const removed = DatabaseManager.removeIgnoredChannel(guild.id, channel.id);

      if (!removed) {
        return interaction.reply({
          content: `⚠️ <#${channel.id}> was not in the No-XP blacklist.`,
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Channel Whitelisted ✅',
            `Members can now earn chat XP in <#${channel.id}> again.`
          )
        ]
      });
    }

    if (subcommand === 'ignore_role') {
      const role = interaction.options.getRole('role');
      const added = DatabaseManager.addIgnoredRole(guild.id, role.id);

      if (!added) {
        return interaction.reply({
          content: `⚠️ Role <@&${role.id}> is already blacklisted from earning XP.`,
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Role Blacklisted 🚫',
            `Members with the <@&${role.id}> role will not gain XP.`
          )
        ]
      });
    }

    if (subcommand === 'unignore_role') {
      const role = interaction.options.getRole('role');
      const removed = DatabaseManager.removeIgnoredRole(guild.id, role.id);

      if (!removed) {
        return interaction.reply({
          content: `⚠️ Role <@&${role.id}> was not in the blacklist.`,
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Role Whitelisted ✅',
            `Members with <@&${role.id}> can now earn XP again.`
          )
        ]
      });
    }

    if (subcommand === 'xp_add') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      if (targetUser.bot) {
        return interaction.reply({ content: '🤖 Bots cannot earn XP!', ephemeral: true });
      }

      const result = DatabaseManager.addXpToUser(guild.id, targetUser.id, amount);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'XP Added ⚡',
            `Added **${amount.toLocaleString()} XP** to <@${targetUser.id}>!\n` +
            `• **Level:** \`${result.newLevel}\`\n` +
            `• **Current Level XP:** \`${result.currentXp.toLocaleString()} / ${result.neededXp.toLocaleString()} XP\`\n` +
            `• **Total XP:** \`${result.totalXp.toLocaleString()} XP\``
          )
        ]
      });
    }

    if (subcommand === 'xp_remove') {
      const targetUser = interaction.options.getUser('user');
      const amount = interaction.options.getInteger('amount');

      if (targetUser.bot) {
        return interaction.reply({ content: '🤖 Bots cannot lose XP!', ephemeral: true });
      }

      const result = DatabaseManager.removeXpFromUser(guild.id, targetUser.id, amount);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'XP Deducted 🔻',
            `Deducted **${amount.toLocaleString()} XP** from <@${targetUser.id}>.\n` +
            `• **New Level:** \`${result.level}\`\n` +
            `• **Current Level XP:** \`${result.xp.toLocaleString()} / ${result.neededXp.toLocaleString()} XP\`\n` +
            `• **Total XP:** \`${result.totalXp.toLocaleString()} XP\``
          )
        ]
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

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Level Updated ⭐',
            `Successfully set <@${targetUser.id}> to **Level ${targetLevel}**!`
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
