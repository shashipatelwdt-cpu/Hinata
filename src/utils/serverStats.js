const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../database/db');

class ServerStats {
  /**
   * Calculate next member milestone goal
   * @param {number} current 
   */
  static calculateGoal(current) {
    if (current < 50) return 50;
    if (current < 100) return 100;
    if (current < 500) return Math.ceil((current + 1) / 100) * 100;
    if (current < 1000) return Math.ceil((current + 1) / 250) * 250;
    return Math.ceil((current + 1) / 500) * 500;
  }

  /**
   * Calculate all stats metrics for a guild
   * @param {import('discord.js').Guild} guild 
   */
  static async calculateStats(guild) {
    try {
      // Ensure member cache is reasonably populated if possible
      if (guild.memberCount > guild.members.cache.size && guild.memberCount < 2000) {
        await guild.members.fetch().catch(() => null);
      }
    } catch {}

    const totalMembers = guild.memberCount || 0;
    const botCount = guild.members.cache.filter(m => m.user.bot).size;
    const humanCount = Math.max(0, totalMembers - botCount);
    const boostCount = guild.premiumSubscriptionCount || 0;
    const boostTier = guild.premiumTier === 'NONE' ? 0 : (guild.premiumTier || 0);
    const goal = this.calculateGoal(totalMembers);

    return {
      totalMembers,
      humanCount,
      botCount,
      boostCount,
      boostTier,
      goal
    };
  }

  /**
   * Format counter channel names
   * @param {object} stats 
   */
  static getFormattedNames(stats) {
    return {
      totalMembers: `👥・All Members: ${stats.totalMembers.toLocaleString()}`,
      humanMembers: `👤・Humans: ${stats.humanCount.toLocaleString()}`,
      botMembers: `🤖・Bots: ${stats.botCount.toLocaleString()}`,
      boosts: `🚀・Boosts: ${stats.boostCount} (Tier ${stats.boostTier})`,
      goal: `🎯・Goal: ${stats.goal.toLocaleString()}`
    };
  }

  /**
   * Setup Live Server Stats for a guild
   * @param {import('discord.js').Guild} guild 
   */
  static async setupStats(guild) {
    const botMember = guild.members.me;
    if (!botMember.permissions.has(PermissionFlagsBits.ManageChannels)) {
      throw new Error('Bot is missing `Manage Channels` permission to create stats channels.');
    }

    // Clean up existing stats if any
    await this.removeStats(guild).catch(() => null);

    const stats = await this.calculateStats(guild);
    const names = this.getFormattedNames(stats);

    // 1. Create Category at the very top of server
    const category = await guild.channels.create({
      name: '📊 ━━ SERVER STATS ━━',
      type: ChannelType.GuildCategory,
      position: 0,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.Connect],
          allow: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: botMember.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.Connect]
        }
      ]
    });

    const channelPermissions = [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.Connect],
        allow: [PermissionFlagsBits.ViewChannel]
      },
      {
        id: botMember.id,
        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.Connect]
      }
    ];

    // 2. Create Locked Voice Channels under category
    const totalChannel = await guild.channels.create({
      name: names.totalMembers,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: channelPermissions
    });

    const humanChannel = await guild.channels.create({
      name: names.humanMembers,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: channelPermissions
    });

    const botChannel = await guild.channels.create({
      name: names.botMembers,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: channelPermissions
    });

    const boostChannel = await guild.channels.create({
      name: names.boosts,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: channelPermissions
    });

    const goalChannel = await guild.channels.create({
      name: names.goal,
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: channelPermissions
    });

    const configData = {
      enabled: true,
      categoryId: category.id,
      channels: {
        totalMembers: totalChannel.id,
        humanMembers: humanChannel.id,
        botMembers: botChannel.id,
        boosts: boostChannel.id,
        goal: goalChannel.id
      },
      lastUpdated: Date.now()
    };

    DatabaseManager.setServerStats(guild.id, configData);
    return { config: configData, stats, names };
  }

  /**
   * Update stats channels for a guild (rate-limit safe)
   * @param {import('discord.js').Guild} guild 
   */
  static async updateGuildStats(guild) {
    if (!guild) return;
    const config = DatabaseManager.getServerStats(guild.id);
    if (!config || !config.enabled || !config.channels) return;

    const botMember = guild.members.me;
    if (!botMember?.permissions.has(PermissionFlagsBits.ManageChannels)) return;

    try {
      const stats = await this.calculateStats(guild);
      const names = this.getFormattedNames(stats);

      const channelMapping = [
        { id: config.channels.totalMembers, targetName: names.totalMembers },
        { id: config.channels.humanMembers, targetName: names.humanMembers },
        { id: config.channels.botMembers, targetName: names.botMembers },
        { id: config.channels.boosts, targetName: names.boosts },
        { id: config.channels.goal, targetName: names.goal }
      ];

      for (const item of channelMapping) {
        if (!item.id) continue;
        const channel = guild.channels.cache.get(item.id) || await guild.channels.fetch(item.id).catch(() => null);
        if (channel && channel.name !== item.targetName) {
          await channel.setName(item.targetName, 'Live Server Stats auto-update').catch(err => {
            // Ignore rate limits or hierarchy errors silently in background
            if (err.status !== 429) {
              console.warn(`[STATS UPDATE WARNING] Could not rename channel ${item.id}:`, err.message);
            }
          });
        }
      }

      DatabaseManager.setServerStats(guild.id, { ...config, lastUpdated: Date.now() });
    } catch (error) {
      console.error(`[STATS UPDATE ERROR: ${guild.name}]`, error);
    }
  }

  /**
   * Remove and clean up stats channels
   * @param {import('discord.js').Guild} guild 
   */
  static async removeStats(guild) {
    const config = DatabaseManager.getServerStats(guild.id);
    if (!config) return false;

    if (config.channels) {
      for (const channelId of Object.values(config.channels)) {
        if (!channelId) continue;
        try {
          const ch = guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(() => null);
          if (ch) await ch.delete('Server stats disabled').catch(() => null);
        } catch {}
      }
    }

    if (config.categoryId) {
      try {
        const cat = guild.channels.cache.get(config.categoryId) || await guild.channels.fetch(config.categoryId).catch(() => null);
        if (cat) await cat.delete('Server stats disabled').catch(() => null);
      } catch {}
    }

    DatabaseManager.setServerStats(guild.id, {
      enabled: false,
      categoryId: null,
      channels: {},
      lastUpdated: Date.now()
    });

    return true;
  }

  /**
   * Start background periodic sync scheduler
   * @param {import('discord.js').Client} client 
   */
  static startStatsScheduler(client) {
    console.log('📊 [SERVER STATS] Live Counters Scheduler initiated (10m interval).');

    // Run first sync after 30 seconds
    setTimeout(async () => {
      for (const guild of client.guilds.cache.values()) {
        const config = DatabaseManager.getServerStats(guild.id);
        if (config?.enabled) {
          await this.updateGuildStats(guild).catch(() => null);
        }
      }
    }, 30000);

    // Periodic 10-minute interval
    setInterval(async () => {
      for (const guild of client.guilds.cache.values()) {
        const config = DatabaseManager.getServerStats(guild.id);
        if (config?.enabled) {
          await this.updateGuildStats(guild).catch(() => null);
        }
      }
    }, 10 * 60 * 1000);
  }
}

module.exports = ServerStats;
