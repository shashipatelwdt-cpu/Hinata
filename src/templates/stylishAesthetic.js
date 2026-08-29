const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'good-looking',
  category: '✨ Ultra-Aesthetic & Modern',
  name: '✨ ✦ GOOD LOOKING — Ultra-Stylish Aesthetic Lounge ✦ ✨',
  description: 'Premium, modern & sleek Discord aesthetic server template with minimalist borders, pastel hierarchy, cozy hangout channels, and auto systems.',
  roles: [
    { name: '👑 ✦ ┋ Founder', color: '#FFB6C1', hoist: true, mentionable: false, isOwnerRole: true },
    { name: '🛡️ ✦ ┋ Management', color: '#B5EAD7', hoist: true, mentionable: false, isAdminRole: true },
    { name: '⚔️ ✦ ┋ Moderator', color: '#C7CEEA', hoist: true, mentionable: true, isModRole: true },
    { name: '💎 ✦ ┋ Elite VIP', color: '#FFDAC1', hoist: true, mentionable: false },
    { name: '🚀 ✦ ┋ Server Booster', color: '#F47FFF', hoist: true, mentionable: false },
    { name: '🎨 ✦ ┋ Creator & Artist', color: '#E2F0CB', hoist: true, mentionable: false },
    { name: '🤖 ✦ ┋ System Bots', color: '#74B9FF', hoist: true, mentionable: false, isBotRole: true },
    { name: '📢 ✦ ┋ Announcements Ping', color: '#7289DA', hoist: false, mentionable: true },
    { name: '🎁 ✦ ┋ Giveaways Ping', color: '#FDCB6E', hoist: false, mentionable: true },
    { name: '👥 ✦ ┋ Members', color: '#DFE6E9', hoist: false, mentionable: false, isMemberRole: true }
  ],
  categories: [
    // 1. INFORMATION & PORTAL
    {
      name: '╭・୨ ✦ ୧・INFORMATION',
      channels: [
        { name: '⌗・welcome', type: ChannelType.GuildText, topic: '✨ Welcome to our community! Enjoy your stay.', isWelcomeChannel: true },
        { name: '⌗・rules', type: ChannelType.GuildText, topic: '📜 Official community guidelines & server rules', isRulesChannel: true },
        { name: '⌗・announcements', type: ChannelType.GuildAnnouncement, topic: '📢 Important server updates, events & news' },
        { name: '⌗・roles', type: ChannelType.GuildText, topic: '🎭 Pick your self-roles, colors & notification pings', isRolesChannel: true },
        { name: '⌗・boosts', type: ChannelType.GuildText, topic: '💎 Exclusive perks for server boosters & supporters' }
      ]
    },

    // 2. MAIN COMMUNITY
    {
      name: '╭・୨ 💬 ୧・COMMUNITY',
      channels: [
        { name: '💬・main-chat', type: ChannelType.GuildText, topic: '💭 Primary hangout chat for friendly conversations' },
        { name: '📸・media-gallery', type: ChannelType.GuildText, topic: '📷 Share photos, artwork, setups & daily life' },
        { name: '🐸・memes-and-clips', type: ChannelType.GuildText, topic: '🎬 Wholesome memes, funny moments & short clips' },
        { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: '🤖 Use bot commands & play mini games here' }
      ]
    },

    // 3. GAMING & ACTIVITIES
    {
      name: '╭・୨ 🎮 ୧・GAMING & CHILL',
      channels: [
        { name: '🎯・looking-for-group', type: ChannelType.GuildText, topic: '🤝 Find teammates to squad up in games' },
        { name: '🎮・game-talk', type: ChannelType.GuildText, topic: '🕹️ General gaming discussions, clips & updates' },
        { name: '🎵・music-commands', type: ChannelType.GuildText, topic: '🎶 Queue music, lo-fi beats & share playlists' }
      ]
    },

    // 4. SUPPORT & FEEDBACK
    {
      name: '╭・୨ 📩 ୧・SUPPORT',
      channels: [
        { name: '📩・open-ticket', type: ChannelType.GuildText, topic: '🎫 Contact staff for assistance, reports, or queries' },
        { name: '💡・suggestions', type: ChannelType.GuildText, topic: '✨ Share ideas & feedback to improve the server' }
      ]
    },

    // 5. VOICE CHANNELS
    {
      name: '╭・୨ 🔊 ୧・VOICE ROOMS',
      channels: [
        { name: '☕・Lo-Fi Lounge', type: ChannelType.GuildVoice },
        { name: '🌸・Cozy Chat [4]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🎮・Duo Gaming [2]', type: ChannelType.GuildVoice, userLimit: 2 },
        { name: '🎮・Squad Gaming [4]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🎵・Music Stream', type: ChannelType.GuildVoice },
        { name: '💤・AFK / Sleeping', type: ChannelType.GuildVoice }
      ]
    },

    // 6. STAFF PRIVACY
    {
      name: '╭・୨ 🛡️ ୧・STAFF ONLY',
      permissions: [
        { roleName: '👑 ✦ ┋ Founder', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '🛡️ ✦ ┋ Management', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '⚔️ ✦ ┋ Moderator', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・staff-chat', type: ChannelType.GuildText, topic: '🛡️ Staff communication & meeting notes' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: '🛡️ Automated audit log stream', isModLogChannel: true },
        { name: '🔊・Staff Call', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
