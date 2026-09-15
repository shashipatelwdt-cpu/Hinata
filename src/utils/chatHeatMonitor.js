/**
 * Dynamic Chat Heat Monitor & Flame-War Auto-Slowmode Engine
 * Mimics human moderator presence by detecting sudden message storms and heated debates,
 * gently applying temporary slowmode to de-escalate tension, and restoring normal speed once quiet.
 */

const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

// Map<channelId, { timestamps: number[], users: Set<string> }>
const channelVelocity = new Map();

// Map<channelId, { originalSlowmode: number, restoreTimer: NodeJS.Timeout }>
const activeSlowmodes = new Map();

class ChatHeatMonitor {
  /**
   * Evaluate message velocity in channel and apply temporary cooling if needed
   * @param {import('discord.js').Message} message
   * @param {object} humanModConfig
   */
  static async recordAndAssess(message, humanModConfig = {}) {
    const channel = message.channel;
    if (!channel || !channel.isTextBased() || !message.guild) return;

    if (humanModConfig.heatMonitorEnabled === false) return;

    const channelId = channel.id;
    const now = Date.now();
    const windowMs = 12000; // 12 seconds sliding window

    if (!channelVelocity.has(channelId)) {
      channelVelocity.set(channelId, { entries: [] });
    }

    const tracker = channelVelocity.get(channelId);
    // Keep only timestamps within window
    tracker.entries = tracker.entries.filter(e => now - e.time < windowMs);
    tracker.entries.push({ time: now, userId: message.author.id });

    // If already in auto-slowmode, don't trigger again
    if (activeSlowmodes.has(channelId)) return;

    const count = tracker.entries.length;
    const distinctUsers = new Set(tracker.entries.map(e => e.userId)).size;
    const threshold = humanModConfig.heatThreshold || 8;

    // Trigger condition: high message rate with multiple participants
    const isOverheated = count >= threshold && distinctUsers >= 2;

    if (isOverheated) {
      const botMember = message.guild.members.me || await message.guild.members.fetchMe().catch(() => null);
      if (!botMember || !channel.permissionsFor(botMember)?.has(PermissionFlagsBits.ManageChannels)) {
        return; // Bot lacks permission to manage slowmode in this channel
      }

      const originalSlowmode = channel.rateLimitPerUser || 0;
      // Target cooling slowmode: 5 seconds (or 10 if already at 5)
      const targetSlowmode = originalSlowmode >= 5 ? 10 : 5;

      try {
        await channel.setRateLimitPerUser(targetSlowmode, 'RAW HumanMod: Chat heat de-escalation');

        // Human-style warm announcement
        const coolEmbed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle('💬 Chat is moving quickly!')
          .setDescription(
            `Chat is moving at high speed right now. ` +
            `RAW has enabled a **temporary ${targetSlowmode}s slowmode** to allow everyone to catch their breath and keep the discussion pleasant.\n\n` +
            `*This will automatically lift once chat calms down.*`
          )
          .setFooter({ text: 'RAW Live Chat Assistant' });

        const notice = await channel.send({ embeds: [coolEmbed] }).catch(() => null);

        // Schedule cooldown restoration check after 40 seconds
        const restoreTimer = setTimeout(async () => {
          try {
            activeSlowmodes.delete(channelId);
            await channel.setRateLimitPerUser(originalSlowmode, 'RAW HumanMod: Chat heat cooled down');

            const restoreNotice = await channel.send({
              content: '✨ **Chat has cooled down!** Restoring normal slowmode. Thanks for keeping it chill everyone!'
            }).catch(() => null);

            if (restoreNotice) {
              setTimeout(() => restoreNotice.delete().catch(() => null), 8000);
            }
            if (notice) {
              notice.delete().catch(() => null);
            }
          } catch (err) {
            console.error('[HEAT MONITOR RESTORE ERROR]', err.message);
          }
        }, 40000);

        activeSlowmodes.set(channelId, { originalSlowmode, restoreTimer });
      } catch (err) {
        console.error('[HEAT MONITOR SLOWMODE ERROR]', err.message);
      }
    }
  }

  /**
   * Check if channel currently has active heat-induced slowmode
   * @param {string} channelId
   * @returns {boolean}
   */
  static isHeatActive(channelId) {
    return activeSlowmodes.has(channelId);
  }

  /**
   * Clean up timer if channel is deleted
   * @param {string} channelId
   */
  static clearChannel(channelId) {
    if (activeSlowmodes.has(channelId)) {
      const data = activeSlowmodes.get(channelId);
      clearTimeout(data.restoreTimer);
      activeSlowmodes.delete(channelId);
    }
    channelVelocity.delete(channelId);
  }
}

module.exports = ChatHeatMonitor;
