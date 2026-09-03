const { Events, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const MusicManager = require('../music/MusicManager');
const config = require('../../config.json');

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
