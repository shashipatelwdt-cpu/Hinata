const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const BadWordsEngine = require('../utils/badWords');
const ModLogger = require('../utils/logger');
const EmbedUtils = require('../utils/embeds');
const PrefixCommandHandler = require('../utils/prefixCommandHandler');
const config = require('../../config.json');

// In-memory spam tracker: Map<userId, Array<timestamps>>
const spamTracker = new Map();

// In-memory XP cooldown tracker: Map<guildId_userId, timestamp>
const xpCooldownTracker = new Map();

// Helper to safely evaluate counting input (numbers and basic arithmetic)
function evaluateCountingInput(content) {
  if (!content || typeof content !== 'string') return null;
  const trimmed = content.trim();

  // Pure integer check
  if (/^-?\d+$/.test(trimmed)) {
    const n = parseInt(trimmed, 10);
    return Number.isSafeInteger(n) ? n : null;
  }

  // Safe arithmetic check: only digits, spaces, and + - * / % ( ) ^
  if (!/^[\d\s+\-*/%()^]+$/.test(trimmed)) return null;

  try {
    const sanitized = trimmed.replace(/\^/g, '**');
    const res = Function(`'use strict'; return (${sanitized});`)();
    if (typeof res === 'number' && Number.isFinite(res) && Number.isSafeInteger(Math.round(res))) {
      return Math.round(res);
    }
  } catch {}
  return null;
}

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

    // ==========================================
    // 1. COUNTING GAME SYSTEM
    // ==========================================
    const counting = DatabaseManager.getCounting(message.guild.id);
    if (counting && counting.channelId && message.channel.id === counting.channelId) {
      const parsedNumber = evaluateCountingInput(message.content);
      if (parsedNumber !== null) {
        const expected = (counting.currentCount || 0) + 1;

        // Anti-Double Count Check
        if (counting.lastUserId === message.author.id) {
          await message.react('❌').catch(() => null);
          const failResult = DatabaseManager.failCount(message.guild.id, message.author.id, 'Double counting');
          
          const failEmbed = new EmbedBuilder()
            .setTitle('💥 Count Ruined!')
            .setDescription(
              `❌ <@${message.author.id}> ruined the count at **${failResult.brokenAt}**!\n` +
              `**Reason:** You cannot count two numbers in a row!\n` +
              `The count has been reset to **0**. Next number is **1**!\n\n` +
              `👑 **Server Record:** **${failResult.previousHighScore}**`
            )
            .setColor(config.embedColors?.danger || '#ED4245')
            .setFooter({ text: 'Hinata Counting Engine' });

          await message.channel.send({ embeds: [failEmbed] }).catch(() => null);
          return;
        }

        // Wrong Number Check
        if (parsedNumber !== expected) {
          await message.react('❌').catch(() => null);
          const failResult = DatabaseManager.failCount(message.guild.id, message.author.id, 'Wrong number');

          const failEmbed = new EmbedBuilder()
            .setTitle('💥 Count Ruined!')
            .setDescription(
              `❌ <@${message.author.id}> ruined the count at **${failResult.brokenAt}**!\n` +
              `**You entered:** \`${parsedNumber}\` • **Expected:** \`${expected}\`\n` +
              `The count has been reset to **0**. Next number is **1**!\n\n` +
              `👑 **Server Record:** **${failResult.previousHighScore}**`
            )
            .setColor(config.embedColors?.danger || '#ED4245')
            .setFooter({ text: 'Hinata Counting Engine' });

          await message.channel.send({ embeds: [failEmbed] }).catch(() => null);
          return;
        }

        // Valid Number Count!
        const { data, isNewHighScore } = DatabaseManager.recordCount(message.guild.id, message.author.id, expected);

        // Milestone reaction
        if (expected % 100 === 0) {
          await message.react('💯').catch(() => null);
          await message.react('🎉').catch(() => null);
        } else if (expected % 50 === 0) {
          await message.react('🎉').catch(() => null);
        } else {
          await message.react('✅').catch(() => null);
        }

        // High Score Announcement
        if (isNewHighScore && expected >= 5) {
          await message.react('👑').catch(() => null);
          if (expected === data.highScore) {
            const hsEmbed = new EmbedBuilder()
              .setTitle('👑 NEW COUNTING RECORD!')
              .setDescription(`🎉 <@${message.author.id}> just set a brand new server counting record of **${expected}**! Keep going!`)
              .setColor(config.embedColors?.success || '#57F287');
            await message.channel.send({ embeds: [hsEmbed] }).catch(() => null);
          }
        }
        return;
      }
    }

    // ==========================================
    // 2. PROFESSIONAL AFK SYSTEM
    // ==========================================
    // 2a. Return from AFK: Did message author have an active AFK status?
    const authorAfk = DatabaseManager.getAfk(message.guild.id, message.author.id);
    if (authorAfk && (Date.now() - authorAfk.timestamp > 3500)) {
      const removed = DatabaseManager.removeAfk(message.guild.id, message.author.id);
      if (removed) {
        // Restore Nickname
        const botMember = message.guild.members.me || await message.guild.members.fetchMe().catch(() => null);
        if (botMember && botMember.permissions.has(PermissionFlagsBits.ManageNicknames)) {
          if (member.id !== message.guild.ownerId && botMember.roles.highest.position > member.roles.highest.position) {
            try {
              await member.setNickname(removed.oldNick || null, 'Restoring nickname after AFK');
            } catch (e) {}
          }
        }

        const durationMs = Date.now() - (removed.timestamp || Date.now());
        const mins = Math.floor(durationMs / 60000);
        const timeStr = mins < 1 ? 'less than a minute' : `${mins} minute${mins === 1 ? '' : 's'}`;

        const returnEmbed = new EmbedBuilder()
          .setTitle(`👋 Welcome back, ${member.displayName || message.author.username}!`)
          .setDescription(`I've removed your **AFK** status.\nYou were away for **${timeStr}** (${removed.reason}).`)
          .setColor(config.embedColors?.success || '#57F287')
          .setTimestamp();

        // If they received mentions while away, display them
        if (removed.mentions && removed.mentions.length > 0) {
          const mentionLines = removed.mentions.slice(-5).map((m, idx) => {
            const timeAgo = `<t:${Math.floor(m.timestamp / 1000)}:R>`;
            return `**${idx + 1}.** By <@${m.authorId}> in <#${m.channelId}> (${timeAgo}):\n> ${m.content || '*[Embed/Attachment]*'}`;
          });

          returnEmbed.addFields({
            name: `📬 Missed Mentions (${removed.mentions.length})`,
            value: mentionLines.join('\n\n').slice(0, 1024)
          });
        }

        const replyMsg = await message.channel.send({ embeds: [returnEmbed] }).catch(() => null);
        if (replyMsg) {
          setTimeout(() => replyMsg.delete().catch(() => null), 14000);
        }
      }
    }

    // 2b. Intercept Mentions: Did the message mention any AFK members?
    if (message.mentions.users.size > 0) {
      for (const [mentionedId, mentionedUser] of message.mentions.users) {
        if (mentionedId !== message.author.id && !mentionedUser.bot) {
          const targetAfk = DatabaseManager.getAfk(message.guild.id, mentionedId);
          if (targetAfk) {
            // Record missed mention
            DatabaseManager.addAfkMention(message.guild.id, mentionedId, {
              authorId: message.author.id,
              authorTag: message.author.tag,
              content: message.cleanContent || message.content,
              channelId: message.channel.id,
              messageId: message.id
            });

            const timeAgo = `<t:${Math.floor(targetAfk.timestamp / 1000)}:R>`;
            const afkNotice = await message.channel.send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(`💤 **${mentionedUser.username}** is currently AFK: **${targetAfk.reason}** (${timeAgo})`)
                  .setColor(config.embedColors?.warning || '#FEE75C')
              ]
            }).catch(() => null);

            if (afkNotice) {
              setTimeout(() => afkNotice.delete().catch(() => null), 8000);
            }
          }
        }
      }
    }

    // ==========================================
    // 3. CHAT XP & LEVEL UP SYSTEM
    // ==========================================
    const guildLevelData = DatabaseManager.getLevelGuildData(message.guild.id);
    if (guildLevelData && guildLevelData.config && guildLevelData.config.enabled !== false) {
      const cooldownKey = `${message.guild.id}_${message.author.id}`;
      const lastXpTime = xpCooldownTracker.get(cooldownKey) || 0;
      const now = Date.now();

      if (now - lastXpTime >= 60000) {
        xpCooldownTracker.set(cooldownKey, now);
        const earnedXp = Math.floor(Math.random() * 11) + 15; // 15 to 25 XP per message
        const xpResult = DatabaseManager.addXp(message.guild.id, message.author.id, earnedXp);

        if (xpResult.leveledUp) {
          // Check role rewards
          let roleRewardText = '';
          const rewardRoleId = guildLevelData.config.roleRewards?.[String(xpResult.newLevel)];
          if (rewardRoleId) {
            const rewardRole = message.guild.roles.cache.get(rewardRoleId) || await message.guild.roles.fetch(rewardRoleId).catch(() => null);
            if (rewardRole) {
              const botMember = message.guild.members.me || await message.guild.members.fetchMe().catch(() => null);
              if (botMember && botMember.permissions.has(PermissionFlagsBits.ManageRoles) && botMember.roles.highest.position > rewardRole.position) {
                await member.roles.add(rewardRole, `Hinata Level Up Reward (Level ${xpResult.newLevel})`).catch(() => null);
                roleRewardText = `\n\n🎁 **Role Reward Unlocked:** <@&${rewardRole.id}>!`;
              }
            }
          }

          // Target channel for announcement
          let targetChannel = message.channel;
          if (guildLevelData.config.channelId) {
            const customCh = message.guild.channels.cache.get(guildLevelData.config.channelId) || await message.guild.channels.fetch(guildLevelData.config.channelId).catch(() => null);
            if (customCh && customCh.isTextBased()) targetChannel = customCh;
          }

          const tier = xpResult.tier || DatabaseManager.getLevelTier(xpResult.newLevel);
          const oldTier = xpResult.oldTier || DatabaseManager.getLevelTier(xpResult.oldLevel);
          const isTierUp = tier.name !== oldTier.name;
          const tierPromotionText = isTierUp ? `\n🌟 **TIER PROMOTION:** Advanced to **${tier.badge} ${tier.name} Tier**!` : '';

          // Add celebration reactions to message
          await message.react('⭐').catch(() => null);
          if (xpResult.newLevel % 5 === 0) await message.react('🎉').catch(() => null);
          if (xpResult.newLevel % 10 === 0) await message.react('👑').catch(() => null);

          const levelEmbed = new EmbedBuilder()
            .setAuthor({ 
              name: `${message.author.username} Leveled Up!`, 
              iconURL: message.author.displayAvatarURL({ dynamic: true }) 
            })
            .setTitle(`${tier.badge} LEVEL UP! • LEVEL ${xpResult.newLevel}`)
            .setDescription(
              `🎉 Congratulations <@${message.author.id}>! Your server activity paid off!\n\n` +
              `**⭐ Current Level:** \`Level ${xpResult.newLevel}\` (${tier.badge} **${tier.name} Tier**)` +
              `${tierPromotionText}\n` +
              `**✨ Total XP:** \`${xpResult.totalXp.toLocaleString()} XP\`\n` +
              `**🎯 Next Milestone:** \`${xpResult.neededXp.toLocaleString()} XP to Level ${xpResult.newLevel + 1}\`` +
              `${roleRewardText}`
            )
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor(tier.color || config.embedColors?.success || '#57F287')
            .setFooter({ text: `Hinata Leveling Engine • Chat actively to climb the leaderboard!` })
            .setTimestamp();

          targetChannel.send({ embeds: [levelEmbed] }).catch(() => null);
        }
      }
    }

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
