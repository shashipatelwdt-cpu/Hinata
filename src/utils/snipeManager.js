/**
 * SnipeManager - In-memory cache for deleted messages, edited messages, and ghost-ping detection
 */
class SnipeManager {
  static snipes = new Map();
  static editSnipes = new Map();
  static ghostPings = new Map();
  static MAX_SNIPES_PER_CHANNEL = 15;
  static MAX_GHOSTPINGS_PER_CHANNEL = 15;

  /**
   * Check if a message has ghost ping mentions
   * @param {import('discord.js').Message} message 
   */
  static detectGhostPing(message) {
    if (!message || message.author?.bot) return null;

    const mentionedUsers = [];
    const mentionedRoles = [];

    // Check user mentions (exclude author mentioning themselves and bots)
    if (message.mentions?.users?.size > 0) {
      message.mentions.users.forEach(user => {
        if (user.id !== message.author.id && !user.bot) {
          mentionedUsers.push({
            id: user.id,
            tag: user.tag || user.username,
            username: user.username,
            avatar: user.displayAvatarURL ? user.displayAvatarURL({ dynamic: true, size: 256 }) : null
          });
        }
      });
    }

    // Check role mentions
    if (message.mentions?.roles?.size > 0) {
      message.mentions.roles.forEach(role => {
        mentionedRoles.push({
          id: role.id,
          name: role.name,
          color: role.hexColor || '#99AAB5'
        });
      });
    }

    const hasEveryone = Boolean(
      message.content?.includes('@everyone') || 
      message.content?.includes('@here') ||
      message.mentions?.everyone
    );

    if (mentionedUsers.length > 0 || mentionedRoles.length > 0 || hasEveryone) {
      return {
        users: mentionedUsers,
        roles: mentionedRoles,
        hasEveryone: hasEveryone
      };
    }

    return null;
  }

  /**
   * Record a ghost ping explicitly
   * @param {object} ghostPingData
   */
  static addGhostPing(ghostPingData) {
    if (!ghostPingData || !ghostPingData.channelId) return null;

    const channelId = ghostPingData.channelId;
    if (!this.ghostPings.has(channelId)) {
      this.ghostPings.set(channelId, []);
    }

    const channelGhostPings = this.ghostPings.get(channelId);
    channelGhostPings.unshift(ghostPingData);

    if (channelGhostPings.length > this.MAX_GHOSTPINGS_PER_CHANNEL) {
      channelGhostPings.pop();
    }

    return ghostPingData;
  }

  /**
   * Get ghost ping for a channel by index (0 = latest)
   * @param {string} channelId 
   * @param {number} index 
   */
  static getGhostPing(channelId, index = 0) {
    const list = this.ghostPings.get(channelId);
    if (!list || list.length === 0) return null;
    const targetIndex = Math.max(0, Math.min(index, list.length - 1));
    return {
      ghostPing: list[targetIndex],
      index: targetIndex + 1,
      total: list.length
    };
  }

  /**
   * Get all ghost pings in a channel
   * @param {string} channelId 
   */
  static getGhostPings(channelId) {
    return this.ghostPings.get(channelId) || [];
  }

  /**
   * Record a deleted message
   * @param {import('discord.js').Message} message 
   */
  static addSnipe(message) {
    if (!message || !message.channelId || !message.author || message.author.bot) return null;

    const channelId = message.channelId;
    if (!this.snipes.has(channelId)) {
      this.snipes.set(channelId, []);
    }

    const attachments = message.attachments ? Array.from(message.attachments.values()).map(att => ({
      url: att.url || att.proxyURL,
      name: att.name,
      contentType: att.contentType
    })) : [];

    const ghostPingData = this.detectGhostPing(message);

    const snipeData = {
      id: message.id,
      channelId: message.channelId,
      guildId: message.guildId,
      author: {
        id: message.author.id,
        tag: message.author.tag || message.author.username,
        username: message.author.username,
        avatar: message.author.displayAvatarURL ? message.author.displayAvatarURL({ dynamic: true, size: 256 }) : null
      },
      content: message.content || '',
      attachments: attachments,
      createdAt: message.createdTimestamp || Date.now(),
      deletedAt: Date.now(),
      ghostPing: ghostPingData
    };

    const channelSnipes = this.snipes.get(channelId);
    channelSnipes.unshift(snipeData);

    // Keep only the most recent N snipes
    if (channelSnipes.length > this.MAX_SNIPES_PER_CHANNEL) {
      channelSnipes.pop();
    }

    // If it's a ghost ping, also save to dedicated ghostPings cache
    if (ghostPingData) {
      this.addGhostPing({
        id: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        type: 'deleted', // 'deleted' or 'edited'
        author: snipeData.author,
        content: message.content || '[No Text Content]',
        attachments: attachments,
        sentAt: message.createdTimestamp || Date.now(),
        eventAt: Date.now(),
        ghostPing: ghostPingData
      });
    }

    return snipeData;
  }

  /**
   * Get snipe for a channel by index (0 = latest, 1 = 2nd latest, etc.)
   * @param {string} channelId 
   * @param {number} index 
   */
  static getSnipe(channelId, index = 0) {
    const list = this.snipes.get(channelId);
    if (!list || list.length === 0) return null;
    const targetIndex = Math.max(0, Math.min(index, list.length - 1));
    return {
      snipe: list[targetIndex],
      index: targetIndex + 1,
      total: list.length
    };
  }

  /**
   * Record an edited message
   * @param {import('discord.js').Message} oldMessage 
   * @param {import('discord.js').Message} newMessage 
   */
  static addEditSnipe(oldMessage, newMessage) {
    if (!oldMessage || !oldMessage.channelId || !oldMessage.author || oldMessage.author.bot) return null;
    if (newMessage && oldMessage.content === newMessage.content) return null;

    const channelId = oldMessage.channelId;
    if (!this.editSnipes.has(channelId)) {
      this.editSnipes.set(channelId, []);
    }

    const attachments = oldMessage.attachments ? Array.from(oldMessage.attachments.values()).map(att => ({
      url: att.url || att.proxyURL,
      name: att.name,
      contentType: att.contentType
    })) : [];

    const oldGhostPing = this.detectGhostPing(oldMessage);
    const newGhostPing = newMessage ? this.detectGhostPing(newMessage) : null;

    // Check if mentions were removed or edited
    const isEditGhostPing = oldGhostPing && (!newGhostPing || oldGhostPing.users.length > (newGhostPing.users?.length || 0) || oldGhostPing.roles.length > (newGhostPing.roles?.length || 0));

    const editData = {
      id: oldMessage.id,
      channelId: oldMessage.channelId,
      guildId: oldMessage.guildId,
      author: {
        id: oldMessage.author.id,
        tag: oldMessage.author.tag || oldMessage.author.username,
        username: oldMessage.author.username,
        avatar: oldMessage.author.displayAvatarURL ? oldMessage.author.displayAvatarURL({ dynamic: true, size: 256 }) : null
      },
      oldContent: oldMessage.content || '[No Text Content]',
      newContent: newMessage?.content || '[No Text Content]',
      attachments: attachments,
      url: newMessage?.url || null,
      editedAt: Date.now(),
      createdAt: oldMessage.createdTimestamp || Date.now(),
      ghostPing: isEditGhostPing ? oldGhostPing : null
    };

    const channelEditSnipes = this.editSnipes.get(channelId);
    channelEditSnipes.unshift(editData);

    if (channelEditSnipes.length > this.MAX_SNIPES_PER_CHANNEL) {
      channelEditSnipes.pop();
    }

    // If old message had mentions that were removed or changed in edit, record as ghost ping
    if (oldGhostPing) {
      this.addGhostPing({
        id: oldMessage.id,
        channelId: oldMessage.channelId,
        guildId: oldMessage.guildId,
        type: 'edited',
        author: editData.author,
        content: oldMessage.content || '[No Text Content]',
        newContent: newMessage?.content || '[No Text Content]',
        attachments: attachments,
        sentAt: oldMessage.createdTimestamp || Date.now(),
        eventAt: Date.now(),
        ghostPing: oldGhostPing
      });
    }

    return editData;
  }

  /**
   * Get edit snipe for a channel by index
   * @param {string} channelId 
   * @param {number} index 
   */
  static getEditSnipe(channelId, index = 0) {
    const list = this.editSnipes.get(channelId);
    if (!list || list.length === 0) return null;
    const targetIndex = Math.max(0, Math.min(index, list.length - 1));
    return {
      editSnipe: list[targetIndex],
      index: targetIndex + 1,
      total: list.length
    };
  }

  /**
   * Clear snipes, edit snipes, and ghost pings for a channel
   * @param {string} channelId 
   */
  static clear(channelId) {
    const deletedCount = (this.snipes.get(channelId)?.length || 0) + 
                         (this.editSnipes.get(channelId)?.length || 0) +
                         (this.ghostPings.get(channelId)?.length || 0);
    this.snipes.delete(channelId);
    this.editSnipes.delete(channelId);
    this.ghostPings.delete(channelId);
    return deletedCount;
  }
}

module.exports = SnipeManager;
