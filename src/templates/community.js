const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'community',
  name: '🌐 Community & Hangout Lounge',
  description: 'Clean, inviting server layout for social clubs, friend groups, YouTubers, and lively communities.',
  roles: [
    { name: '👑 Server Owner', color: '#E67E22', hoist: true, mentionable: false },
    { name: '🛡️ Administrator', color: '#E74C3C', hoist: true, mentionable: false },
    { name: '👮 Moderator', color: '#3498DB', hoist: true, mentionable: true },
    { name: '🌟 Server Booster', color: '#F47FFF', hoist: true, mentionable: false },
    { name: '💎 Active Member', color: '#1ABC9C', hoist: true, mentionable: false },
    { name: '🤖 Community Bot', color: '#7289DA', hoist: true, mentionable: false },
    { name: '👥 Member', color: '#95A5A6', hoist: false, mentionable: false }
  ],
  categories: [
    {
      name: '📌 ━━ WELCOME & INFO ━━',
      channels: [
        { name: '👋・welcome', type: ChannelType.GuildText, topic: 'New member greetings!' },
        { name: '📜・rules-and-faq', type: ChannelType.GuildText, topic: 'Server rules, guidelines and FAQ' },
        { name: '📢・announcements', type: ChannelType.GuildText, topic: 'Community announcements' },
        { name: '🎭・roles-selection', type: ChannelType.GuildText, topic: 'Select your colors and interest roles' }
      ]
    },
    {
      name: '💬 ━━ MAIN LOUNGE ━━',
      channels: [
        { name: '💬・general-lounge', type: ChannelType.GuildText, topic: 'Main conversation hub' },
        { name: '🙋・introductions', type: ChannelType.GuildText, topic: 'Introduce yourself to the community!' },
        { name: '📸・photos-and-life', type: ChannelType.GuildText, topic: 'Share pet photos, food, travel' },
        { name: '😂・memes-and-fun', type: ChannelType.GuildText, topic: 'Daily laughs and memes' },
        { name: '🎵・music-and-vibes', type: ChannelType.GuildText, topic: 'Share your favorite songs and playlists' },
        { name: '🤖・bot-playground', type: ChannelType.GuildText, topic: 'Spam bot commands here' }
      ]
    },
    {
      name: '🔊 ━━ VOICE CHAT ━━',
      channels: [
        { name: '☕・Casual Hangout', type: ChannelType.GuildVoice },
        { name: '🍿・Watch Together', type: ChannelType.GuildVoice },
        { name: '🎵・Music Chill', type: ChannelType.GuildVoice },
        { name: '🤫・Quiet Room', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '💤・AFK Lounge', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🛠️ ━━ MODERATION ━━',
      permissions: [
        { roleName: '🛡️ Administrator', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '👮 Moderator', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・staff-hq', type: ChannelType.GuildText, topic: 'Staff coordination and discussions' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: 'Audit log channel' },
        { name: '🔊・Staff Voice', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
