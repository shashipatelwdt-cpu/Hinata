const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'gaming',
  name: '🎮 Gaming & Esports Hub',
  description: 'Complete server setup for gaming communities, streamers, squads, and esports enthusiasts.',
  roles: [
    { name: '👑 Owner', color: '#FFD700', hoist: true, mentionable: false },
    { name: '🛡️ Admin', color: '#ED4245', hoist: true, mentionable: false },
    { name: '⚔️ Moderator', color: '#3498DB', hoist: true, mentionable: true },
    { name: '🎙️ Streamer / Creator', color: '#9B59B6', hoist: true, mentionable: true },
    { name: '💎 VIP Member', color: '#E91E63', hoist: true, mentionable: false },
    { name: '🎮 Gamer', color: '#2ECC71', hoist: true, mentionable: true },
    { name: '🤖 Bot', color: '#95A5A6', hoist: true, mentionable: false },
    { name: '👥 Member', color: '#99AAB5', hoist: false, mentionable: false }
  ],
  categories: [
    {
      name: '📢 ━━ INFORMATION ━━',
      channels: [
        { name: '📜・rules', type: ChannelType.GuildText, topic: 'Community rules and guidelines' },
        { name: '📢・announcements', type: ChannelType.GuildText, topic: 'Important server announcements' },
        { name: '🎁・giveaways', type: ChannelType.GuildText, topic: 'Server giveaways and events' },
        { name: '🎭・get-roles', type: ChannelType.GuildText, topic: 'Pick your reaction & self roles' }
      ]
    },
    {
      name: '💬 ━━ GENERAL CHAT ━━',
      channels: [
        { name: '👋・welcome', type: ChannelType.GuildText, topic: 'Welcome our newest members!' },
        { name: '💬・general-chat', type: ChannelType.GuildText, topic: 'Main hangout chat for everyone' },
        { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: 'Use bot commands here' },
        { name: '📷・media-clips', type: ChannelType.GuildText, topic: 'Share your epic gaming clips & photos' },
        { name: '🐸・memes', type: ChannelType.GuildText, topic: 'Gaming and community memes' }
      ]
    },
    {
      name: '🎮 ━━ GAMING ROOMS ━━',
      channels: [
        { name: '🎯・looking-for-group', type: ChannelType.GuildText, topic: 'Find teammates and squad up!' },
        { name: '🏆・valorant', type: ChannelType.GuildText, topic: 'Valorant lineups, clips & chats' },
        { name: '⛏️・minecraft', type: ChannelType.GuildText, topic: 'Minecraft builds and servers' },
        { name: '🚗・gta-roblox', type: ChannelType.GuildText, topic: 'GTA & Roblox sessions' },
        { name: '🔥・other-games', type: ChannelType.GuildText, topic: 'Discuss any other awesome games' }
      ]
    },
    {
      name: '🔊 ━━ VOICE CHANNELS ━━',
      channels: [
        { name: '🔊・Lobby 1', type: ChannelType.GuildVoice },
        { name: '🔊・Lobby 2', type: ChannelType.GuildVoice },
        { name: '🎮・Squad Duo (2)', type: ChannelType.GuildVoice, userLimit: 2 },
        { name: '🎮・Squad Trio (3)', type: ChannelType.GuildVoice, userLimit: 3 },
        { name: '🎮・Full Squad (5)', type: ChannelType.GuildVoice, userLimit: 5 },
        { name: '🎧・Streaming Lounge', type: ChannelType.GuildVoice },
        { name: '💤・AFK', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🛡️ ━━ STAFF AREA ━━',
      permissions: [
        { roleName: '🛡️ Admin', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '⚔️ Moderator', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・staff-chat', type: ChannelType.GuildText, topic: 'Staff private discussion' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: 'Automated moderation logs' },
        { name: '🔊・Staff Meeting Room', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
