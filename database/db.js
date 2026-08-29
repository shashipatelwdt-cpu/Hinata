const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dbFile = path.join(dataDir, 'database.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial in-memory data store structure
let store = {
  guild_settings: {},
  warnings: [],
  tickets: {},
  giveaways: {},
  invites: {},
  invite_members: {}
};

// Load database from file
function loadDatabase() {
  try {
    if (fs.existsSync(dbFile)) {
      const raw = fs.readFileSync(dbFile, 'utf8');
      const parsed = JSON.parse(raw);
      store = {
        guild_settings: parsed.guild_settings || {},
        warnings: parsed.warnings || [],
        tickets: parsed.tickets || {},
        giveaways: parsed.giveaways || {},
        invites: parsed.invites || {},
        invite_members: parsed.invite_members || {}
      };
    } else {
      saveDatabase();
    }
  } catch (error) {
    console.error('[DATABASE] Failed to load data file, initializing fresh store:', error);
    saveDatabase();
  }
}

// Atomic save to file
function saveDatabase() {
  try {
    const tempFile = `${dbFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf8');
    fs.renameSync(tempFile, dbFile);
  } catch (error) {
    console.error('[DATABASE] Error saving database:', error);
  }
}

// Initialize on require
loadDatabase();

class DatabaseManager {
  // Guild Settings Helper
  static getGuild(guildId) {
    if (!store.guild_settings[guildId]) {
      store.guild_settings[guildId] = {
        guild_id: guildId,
        modlog_channel: null,
        autorole: {
          enabled: false,
          humanRoleId: null,
          botRoleId: null
        },
        welcome: {},
        leave: {},
        automod: {},
        ticket: {},
        selfroles: {},
        rules: {}
      };
      saveDatabase();
    } else {
      if (!store.guild_settings[guildId].autorole) {
        store.guild_settings[guildId].autorole = {
          enabled: !!(store.guild_settings[guildId].welcome?.roleId || store.guild_settings[guildId].welcome?.botRoleId),
          humanRoleId: store.guild_settings[guildId].welcome?.roleId || null,
          botRoleId: store.guild_settings[guildId].welcome?.botRoleId || null
        };
        saveDatabase();
      }
      if (!store.guild_settings[guildId].rules) {
        store.guild_settings[guildId].rules = {};
        saveDatabase();
      }
    }
    return store.guild_settings[guildId];
  }

  static resetGuild(guildId) {
    store.guild_settings[guildId] = {
      guild_id: guildId,
      modlog_channel: null,
      autorole: {
        enabled: false,
        humanRoleId: null,
        botRoleId: null
      },
      welcome: {},
      leave: {},
      automod: {},
      ticket: {},
      selfroles: {},
      rules: {}
    };
    saveDatabase();
    return store.guild_settings[guildId];
  }

  static setModlogChannel(guildId, channelId) {
    const guild = this.getGuild(guildId);
    guild.modlog_channel = channelId;
    saveDatabase();
  }

  static setAutoroleConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.autorole = { ...(guild.autorole || {}), ...config };
    saveDatabase();
    return guild.autorole;
  }

  static getAutorole(guildId) {
    const guild = this.getGuild(guildId);
    return guild.autorole || { enabled: false, humanRoleId: null, botRoleId: null };
  }

  static setWelcomeConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.welcome = { ...(guild.welcome || {}), ...config };
    saveDatabase();
  }

  static setLeaveConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.leave = { ...(guild.leave || {}), ...config };
    saveDatabase();
  }

  static setAutomodConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.automod = { ...(guild.automod || {}), ...config };
    saveDatabase();
  }

  static setTicketConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.ticket = { ...(guild.ticket || {}), ...config };
    saveDatabase();
  }

  static setSelfRolesConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.selfroles = { ...(guild.selfroles || {}), ...config };
    saveDatabase();
  }

  static setServerStats(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.serverstats = { ...(guild.serverstats || {}), ...config };
    saveDatabase();
    return guild.serverstats;
  }

  static getServerStats(guildId) {
    const guild = this.getGuild(guildId);
    return guild.serverstats || { enabled: false, categoryId: null, channels: {} };
  }

  // Rules System
  static setRulesConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.rules = { ...(guild.rules || {}), ...config };
    saveDatabase();
    return guild.rules;
  }

  static getRulesConfig(guildId) {
    const guild = this.getGuild(guildId);
    return guild.rules || { enabled: false, channelId: null, verifyRoleId: null, templateId: null };
  }

  // Channel Muted Bots System
  static addMutedBot(guildId, channelId, botId, data = {}) {
    const guild = this.getGuild(guildId);
    if (!guild.channel_muted_bots) {
      guild.channel_muted_bots = {};
    }
    if (!guild.channel_muted_bots[channelId]) {
      guild.channel_muted_bots[channelId] = [];
    }
    guild.channel_muted_bots[channelId] = guild.channel_muted_bots[channelId].filter(b => b.botId !== botId);
    guild.channel_muted_bots[channelId].push({
      botId,
      botTag: data.botTag || 'Unknown Bot',
      channelId,
      reason: data.reason || 'Muted in channel by moderator',
      modId: data.modId || null,
      mutedAt: new Date().toISOString()
    });
    saveDatabase();
    return guild.channel_muted_bots[channelId];
  }

  static removeMutedBot(guildId, channelId, botId) {
    const guild = this.getGuild(guildId);
    if (!guild.channel_muted_bots || !guild.channel_muted_bots[channelId]) {
      return false;
    }
    const initialLen = guild.channel_muted_bots[channelId].length;
    guild.channel_muted_bots[channelId] = guild.channel_muted_bots[channelId].filter(b => b.botId !== botId);
    if (guild.channel_muted_bots[channelId].length === 0) {
      delete guild.channel_muted_bots[channelId];
    }
    const changed = initialLen !== (guild.channel_muted_bots[channelId]?.length || 0);
    if (changed) saveDatabase();
    return changed;
  }

  static getMutedBots(guildId, channelId = null) {
    const guild = this.getGuild(guildId);
    if (!guild.channel_muted_bots) return channelId ? [] : {};
    if (channelId) {
      return guild.channel_muted_bots[channelId] || [];
    }
    return guild.channel_muted_bots;
  }

  static isBotMutedInChannel(guildId, channelId, botId) {
    const guild = this.getGuild(guildId);
    if (!guild.channel_muted_bots || !guild.channel_muted_bots[channelId]) return false;
    return guild.channel_muted_bots[channelId].some(b => b.botId === botId);
  }

  // ==========================================
  // INVITE TRACKER METHODS
  // ==========================================

  static getInvites(guildId, userId) {
    if (!store.invites) store.invites = {};
    if (!store.invites[guildId]) store.invites[guildId] = {};
    const userStats = store.invites[guildId][userId] || {
      regular: 0,
      leaves: 0,
      fake: 0,
      bonus: 0
    };

    const regular = Math.max(0, userStats.regular || 0);
    const leaves = Math.max(0, userStats.leaves || 0);
    const fake = Math.max(0, userStats.fake || 0);
    const bonus = userStats.bonus || 0;
    // Net total real invites: (regular + bonus) - (leaves + fake)
    const total = Math.max(0, (regular + bonus) - (leaves + fake));

    return {
      regular,
      leaves,
      fake,
      bonus,
      total
    };
  }

  static addInvite(guildId, userId, isFake = false) {
    if (!store.invites) store.invites = {};
    if (!store.invites[guildId]) store.invites[guildId] = {};
    if (!store.invites[guildId][userId]) {
      store.invites[guildId][userId] = { regular: 0, leaves: 0, fake: 0, bonus: 0 };
    }

    if (isFake) {
      store.invites[guildId][userId].fake = (store.invites[guildId][userId].fake || 0) + 1;
    } else {
      store.invites[guildId][userId].regular = (store.invites[guildId][userId].regular || 0) + 1;
    }

    saveDatabase();
    return this.getInvites(guildId, userId);
  }

  static recordMemberJoin(guildId, memberId, inviterId, code = null, isFake = false) {
    if (!store.invite_members) store.invite_members = {};
    if (!store.invite_members[guildId]) store.invite_members[guildId] = {};

    store.invite_members[guildId][memberId] = {
      inviterId: inviterId || null,
      code: code || null,
      isFake: !!isFake,
      joinedAt: new Date().toISOString()
    };

    if (inviterId) {
      this.addInvite(guildId, inviterId, isFake);
    }

    saveDatabase();
    return store.invite_members[guildId][memberId];
  }

  static removeInvite(guildId, memberId) {
    if (!store.invite_members || !store.invite_members[guildId]) return null;
    const memberRecord = store.invite_members[guildId][memberId];

    if (memberRecord && memberRecord.inviterId) {
      const inviterId = memberRecord.inviterId;
      if (!store.invites) store.invites = {};
      if (!store.invites[guildId]) store.invites[guildId] = {};
      if (!store.invites[guildId][inviterId]) {
        store.invites[guildId][inviterId] = { regular: 0, leaves: 0, fake: 0, bonus: 0 };
      }

      store.invites[guildId][inviterId].leaves = (store.invites[guildId][inviterId].leaves || 0) + 1;
      saveDatabase();
      return { inviterId, stats: this.getInvites(guildId, inviterId) };
    }

    return null;
  }

  static addBonusInvites(guildId, userId, amount) {
    if (!store.invites) store.invites = {};
    if (!store.invites[guildId]) store.invites[guildId] = {};
    if (!store.invites[guildId][userId]) {
      store.invites[guildId][userId] = { regular: 0, leaves: 0, fake: 0, bonus: 0 };
    }

    store.invites[guildId][userId].bonus = (store.invites[guildId][userId].bonus || 0) + amount;
    saveDatabase();
    return this.getInvites(guildId, userId);
  }

  static resetInvites(guildId, userId = null) {
    if (!store.invites) store.invites = {};
    if (!store.invites[guildId]) store.invites[guildId] = {};

    if (userId) {
      store.invites[guildId][userId] = { regular: 0, leaves: 0, fake: 0, bonus: 0 };
      saveDatabase();
      return this.getInvites(guildId, userId);
    } else {
      store.invites[guildId] = {};
      if (store.invite_members && store.invite_members[guildId]) {
        store.invite_members[guildId] = {};
      }
      saveDatabase();
      return true;
    }
  }

  static getMemberInviter(guildId, memberId) {
    if (!store.invite_members || !store.invite_members[guildId]) return null;
    return store.invite_members[guildId][memberId] || null;
  }

  static getInviteLeaderboard(guildId, limit = 10) {
    if (!store.invites || !store.invites[guildId]) return [];
    const entries = Object.entries(store.invites[guildId]);

    const mapped = entries.map(([userId, stats]) => {
      const regular = Math.max(0, stats.regular || 0);
      const leaves = Math.max(0, stats.leaves || 0);
      const fake = Math.max(0, stats.fake || 0);
      const bonus = stats.bonus || 0;
      const total = Math.max(0, (regular + bonus) - (leaves + fake));
      return {
        userId,
        regular,
        leaves,
        fake,
        bonus,
        total
      };
    });

    // Filter users with at least 1 activity or net total and sort descending by total
    return mapped
      .filter(u => u.total > 0 || u.regular > 0 || u.bonus > 0 || u.leaves > 0)
      .sort((a, b) => b.total - a.total || b.regular - a.regular)
      .slice(0, limit);
  }

  static getUserInviteRank(guildId, userId) {
    const leaderboard = this.getInviteLeaderboard(guildId, 1000);
    const index = leaderboard.findIndex(u => u.userId === userId);
    return index !== -1 ? index + 1 : null;
  }

  // ==========================================
  // WARNINGS
  // ==========================================
  static addWarn(guildId, userId, modId, reason) {
    if (!Array.isArray(store.warnings)) store.warnings = [];
    const newId = store.warnings.length > 0 ? Math.max(...store.warnings.map(w => w.id || 0)) + 1 : 1;
    const warning = {
      id: newId,
      guild_id: guildId,
      user_id: userId,
      moderator_id: modId,
      reason: reason || 'No reason provided',
      created_at: new Date().toISOString()
    };
    store.warnings.push(warning);
    saveDatabase();
    return newId;
  }

  static getWarns(guildId, userId) {
    if (!Array.isArray(store.warnings)) store.warnings = [];
    return store.warnings
      .filter(w => w.guild_id === guildId && w.user_id === userId)
      .sort((a, b) => b.id - a.id);
  }

  static getWarnCount(guildId, userId) {
    return this.getWarns(guildId, userId).length;
  }

  static deleteWarn(guildId, warnId) {
    if (!Array.isArray(store.warnings)) return false;
    const initialLen = store.warnings.length;
    store.warnings = store.warnings.filter(w => !(w.guild_id === guildId && w.id === parseInt(warnId)));
    const changed = store.warnings.length < initialLen;
    if (changed) saveDatabase();
    return changed;
  }

  static clearWarns(guildId, userId) {
    if (!Array.isArray(store.warnings)) return 0;
    const initialLen = store.warnings.length;
    store.warnings = store.warnings.filter(w => !(w.guild_id === guildId && w.user_id === userId));
    const removedCount = initialLen - store.warnings.length;
    if (removedCount > 0) saveDatabase();
    return removedCount;
  }

  // ==========================================
  // TICKETS
  // ==========================================
  static createTicket(ticketId, guildId, channelId, userId, category) {
    if (!store.tickets) store.tickets = {};
    store.tickets[channelId] = {
      ticket_id: ticketId,
      guild_id: guildId,
      channel_id: channelId,
      user_id: userId,
      category: category,
      status: 'open',
      created_at: new Date().toISOString(),
      closed_at: null
    };
    saveDatabase();
    return store.tickets[channelId];
  }

  static getTicketByChannel(channelId) {
    if (!store.tickets) store.tickets = {};
    return store.tickets[channelId] || null;
  }

  static closeTicket(channelId) {
    if (store.tickets && store.tickets[channelId]) {
      store.tickets[channelId].status = 'closed';
      store.tickets[channelId].closed_at = new Date().toISOString();
      saveDatabase();
      return true;
    }
    return false;
  }

  static getUserOpenTickets(guildId, userId) {
    if (!store.tickets) return [];
    return Object.values(store.tickets).filter(
      t => t.guild_id === guildId && t.user_id === userId && t.status === 'open'
    );
  }

  // ==========================================
  // GIVEAWAYS
  // ==========================================
  static createGiveaway(messageId, guildId, channelId, prize, winnersCount, endsAt, hostedBy) {
    if (!store.giveaways) store.giveaways = {};
    store.giveaways[messageId] = {
      message_id: messageId,
      guild_id: guildId,
      channel_id: channelId,
      prize: prize,
      winners_count: winnersCount,
      ends_at: endsAt,
      hosted_by: hostedBy,
      ended: false
    };
    saveDatabase();
    return store.giveaways[messageId];
  }

  static getGiveaway(messageId) {
    if (!store.giveaways) store.giveaways = {};
    return store.giveaways[messageId] || null;
  }

  static getActiveGiveaways() {
    if (!store.giveaways) return [];
    return Object.values(store.giveaways).filter(g => !g.ended);
  }

  static endGiveaway(messageId) {
    if (store.giveaways && store.giveaways[messageId]) {
      store.giveaways[messageId].ended = true;
      saveDatabase();
      return true;
    }
    return false;
  }
}

module.exports = { DatabaseManager };
