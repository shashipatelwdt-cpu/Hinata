const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'owo-arcade',
  category: '🎲 Bot Gaming & Economy',
  name: '🐾 🎰 OWO & BOT GAMING ARCADE SANCTUARY 🎰 🐾',
  description: 'Ultimate Aesthetic Bot Gaming Server for OwO, Nomi, Karuta & Economy bots with dedicated Hunting Zones, High-Stakes Casino, Market Trades, Middleman Support & Auto Systems.',
  roles: [
    { name: '👑 ＧＲＡＮＤ ＭＡＳＴＥＲ (Owner)', color: '#FFD700', hoist: true, mentionable: false, isOwnerRole: true },
    { name: '🛡️ ＡＲＣＡＤＥ ＡＤＭＩＮ', color: '#FF4757', hoist: true, mentionable: false, isAdminRole: true },
    { name: '⚔️ ＳＡＮＣＴＵＡＲＹ ＭＯＤ', color: '#2ED573', hoist: true, mentionable: true, isModRole: true },
    { name: '⚖️ ＴＲＵＳＴＥＤ ＭＩＤＤＬＥＭＡＮ', color: '#FFA502', hoist: true, mentionable: true },
    { name: '🎁 ＥＶＥＮＴ & ＤＲＯＰ ＨＯＳＴ', color: '#FD79A8', hoist: true, mentionable: true },
    { name: '💎 ＨＩＧＨ ＲＯＬＬＥＲ (VIP)', color: '#A55EEA', hoist: true, mentionable: false },
    { name: '🐾 ＭＹＴＨＩＣ ＨＵＮＴＥＲ (Lv.50+)', color: '#1E90FF', hoist: true, mentionable: false },
    { name: '⚡ ＢＯＴ ＧＲＩＮＤＥＲ', color: '#00D2D3', hoist: true, mentionable: false },
    { name: '🤖 ＧＡＭＥ ＢＯＴＳ', color: '#747D8C', hoist: true, mentionable: false, isBotRole: true },
    { name: '👥 ＡＲＣＡＤＥ ＣＩＴＩＺＥＮ', color: '#DFE6E9', hoist: false, mentionable: false, isMemberRole: true }
  ],
  categories: [
    // 1. GATEWAY
    {
      name: '🌸・━━ 🐾 ＧＡＴＥＷＡＹ 🐾 ━━・🌸',
      channels: [
        { name: '👋・welcome-sanctuary', type: ChannelType.GuildText, topic: '🌸 Welcome to OwO & Bot Gaming Arcade Sanctuary!', isWelcomeChannel: true },
        { name: '📜・arcade-rules', type: ChannelType.GuildText, topic: '📜 Safe grinding, anti-cheat & trading rules', isRulesChannel: true },
        { name: '⚡・verify-here', type: ChannelType.GuildText, topic: '🛡️ 1-Click Verification to unlock all grind & casino zones' },
        { name: '📢・bot-announcements', type: ChannelType.GuildText, topic: '🏮 Game updates, spawn rate boosts & server news' },
        { name: '🎭・bot-pings-and-roles', type: ChannelType.GuildText, topic: '🔔 Pick Daily Reminder, Hunt Ping & Giveaway roles', isRolesChannel: true },
        { name: '💎・booster-rewards', type: ChannelType.GuildText, topic: '✨ Exclusive coin multipliers, VIP casino & custom tags' },
        { name: '🚪・leave-goodbyes', type: ChannelType.GuildText, topic: '👋 Member departure logs' }
      ]
    },

    // 2. GIVEAWAYS & DROPS
    {
      name: '🎉・━━ 🎁 ＤＲＯＰＳ & ＧＩＶＥＡＷＡＹＳ 🎁 ━━・🎉',
      channels: [
        { name: '🎉・nitro-and-cash-drops', type: ChannelType.GuildText, topic: '🎁 Discord Nitro, Steam Cards & Real Cash Giveaways' },
        { name: '💰・millions-currency-drops', type: ChannelType.GuildText, topic: '💸 OwO Cowoncy, Nomi Coins, Mudae Kakera & Gems' },
        { name: '🐾・mythic-pet-giveaways', type: ChannelType.GuildText, topic: '🐾 Rare animals, God roll weapons & loot crates' },
        { name: '🏆・giveaway-winners', type: ChannelType.GuildText, topic: '👑 Hall of winners & prize claim proof logs' }
      ]
    },

    // 3. OWO & NOMI HUNTING / GRIND ZONES
    {
      name: '🐾・━━ ⚡ ＨＵＮＴ & ＧＲＩＮＤ ⚡ ━━・🐾',
      channels: [
        { name: '🐾・main-hunt-and-battle', type: ChannelType.GuildText, topic: '🐾 Primary fast hunting, catching animals & battles (hunt/battle/pray)' },
        { name: '⚡・speed-grind-fast', type: ChannelType.GuildText, topic: '⚡ High-speed non-stop farming channel' },
        { name: '⚔️・pvp-arena-duels', type: ChannelType.GuildText, topic: '⚔️ Challenge players to PvP duels & weapon battles' },
        { name: '🌲・zoo-and-showcase', type: ChannelType.GuildText, topic: '🦁 Display your animal zoo, pet stats & rare inventories' },
        { name: '💍・marry-and-affinity', type: ChannelType.GuildText, topic: '💖 Propose, marry, check love affinity & ring stats' },
        { name: '📖・grinding-guide-and-tips', type: ChannelType.GuildText, topic: '💡 Top farming tactics, weapon tier lists & quick coin guides' }
      ]
    },

    // 4. CASINO & HIGH-ROLLER BETTING
    {
      name: '🎰・━━ 🎲 ＣＡＳＩＮＯ & ＢＥＴＳ 🎲 ━━・🎰',
      channels: [
        { name: '🎰・slots-and-roulette', type: ChannelType.GuildText, topic: '🎰 Spin slot machines & roulette wheels' },
        { name: '🪙・coinflip-and-dice', type: ChannelType.GuildText, topic: '💰 50/50 high-stakes coinflips, dice rolls & bets' },
        { name: '🃏・blackjack-tables', type: ChannelType.GuildText, topic: '🃏 Play 21 Blackjack vs Bot Dealer' },
        { name: '💎・high-rollers-vip', type: ChannelType.GuildText, topic: '👑 1M+ High-stakes exclusive gambling room for VIPs' }
      ]
    },

    // 5. MARKETPLACE & SAFE TRADING
    {
      name: '💸・━━ 🔄 ＭＡＲＫＥＴ & ＴＲＡＤＥ 🔄 ━━・💸',
      channels: [
        { name: '💸・market-trade-hub', type: ChannelType.GuildText, topic: '🤝 Buy, sell & trade animals, items, weapons & cards' },
        { name: '🔄・cross-bot-exchange', type: ChannelType.GuildText, topic: '💱 Exchange currency across OwO, Nomi, Karuta, Anigame' },
        { name: '🛡️・middleman-desk', type: ChannelType.GuildText, topic: '⚖️ Request verified Middleman for 100% scam-free big deals' },
        { name: '⭐・vouches-and-rep', type: ChannelType.GuildText, topic: '🌟 Post legitimate buyer/seller reputation proofs' }
      ]
    },

    // 6. MULTI-BOT ARENA & MINIGAMES
    {
      name: '🤖・━━ 🎮 ＢＯＴ ＡＲＥＮＡ 🎮 ━━・🤖',
      channels: [
        { name: '🤖・bot-spam-1', type: ChannelType.GuildText, topic: '🤖 General bot commands for Dank Memer, Karuta, Mudae' },
        { name: '🤖・bot-spam-2', type: ChannelType.GuildText, topic: '🤖 Backup command room for overflow bot spam' },
        { name: '🎨・anigame-and-cards', type: ChannelType.GuildText, topic: '🃏 Anime card collections, drops & card claiming' },
        { name: '🐸・dank-memer-robbery', type: ChannelType.GuildText, topic: '💰 Heists, passive mode, fishing & pet work' }
      ]
    },

    // 7. COMMUNITY & FLEX LOUNGE
    {
      name: '💬・━━ 🍵 ＡＲＣＡＤＥ ＬＯＵＮＧＥ 🍵 ━━・💬',
      channels: [
        { name: '💬・arcade-main-chat', type: ChannelType.GuildText, topic: '🍵 Chill, talk & hang out with all community members' },
        { name: '📸・rare-drops-flex', type: ChannelType.GuildText, topic: '✨ Show off Mythical animals, jackpot wins & God items' },
        { name: '🐸・memes-and-gambling-fails', type: ChannelType.GuildText, topic: '😂 Hilarious memes, bankrupt fails & lucky clutches' },
        { name: '💡・arcade-suggestions', type: ChannelType.GuildText, topic: '🏮 Suggest new bot games, role rewards & features' }
      ]
    },

    // 8. VOICE CHANNELS & MUSIC
    {
      name: '🔊・━━ 🎐 ＧＲＩＮＤ ＶＯＩＣＥ & ＭＵＳＩＣ 🎐 ━━・🔊',
      channels: [
        { name: '🍵・Arcade Lounge VC', type: ChannelType.GuildVoice },
        { name: '🐾・Duo Grinders (2)', type: ChannelType.GuildVoice, userLimit: 2 },
        { name: '🐾・Squad Grinders (5)', type: ChannelType.GuildVoice, userLimit: 5 },
        { name: '🎰・High Stakes Casino VC', type: ChannelType.GuildVoice, userLimit: 10 },
        { name: '🎵・24/7 Lo-Fi Chill Beats', type: ChannelType.GuildVoice },
        { name: '💤・AFK Grinder Slumber', type: ChannelType.GuildVoice }
      ]
    },

    // 9. STAFF HQ & SECURITY
    {
      name: '🛡️・━━ 🔒 ＳＴＡＦＦ ＨＱ 🔒 ━━・🛡️',
      permissions: [
        { roleName: '👑 ＧＲＡＮＤ ＭＡＳＴＥＲ (Owner)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🛡️ ＡＲＣＡＤＥ ＡＤＭＩＮ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '⚔️ ＳＡＮＣＴＵＡＲＹ ＭＯＤ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '⚖️ ＴＲＵＳＴＥＤ ＭＩＤＤＬＥＭＡＮ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] }
      ],
      channels: [
        { name: '🔒・staff-hq', type: ChannelType.GuildText, topic: '🔒 Private leadership command center & planning' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: '🛡️ Automated audit log stream & AutoMod filters', isModLogChannel: true },
        { name: '🎫・scam-and-ticket-desk', type: ChannelType.GuildText, topic: '📩 Support tickets, trade disputes & report center', isTicketsChannel: true },
        { name: '🔊・Staff War Room VC', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
