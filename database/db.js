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
  invite_members: {},
  bot_meta: {},
  playlists: {},
  counting: {},
  afk: {},
  levels: {}
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
        invite_members: parsed.invite_members || {},
        bot_meta: parsed.bot_meta || {},
        playlists: parsed.playlists || {},
        counting: parsed.counting || {},
        afk: parsed.afk || {},
        levels: parsed.levels || {}
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
      } else if (!store.guild_settings[guildId].autorole.humanRoleId && store.guild_settings[guildId].welcome?.roleId) {
        store.guild_settings[guildId].autorole.humanRoleId = store.guild_settings[guildId].welcome.roleId;
        store.guild_settings[guildId].autorole.enabled = true;
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
    const autorole = guild.autorole || {};
    const humanRoleId = autorole.humanRoleId || guild.welcome?.roleId || null;
    const botRoleId = autorole.botRoleId || guild.welcome?.botRoleId || null;
    const enabled = (autorole.enabled === true) || (autorole.enabled !== false && (!!humanRoleId || !!botRoleId));

    return {
      enabled,
      humanRoleId,
      botRoleId
    };
  }

  static setWelcomeConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.welcome = { ...(guild.welcome || {}), ...config };

    // Auto-sync with autorole if roles are defined
    if (config.roleId || config.botRoleId) {
      if (!guild.autorole) {
        guild.autorole = { enabled: true, humanRoleId: null, botRoleId: null };
      }
      if (config.roleId) guild.autorole.humanRoleId = config.roleId;
      if (config.botRoleId) guild.autorole.botRoleId = config.botRoleId;
      guild.autorole.enabled = true;
    }

    saveDatabase();
    return guild.welcome;
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

  static syncGuildInvitesFromDiscord(guildId, discordInviteCounts = {}) {
    if (!store.invites) store.invites = {};
    if (!store.invites[guildId]) store.invites[guildId] = {};

    let syncedCount = 0;
    for (const [userId, uses] of Object.entries(discordInviteCounts)) {
      if (!store.invites[guildId][userId]) {
        store.invites[guildId][userId] = {
          regular: uses,
          leaves: 0,
          fake: 0,
          bonus: 0
        };
        syncedCount++;
      } else {
        const currentRegular = store.invites[guildId][userId].regular || 0;
        if (currentRegular < uses) {
          store.invites[guildId][userId].regular = uses;
          syncedCount++;
        }
      }
    }

    if (syncedCount > 0) {
      saveDatabase();
    }
    return syncedCount;
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

  // ==========================================
  // BOT METADATA (Releases & Updates)
  // ==========================================
  static getMeta(key) {
    if (!store.bot_meta) store.bot_meta = {};
    return store.bot_meta[key] || null;
  }

  static setMeta(key, value) {
    if (!store.bot_meta) store.bot_meta = {};
    store.bot_meta[key] = value;
    saveDatabase();
  }

  // ==========================================
  // SPOTIFY-STYLE CUSTOM USER PLAYLISTS
  // ==========================================
  static getUserPlaylists(userId) {
    if (!store.playlists) store.playlists = {};
    if (!store.playlists[userId]) return [];
    return Object.values(store.playlists[userId]);
  }

  static getPlaylist(userId, name) {
    if (!store.playlists) store.playlists = {};
    if (!store.playlists[userId]) return null;
    const key = String(name).trim().toLowerCase();
    return store.playlists[userId][key] || null;
  }

  static createPlaylist(userId, name, description = '') {
    if (!store.playlists) store.playlists = {};
    if (!store.playlists[userId]) store.playlists[userId] = {};

    const cleanName = String(name).trim();
    const key = cleanName.toLowerCase();

    if (store.playlists[userId][key]) {
      return { success: false, message: `A playlist named **${cleanName}** already exists!` };
    }

    const existingCount = Object.keys(store.playlists[userId]).length;
    if (existingCount >= 25) {
      return { success: false, message: 'You have reached the maximum limit of 25 personal playlists!' };
    }

    const newPlaylist = {
      name: cleanName,
      description: description || 'My custom personal playlist',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tracks: []
    };

    store.playlists[userId][key] = newPlaylist;
    saveDatabase();
    return { success: true, playlist: newPlaylist, message: `Playlist **${cleanName}** created successfully!` };
  }

  static deletePlaylist(userId, name) {
    if (!store.playlists || !store.playlists[userId]) return false;
    const key = String(name).trim().toLowerCase();
    if (store.playlists[userId][key]) {
      delete store.playlists[userId][key];
      saveDatabase();
      return true;
    }
    return false;
  }

  static addTrackToPlaylist(userId, name, track) {
    if (!store.playlists || !store.playlists[userId]) {
      return { success: false, message: 'Playlist not found!' };
    }
    const key = String(name).trim().toLowerCase();
    const pl = store.playlists[userId][key];
    if (!pl) {
      return { success: false, message: `Playlist **${name}** does not exist!` };
    }

    if (!Array.isArray(pl.tracks)) pl.tracks = [];

    if (pl.tracks.length >= 100) {
      return { success: false, message: `Playlist **${pl.name}** has reached the maximum 100 tracks limit!` };
    }

    const trackObj = {
      title: track.title || 'Untitled Song',
      url: track.url,
      duration: track.duration || 'Unknown',
      durationSec: track.durationSec || 0,
      thumbnail: track.thumbnail || null,
      author: track.author || 'Artist',
      added_at: new Date().toISOString()
    };

    pl.tracks.push(trackObj);
    pl.updated_at = new Date().toISOString();
    saveDatabase();
    return { success: true, track: trackObj, totalTracks: pl.tracks.length, message: `Added **${trackObj.title}** to **${pl.name}**!` };
  }

  static removeTrackFromPlaylist(userId, name, index) {
    if (!store.playlists || !store.playlists[userId]) {
      return { success: false, message: 'Playlist not found!' };
    }
    const key = String(name).trim().toLowerCase();
    const pl = store.playlists[userId][key];
    if (!pl || !Array.isArray(pl.tracks)) {
      return { success: false, message: `Playlist **${name}** does not exist!` };
    }

    const idx = parseInt(index, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= pl.tracks.length) {
      return { success: false, message: `Invalid track number! Please select between 1 and ${pl.tracks.length}.` };
    }

    const removed = pl.tracks.splice(idx, 1)[0];
    pl.updated_at = new Date().toISOString();
    saveDatabase();
    return { success: true, removedTrack: removed, totalTracks: pl.tracks.length, message: `Removed **${removed.title}** from **${pl.name}**.` };
  }

  static clearPlaylist(userId, name) {
    if (!store.playlists || !store.playlists[userId]) return false;
    const key = String(name).trim().toLowerCase();
    const pl = store.playlists[userId][key];
    if (!pl) return false;
    pl.tracks = [];
    pl.updated_at = new Date().toISOString();
    saveDatabase();
    return true;
  }

  // --- COUNTING SYSTEM HELPERS ---
  static getCounting(guildId) {
    if (!store.counting) store.counting = {};
    if (!store.counting[guildId]) {
      store.counting[guildId] = {
        channelId: null,
        currentCount: 0,
        lastUserId: null,
        highScore: 0,
        highScoreDate: null,
        totalCounts: 0,
        userStats: {}
      };
      saveDatabase();
    }
    return store.counting[guildId];
  }

  static setCounting(guildId, data) {
    const current = this.getCounting(guildId);
    store.counting[guildId] = { ...current, ...data };
    saveDatabase();
    return store.counting[guildId];
  }

  static recordCount(guildId, userId, number) {
    const data = this.getCounting(guildId);
    data.currentCount = number;
    data.lastUserId = userId;
    data.totalCounts = (data.totalCounts || 0) + 1;

    let isNewHighScore = false;
    if (number > (data.highScore || 0)) {
      data.highScore = number;
      data.highScoreDate = new Date().toISOString();
      isNewHighScore = true;
    }

    if (!data.userStats) data.userStats = {};
    if (!data.userStats[userId]) {
      data.userStats[userId] = { counts: 0, fails: 0, lastCountAt: null };
    }
    data.userStats[userId].counts = (data.userStats[userId].counts || 0) + 1;
    data.userStats[userId].lastCountAt = new Date().toISOString();

    saveDatabase();
    return { data, isNewHighScore };
  }

  static failCount(guildId, userId, reason = 'Wrong number') {
    const data = this.getCounting(guildId);
    const brokenAt = data.currentCount;
    const previousHighScore = data.highScore || 0;

    data.currentCount = 0;
    data.lastUserId = null;

    if (!data.userStats) data.userStats = {};
    if (!data.userStats[userId]) {
      data.userStats[userId] = { counts: 0, fails: 0, lastCountAt: null };
    }
    data.userStats[userId].fails = (data.userStats[userId].fails || 0) + 1;

    saveDatabase();
    return { brokenAt, previousHighScore, reason };
  }

  static getCountingLeaderboard(guildId, limit = 10) {
    const data = this.getCounting(guildId);
    if (!data.userStats) return [];
    return Object.entries(data.userStats)
      .map(([userId, stats]) => ({
        userId,
        counts: stats.counts || 0,
        fails: stats.fails || 0,
        lastCountAt: stats.lastCountAt
      }))
      .sort((a, b) => b.counts - a.counts)
      .slice(0, limit);
  }

  // --- PROFESSIONAL AFK SYSTEM HELPERS ---
  static getAfk(guildId, userId) {
    if (!store.afk) store.afk = {};
    if (!store.afk[guildId]) return null;
    return store.afk[guildId][userId] || null;
  }

  static setAfk(guildId, userId, afkData) {
    if (!store.afk) store.afk = {};
    if (!store.afk[guildId]) store.afk[guildId] = {};
    store.afk[guildId][userId] = {
      reason: afkData.reason || 'AFK',
      timestamp: afkData.timestamp || Date.now(),
      oldNick: afkData.oldNick || null,
      mentions: []
    };
    saveDatabase();
    return store.afk[guildId][userId];
  }

  static removeAfk(guildId, userId) {
    if (!store.afk || !store.afk[guildId] || !store.afk[guildId][userId]) return null;
    const removed = store.afk[guildId][userId];
    delete store.afk[guildId][userId];
    saveDatabase();
    return removed;
  }

  static addAfkMention(guildId, userId, mentionData) {
    if (!store.afk || !store.afk[guildId] || !store.afk[guildId][userId]) return false;
    const record = store.afk[guildId][userId];
    if (!Array.isArray(record.mentions)) record.mentions = [];
    record.mentions.push({
      authorId: mentionData.authorId,
      authorTag: mentionData.authorTag,
      content: mentionData.content ? mentionData.content.slice(0, 200) : '',
      channelId: mentionData.channelId,
      messageId: mentionData.messageId,
      timestamp: Date.now()
    });
    if (record.mentions.length > 15) {
      record.mentions.shift();
    }
    saveDatabase();
    return true;
  }

  static getGuildAfks(guildId) {
    if (!store.afk || !store.afk[guildId]) return [];
    return Object.entries(store.afk[guildId]).map(([userId, data]) => ({
      userId,
      ...data
    }));
  }

  // --- PROFESSIONAL LEVEL & XP SYSTEM HELPERS ---
  static getXpNeededForLevel(level) {
    const lvl = Math.max(0, parseInt(level) || 0);
    return 5 * (lvl * lvl) + 50 * lvl + 100;
  }

  static getLevelGuildData(guildId) {
    if (!store.levels) store.levels = {};
    if (!store.levels[guildId]) {
      store.levels[guildId] = {
        config: {
          enabled: true,
          channelId: null,
          roleRewards: {}
        },
        users: {}
      };
      saveDatabase();
    }
    return store.levels[guildId];
  }

  static setLevelConfig(guildId, configUpdates) {
    const data = this.getLevelGuildData(guildId);
    data.config = { ...data.config, ...configUpdates };
    saveDatabase();
    return data.config;
  }

  static addLevelRoleReward(guildId, level, roleId) {
    const data = this.getLevelGuildData(guildId);
    if (!data.config.roleRewards) data.config.roleRewards = {};
    data.config.roleRewards[String(level)] = roleId;
    saveDatabase();
    return data.config.roleRewards;
  }

  static removeLevelRoleReward(guildId, level) {
    const data = this.getLevelGuildData(guildId);
    if (data.config.roleRewards && data.config.roleRewards[String(level)]) {
      delete data.config.roleRewards[String(level)];
      saveDatabase();
      return true;
    }
    return false;
  }

  static getUserLevel(guildId, userId) {
    const data = this.getLevelGuildData(guildId);
    if (!data.users[userId]) {
      data.users[userId] = {
        xp: 0,
        level: 0,
        totalXp: 0,
        lastXpAt: 0
      };
      saveDatabase();
    }
    const user = data.users[userId];
    const neededXp = this.getXpNeededForLevel(user.level);
    return {
      ...user,
      neededXp
    };
  }

  static addXp(guildId, userId, amount = 20) {
    const data = this.getLevelGuildData(guildId);
    if (!data.users[userId]) {
      data.users[userId] = {
        xp: 0,
        level: 0,
        totalXp: 0,
        lastXpAt: 0
      };
    }
    const user = data.users[userId];
    user.xp = (user.xp || 0) + amount;
    user.totalXp = (user.totalXp || 0) + amount;
    user.lastXpAt = Date.now();

    let leveledUp = false;
    let oldLevel = user.level || 0;
    let needed = this.getXpNeededForLevel(user.level);

    while (user.xp >= needed) {
      user.xp -= needed;
      user.level += 1;
      leveledUp = true;
      needed = this.getXpNeededForLevel(user.level);
    }

    saveDatabase();

    return {
      leveledUp,
      oldLevel,
      newLevel: user.level,
      currentXp: user.xp,
      neededXp: needed,
      totalXp: user.totalXp
    };
  }

  static getLevelLeaderboard(guildId, limit = 10) {
    const data = this.getLevelGuildData(guildId);
    if (!data.users) return [];
    return Object.entries(data.users)
      .map(([userId, stats]) => ({
        userId,
        level: stats.level || 0,
        xp: stats.xp || 0,
        totalXp: stats.totalXp || 0
      }))
      .sort((a, b) => (b.totalXp - a.totalXp) || (b.level - a.level))
      .slice(0, limit);
  }

  static getUserRank(guildId, userId) {
    const data = this.getLevelGuildData(guildId);
    if (!data.users) return 1;
    const sorted = Object.entries(data.users)
      .map(([id, stats]) => ({ id, totalXp: stats.totalXp || 0 }))
      .sort((a, b) => b.totalXp - a.totalXp);
    const index = sorted.findIndex(item => item.id === userId);
    return index !== -1 ? index + 1 : sorted.length + 1;
  }
}

module.exports = { DatabaseManager };
