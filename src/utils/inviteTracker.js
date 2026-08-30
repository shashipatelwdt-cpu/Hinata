const { DatabaseManager } = require('../../database/db');

class InviteTracker {
  static cachedInvites = new Map();
  static vanityUses = new Map();

  /**
   * Initialize invite cache for all connected guilds
   * @param {import('discord.js').Client} client 
   */
  static async init(client) {
    console.log('🔄 Initializing Invite Tracker cache across guilds...');
    for (const guild of client.guilds.cache.values()) {
      await this.syncGuild(guild).catch(() => null);
    }
    console.log(`✅ Invite Tracker initialized for ${this.cachedInvites.size} guild(s).`);
  }

  /**
   * Sync invites for a specific guild and reconcile with database
   * @param {import('discord.js').Guild} guild 
   */
  static async syncGuild(guild) {
    try {
      const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
      if (!botMember || !botMember.permissions.has('ManageGuild')) {
        console.warn(`[INVITE TRACKER] Bot lacks 'ManageGuild' permission in ${guild.name} (${guild.id}).`);
        return 0;
      }

      const invites = await guild.invites.fetch().catch(err => {
        console.warn(`[INVITE TRACKER] Could not fetch invites in ${guild.name}: ${err.message}`);
        return null;
      });
      if (!invites) return 0;

      const codeUsesMap = new Map();
      const userTotalUses = {};

      invites.forEach(inv => {
        const uses = inv.uses || 0;
        codeUsesMap.set(inv.code, uses);
        if (inv.inviter && inv.inviter.id) {
          userTotalUses[inv.inviter.id] = (userTotalUses[inv.inviter.id] || 0) + uses;
        }
      });

      this.cachedInvites.set(guild.id, codeUsesMap);

      // Reconcile with Database so existing Discord invites are properly reflected
      const syncedCount = DatabaseManager.syncGuildInvitesFromDiscord(guild.id, userTotalUses);

      if (guild.vanityURLCode) {
        const vanity = await guild.fetchVanityData().catch(() => null);
        if (vanity) {
          this.vanityUses.set(guild.id, vanity.uses || 0);
        }
      }

      return syncedCount;
    } catch (err) {
      console.error(`[INVITE TRACKER SYNC ERROR in ${guild.name}]:`, err.message);
      return 0;
    }
  }

  /**
   * Process a new member join and detect the inviter
   * @param {import('discord.js').GuildMember} member 
   */
  static async trackJoin(member) {
    const guild = member.guild;
    const previousInvites = this.cachedInvites.get(guild.id) || new Map();
    let usedInvite = null;
    let isVanity = false;

    try {
      const currentInvites = await guild.invites.fetch().catch(() => null);
      if (currentInvites) {
        for (const [code, inv] of currentInvites.entries()) {
          const prevUses = previousInvites.get(code) || 0;
          if (inv.uses > prevUses) {
            usedInvite = inv;
            break;
          }
        }

        // Update cached map
        const newMap = new Map();
        currentInvites.forEach(inv => newMap.set(inv.code, inv.uses || 0));
        this.cachedInvites.set(guild.id, newMap);
      }

      // Check vanity if not found in regular invites
      if (!usedInvite && guild.vanityURLCode) {
        const currentVanity = await guild.fetchVanityData().catch(() => null);
        const prevVanityUses = this.vanityUses.get(guild.id) || 0;
        if (currentVanity && currentVanity.uses > prevVanityUses) {
          isVanity = true;
          this.vanityUses.set(guild.id, currentVanity.uses);
        }
      }
    } catch (err) {
      // Ignore invite fetch error
    }

    // Account age threshold for fake detection: < 3 days (259,200,000 ms)
    const accountAgeMs = Date.now() - member.user.createdTimestamp;
    const isUnderage = accountAgeMs < 3 * 24 * 60 * 60 * 1000;
    const isBot = member.user.bot;

    let isFake = isUnderage || isBot;

    // Self-invite check: if user used their own invite
    if (usedInvite && usedInvite.inviter && usedInvite.inviter.id === member.user.id) {
      isFake = true;
    }

    let inviterUser = usedInvite ? usedInvite.inviter : null;

    // Record in Database
    DatabaseManager.recordMemberJoin(
      guild.id,
      member.user.id,
      inviterUser ? inviterUser.id : (isVanity ? 'VANITY_URL' : null),
      usedInvite ? usedInvite.code : (isVanity ? guild.vanityURLCode : null),
      isFake
    );

    const inviterStats = inviterUser ? DatabaseManager.getInvites(guild.id, inviterUser.id) : null;

    return {
      inviter: inviterUser,
      inviteCode: usedInvite ? usedInvite.code : (isVanity ? guild.vanityURLCode : null),
      isVanity,
      isFake,
      isUnderage,
      inviterStats
    };
  }

  /**
   * Process a member leave and update inviter leaves count
   * @param {import('discord.js').GuildMember} member 
   */
  static async trackLeave(member) {
    const guild = member.guild;
    const leaveResult = DatabaseManager.removeInvite(guild.id, member.user.id);
    return leaveResult;
  }

  /**
   * Handle invite create event
   * @param {import('discord.js').Invite} invite 
   */
  static handleInviteCreate(invite) {
    if (!invite.guild) return;
    const guildId = invite.guild.id;
    const map = this.cachedInvites.get(guildId) || new Map();
    map.set(invite.code, invite.uses || 0);
    this.cachedInvites.set(guildId, map);
  }

  /**
   * Handle invite delete event
   * @param {import('discord.js').Invite} invite 
   */
  static handleInviteDelete(invite) {
    if (!invite.guild) return;
    const guildId = invite.guild.id;
    const map = this.cachedInvites.get(guildId);
    if (map) {
      map.delete(invite.code);
    }
  }
}

module.exports = InviteTracker;
