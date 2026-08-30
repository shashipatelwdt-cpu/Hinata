const { Events } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const MusicManager = require('../music/MusicManager');

// Fallback timer map for non-queue voice connections
const standaloneEmptyTimers = new Map();

module.exports = {
  name: Events.VoiceStateUpdate || 'voiceStateUpdate',
  once: false,
  async execute(oldState, newState, client) {
    const guild = newState.guild || oldState.guild;
    if (!guild) return;

    const botMember = guild.members.me || guild.members.cache.get(client.user?.id);
    if (!botMember) return;

    const queue = MusicManager.getQueue(guild.id);

    // 1. Bot itself disconnected from voice channel
    if (oldState.id === client.user?.id && !newState.channelId) {
      if (queue) {
        queue.destroy();
      }
      if (standaloneEmptyTimers.has(guild.id)) {
        clearTimeout(standaloneEmptyTimers.get(guild.id));
        standaloneEmptyTimers.delete(guild.id);
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
      if (standaloneEmptyTimers.has(guild.id)) {
        clearTimeout(standaloneEmptyTimers.get(guild.id));
        standaloneEmptyTimers.delete(guild.id);
      }
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
      // Channel is empty (no humans present)
      if (queue) {
        queue.startEmptyChannelTimer(15000); // 15 seconds grace period
      } else {
        if (!standaloneEmptyTimers.has(guild.id)) {
          const timer = setTimeout(() => {
            standaloneEmptyTimers.delete(guild.id);
            const conn = getVoiceConnection(guild.id);
            if (conn) {
              try { conn.destroy(); } catch {}
            }
          }, 15000);
          standaloneEmptyTimers.set(guild.id, timer);
        }
      }
    } else {
      // Humans are present, cancel any pending auto-leave countdowns
      if (queue) {
        queue.cancelEmptyChannelTimer();
      }
      if (standaloneEmptyTimers.has(guild.id)) {
        clearTimeout(standaloneEmptyTimers.get(guild.id));
        standaloneEmptyTimers.delete(guild.id);
      }
    }
  }
};
