const { ChannelType } = require('discord.js');

module.exports = {
  id: 'tactical-5v5',
  category: '🎮 Game Dev & Community',
  name: '⚡ 🎯 PROJECT 5v5 • GAME STUDIO & COMMUNITY 🎯 ⚡',
  description: 'Simple & clean Discord template for an upcoming 5v5 game: Dev logs, sneak peeks, community chat, and 5-man squad voice rooms.',
  roles: [
    { name: '👑 Game Creator', color: '#FF4655', hoist: true, mentionable: false, isOwnerRole: true },
    { name: '🛡️ Admin', color: '#E74C3C', hoist: true, mentionable: false, isAdminRole: true },
    { name: '🛠️ Dev Team', color: '#3498DB', hoist: true, mentionable: false },
    { name: '⚖️ Moderator', color: '#A29BFE', hoist: true, mentionable: true, isModRole: true },
    { name: '💎 VIP / Supporter', color: '#F47FFF', hoist: true, mentionable: false },
    { name: '📢 Updates Ping', color: '#7289DA', hoist: false, mentionable: true },
    { name: '🤖 Bots', color: '#74B9FF', hoist: true, mentionable: false, isBotRole: true },
    { name: '👥 Member', color: '#99AAB5', hoist: false, mentionable: false, isMemberRole: true }
  ],
  categories: [
    // 1. WELCOME & INFO
    {
      name: '📌・━━ ⚡ WELCOME & INFO ⚡ ━━・📌',
      channels: [
        { name: '👋・welcome', type: ChannelType.GuildText, topic: '⚡ Welcome to our upcoming 5v5 game community!', isWelcomeChannel: true },
        { name: '📜・rules', type: ChannelType.GuildText, topic: '📜 Server rules and community guidelines', isRulesChannel: true },
        { name: '📢・announcements', type: ChannelType.GuildText, topic: '📢 Important game development announcements & server updates' }
      ]
    },

    // 2. DEV PROGRESS & SNEAK PEEKS
    {
      name: '🛠️・━━ 🚀 DEV PROGRESS & LEAKS 🚀 ━━・🛠️',
      channels: [
        { name: '🚀・dev-updates', type: ChannelType.GuildText, topic: '📝 Behind-the-scenes dev logs, engine updates & progress' },
        { name: '🎨・sneak-peeks', type: ChannelType.GuildText, topic: '🎨 Character 3D models, weapon designs, map art & teasers' },
        { name: '💡・game-ideas', type: ChannelType.GuildText, topic: '💬 Share your suggestions, abilities, and mechanics ideas for the game' }
      ]
    },

    // 3. COMMUNITY & GAMING
    {
      name: '💬・━━ ☕ COMMUNITY CHAT ☕ ━━・💬',
      channels: [
        { name: '💬・general-chat', type: ChannelType.GuildText, topic: '🔥 Main hangout and discussion room' },
        { name: '🎮・gaming-talk', type: ChannelType.GuildText, topic: '🎯 Talk about games, find gaming friends while waiting' },
        { name: '🎬・clips-and-media', type: ChannelType.GuildText, topic: '🎥 Share your gaming clips, screenshots, and memes' },
        { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: '🤖 Music & bot commands' }
      ]
    },

    // 4. SQUAD VOICE CHANNELS
    {
      name: '🔊・━━ 🎙️ SQUAD VOICE 🎙️ ━━・🔊',
      channels: [
        { name: '🔊・Lobby Lounge', type: ChannelType.GuildVoice },
        { name: '🎮・Squad 1 (5)', type: ChannelType.GuildVoice, userLimit: 5 },
        { name: '🎮・Squad 2 (5)', type: ChannelType.GuildVoice, userLimit: 5 },
        { name: '👥・Duo / Trio (3)', type: ChannelType.GuildVoice, userLimit: 3 },
        { name: '💤・AFK', type: ChannelType.GuildVoice }
      ]
    },

    // 5. STAFF ONLY
    {
      name: '🛡️・━━ 🔒 STAFF ONLY 🔒 ━━・🛡️',
      channels: [
        { name: '🔒・staff-chat', type: ChannelType.GuildText, topic: '🔒 Private chat for developers and server moderators' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: '📜 Automated moderation and audit stream', isModLogChannel: true },
        { name: '🔒・Staff Voice', type: ChannelType.GuildVoice, userLimit: 10 }
      ]
    }
  ]
};
