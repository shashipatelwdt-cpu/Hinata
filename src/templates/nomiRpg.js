const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'nomi-rpg',
  category: '🍜 Nomi Culinary RPG',
  name: '🍜 NOMI BOT GAME — Official Discord Culinary RPG Sanctuary',
  description: 'Official Master Discord Server for NOMI Bot Game (https://nomibot.netlify.app/) — Cooking Arenas, Restaurant Tycoon, SRS Quests, Recipe Crafting, Founder Lounge & Support Hub.',
  roles: [
    { name: '👑 ୨ Head Chef / Owner ୧', color: '#FFB703', hoist: true, mentionable: false, isOwnerRole: true },
    { name: '🛡️ ୨ Executive Chef (Admin) ୧', color: '#FB8500', hoist: true, mentionable: false, isAdminRole: true },
    { name: '⚔️ ୨ Sous Chef (Moderator) ୧', color: '#023047', hoist: true, mentionable: true, isModRole: true },
    { name: '👑 ୨ NOMI Founder (#10000001+) ୧', color: '#FFD700', hoist: true, mentionable: true },
    { name: '💎 ୨ Michelin Star (VIP Chef) ୧', color: '#8ECAE6', hoist: true, mentionable: false },
    { name: '🍳 ୨ Master Chef (Lv.50+) ୧', color: '#E76F51', hoist: true, mentionable: false },
    { name: '🤖 ୨ NOMI Official Bot ୧', color: '#2A9D8F', hoist: true, mentionable: false, isBotRole: true },
    { name: '📢 ୨ Recipe & Update Ping ୧', color: '#7289DA', hoist: false, mentionable: true },
    { name: '🎁 ୨ Drop & Event Ping ୧', color: '#FDCB6E', hoist: false, mentionable: true },
    { name: '👨‍🍳 ୨ Apprentice Chef (Member) ୧', color: '#DFE6E9', hoist: false, mentionable: false, isMemberRole: true }
  ],
  categories: [
    // 1. WELCOME & PORTAL
    {
      name: '🍜・━━ ⛩️ ＲＥＳＴＡＵＲＡＮＴ ＥＮＴＲＹ ⛩️ ━━・🍜',
      channels: [
        { name: '👋・welcome-arrivals', type: ChannelType.GuildText, topic: '🍜 Welcome to the Official NOMI Culinary RPG Sanctuary! Read info & get started.', isWelcomeChannel: true },
        { name: '📜・kitchen-rules', type: ChannelType.GuildText, topic: '📜 Official NOMI Discord guidelines, trading rules & fair play etiquette', isRulesChannel: true },
        { name: '📢・nomi-updates', type: ChannelType.GuildAnnouncement, topic: '🏮 New recipes, patch notes, game updates & bot announcements' },
        { name: '🎭・chef-roles', type: ChannelType.GuildText, topic: '🌸 Pick your update pings, recipe alerts, and notification roles', isRolesChannel: true },
        { name: '🌐・web-portal-links', type: ChannelType.GuildText, topic: '🔗 Official NOMI website (https://nomibot.netlify.app/) & Kitchen Simulator' }
      ]
    },

    // 2. FOUNDER'S CIRCLE & VIP
    {
      name: '👑・━━ ✨ ＦＯＵＮＤＥＲ ＳＡＮＣＴＵＡＲＹ ✨ ━━・👑',
      channels: [
        { name: '👑・founder-lounge', type: ChannelType.GuildText, topic: '✨ Exclusive lounge for verified NOMI Founder ID (#10000001+) holders' },
        { name: '💎・booster-kitchen-perks', type: ChannelType.GuildText, topic: '✨ Boost perks, custom recipe cosmetics & coin bonuses' },
        { name: '🏆・hall-of-fame', type: ChannelType.GuildText, topic: '📊 Top wealthy chefs, dish masters & leaderboard champions' }
      ]
    },

    // 3. NOMI SPAM & GRINDING (SPAM 1, 2, 3, CRAFT, QUEST)
    {
      name: '🍙・━━ ⚡ ＮＯＭＩ ＳＰＡＭ ⚡ ━━・🍙',
      channels: [
        { name: '🍙・nomi-spam-1', type: ChannelType.GuildText, topic: '⚡ Primary fast Nomi spam, cooking (/cook) & grinds' },
        { name: '🍙・nomi-spam-2', type: ChannelType.GuildText, topic: '⚡ Secondary fast Nomi spam & farming channel' },
        { name: '🍙・nomi-spam-3', type: ChannelType.GuildText, topic: '⚡ High-speed non-stop Nomi spam channel' },
        { name: '🔨・crafting-and-boxes', type: ChannelType.GuildText, topic: '🪨 Craft tools, open mystery boxes (/box) & manage materials (Wood, Stone, Ore)' },
        { name: '📜・srs-quests-and-daily', type: ChannelType.GuildText, topic: '⚔️ Complete Daily, Weekly, Quiz & Special Quests for massive XP and cash' },
        { name: '🏪・nomi-shop-and-trade', type: ChannelType.GuildText, topic: '💰 Buy XP boosts, wallet shields, and trade rare dishes (/trade)' },
        { name: '💡・culinary-guide-and-recipes', type: ChannelType.GuildText, topic: '📖 Discovery recipes, synthesis formulas & beginner tips' }
      ]
    },

    // 4. COMMUNITY & SOCIAL HANGOUT
    {
      name: '💬・━━ 🍵 ＴＯＫＹＯ ＲＡＭＥＮ ＬＯＵＮＧＥ 🍵 ━━・💬',
      channels: [
        { name: '🍵・ramen-bar-chat', type: ChannelType.GuildText, topic: '🌸 Main chill lounge to chat with other chefs & players' },
        { name: '📸・food-and-media', type: ChannelType.GuildText, topic: '🍲 Share real-life food photos, anime cooking clips & setups' },
        { name: '🐸・food-memes', type: ChannelType.GuildText, topic: '🍙 Culinary memes, funny cook fails & gamer jokes' },
        { name: '🤝・chef-friendships', type: ChannelType.GuildText, topic: '💖 Add friends, send daily gifts & build friendship bonds' }
      ]
    },

    // 5. SUPPORT & FEEDBACK
    {
      name: '📩・━━ 🏮 ＳＵＰＰＯＲＴ & ＢＵＧＳ 🏮 ━━・📩',
      channels: [
        { name: '📩・open-a-ticket', type: ChannelType.GuildText, topic: '🎫 Click button below to contact staff for game help or Founder ID claims' },
        { name: '🐛・bug-reports', type: ChannelType.GuildText, topic: '🐞 Report game bugs, website glitches or command errors' },
        { name: '💡・game-suggestions', type: ChannelType.GuildText, topic: '✨ Suggest new recipes, features, or balance changes' }
      ]
    },

    // 6. VOICE CHANNELS
    {
      name: '🔊・━━ 🎐 ＬＯＦＩ & ＫＩＴＣＨＥＮ ＶＯＩＣＥ 🎐 ━━・🔊',
      channels: [
        { name: '🍵・Ramen Bar Chill', type: ChannelType.GuildVoice },
        { name: '🍳・Duo Kitchen (2)', type: ChannelType.GuildVoice, userLimit: 2 },
        { name: '🍳・Squad Kitchen (4)', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🎵・24/7 Lo-Fi Cooking Beats', type: ChannelType.GuildVoice },
        { name: '💤・Food Coma (AFK)', type: ChannelType.GuildVoice }
      ]
    },

    // 7. STAFF COMMAND HQ
    {
      name: '🛡️・━━ 🏯 ＥＸＥＣＵＴＩＶＥ ＳＴＡＦＦ 🏯 ━━・🛡️',
      permissions: [
        { roleName: '👑 ୨ Head Chef / Owner ୧', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '🛡️ ୨ Executive Chef (Admin) ୧', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '⚔️ ୨ Sous Chef (Moderator) ୧', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・staff-hq', type: ChannelType.GuildText, topic: '🏯 Private staff command room & event planning' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: '🛡️ Automated moderation & audit logs', isModLogChannel: true },
        { name: '🔊・Staff Conference', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
