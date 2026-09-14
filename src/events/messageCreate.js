const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const BadWordsEngine = require('../utils/badWords');
const ModLogger = require('../utils/logger');
const EmbedUtils = require('../utils/embeds');
const PrefixCommandHandler = require('../utils/prefixCommandHandler');
const ScamDetector = require('../utils/scamDetector');
const TimeUtils = require('../utils/time');
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
    // 3. ARCANE-STYLE CHAT XP & LEVEL UP SYSTEM
    // ==========================================
    const guildLevelData = DatabaseManager.getLevelGuildData(message.guild.id);
    const levelConfig = guildLevelData?.config || {};

    if (guildLevelData && levelConfig.enabled !== false) {
      // Arcane check: Ignored channel check
      const isChannelIgnored = Array.isArray(levelConfig.ignoredChannels) && levelConfig.ignoredChannels.includes(message.channel.id);
      // Arcane check: Ignored roles check
      const hasIgnoredRole = Array.isArray(levelConfig.ignoredRoles) && member.roles.cache.some(r => levelConfig.ignoredRoles.includes(r.id));

      if (!isChannelIgnored && !hasIgnoredRole) {
        const cooldownKey = `${message.guild.id}_${message.author.id}`;
        const lastXpTime = xpCooldownTracker.get(cooldownKey) || 0;
        const now = Date.now();

        // 7-second anti-spam cooldown per user to allow natural conversational flow
        if (now - lastXpTime >= 7000) {
          const rawText = (message.cleanContent || message.content || '').trim();
          // Extract words, filtering out URLs, Discord mentions, and empty tokens
          const words = rawText
            .split(/\s+/)
            .filter(w => w.length > 0 && !/^https?:\/\//i.test(w) && !/^<[@#&!:]\w+:?\d*>$/.test(w));

          // 1 XP per word (minimum 1 if message has text or media, capped at 50 to prevent dictionary copy-paste abuse)
          let earnedXp = words.length;
          if (earnedXp === 0 && (rawText.length > 0 || message.attachments.size > 0)) {
            earnedXp = 1;
          }
          earnedXp = Math.max(1, Math.min(earnedXp, 50));

          xpCooldownTracker.set(cooldownKey, now);
          const xpResult = DatabaseManager.addXp(message.guild.id, message.author.id, earnedXp);

          if (xpResult.leveledUp) {
            // 1. Role Rewards Handling (Arcane Style)
            let unlockedRole = null;
            const rewardRoleId = levelConfig.roleRewards?.[String(xpResult.newLevel)];

            if (rewardRoleId) {
              const rewardRole = message.guild.roles.cache.get(rewardRoleId) || await message.guild.roles.fetch(rewardRoleId).catch(() => null);
              if (rewardRole) {
                const botMember = message.guild.members.me || await message.guild.members.fetchMe().catch(() => null);
                if (botMember && botMember.permissions.has(PermissionFlagsBits.ManageRoles) && botMember.roles.highest.position > rewardRole.position) {
                  await member.roles.add(rewardRole, `Arcane Level Up Reward (Level ${xpResult.newLevel})`).catch(() => null);
                  unlockedRole = rewardRole;

                  // If non-stacking roles: remove lower level reward roles
                  if (levelConfig.stackRoles === false) {
                    for (const [lvlStr, prevRoleId] of Object.entries(levelConfig.roleRewards)) {
                      const prevLvl = parseInt(lvlStr, 10);
                      if (prevLvl < xpResult.newLevel && prevRoleId !== rewardRoleId && member.roles.cache.has(prevRoleId)) {
                        await member.roles.remove(prevRoleId, 'Arcane unstacking role reward progression').catch(() => null);
                      }
                    }
                  }
                }
              }
            }

            // 2. Exact Level Up Announcement Message & Embed (AmariBot Style)
            const channelType = levelConfig.channelType || (levelConfig.channelId ? 'custom' : 'current');

            if (channelType !== 'none') {
              const roleText = unlockedRole ? `<@&${unlockedRole.id}>` : '';
              const displayName = member.displayName || message.author.username;
              
              const defaultTemplate = 'Congrats {user} it looks like you levelled up! You are now level {level}, keep being active to gain more XP and unlock more roles!';
              const rawTemplate = levelConfig.message && !levelConfig.message.startsWith('GG {user}')
                ? levelConfig.message
                : defaultTemplate;

              let desc = rawTemplate
                .replace(/{user}/g, `<@${message.author.id}>`)
                .replace(/{level}/g, xpResult.newLevel)
                .replace(/{server}/g, message.guild.name);

              if (rawTemplate.includes('{role}')) {
                desc = desc.replace(/{role}/g, roleText);
              } else if (unlockedRole) {
                desc += `\n\n🎉 **Unlocked Role:** ${roleText}!`;
              }

              const levelEmbed = new EmbedBuilder()
                .setTitle(`${displayName} leveled up!`)
                .setDescription(desc)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 256 }))
                .setColor('#F1C40F')
                .setFooter({ 
                  text: message.guild.name, 
                  iconURL: message.guild.iconURL() || undefined 
                });

              const payload = {
                content: `<@${message.author.id}>`,
                embeds: [levelEmbed]
              };

              // Subtle celebration reaction on message
              await message.react('⭐').catch(() => null);

              // Dispatch announcement based on settings
              if (channelType === 'dm') {
                await message.author.send(payload).catch(() => {
                  message.channel.send(payload).catch(() => null);
                });
              } else if (channelType === 'custom' && levelConfig.channelId) {
                const customCh = message.guild.channels.cache.get(levelConfig.channelId) || await message.guild.channels.fetch(levelConfig.channelId).catch(() => null);
                if (customCh && customCh.isTextBased()) {
                  await customCh.send(payload).catch(() => null);
                } else {
                  await message.channel.send(payload).catch(() => null);
                }
              } else {
                // Default 'current' channel
                await message.channel.send(payload).catch(() => null);
              }
            }
          }
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
    let isScamViolation = false;
    let scamData = null;

    // 1. Anti-Scam & Malicious Image/QR Engine (Real-Moderator Defense)
    if (automod.antiScam !== false) {
      const scamCheck = await ScamDetector.analyzeMessage(message);
      if (scamCheck && scamCheck.isScam) {
        violation = 'Malicious Scam / Phishing';
        violationDetail = scamCheck.reason || 'Malicious scam or phishing content detected.';
        isScamViolation = true;
        scamData = scamCheck;
      }
    }

    // 2. Anti-Discord Invite
    if (!violation && automod.antiInvite) {
      const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
      if (inviteRegex.test(message.content)) {
        violation = 'Anti-Invite Violation';
        violationDetail = 'Posting Discord invite links is forbidden.';
      }
    }

    // 3. Anti-Link (General External Links)
    if (!violation && automod.antiLink) {
      const linkRegex = /(https?:\/\/[^\s]+)/i;
      if (linkRegex.test(message.content)) {
        violation = 'Anti-Link Violation';
        violationDetail = 'External links are blocked on this server.';
      }
    }

    // 4. Anti-Mass-Mention
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

    // 5. Anti-Profanity / Bad Words
    if (!violation && automod.antiProfanity !== false) {
      const customList = Array.isArray(automod.customBadWords) && automod.customBadWords.length > 0
        ? automod.customBadWords
        : BadWordsEngine.getDefaultBadWords();

      const check = BadWordsEngine.checkMessage(message.content, customList);
      if (check.isProfane) {
        violation = 'Profanity Filter Violation';
        violationDetail = `Message contained prohibited abusive content: \`${check.matchedWord}\``;
      }
    }

    // 6. Anti-Spam (Fast message flooding)
    if (!violation && automod.antiSpam) {
      const now = Date.now();
      const userId = message.author.id;
      if (!spamTracker.has(userId)) {
        spamTracker.set(userId, []);
      }
      const timestamps = spamTracker.get(userId);
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
      // Step 1: Delete offending message immediately
      try {
        await message.delete();
      } catch (err) {
        console.error('[AUTOMOD DELETE ERROR]', err);
      }

      // Step 2: Real-Moderator Scam Handling vs Standard Violations
      if (isScamViolation && scamData) {
        const actionType = automod.scamAction || 'timeout';
        const timeoutDurationStr = automod.scamTimeoutDuration || '1h';
        const timeoutMs = TimeUtils.parseDuration(timeoutDurationStr) || (60 * 60 * 1000);
        let actionSummary = 'Message Deleted';

        // 2a. Real-Moderator Enforcement: Timeout / Ban / Kick
        const botMember = message.guild.members.me || await message.guild.members.fetchMe().catch(() => null);
        const canModerate = botMember && member && member.moderatable && botMember.roles.highest.position > member.roles.highest.position;

        if (canModerate) {
          if (actionType === 'ban' && botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
            await member.ban({ reason: `AutoMod Security: ${scamData.reason}` }).catch(() => null);
            actionSummary = 'Member Banned';
          } else if (actionType === 'kick' && botMember.permissions.has(PermissionFlagsBits.KickMembers)) {
            await member.kick(`AutoMod Security: ${scamData.reason}`).catch(() => null);
            actionSummary = 'Member Kicked';
          } else if (actionType !== 'delete_only' && botMember.permissions.has(PermissionFlagsBits.ModerateMembers)) {
            await member.timeout(timeoutMs, `AutoMod Security: ${scamData.reason}`).catch(() => null);
            actionSummary = `Timed out for ${TimeUtils.formatDuration(timeoutMs)}`;
          }
        }

        // 2b. Record Official Warning in Database
        const botId = client?.user?.id || message.client.user.id;
        const warnId = DatabaseManager.addWarn(message.guild.id, message.author.id, botId, `AutoMod Scam Interception: ${scamData.reason}`);

        // 2c. Send Temporary Public Warning in Channel (Self-deletes in 8 seconds)
        const publicNotice = new EmbedBuilder()
          .setColor(config.embedColors.danger || '#ED4245')
          .setTitle('🛡️ Security Shield: Scam Intercepted')
          .setDescription(
            `⚠️ A dangerous **phishing / scam image or link** from ${message.author} was intercepted and deleted.\n` +
            `🛡️ **Moderator Action:** ${actionSummary} • Recorded Warning **#${warnId}**.`
          )
          .setFooter({ text: 'Hinata Security AutoMod • Notice self-deletes in 8s' });

        const noticeMsg = await message.channel.send({ embeds: [publicNotice] }).catch(() => null);
        if (noticeMsg) {
          setTimeout(() => noticeMsg.delete().catch(() => null), 8000);
        }

        // 2d. Send Helpful Security DM to Compromised User in Clean English
        try {
          const userDmEmbed = new EmbedBuilder()
            .setColor(config.embedColors.danger || '#ED4245')
            .setTitle(`🚨 Security Notice: Incident in ${message.guild.name}`)
            .setDescription(
              `Hello **${message.author.username}**,\n\n` +
              `Our automated security systems intercepted and deleted a **scam or phishing message** sent from your account in **${message.guild.name}**.\n\n` +
              `**Threat Category:** ${scamData.reason}\n` +
              `**Action Taken:** ${actionSummary}\n\n` +
              `### 🔒 Urgent Security Advice:\n` +
              `Your Discord account may be compromised or infected with a token grabber.\n` +
              `1. **Change your Discord password immediately** (this revokes active attacker tokens).\n` +
              `2. **Check Authorized Apps** in Discord User Settings and remove unfamiliar apps.\n` +
              `3. **Enable Two-Factor Authentication (2FA)**.\n` +
              `4. Run an antivirus scan on your device if you recently downloaded files or games.`
            )
            .setFooter({ text: 'Hinata Security Defense' })
            .setTimestamp();

          await message.author.send({ embeds: [userDmEmbed] }).catch(() => null);
        } catch {}

        // 2e. Detailed Staff Audit Log with OCR and QR Evidence
        await ModLogger.log(message.guild, {
          action: 'AutoMod: Scam / Phishing Intercepted',
          target: message.author,
          reason: scamData.reason,
          color: config.embedColors.danger,
          fields: [
            { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
            { name: '🛡️ Action Applied', value: `${actionSummary} (Warn #${warnId})`, inline: true },
            { name: '🔍 Threat Type', value: `\`${scamData.scamType || 'SCAM_DETECTED'}\``, inline: true },
            ...(scamData.details ? [{ name: '📋 Threat Detail', value: scamData.details.slice(0, 500), inline: false }] : []),
            ...(scamData.ocrText ? [{ name: '📝 Extracted Image OCR Text', value: `\`\`\`${scamData.ocrText.slice(0, 900)}\`\`\``, inline: false }] : []),
            ...(scamData.qrData ? [{ name: '📱 Decoded QR Data', value: `\`\`\`${scamData.qrData.slice(0, 500)}\`\`\``, inline: false }] : []),
            ...(scamData.evidenceUrl ? [{ name: '🔗 Evidence Media URL', value: `[View Uploaded File](${scamData.evidenceUrl})`, inline: false }] : [])
          ]
        });

      } else {
        // Standard AutoMod Action (Invites, Links, Mass Mentions, Profanity, Spam)
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
  }
};
