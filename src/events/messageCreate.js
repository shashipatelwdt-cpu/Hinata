const { PermissionFlagsBits } = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const BadWordsEngine = require('../utils/badWords');
const ModLogger = require('../utils/logger');
const EmbedUtils = require('../utils/embeds');
const PrefixCommandHandler = require('../utils/prefixCommandHandler');
const config = require('../../config.json');

// In-memory spam tracker: Map<userId, Array<timestamps>>
const spamTracker = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (!message.guild) return;

    // Check if message author is a bot that is muted in this channel
    if (message.author.bot) {
      if (DatabaseManager.isBotMutedInChannel(message.guild.id, message.channel.id, message.author.id)) {
        try {
          await message.delete();
        } catch (err) {
          // Ignore delete errors
        }
      }
      return;
    }

    // 0. Handle Prefix Commands (e.g. h play <song>, h skip, h stop, etc.)
    const isCommandHandled = await PrefixCommandHandler.handleMessage(message, client || message.client);
    if (isCommandHandled) return;

    const member = message.member;
    if (!member) return;

    const guildSettings = DatabaseManager.getGuild(message.guild.id);
    const automod = { ...config.defaultSettings.automod, ...(guildSettings.automod || {}) };

    // Admins, server owner, and moderators bypass automod unless filterAdmins is enabled
    const isStaffOrAdmin =
      member.permissions.has(PermissionFlagsBits.Administrator) ||
      member.permissions.has(PermissionFlagsBits.ManageGuild) ||
      member.permissions.has(PermissionFlagsBits.ManageMessages) ||
      member.permissions.has(PermissionFlagsBits.ModerateMembers) ||
      member.permissions.has(PermissionFlagsBits.KickMembers) ||
      member.permissions.has(PermissionFlagsBits.BanMembers) ||
      member.permissions.has(PermissionFlagsBits.MentionEveryone) ||
      message.author.id === message.guild.ownerId;

    // Prevent non-staff users from mentioning or triggering a channel-muted bot in this channel
    if (!isStaffOrAdmin && message.mentions.users.size > 0) {
      const mutedBotMentioned = message.mentions.users.find(u =>
        u.bot && DatabaseManager.isBotMutedInChannel(message.guild.id, message.channel.id, u.id)
      );
      if (mutedBotMentioned) {
        try {
          await message.delete();
          const notice = await message.channel.send({
            content: `🚫 ${message.author}, <@${mutedBotMentioned.id}> is **disabled / muted** in this channel and cannot be used here.`
          }).catch(() => null);
          if (notice) {
            setTimeout(() => notice.delete().catch(() => null), 5000);
          }
        } catch (err) {
          // ignore
        }
        return;
      }
    }

    if (isStaffOrAdmin && automod.filterAdmins !== true) {
      return;
    }

    let violation = null;
    let violationDetail = '';

    const content = message.content.toLowerCase();

    // 1. Anti-Discord Invite
    if (automod.antiInvite) {
      const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
      if (inviteRegex.test(message.content)) {
        violation = 'Anti-Invite Violation';
        violationDetail = 'Posting Discord invite links is forbidden.';
      }
    }

    // 2. Anti-Link (General External Links)
    if (!violation && automod.antiLink) {
      const linkRegex = /(https?:\/\/[^\s]+)/i;
      if (linkRegex.test(message.content)) {
        violation = 'Anti-Link Violation';
        violationDetail = 'External links are blocked on this server.';
      }
    }

    // 3. Anti-Mass-Mention
    // Do NOT trigger on @everyone or @here alone; only trigger when a user mentions more than 5 users/roles
    if (!violation && automod.antiMassMention) {
      const maxAllowed = automod.maxMentions || 5;
      const userMentionCount = message.mentions.users.filter(u => u.id !== message.author.id && !u.bot).size;
      const roleMentionCount = message.mentions.roles.size;
      const totalMentions = userMentionCount + roleMentionCount;

      if (totalMentions > maxAllowed) {
        violation = 'Mass-Mention Violation';
        violationDetail = `Message contained ${totalMentions} mentions (allowed limit is ${maxAllowed}).`;
      }
    }

    // 4. Anti-Profanity / Bad Words (Hindi, Hinglish & English)
    if (!violation && automod.antiProfanity !== false) {
      const customList = Array.isArray(automod.customBadWords) && automod.customBadWords.length > 0
        ? automod.customBadWords
        : BadWordsEngine.getDefaultBadWords();

      const check = BadWordsEngine.checkMessage(message.content, customList);
      if (check.isProfane) {
        violation = 'Profanity Filter Violation';
        violationDetail = `Message contained prohibited abuse / bad word: \`${check.matchedWord}\``;
      }
    }

    // 5. Anti-Spam (Fast message flooding)
    if (!violation && automod.antiSpam) {
      const now = Date.now();
      const userId = message.author.id;
      if (!spamTracker.has(userId)) {
        spamTracker.set(userId, []);
      }
      const timestamps = spamTracker.get(userId);
      // Keep timestamps within last 4 seconds
      const recent = timestamps.filter(t => now - t < 4000);
      recent.push(now);
      spamTracker.set(userId, recent);

      if (recent.length >= 5) {
        violation = 'Anti-Spam Flooding';
        violationDetail = 'Sending too many messages too quickly.';
      }
    }

    // Process Violation Action
    if (violation) {
      try {
        await message.delete();
      } catch (err) {
        console.error('[AUTOMOD DELETE ERROR]', err);
      }

      // Send auto-deleting warning notice in channel
      const warnMsg = await message.channel.send({
        content: `⚠️ ${message.author}, your message was deleted by **AutoMod**: *${violationDetail}*`
      }).catch(() => null);

      if (warnMsg) {
        setTimeout(() => warnMsg.delete().catch(() => null), 6000);
      }

      // Log to ModLogs
      await ModLogger.log(message.guild, {
        action: `AutoMod: ${violation}`,
        target: message.author,
        reason: violationDetail,
        color: config.embedColors.danger,
        fields: [
          { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: '📝 Message Content', value: `\`\`\`${(message.content || '[No Text]').slice(0, 1000)}\`\`\``, inline: false }
        ]
      });
    }
  }
};
