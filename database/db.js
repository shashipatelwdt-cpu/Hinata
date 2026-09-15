const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const backupsDir = path.join(dataDir, 'backups');
const dbFile = path.join(dataDir, 'database.json');
const backupFile = path.join(dataDir, 'database.json.bak');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
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
  levels: {},
  honor: {},
  cases: {},
  strikes: {},
  threat_watchlist: {}
};

function applyParsedStore(parsed) {
  if (!parsed || typeof parsed !== 'object') return;

  // 1. Seamlessly merge guild_settings to prevent losing any local or cloud guild configs
  const mergedGuildSettings = { ...(store.guild_settings || {}) };
  for (const [gId, gConfig] of Object.entries(parsed.guild_settings || {})) {
    mergedGuildSettings[gId] = {
      ...(mergedGuildSettings[gId] || {}),
      ...gConfig
    };
  }

  // 2. Deep-merge member levels to ensure zero XP or level data loss across redeployments
  const mergedLevels = { ...(store.levels || {}) };
  for (const [gId, gLevels] of Object.entries(parsed.levels || {})) {
    if (!mergedLevels[gId]) {
      mergedLevels[gId] = { ...gLevels };
    } else {
      for (const [uId, uData] of Object.entries(gLevels || {})) {
        // Keep the higher XP / progress if both exist
        if (!mergedLevels[gId][uId]) {
          mergedLevels[gId][uId] = { ...uData };
        } else {
          const currentXp = Number(mergedLevels[gId][uId].xp || 0);
          const incomingXp = Number(uData.xp || 0);
          if (incomingXp > currentXp) {
            mergedLevels[gId][uId] = { ...mergedLevels[gId][uId], ...uData };
          }
        }
      }
    }
  }

  // 3. Deep-merge honor progression
  const mergedHonor = { ...(store.honor || {}) };
  for (const [gId, gHonor] of Object.entries(parsed.honor || {})) {
    if (!mergedHonor[gId]) {
      mergedHonor[gId] = { ...gHonor };
    } else {
      mergedHonor[gId] = { ...mergedHonor[gId], ...gHonor };
    }
  }

  // 4. Merge moderation cases with deduplication
  const mergedCases = { ...(store.cases || {}) };
  for (const [gId, gCases] of Object.entries(parsed.cases || {})) {
    if (!mergedCases[gId] || !Array.isArray(mergedCases[gId])) {
      mergedCases[gId] = Array.isArray(gCases) ? [...gCases] : [];
    } else if (Array.isArray(gCases)) {
      const existingIds = new Set(mergedCases[gId].map(c => c.caseId));
      for (const c of gCases) {
        if (!existingIds.has(c.caseId)) {
          mergedCases[gId].push(c);
        }
      }
    }
  }

  // 5. Merge strikes
  const mergedStrikes = { ...(store.strikes || {}) };
  for (const [gId, gStrikes] of Object.entries(parsed.strikes || {})) {
    if (!mergedStrikes[gId]) {
      mergedStrikes[gId] = { ...gStrikes };
    } else {
      for (const [uId, uStrikes] of Object.entries(gStrikes || {})) {
        if (!mergedStrikes[gId][uId]) {
          mergedStrikes[gId][uId] = Array.isArray(uStrikes) ? [...uStrikes] : [];
        } else if (Array.isArray(uStrikes)) {
          const existingStrikeIds = new Set(mergedStrikes[gId][uId].map(s => s.id));
          for (const s of uStrikes) {
            if (!existingStrikeIds.has(s.id)) {
              mergedStrikes[gId][uId].push(s);
            }
          }
        }
      }
    }
  }

  // 6. Merge warnings
  let mergedWarnings = Array.isArray(store.warnings) ? [...store.warnings] : [];
  if (Array.isArray(parsed.warnings)) {
    const existingWarnIds = new Set(mergedWarnings.map(w => w.id));
    for (const w of parsed.warnings) {
      if (!existingWarnIds.has(w.id)) {
        mergedWarnings.push(w);
      }
    }
  }

  store = {
    guild_settings: mergedGuildSettings,
    warnings: mergedWarnings,
    tickets: parsed.tickets && Object.keys(parsed.tickets).length > 0 ? { ...(store.tickets || {}), ...parsed.tickets } : (store.tickets || {}),
    giveaways: parsed.giveaways && Object.keys(parsed.giveaways).length > 0 ? { ...(store.giveaways || {}), ...parsed.giveaways } : (store.giveaways || {}),
    invites: parsed.invites && Object.keys(parsed.invites).length > 0 ? { ...(store.invites || {}), ...parsed.invites } : (store.invites || {}),
    invite_members: parsed.invite_members && Object.keys(parsed.invite_members).length > 0 ? { ...(store.invite_members || {}), ...parsed.invite_members } : (store.invite_members || {}),
    bot_meta: { ...(store.bot_meta || {}), ...(parsed.bot_meta || {}) },
    playlists: parsed.playlists && Object.keys(parsed.playlists).length > 0 ? { ...(store.playlists || {}), ...parsed.playlists } : (store.playlists || {}),
    counting: { ...(store.counting || {}), ...(parsed.counting || {}) },
    afk: { ...(store.afk || {}), ...(parsed.afk || {}) },
    levels: mergedLevels,
    honor: mergedHonor,
    cases: mergedCases,
    strikes: mergedStrikes,
    threat_watchlist: { ...(store.threat_watchlist || {}), ...(parsed.threat_watchlist || {}) }
  };
}

function isValidDatabaseObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj) &&
    (obj.guild_settings || obj.levels || obj.warnings || obj.invites || obj.playlists || obj.tickets || obj.honor || obj.cases || obj.strikes);
}

// Multi-Stage Resilient Load Database with Zero Data Wipe Safeguards
function loadDatabase() {
  let loaded = false;

  // Stage 1: Try reading main dbFile
  if (fs.existsSync(dbFile)) {
    try {
      const raw = fs.readFileSync(dbFile, 'utf8').trim();
      if (raw.length > 0) {
        const parsed = JSON.parse(raw);
        if (isValidDatabaseObject(parsed)) {
          applyParsedStore(parsed);
          loaded = true;
          // Maintain a known-good backup mirror
          try {
            fs.copyFileSync(dbFile, backupFile);
          } catch {}
        } else {
          console.warn('[DATABASE WARNING] database.json exists but contains unexpected structure.');
        }
      }
    } catch (error) {
      console.error('[DATABASE CORRUPTION WARNING] Error reading database.json:', error.message);
      // Quarantine the corrupted file so ZERO data is lost
      try {
        const quarantine = path.join(dataDir, `database.corrupted.${Date.now()}.json`);
        fs.copyFileSync(dbFile, quarantine);
        console.warn(`[DATABASE RECOVERY] Corrupted file quarantined as: ${path.basename(quarantine)}`);
      } catch {}
    }
  }

  // Stage 2: If main failed, try fallback backup file (database.json.bak)
  if (!loaded && fs.existsSync(backupFile)) {
    try {
      console.log('[DATABASE RECOVERY] Attempting restore from database.json.bak...');
      const rawBak = fs.readFileSync(backupFile, 'utf8').trim();
      if (rawBak.length > 0) {
        const parsedBak = JSON.parse(rawBak);
        if (isValidDatabaseObject(parsedBak)) {
          applyParsedStore(parsedBak);
          loaded = true;
          console.log('✅ [DATABASE RECOVERY] Restored successfully from database.json.bak!');
          try {
            fs.copyFileSync(backupFile, dbFile);
          } catch {}
        }
      }
    } catch (bakErr) {
      console.error('[DATABASE RECOVERY] Failed reading backup file:', bakErr.message);
    }
  }

  // Stage 3: If still not loaded, scan rolling snapshots in data/backups/
  if (!loaded && fs.existsSync(backupsDir)) {
    try {
      const snapshotFiles = fs.readdirSync(backupsDir)
        .filter(f => f.startsWith('database-') && f.endsWith('.json'))
        .sort()
        .reverse();

      for (const snapFile of snapshotFiles) {
        try {
          const snapPath = path.join(backupsDir, snapFile);
          const rawSnap = fs.readFileSync(snapPath, 'utf8').trim();
          if (rawSnap.length > 0) {
            const parsedSnap = JSON.parse(rawSnap);
            if (isValidDatabaseObject(parsedSnap)) {
              applyParsedStore(parsedSnap);
              loaded = true;
              console.log(`✅ [DATABASE RECOVERY] Restored successfully from snapshot: ${snapFile}!`);
              try {
                fs.copyFileSync(snapPath, dbFile);
                fs.copyFileSync(snapPath, backupFile);
              } catch {}
              break;
            }
          }
        } catch {}
      }
    } catch {}
  }

  // Final check: If completely fresh start (first install)
  if (!loaded) {
    if (!fs.existsSync(dbFile)) {
      console.log('[DATABASE] Fresh install detected: creating initial database.json.');
      saveDatabaseDirect();
    } else {
      console.error('🚨 [DATABASE CRITICAL] Could not parse database. Retaining current in-memory store without overwriting disk.');
    }
  }
}

// Rolling 30-minute backup snapshots
let lastSnapshotTime = 0;
function createPeriodicSnapshot() {
  const now = Date.now();
  if (now - lastSnapshotTime < 30 * 60 * 1000) return; // 30 mins
  lastSnapshotTime = now;

  try {
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const snapPath = path.join(backupsDir, `database-${dateStr}.json`);
    fs.copyFileSync(dbFile, snapPath);

    // Keep only last 10 snapshots
    const snapshots = fs.readdirSync(backupsDir)
      .filter(f => f.startsWith('database-') && f.endsWith('.json'))
      .sort();

    while (snapshots.length > 10) {
      const oldest = snapshots.shift();
      try { fs.unlinkSync(path.join(backupsDir, oldest)); } catch {}
    }
  } catch {}
}

// Resilient Debounced Atomic Save with Windows/OneDrive collision handling
let saveDebounceTimer = null;
let isSavingActive = false;
let hasQueuedSave = false;

function scheduleDebouncedSave() {
  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(() => {
    saveDebounceTimer = null;
    saveDatabaseDirect();
  }, 1000); // 1-second debounce prevents rapid disk thrashing
}

function saveDatabaseDirect() {
  if (isSavingActive) {
    hasQueuedSave = true;
    return;
  }
  isSavingActive = true;

  try {
    const dataStr = JSON.stringify(store, null, 2);
    const tempFile = path.join(dataDir, `db-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.tmp`);

    fs.writeFileSync(tempFile, dataStr, 'utf8');

    // Windows/OneDrive safe atomic rename with copy fallback
    let saved = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        fs.renameSync(tempFile, dbFile);
        saved = true;
        break;
      } catch (err) {
        // Handle Windows EPERM / EBUSY
        try {
          fs.copyFileSync(tempFile, dbFile);
          try { fs.unlinkSync(tempFile); } catch {}
          saved = true;
          break;
        } catch {}
      }
    }

    if (!saved) {
      // Last resort direct write
      fs.writeFileSync(dbFile, dataStr, 'utf8');
      try { fs.unlinkSync(tempFile); } catch {}
    }

    // Maintain .bak mirror
    try {
      fs.copyFileSync(dbFile, backupFile);
    } catch {}

    createPeriodicSnapshot();
  } catch (error) {
    console.error('[DATABASE SAVE ERROR]:', error.message);
  } finally {
    isSavingActive = false;
    if (hasQueuedSave) {
      hasQueuedSave = false;
      scheduleDebouncedSave();
    }
  }
}

let MongoClient = null;
try {
  MongoClient = require('mongodb').MongoClient;
} catch {}

let mongoClient = null;
let mongoDb = null;
let mongoCollection = null;
let isMongoConnected = false;
let mongoSyncTimer = null;
let isMongoSyncing = false;
let lastCloudSyncTime = 0;

async function initMongoConnection() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.log('[DATABASE] Running in local file mode (data/database.json).');
    console.log('💡 [DATABASE CLOUD TIP] For permanent 24/7 data persistence on Render (never lose levels/XP on deploy), set MONGODB_URI in your environment variables.');
    return;
  }
  if (!MongoClient) {
    console.warn('⚠️ [DATABASE WARNING] MONGODB_URI is provided but "mongodb" package is not installed.');
    return;
  }

  try {
    console.log('🌐 [DATABASE CLOUD] Connecting to MongoDB Atlas for permanent cloud storage...');
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000
    });
    await mongoClient.connect();
    mongoDb = mongoClient.db(process.env.MONGODB_DB_NAME || 'apex_discord_bot');
    mongoCollection = mongoDb.collection('bot_store');
    isMongoConnected = true;

    // Load cloud document
    const cloudDoc = await mongoCollection.findOne({ _id: 'main_store' });
    if (cloudDoc && isValidDatabaseObject(cloudDoc.store)) {
      applyParsedStore(cloudDoc.store);
      lastCloudSyncTime = Date.now();
      console.log('✅ [DATABASE CLOUD] Connected to MongoDB Atlas! Synced cloud store to memory & local mirror.');
      saveDatabaseDirect();
    } else {
      // First-time sync: push existing local store to cloud
      await mongoCollection.updateOne(
        { _id: 'main_store' },
        { $set: { store, updatedAt: new Date(), createdAt: new Date() } },
        { upsert: true }
      );
      lastCloudSyncTime = Date.now();
      console.log('✅ [DATABASE CLOUD] Connected to MongoDB Atlas! Initialized cloud store with existing local data.');
    }

    // Periodic 5-minute cloud safeguard sync
    setInterval(() => {
      if (isMongoConnected) {
        syncToMongo().catch(() => null);
      }
    }, 5 * 60 * 1000);
  } catch (err) {
    console.error('❌ [DATABASE CLOUD ERROR] Failed to connect to MongoDB Atlas:', err.message);
    console.log('🔄 [DATABASE RECOVERY] Continuing with local database.json storage.');
    isMongoConnected = false;
  }
}

function scheduleMongoSync() {
  if (!isMongoConnected || !mongoCollection) return;
  if (mongoSyncTimer) clearTimeout(mongoSyncTimer);
  mongoSyncTimer = setTimeout(async () => {
    mongoSyncTimer = null;
    await syncToMongo();
  }, 2500); // 2.5s debounced sync prevents MongoDB connection overload
}

async function syncToMongo() {
  if (!isMongoConnected || !mongoCollection || isMongoSyncing) return;
  isMongoSyncing = true;
  try {
    await mongoCollection.updateOne(
      { _id: 'main_store' },
      { $set: { store, updatedAt: new Date() } },
      { upsert: true }
    );
    lastCloudSyncTime = Date.now();
  } catch (err) {
    console.error('⚠️ [DATABASE CLOUD SYNC ERROR]:', err.message);
  } finally {
    isMongoSyncing = false;
  }
}

function saveDatabase(immediate = false) {
  if (immediate) {
    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
      saveDebounceTimer = null;
    }
    saveDatabaseDirect();
    if (isMongoConnected) {
      syncToMongo().catch(() => null);
    }
  } else {
    scheduleDebouncedSave();
    if (isMongoConnected) {
      scheduleMongoSync();
    }
  }
}

// Flush pending changes immediately on process termination
async function flushOnProcessExit() {
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
    saveDebounceTimer = null;
  }
  saveDatabaseDirect();
  if (isMongoConnected && mongoCollection) {
    try {
      await mongoCollection.updateOne(
        { _id: 'main_store' },
        { $set: { store, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch {}
  }
}

process.on('exit', () => { flushOnProcessExit(); });
process.on('beforeExit', () => { flushOnProcessExit(); });
process.on('SIGINT', async () => { await flushOnProcessExit(); process.exit(0); });
process.on('SIGTERM', async () => { await flushOnProcessExit(); process.exit(0); });

// Initialize local store on require & connect to cloud if configured
loadDatabase();
initMongoConnection().catch(err => {
  console.error('[DATABASE INIT ASYNC ERROR]:', err.message);
});

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

  // ==========================================
  // ARCANE-STYLE LEVEL & XP SYSTEM HELPERS
  // ==========================================
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
          channelType: 'current', // 'current' | 'custom' | 'dm' | 'none'
          channelId: null,
          message: 'Congrats {user} it looks like you levelled up! You are now level {level}, keep being active to gain more XP and unlock more roles!',
          multiplier: 1.0,
          stackRoles: true,
          ignoredChannels: [],
          ignoredRoles: [],
          roleRewards: {}
        },
        users: {}
      };
      saveDatabase();
    } else {
      const cfg = store.levels[guildId].config || {};
      if (cfg.enabled === undefined) cfg.enabled = true;
      if (!cfg.channelType) cfg.channelType = cfg.channelId ? 'custom' : 'current';
      if (!cfg.message) cfg.message = 'Congrats {user} it looks like you levelled up! You are now level {level}, keep being active to gain more XP and unlock more roles!';
      if (cfg.multiplier === undefined) cfg.multiplier = 1.0;
      if (cfg.stackRoles === undefined) cfg.stackRoles = true;
      if (!Array.isArray(cfg.ignoredChannels)) cfg.ignoredChannels = [];
      if (!Array.isArray(cfg.ignoredRoles)) cfg.ignoredRoles = [];
      if (!cfg.roleRewards || typeof cfg.roleRewards !== 'object') cfg.roleRewards = {};
      store.levels[guildId].config = cfg;
      if (!store.levels[guildId].users) store.levels[guildId].users = {};
    }
    return store.levels[guildId];
  }

  static setLevelConfig(guildId, configUpdates) {
    const data = this.getLevelGuildData(guildId);
    data.config = { ...data.config, ...configUpdates };
    saveDatabase(true);
    return data.config;
  }

  static setLevelMessage(guildId, messageTemplate) {
    const data = this.getLevelGuildData(guildId);
    data.config.message = messageTemplate || 'GG {user}, you just leveled up to **level {level}**!';
    saveDatabase(true);
    return data.config.message;
  }

  static addIgnoredChannel(guildId, channelId) {
    const data = this.getLevelGuildData(guildId);
    if (!Array.isArray(data.config.ignoredChannels)) data.config.ignoredChannels = [];
    if (!data.config.ignoredChannels.includes(channelId)) {
      data.config.ignoredChannels.push(channelId);
      saveDatabase(true);
      return true;
    }
    return false;
  }

  static removeIgnoredChannel(guildId, channelId) {
    const data = this.getLevelGuildData(guildId);
    if (!Array.isArray(data.config.ignoredChannels)) return false;
    const initialLen = data.config.ignoredChannels.length;
    data.config.ignoredChannels = data.config.ignoredChannels.filter(id => id !== channelId);
    if (data.config.ignoredChannels.length < initialLen) {
      saveDatabase(true);
      return true;
    }
    return false;
  }

  static addIgnoredRole(guildId, roleId) {
    const data = this.getLevelGuildData(guildId);
    if (!Array.isArray(data.config.ignoredRoles)) data.config.ignoredRoles = [];
    if (!data.config.ignoredRoles.includes(roleId)) {
      data.config.ignoredRoles.push(roleId);
      saveDatabase(true);
      return true;
    }
    return false;
  }

  static removeIgnoredRole(guildId, roleId) {
    const data = this.getLevelGuildData(guildId);
    if (!Array.isArray(data.config.ignoredRoles)) return false;
    const initialLen = data.config.ignoredRoles.length;
    data.config.ignoredRoles = data.config.ignoredRoles.filter(id => id !== roleId);
    if (data.config.ignoredRoles.length < initialLen) {
      saveDatabase(true);
      return true;
    }
    return false;
  }

  static addLevelRoleReward(guildId, level, roleId) {
    const data = this.getLevelGuildData(guildId);
    if (!data.config.roleRewards) data.config.roleRewards = {};
    data.config.roleRewards[String(level)] = roleId;
    saveDatabase(true);
    return data.config.roleRewards;
  }

  static removeLevelRoleReward(guildId, level) {
    const data = this.getLevelGuildData(guildId);
    if (data.config.roleRewards && data.config.roleRewards[String(level)]) {
      delete data.config.roleRewards[String(level)];
      saveDatabase(true);
      return true;
    }
    return false;
  }

  static getUserLevel(guildId, userId) {
    const data = this.getLevelGuildData(guildId);
    const now = Date.now();
    if (!data.users[userId]) {
      data.users[userId] = {
        xp: 0,
        level: 0,
        totalXp: 0,
        weeklyXp: 0,
        weeklyResetAt: now + 7 * 24 * 60 * 60 * 1000,
        lastXpAt: 0
      };
      saveDatabase();
    }
    const user = data.users[userId];
    if (!user.weeklyResetAt || now > user.weeklyResetAt) {
      user.weeklyXp = 0;
      user.weeklyResetAt = now + 7 * 24 * 60 * 60 * 1000;
      saveDatabase();
    }
    const neededXp = this.getXpNeededForLevel(user.level);
    return {
      ...user,
      weeklyXp: user.weeklyXp || 0,
      neededXp,
      tier: this.getLevelTier(user.level)
    };
  }

  static getLevelTier(level = 0) {
    if (level >= 100) return { name: 'Immortal', badge: '⚡', color: '#FFD700', minLevel: 100 };
    if (level >= 75) return { name: 'Grandmaster', badge: '🌌', color: '#9B59B6', minLevel: 75 };
    if (level >= 50) return { name: 'Master', badge: '👑', color: '#E91E63', minLevel: 50 };
    if (level >= 30) return { name: 'Diamond', badge: '🔮', color: '#00D2FF', minLevel: 30 };
    if (level >= 20) return { name: 'Platinum', badge: '💎', color: '#2ECC71', minLevel: 20 };
    if (level >= 10) return { name: 'Gold', badge: '🥇', color: '#F1C40F', minLevel: 10 };
    if (level >= 5) return { name: 'Silver', badge: '🥈', color: '#BDC3C7', minLevel: 5 };
    return { name: 'Bronze', badge: '🥉', color: '#CD7F32', minLevel: 0 };
  }

  static setUserRankTheme(guildId, userId, theme = {}) {
    const data = this.getLevelGuildData(guildId);
    if (!data.users[userId]) {
      this.getUserLevel(guildId, userId);
    }
    data.users[userId].theme = {
      ...(data.users[userId].theme || {}),
      ...theme
    };
    saveDatabase();
    return data.users[userId].theme;
  }

  static getUserRankTheme(guildId, userId) {
    const data = this.getLevelGuildData(guildId);
    return data.users?.[userId]?.theme || {};
  }

  static setUserLevel(guildId, userId, targetLevel, targetXp = 0) {
    const data = this.getLevelGuildData(guildId);
    if (!data.users[userId]) {
      this.getUserLevel(guildId, userId);
    }
    const user = data.users[userId];
    user.level = Math.max(0, parseInt(targetLevel) || 0);
    user.xp = Math.max(0, parseInt(targetXp) || 0);
    
    // Recalculate total XP
    let calculatedTotal = user.xp;
    for (let l = 0; l < user.level; l++) {
      calculatedTotal += this.getXpNeededForLevel(l);
    }
    user.totalXp = calculatedTotal;
    saveDatabase(true);
    return user;
  }

  static addXpToUser(guildId, userId, amount) {
    const addAmt = Math.max(0, parseInt(amount) || 0);
    return this.addXp(guildId, userId, addAmt, true);
  }

  static removeXpFromUser(guildId, userId, amount) {
    const data = this.getLevelGuildData(guildId);
    const user = this.getUserLevel(guildId, userId);
    const subAmt = Math.max(0, parseInt(amount) || 0);

    const oldLevel = user.level || 0;
    const newTotal = Math.max(0, (user.totalXp || 0) - subAmt);

    let calculatedLevel = 0;
    let remainingXp = newTotal;
    while (remainingXp >= this.getXpNeededForLevel(calculatedLevel)) {
      remainingXp -= this.getXpNeededForLevel(calculatedLevel);
      calculatedLevel++;
    }

    data.users[userId].level = calculatedLevel;
    data.users[userId].xp = remainingXp;
    data.users[userId].totalXp = newTotal;
    saveDatabase(true);

    return {
      userId,
      oldLevel,
      newLevel: calculatedLevel,
      currentXp: remainingXp,
      neededXp: this.getXpNeededForLevel(calculatedLevel),
      totalXp: newTotal
    };
  }

  static resetUserLevel(guildId, userId) {
    const data = this.getLevelGuildData(guildId);
    if (data.users && data.users[userId]) {
      data.users[userId] = {
        xp: 0,
        level: 0,
        totalXp: 0,
        lastXpAt: 0,
        theme: data.users[userId].theme || {}
      };
      saveDatabase(true);
      return true;
    }
    return false;
  }

  static addXp(guildId, userId, amount = 20, bypassMultiplier = false) {
    const data = this.getLevelGuildData(guildId);
    const now = Date.now();
    if (!data.users[userId]) {
      data.users[userId] = {
        xp: 0,
        level: 0,
        totalXp: 0,
        weeklyXp: 0,
        weeklyResetAt: now + 7 * 24 * 60 * 60 * 1000,
        lastXpAt: 0
      };
    }
    const user = data.users[userId];
    if (!user.weeklyResetAt || now > user.weeklyResetAt) {
      user.weeklyXp = 0;
      user.weeklyResetAt = now + 7 * 24 * 60 * 60 * 1000;
    }

    const multiplier = bypassMultiplier ? 1.0 : Math.max(0.1, parseFloat(data.config?.multiplier) || 1.0);
    const finalAmount = Math.max(1, Math.round(amount * multiplier));

    user.xp = (user.xp || 0) + finalAmount;
    user.totalXp = (user.totalXp || 0) + finalAmount;
    user.weeklyXp = (user.weeklyXp || 0) + finalAmount;
    user.lastXpAt = now;

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
      totalXp: user.totalXp,
      weeklyXp: user.weeklyXp,
      earnedXp: finalAmount,
      tier: this.getLevelTier(user.level),
      oldTier: this.getLevelTier(oldLevel)
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
        totalXp: stats.totalXp || 0,
        weeklyXp: stats.weeklyXp || 0,
        tier: this.getLevelTier(stats.level || 0)
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

  static getUserWeeklyRank(guildId, userId) {
    const data = this.getLevelGuildData(guildId);
    if (!data.users) return 1;
    const now = Date.now();
    const sorted = Object.entries(data.users)
      .map(([id, stats]) => {
        const isExpired = stats.weeklyResetAt && now > stats.weeklyResetAt;
        const weeklyXp = isExpired ? 0 : (stats.weeklyXp || 0);
        return { id, weeklyXp };
      })
      .sort((a, b) => b.weeklyXp - a.weeklyXp);
    const index = sorted.findIndex(item => item.id === userId);
    return index !== -1 ? index + 1 : sorted.length + 1;
  }

  // ==========================================
  // HONOR & REPUTATION SYSTEM
  // ==========================================
  static calculateHonorLevel(points) {
    if (points >= 100) return 5;
    if (points >= 50) return 4;
    if (points >= 25) return 3;
    if (points >= 10) return 2;
    return 1;
  }

  static getHonorPointsForNextLevel(level) {
    switch (level) {
      case 1: return { currentTierBase: 0, nextTierReq: 10, nextLevel: 2, title: 'Respected' };
      case 2: return { currentTierBase: 10, nextTierReq: 25, nextLevel: 3, title: 'Honorable' };
      case 3: return { currentTierBase: 25, nextTierReq: 50, nextLevel: 4, title: 'Distinguished' };
      case 4: return { currentTierBase: 50, nextTierReq: 100, nextLevel: 5, title: 'Radiant Paragon' };
      case 5: return { currentTierBase: 100, nextTierReq: 100, nextLevel: 5, title: 'Radiant Paragon (Max Tier)' };
      default: return { currentTierBase: 0, nextTierReq: 10, nextLevel: 2, title: 'Respected' };
    }
  }

  static getHonorConfig(guildId) {
    const guild = this.getGuild(guildId);
    if (!guild.honor_config) {
      guild.honor_config = {
        enabled: true,
        channelId: null,
        roles: {
          '2': null,
          '3': null,
          '4': null,
          '5': null
        },
        stackRoles: true,
        dailyTokens: 3
      };
    }
    return guild.honor_config;
  }

  static setHonorConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.honor_config = { ...(guild.honor_config || this.getHonorConfig(guildId)), ...config };
    saveDatabase();
    return guild.honor_config;
  }

  static getHonorUser(guildId, userId) {
    if (!store.honor) store.honor = {};
    if (!store.honor[guildId]) store.honor[guildId] = {};

    const now = Date.now();
    const defaultData = {
      points: 0,
      level: 1,
      categories: {
        friendly: 0,
        shotcaller: 0,
        helpful: 0,
        mvp: 0
      },
      tokensRemaining: 3,
      tokenResetAt: now + (24 * 60 * 60 * 1000),
      lastGivenTo: {},
      history: []
    };

    if (!store.honor[guildId][userId]) {
      store.honor[guildId][userId] = defaultData;
      saveDatabase();
      return store.honor[guildId][userId];
    }

    const userData = store.honor[guildId][userId];
    // Reset daily tokens if 24 hours have elapsed
    if (now > (userData.tokenResetAt || 0)) {
      userData.tokensRemaining = 3;
      userData.tokenResetAt = now + (24 * 60 * 60 * 1000);
      saveDatabase();
    }

    if (!userData.categories) {
      userData.categories = { friendly: 0, shotcaller: 0, helpful: 0, mvp: 0 };
    }
    if (typeof userData.tokensRemaining !== 'number') {
      userData.tokensRemaining = 3;
    }

    return userData;
  }

  static addHonor(guildId, targetUserId, senderUserId, category = 'friendly', reason = '') {
    if (!store.honor) store.honor = {};
    if (!store.honor[guildId]) store.honor[guildId] = {};

    const sender = this.getHonorUser(guildId, senderUserId);
    const target = this.getHonorUser(guildId, targetUserId);

    // 1. Check daily tokens
    if (sender.tokensRemaining <= 0) {
      const remainingMs = Math.max(0, (sender.tokenResetAt || Date.now()) - Date.now());
      return {
        success: false,
        error: 'NO_TOKENS',
        resetInMs: remainingMs
      };
    }

    // 2. Check 24-hour friend cooldown
    const lastGivenTime = sender.lastGivenTo?.[targetUserId] || 0;
    const cooldownMs = 24 * 60 * 60 * 1000;
    if (Date.now() - lastGivenTime < cooldownMs) {
      const remainingMs = cooldownMs - (Date.now() - lastGivenTime);
      return {
        success: false,
        error: 'USER_COOLDOWN',
        resetInMs: remainingMs
      };
    }

    // Deduct token from sender and record timestamp
    sender.tokensRemaining = Math.max(0, sender.tokensRemaining - 1);
    if (!sender.lastGivenTo) sender.lastGivenTo = {};
    sender.lastGivenTo[targetUserId] = Date.now();

    // Update target points and category
    const validCat = ['friendly', 'shotcaller', 'helpful', 'mvp'].includes(category.toLowerCase())
      ? category.toLowerCase()
      : 'friendly';

    target.points = (target.points || 0) + 1;
    target.categories[validCat] = (target.categories[validCat] || 0) + 1;

    // Record history
    if (!target.history) target.history = [];
    target.history.unshift({
      fromUserId: senderUserId,
      category: validCat,
      reason: reason ? reason.slice(0, 150) : null,
      timestamp: Date.now()
    });
    if (target.history.length > 10) target.history = target.history.slice(0, 10);

    const oldLevel = target.level || 1;
    const newLevel = this.calculateHonorLevel(target.points);
    const leveledUp = newLevel > oldLevel;
    target.level = newLevel;

    saveDatabase();

    return {
      success: true,
      targetUserId,
      senderUserId,
      category: validCat,
      points: target.points,
      level: target.level,
      oldLevel,
      leveledUp,
      tokensLeft: sender.tokensRemaining
    };
  }

  static getHonorLeaderboard(guildId, limit = 10) {
    if (!store.honor || !store.honor[guildId]) return [];
    const entries = Object.entries(store.honor[guildId]);

    return entries
      .map(([userId, data]) => ({
        userId,
        points: data.points || 0,
        level: data.level || 1,
        categories: data.categories || { friendly: 0, shotcaller: 0, helpful: 0, mvp: 0 }
      }))
      .filter(u => u.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit);
  }

  static getUserHonorRank(guildId, userId) {
    const leaderboard = this.getHonorLeaderboard(guildId, 1000);
    const index = leaderboard.findIndex(u => u.userId === userId);
    return index !== -1 ? index + 1 : null;
  }

  static resetHonorUser(guildId, userId) {
    if (store.honor && store.honor[guildId] && store.honor[guildId][userId]) {
      delete store.honor[guildId][userId];
      saveDatabase();
      return true;
    }
    return false;
  }

  // ==========================================
  // HUMAN-LIKE MODERATION & CASE SYSTEM
  // ==========================================

  static getHumanModConfig(guildId) {
    const guild = this.getGuild(guildId);
    const defaults = {
      enabled: true,
      strikeDecayDays: 7,
      heatMonitorEnabled: true,
      heatThreshold: 8, // messages within 10s
      antiVoiceHopEnabled: true,
      antiRaidThreshold: 75, // threat score > 75 triggers quarantine
      appealChannelId: null
    };
    return { ...defaults, ...(guild.human_mod || {}) };
  }

  static setHumanModConfig(guildId, config) {
    const guild = this.getGuild(guildId);
    guild.human_mod = { ...(guild.human_mod || {}), ...config };
    saveDatabase();
    return guild.human_mod;
  }

  static addCase(guildId, data) {
    if (!store.cases) store.cases = {};
    if (!Array.isArray(store.cases[guildId])) store.cases[guildId] = [];

    const existing = store.cases[guildId];
    const maxNum = existing.length > 0 ? Math.max(...existing.map(c => c.id || 0)) : 0;
    const num = maxNum + 1;
    const caseId = `CASE-${1000 + num}`;

    const newCase = {
      id: num,
      caseId,
      guildId,
      userId: data.userId,
      userTag: data.userTag || 'Unknown User',
      modId: data.modId || 'AUTOMOD',
      modTag: data.modTag || 'RAW AutoMod',
      action: data.action || 'Warning',
      reason: data.reason || 'No reason provided',
      detail: data.detail || null,
      channelId: data.channelId || null,
      messageId: data.messageId || null,
      duration: data.duration || null,
      strikeNumber: data.strikeNumber || null,
      timestamp: new Date().toISOString(),
      status: 'active',
      pardonedAt: null,
      pardonedBy: null,
      pardonReason: null,
      appeal: null
    };

    store.cases[guildId].push(newCase);
    saveDatabase();
    return newCase;
  }

  static getCase(guildId, caseIdentifier) {
    if (!store.cases || !Array.isArray(store.cases[guildId])) return null;
    const search = String(caseIdentifier).trim().toUpperCase();
    return store.cases[guildId].find(c => 
      c.caseId.toUpperCase() === search || 
      String(c.id) === search ||
      c.caseId.toUpperCase() === `CASE-${search}`
    ) || null;
  }

  static findCaseGlobally(caseIdentifier) {
    if (!store.cases) return null;
    const search = String(caseIdentifier).trim().toUpperCase();
    for (const [gId, cases] of Object.entries(store.cases)) {
      if (Array.isArray(cases)) {
        const match = cases.find(c =>
          c.caseId.toUpperCase() === search ||
          String(c.id) === search ||
          c.caseId.toUpperCase() === `CASE-${search}`
        );
        if (match) return { guildId: gId, modCase: match };
      }
    }
    return null;
  }

  static getCases(guildId, userId = null, limit = 20) {
    if (!store.cases || !Array.isArray(store.cases[guildId])) return [];
    let list = store.cases[guildId];
    if (userId) {
      list = list.filter(c => c.userId === userId);
    }
    return list.slice().sort((a, b) => b.id - a.id).slice(0, limit);
  }

  static updateCase(guildId, caseIdentifier, updates = {}) {
    const modCase = this.getCase(guildId, caseIdentifier);
    if (!modCase) return null;
    Object.assign(modCase, updates);
    saveDatabase();
    return modCase;
  }

  static pardonCase(guildId, caseIdentifier, modId, modTag, reason) {
    const modCase = this.getCase(guildId, caseIdentifier);
    if (!modCase) return null;

    modCase.status = 'pardoned';
    modCase.pardonedAt = new Date().toISOString();
    modCase.pardonedBy = modTag || modId;
    modCase.pardonReason = reason || 'Pardoned by staff';

    // Also deactivate associated strike if present
    if (modCase.userId && store.strikes && store.strikes[guildId] && Array.isArray(store.strikes[guildId][modCase.userId])) {
      const userStrikes = store.strikes[guildId][modCase.userId];
      const matchStrike = userStrikes.find(s => s.caseId === modCase.caseId || s.reason === modCase.reason);
      if (matchStrike) {
        matchStrike.active = false;
      }
    }

    saveDatabase();
    return modCase;
  }

  static addStrike(guildId, userId, reason, durationDays = 7, caseId = null) {
    if (!store.strikes) store.strikes = {};
    if (!store.strikes[guildId]) store.strikes[guildId] = {};
    if (!Array.isArray(store.strikes[guildId][userId])) store.strikes[guildId][userId] = [];

    const now = Date.now();
    const expiresAt = now + (durationDays * 24 * 60 * 60 * 1000);

    const strike = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      caseId: caseId || null,
      reason: reason || 'Rule infraction',
      timestamp: now,
      expiresAt: expiresAt,
      active: true
    };

    store.strikes[guildId][userId].push(strike);
    saveDatabase();

    const activeStrikes = this.getActiveStrikes(guildId, userId);
    return {
      totalActive: activeStrikes.length,
      strike,
      activeStrikes
    };
  }

  static getActiveStrikes(guildId, userId) {
    if (!store.strikes || !store.strikes[guildId] || !Array.isArray(store.strikes[guildId][userId])) {
      return [];
    }
    const now = Date.now();
    return store.strikes[guildId][userId].filter(s => s.active !== false && now < s.expiresAt);
  }

  static clearStrikes(guildId, userId) {
    if (!store.strikes || !store.strikes[guildId] || !Array.isArray(store.strikes[guildId][userId])) {
      return 0;
    }
    const initialLen = this.getActiveStrikes(guildId, userId).length;
    store.strikes[guildId][userId] = store.strikes[guildId][userId].map(s => ({ ...s, active: false }));
    saveDatabase();
    return initialLen;
  }

  static setThreatWatch(guildId, userId, data = {}) {
    if (!store.threat_watchlist) store.threat_watchlist = {};
    if (!store.threat_watchlist[guildId]) store.threat_watchlist[guildId] = {};
    store.threat_watchlist[guildId][userId] = {
      userId,
      ...data,
      recordedAt: new Date().toISOString()
    };
    saveDatabase();
    return store.threat_watchlist[guildId][userId];
  }

  static getThreatWatch(guildId, userId) {
    if (!store.threat_watchlist || !store.threat_watchlist[guildId]) return null;
    return store.threat_watchlist[guildId][userId] || null;
  }

  // Cloud & Backup Helpers
  static isCloudSyncActive() {
    return isMongoConnected;
  }

  static getCloudStatus() {
    return {
      connected: isMongoConnected,
      lastSync: lastCloudSyncTime ? new Date(lastCloudSyncTime).toISOString() : null,
      provider: isMongoConnected ? 'MongoDB Atlas (Persistent Cloud Safe)' : 'Local File (Ephemeral on Render)'
    };
  }

  static exportDatabaseJSON() {
    return JSON.stringify(store, null, 2);
  }

  static importDatabaseJSON(parsed) {
    if (!isValidDatabaseObject(parsed)) {
      throw new Error('Invalid database structure. Missing required database collections.');
    }
    applyParsedStore(parsed);
    saveDatabase(true);
    return true;
  }
}

module.exports = { DatabaseManager };
