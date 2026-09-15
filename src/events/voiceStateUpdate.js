const { Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { DatabaseManager } = require('../../database/db');
const MusicManager = require('../music/MusicManager');
const ModLogger = require('../utils/logger');
const config = require('../../config.json');

// In-memory voice hopping tracker: Map<userId, Array<timestamps>>
const voiceHopTracker = new Map();

module.exports = {
  name: Events.VoiceStateUpdate || 'voiceStateUpdate',
  once: false,
  async execute(oldState, newState, client) {
    const guild = newState.guild || oldState.guild;
    if (!guild) return;

    // ----------------------------------------------------
    // 0. Anti-Voice Channel Hopping & Raid Defense
    // ----------------------------------------------------
    const member = newState.member || oldState.member;
    if (member && !member.user.bot && oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
      const humanModConfig = DatabaseManager.getHumanModConfig(guild.id);
      if (humanModConfig.antiVoiceHopEnabled !== false) {
        const now = Date.now();
        const userId = member.id;
        if (!voiceHopTracker.has(userId)) {
          voiceHopTracker.set(userId, []);
        }
        const hops = voiceHopTracker.get(userId).filter(t => now - t < 8000); // 8-second window
        hops.push(now);
        voiceHopTracker.set(userId, hops);

        if (hops.length >= 4) {
          // 4+ channel hops in 8 seconds -> Raid / Soundboard hopping detected
          voiceHopTracker.delete(userId);
          const botMember = guild.members.me || guild.members.cache.get(client.user?.id);

          if (botMember && botMember.permissions.has(PermissionFlagsBits.MuteMembers) && member.moderatable) {
            try {
              await newState.setMute(true, 'RAW HumanMod: Rapid voice channel hopping');
              if (botMember.permissions.has(PermissionFlagsBits.DeafenMembers)) {
                await newState.setDeaf(true, 'RAW HumanMod: Rapid voice channel hopping');
              }

              // Send polite DM in English
              const hopDm = new EmbedBuilder()
                .setColor('#FEE75C')
                .setTitle(`🎙️ Voice Notice from ${guild.name}`)
                .setDescription(
                  `Hello **${member.user.username}**,\n\n` +
                  `You were automatically muted in voice channels for **rapid channel hopping** (switching channels multiple times in a few seconds).\n\n` +
                  `• **Duration:** 5 Minutes\n` +
                  `• **Reason:** Rapid channel disruption\n\n` +
                  `This prevents accidental or intentional disturbance to others. You will be unmuted automatically in 5 minutes!`
                )
                .setFooter({ text: 'RAW Voice Protection' })
                .setTimestamp();

              await member.send({ embeds: [hopDm] }).catch(() => null);

              // Auto-restore after 5 minutes
              setTimeout(async () => {
                try {
                  const currentMem = await guild.members.fetch(userId).catch(() => null);
                  if (currentMem && currentMem.voice?.channel) {
                    await currentMem.voice.setMute(false, 'RAW: Voice hopping cooldown expired').catch(() => null);
                    await currentMem.voice.setDeaf(false, 'RAW: Voice hopping cooldown expired').catch(() => null);
                  }
                } catch {}
              }, 5 * 60 * 1000);

              // Log to ModLogs
              await ModLogger.log(guild, {
                action: '🎙️ Voice: Rapid Channel Hopping Intercepted',
                target: member.user,
                color: config.embedColors?.warning || '#FEE75C',
                reason: 'Switched voice channels 4+ times in 8 seconds.',
                fields: [
                  { name: '👤 Member', value: `<@${member.id}> (\`${member.user.tag}\`)`, inline: true },
                  { name: '⚖️ Action Applied', value: '5-Minute Voice Mute / Deafen', inline: true }
                ]
              }).catch(() => null);

            } catch (err) {
              console.error('[VOICE HOP PROTECTION ERROR]', err.message);
            }
          }
        }
      }
    }

    const botMember = guild.members.me || guild.members.cache.get(client.user?.id);
    if (!botMember) return;

    const queue = MusicManager.getQueue(guild.id);

    // 1. Bot itself disconnected from voice channel
    if (oldState.id === client.user?.id && !newState.channelId) {
      if (queue) {
        queue.destroy();
      }
      return;
    }

    // 2. Bot itself moved to a different voice channel
    if (oldState.id === client.user?.id && newState.channelId) {
      if (queue) {
        queue.voiceChannel = newState.channel;
      }
    }

    // Find the voice channel where the bot is currently located
    const botVoiceChannel = botMember.voice?.channel || (queue ? queue.voiceChannel : null);
    if (!botVoiceChannel) {
      if (queue) queue.destroy();
      return;
    }

    // Check if the event is relevant to the bot's voice channel
    if (oldState.channelId !== botVoiceChannel.id && newState.channelId !== botVoiceChannel.id) {
      return;
    }

    // Count non-bot (human) members in the channel
    const nonBotMembers = botVoiceChannel.members ? botVoiceChannel.members.filter(m => !m.user.bot) : [];
    const humanCount = nonBotMembers.size !== undefined ? nonBotMembers.size : (Array.isArray(nonBotMembers) ? nonBotMembers.length : 0);

    if (humanCount === 0) {
      if (queue) {
        queue.startEmptyChannelTimer(20000);
      } else {
        const conn = getVoiceConnection(guild.id);
        if (conn) {
          try { conn.destroy(); } catch {}
        }
      }
    } else {
      if (queue) {
        queue.cancelEmptyChannelTimer();
      }
    }
  }
};
