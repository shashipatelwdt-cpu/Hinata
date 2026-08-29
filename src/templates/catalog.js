const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  // ================= 🌸 JAPANESE NOMI BOT ARCADE & GIVEAWAYS =================
  'nomi-japanese': {
    id: 'nomi-japanese',
    category: '🎨 Anime & Gaming',
    name: '🌸 ⛩️ TOKYO NOMI ARCADE & GIVEAWAY SANCTUARY ⛩️ 🌸',
    description: 'Ultra-aesthetic Japanese & Anime Bot Gaming server with dedicated Nomi Game Grinds, Spawns, Battles, Casino & Nitro Giveaways!',
    roles: [
      { name: '🌸 ⛩️ ＳＨＯＧＵＮ (Owner)', color: '#FF7675', hoist: true, mentionable: false, isOwnerRole: true },
      { name: '⚔️ 🏯 ＤＡＩＭＹＯ (Admin)', color: '#E84393', hoist: true, mentionable: false, isAdminRole: true },
      { name: '🥷 🏮 ＳＨＩＮＯＢＩ (Moderator)', color: '#FD79A8', hoist: true, mentionable: true, isModRole: true },
      { name: '🎁 ✨ ＥＶＥＮＴ ＨＯＳＴ (Giveaway Manager)', color: '#FDCB6E', hoist: true, mentionable: true },
      { name: '🎴 👑 ＮＯＭＩ ＥＭＰＥＲＯＲ', color: '#00CEC9', hoist: true, mentionable: true },
      { name: '🍙 ⚔️ ＮＯＭＩ ＭＡＳＴＥＲ (Lv.50+)', color: '#81ECEC', hoist: true, mentionable: false },
      { name: '🎲 ⚡ ＢＯＴ ＧＡＭＥＲ', color: '#A29BFE', hoist: true, mentionable: false },
      { name: '💎 🌸 ＶＩＰ ＳＡＭＵＲＡＩ', color: '#E056FD', hoist: true, mentionable: false },
      { name: '🤖 ⚡ ＭＥＣＨＡ (Bots)', color: '#74B9FF', hoist: true, mentionable: false, isBotRole: true },
      { name: '👥 🎐 ＶＩＬＬＡＧＥＲ (Members)', color: '#DFE6E9', hoist: false, mentionable: false, isMemberRole: true }
    ],
    categories: [
      {
        name: '🌸・━━ ⛩️ ＷＥＬＣＯＭＥ & ＩＮＦＯ ⛩️ ━━・🌸',
        channels: [
          { name: '👋・welcome-arrivals', type: ChannelType.GuildText, topic: '🌸 Welcome to Tokyo Nomi & Bot Gaming Sanctuary!', isWelcomeChannel: true },
          { name: '📜・shinto-rules', type: ChannelType.GuildText, topic: '📜 Server etiquette & bot grind guidelines' },
          { name: '📢・temple-announcements', type: ChannelType.GuildText, topic: '🏮 Server announcements, bot updates & event news' },
          { name: '🎭・aesthetic-roles', type: ChannelType.GuildText, topic: '🌸 Pick your notification, bot ping & aesthetic roles' },
          { name: '💎・booster-perks', type: ChannelType.GuildText, topic: '✨ Exclusive perks, custom roles & booster benefits' }
        ]
      },
      {
        name: '🎉・━━ 🎁 ＧＩＶＥＡＷＡＹＳ & ＤＲＯＰＳ 🎁 ━━・🎉',
        channels: [
          { name: '🎉・nitro-giveaways', type: ChannelType.GuildText, topic: '🎁 Discord Nitro, Game Passes, Roles & Gift Cards' },
          { name: '🍙・nomi-currency-drops', type: ChannelType.GuildText, topic: '💰 Free Nomi coins, items, cards & in-game drops' },
          { name: '🏆・giveaway-winners', type: ChannelType.GuildText, topic: '👑 Hall of winners, prize proof & claim logs' },
          { name: '✨・special-events', type: ChannelType.GuildText, topic: '🏮 Seasonal anime festivals, quizzes & tournaments' }
        ]
      },
      {
        name: '🎴・━━ 🍙 ＮＯＭＩ ＢＯＴ ＡＲＣＡＤＥ 🍙 ━━・🎴',
        channels: [
          { name: '🍙・nomi-main-grind', type: ChannelType.GuildText, topic: '🍙 Primary high-speed grinding zone for Nomi Game' },
          { name: '🎴・nomi-spawns-catch', type: ChannelType.GuildText, topic: '⚡ Fast spawns, hunting & card catch alerts' },
          { name: '⚔️・nomi-duels-battles', type: ChannelType.GuildText, topic: '⚔️ PvP battle arena & guild challenges' },
          { name: '💰・nomi-market-trade', type: ChannelType.GuildText, topic: '💸 Trade characters, sell items & currency exchange' },
          { name: '🎲・nomi-casino-gambling', type: ChannelType.GuildText, topic: '🎰 High-stakes betting, coinflips, dice & slots' },
          { name: '📖・nomi-guide-and-help', type: ChannelType.GuildText, topic: '💡 Beginner guide, tier lists & top strategy tips' }
        ]
      },
      {
        name: '🤖・━━ ⚡ ＢＯＴ ＡＲＥＮＡ ⚡ ━━・🤖',
        channels: [
          { name: '🤖・bot-commands-1', type: ChannelType.GuildText, topic: '🤖 General bot commands & utilities' },
          { name: '🤖・bot-commands-2', type: ChannelType.GuildText, topic: '🤖 Secondary spam-free bot command room' },
          { name: '🎲・owo-and-minigames', type: ChannelType.GuildText, topic: '🐾 OwO, Karuta, Anigame, Mudae & fun mini-games' },
          { name: '🎵・lofi-music-commands', type: ChannelType.GuildText, topic: '🎶 Queue J-Pop, Anime OSTs & Lo-Fi beats' }
        ]
      },
      {
        name: '💬・━━ 🍵 ＳＡＫＵＲＡ ＬＯＵＮＧＥ 🍵 ━━・💬',
        channels: [
          { name: '🍵・tea-house-chat', type: ChannelType.GuildText, topic: '🌸 Main Japanese lounge chat for all travelers' },
          { name: '📸・anime-and-media', type: ChannelType.GuildText, topic: '🎏 Wallpapers, screenshots, anime clips & art' },
          { name: '🐸・ramen-memes', type: ChannelType.GuildText, topic: '🍙 Daily memes, wholesome shitposts & comedy' },
          { name: '💡・arcade-suggestions', type: ChannelType.GuildText, topic: '🏮 Suggest new bot games, events or improvements' }
        ]
      },
      {
        name: '🔊・━━ 🎐 ＬＯＦＩ & ＶＯＩＣＥ 🎐 ━━・🔊',
        channels: [
          { name: '🍵・Tea Garden Lounge', type: ChannelType.GuildVoice },
          { name: '🌸・Sakura Chill (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🍙・Nomi Grinders Duo (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🍙・Nomi Squad Grind (5)', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🎵・Tokyo 24/7 Lo-Fi Beats', type: ChannelType.GuildVoice },
          { name: '💤・Zen Slumber (AFK)', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️・━━ 🏯 ＳＨＯＧＵＮＡＴＥ ＳＴＡＦＦ 🏯 ━━・🛡️',
        permissions: [
          { roleName: '🌸 ⛩️ ＳＨＯＧＵＮ (Owner)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { roleName: '⚔️ 🏯 ＤＡＩＭＹＯ (Admin)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { roleName: '🥷 🏮 ＳＨＩＮＯＢＩ (Moderator)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ],
        channels: [
          { name: '🔒・shogunate-hq', type: ChannelType.GuildText, topic: '🏯 Private staff command room & planning' },
          { name: '📜・mod-logs', type: ChannelType.GuildText, topic: '🛡️ Automated audit log stream', isModLogChannel: true },
          { name: '🔊・Staff War Room', type: ChannelType.GuildVoice }
        ]
      }
    ]
  },

  // ================= 🎮 GAMING PRESETS =================
  'gaming-all': {
    id: 'gaming-all',
    category: '🎮 Gaming',
    name: '🎮 All-In-One Ultimate Gaming Lounge',
    description: 'All-inclusive server for multi-game communities (Valorant, Minecraft, GTA, Roblox, Clips, Squad Voice).',
    roles: [
      { name: '👑 Server Owner', color: '#FFD700', hoist: true, mentionable: false, isOwnerRole: true },
      { name: '🛡️ Head Admin', color: '#ED4245', hoist: true, mentionable: false, isAdminRole: true },
      { name: '⚔️ Game Moderator', color: '#3498DB', hoist: true, mentionable: true },
      { name: '🎙️ Official Streamer', color: '#9B59B6', hoist: true, mentionable: true },
      { name: '💎 VIP Member', color: '#E91E63', hoist: true, mentionable: false },
      { name: '🎮 Pro Gamer', color: '#2ECC71', hoist: true, mentionable: true },
      { name: '🤖 Bot', color: '#95A5A6', hoist: true, mentionable: false, isBotRole: true },
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
          { name: '👋・welcome', type: ChannelType.GuildText, topic: 'Welcome our newest members!', isWelcomeChannel: true },
          { name: '💬・general-chat', type: ChannelType.GuildText, topic: 'Main hangout chat for everyone' },
          { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: 'Use bot commands here' },
          { name: '📷・media-clips', type: ChannelType.GuildText, topic: 'Share your epic gaming clips & photos' },
          { name: '🐸・memes', type: ChannelType.GuildText, topic: 'Gaming and community memes' }
        ]
      },
      {
        name: '🎮 ━━ GAME ROOMS ━━',
        channels: [
          { name: '🎯・looking-for-group', type: ChannelType.GuildText, topic: 'Find teammates and squad up!' },
          { name: '🏆・valorant-chat', type: ChannelType.GuildText, topic: 'Valorant lineups, clips & chats' },
          { name: '⛏️・minecraft-chat', type: ChannelType.GuildText, topic: 'Minecraft builds and servers' },
          { name: '🚗・gta-roblox', type: ChannelType.GuildText, topic: 'GTA & Roblox sessions' },
          { name: '🔥・other-games', type: ChannelType.GuildText, topic: 'Discuss any other awesome games' }
        ]
      },
      {
        name: '🔊 ━━ VOICE CHANNELS ━━',
        channels: [
          { name: '🔊・General Lounge', type: ChannelType.GuildVoice },
          { name: '🎮・Squad Duo 1 (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🎮・Squad Duo 2 (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🎮・Squad Trio (3)', type: ChannelType.GuildVoice, userLimit: 3 },
          { name: '🎮・Full Squad 1 (5)', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🎮・Full Squad 2 (5)', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🎧・Streaming Lounge', type: ChannelType.GuildVoice },
          { name: '💤・AFK', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF HQ ━━',
        permissions: [
          { roleName: '🛡️ Head Admin', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { roleName: '⚔️ Game Moderator', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ],
        channels: [
          { name: '🔒・staff-chat', type: ChannelType.GuildText, topic: 'Staff private discussion' },
          { name: '📜・mod-logs', type: ChannelType.GuildText, topic: 'Automated moderation logs', isModLogChannel: true },
          { name: '🔊・Staff Meeting Room', type: ChannelType.GuildVoice }
        ]
      }
    ]
  },

  'gaming-fps': {
    id: 'gaming-fps',
    category: '🎮 Gaming',
    name: '🎯 Valorant & FPS Tactical Hub',
    description: 'Optimized for tactical shooter squads, rank grinds, lineup sharing, and scrim voice rooms.',
    roles: [
      { name: '👑 Radiant / Lead', color: '#FF4655', hoist: true, isOwnerRole: true },
      { name: '🛡️ Immortal / Mod', color: '#B3285B', hoist: true, isAdminRole: true },
      { name: '💎 Ascendant / VIP', color: '#16A085', hoist: true },
      { name: '⭐ Diamond / Pro', color: '#8E44AD', hoist: true },
      { name: '🎯 Duelist', color: '#E74C3C', hoist: false },
      { name: '🛡️ Sentinel', color: '#3498DB', hoist: false },
      { name: '🧠 Initiator', color: '#F1C40F', hoist: false },
      { name: '☁️ Controller', color: '#95A5A6', hoist: false },
      { name: '🤖 Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📢 ━━ FPS HQ ━━',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText, topic: 'Server guidelines' },
          { name: '📢・announcements', type: ChannelType.GuildText, topic: 'Patches & Tournament updates' },
          { name: '🎭・agent-roles', type: ChannelType.GuildText, topic: 'Pick your Agent & Rank roles' }
        ]
      },
      {
        name: '💬 ━━ GENERAL & LFG ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・fps-lounge', type: ChannelType.GuildText, topic: 'Rank grind chats & setups' },
          { name: '🎯・lfg-competitive', type: ChannelType.GuildText, topic: 'Find 5-stack teammates' },
          { name: '📹・ace-highlights', type: ChannelType.GuildText, topic: 'Post your insane clips & aces' },
          { name: '💡・lineups-and-strats', type: ChannelType.GuildText, topic: 'Share lineups, setups, flashes' }
        ]
      },
      {
        name: '🔊 ━━ COMPETITIVE COMMS ━━',
        channels: [
          { name: '🏆・Ranked 5-Stack 1', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🏆・Ranked 5-Stack 2', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🎯・Competitive Trio', type: ChannelType.GuildVoice, userLimit: 3 },
          { name: '🎯・Duo Grinding 1', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🎯・Duo Grinding 2', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🍿・VOD Review Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'gaming-minecraft': {
    id: 'gaming-minecraft',
    category: '🎮 Gaming',
    name: '⛏️ Minecraft SMP & Server Community',
    description: 'For Minecraft survival servers, SMPs, builders, redstone engineers, and modpack players.',
    roles: [
      { name: '👑 Server Owner', color: '#2ECC71', hoist: true, isOwnerRole: true },
      { name: '🛡️ SMP Admin', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '⚔️ SMP Moderator', color: '#E67E22', hoist: true },
      { name: '🏛️ Master Builder', color: '#F39C12', hoist: true },
      { name: '⚙️ Redstone Engineer', color: '#C0392B', hoist: true },
      { name: '💎 VIP Donator', color: '#1ABC9C', hoist: true },
      { name: '⛏️ Miner / Member', color: '#95A5A6', hoist: false },
      { name: '🤖 Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📜 ━━ SERVER INFO ━━',
        channels: [
          { name: '📜・smp-rules', type: ChannelType.GuildText, topic: 'Griefing rules & guidelines' },
          { name: '🌐・server-ip-info', type: ChannelType.GuildText, topic: 'IP address, port, and whitelist details' },
          { name: '📢・server-updates', type: ChannelType.GuildText, topic: 'Server resets, events, plugins' }
        ]
      },
      {
        name: '💬 ━━ SMP COMMUNITY ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-chat', type: ChannelType.GuildText, topic: 'SMP general discussions' },
          { name: '🏛️・build-showcase', type: ChannelType.GuildText, topic: 'Show your bases and builds' },
          { name: '⚙️・redstone-contraptions', type: ChannelType.GuildText, topic: 'Farms and automation' },
          { name: '🏪・smp-market-trade', type: ChannelType.GuildText, topic: 'In-game trading and shops' },
          { name: '🗺️・seed-and-coords', type: ChannelType.GuildText, topic: 'Base locations & nether hub coordinates' }
        ]
      },
      {
        name: '🔊 ━━ SMP PROXIMITY & COMMS ━━',
        channels: [
          { name: '🔊・SMP Voice 1', type: ChannelType.GuildVoice },
          { name: '🔊・SMP Voice 2', type: ChannelType.GuildVoice },
          { name: '⛏️・Mining Session (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🏛️・Building Project (5)', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '💤・AFK Pool', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ ADMIN HQ ━━',
        channels: [
          { name: '🔒・staff-logs', type: ChannelType.GuildText, isModLogChannel: true },
          { name: '🔒・grief-reports', type: ChannelType.GuildText }
        ]
      }
    ]
  },

  'gaming-battleroyale': {
    id: 'gaming-battleroyale',
    category: '🎮 Gaming',
    name: '🔥 Battle Royale & BGMI / FreeFire / Warzone Hub',
    description: 'Fast-paced action hub for mobile & PC battle royale squads, scrims, and tournaments.',
    roles: [
      { name: '👑 Clan CEO', color: '#D35400', hoist: true, isOwnerRole: true },
      { name: '🛡️ Clan Admin', color: '#C0392B', hoist: true, isAdminRole: true },
      { name: '⭐ Tier 1 Player', color: '#F1C40F', hoist: true },
      { name: '🎮 Assaulter', color: '#E74C3C', hoist: false },
      { name: '🎯 Sniper', color: '#3498DB', hoist: false },
      { name: '🧠 IGL (Leader)', color: '#9B59B6', hoist: false },
      { name: '🤖 Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📢 ━━ TOURNAMENT HQ ━━',
        channels: [
          { name: '📜・clan-rules', type: ChannelType.GuildText },
          { name: '📢・scrim-announcements', type: ChannelType.GuildText },
          { name: '🏆・trophies-and-wins', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ SQUAD LOUNGE ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-squads', type: ChannelType.GuildText },
          { name: '🎯・squad-recruitment', type: ChannelType.GuildText },
          { name: '📹・headshots-and-clutches', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ BATTLE VOICE ━━',
        channels: [
          { name: '🏆・Tournament Squad 1', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🏆・Tournament Squad 2', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🎮・Squad Duo (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🔊・Casual Play', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-hq', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'gaming-roblox': {
    id: 'gaming-roblox',
    category: '🎮 Gaming',
    name: '🧱 Roblox Gaming & Studio Dev Hub',
    description: 'For Roblox game devs, Scripters, 3D modelers, traders, and casual party players.',
    roles: [
      { name: '👑 Studio Lead', color: '#E74C3C', hoist: true, isOwnerRole: true },
      { name: '🛡️ Studio Manager', color: '#E67E22', hoist: true, isAdminRole: true },
      { name: '💻 Lua Scripter', color: '#3498DB', hoist: true },
      { name: '🎨 3D Builder / Modeler', color: '#9B59B6', hoist: true },
      { name: '💎 Limiteds Trader', color: '#F1C40F', hoist: true },
      { name: '🎮 Robloxian', color: '#2ECC71', hoist: false },
      { name: '🤖 Bot', color: '#95A5A6', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📢 ━━ ROBLOX HQ ━━',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText },
          { name: '📢・game-updates', type: ChannelType.GuildText },
          { name: '🎁・robux-giveaways', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ COMMUNITY & PLAY ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・roblox-chat', type: ChannelType.GuildText },
          { name: '🎮・party-up-games', type: ChannelType.GuildText, topic: 'Blox Fruits, Bedwars, Doors' },
          { name: '💸・trading-hub', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💻 ━━ ROBLOX STUDIO DEV ━━',
        channels: [
          { name: '🛠️・scripting-help', type: ChannelType.GuildText },
          { name: '🎨・builds-and-assets', type: ChannelType.GuildText },
          { name: '💼・commissions-and-hiring', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ VOICE CHANNELS ━━',
        channels: [
          { name: '🔊・Roblox Hangout', type: ChannelType.GuildVoice },
          { name: '🎮・Party Squad (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '💻・Studio Dev Stream', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'gaming-gtarp': {
    id: 'gaming-gtarp',
    category: '🎮 Gaming',
    name: '🚓 GTA V FiveM RP & City Hub',
    description: 'Comprehensive roleplay infrastructure with Police (LSPD), EMS, Gangs, Courthouse, and Civilians.',
    roles: [
      { name: '👑 Mayor / Server Owner', color: '#F1C40F', hoist: true, isOwnerRole: true },
      { name: '🛡️ City Admin', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '👮 Police Chief (LSPD)', color: '#2980B9', hoist: true },
      { name: '🚑 Head Doctor (EMS)', color: '#E67E22', hoist: true },
      { name: '⚖️ Judge / Lawyer', color: '#8E44AD', hoist: true },
      { name: '💀 Gang Leader', color: '#C0392B', hoist: true },
      { name: '🚗 Citizen', color: '#16A085', hoist: false },
      { name: '🤖 Dispatch AI', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🏛️ ━━ CITY HALL ━━',
        channels: [
          { name: '📜・city-laws-rules', type: ChannelType.GuildText },
          { name: '📢・mayor-announcements', type: ChannelType.GuildText },
          { name: '📝・whitelist-application', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ CIVILIAN LIFE ━━',
        channels: [
          { name: '👋・arrival-airport', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・city-tweets-ooc', type: ChannelType.GuildText },
          { name: '📸・city-photos', type: ChannelType.GuildText },
          { name: '💼・job-center-hiring', type: ChannelType.GuildText },
          { name: '🏪・yellow-pages-ads', type: ChannelType.GuildText }
        ]
      },
      {
        name: '👮 ━━ EMERGENCY SERVICES ━━',
        channels: [
          { name: '🚓・lspd-dispatch', type: ChannelType.GuildText },
          { name: '🚑・ems-medical-records', type: ChannelType.GuildText },
          { name: '⚖️・doj-court-dockets', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ RADIO FREQUENCIES ━━',
        channels: [
          { name: '🔊・City Hangout Voice', type: ChannelType.GuildVoice },
          { name: '📻・Police Radio 1 (LSPD)', type: ChannelType.GuildVoice },
          { name: '📻・EMS Radio 1', type: ChannelType.GuildVoice },
          { name: '💀・Underground Radio', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ ADMIN STAFF ━━',
        channels: [
          { name: '🔒・admin-reports', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'gaming-genshin': {
    id: 'gaming-genshin',
    category: '🎮 Gaming',
    name: '✨ Genshin Impact & Anime Gacha Lounge',
    description: 'For Travelers & Gacha fans: Builds, Artifact flex, Co-op farming, Lore, and Banner pulls.',
    roles: [
      { name: '👑 Archon / Owner', color: '#9B59B6', hoist: true, isOwnerRole: true },
      { name: '🛡️ Adeptus / Mod', color: '#1ABC9C', hoist: true, isAdminRole: true },
      { name: '⭐ AR 60 Veteran', color: '#F1C40F', hoist: true },
      { name: '🗡️ DPS Specialist', color: '#E74C3C', hoist: false },
      { name: '🛡️ Support / Healer', color: '#3498DB', hoist: false },
      { name: '🌸 Traveler', color: '#E91E63', hoist: false },
      { name: '🤖 Paimon Bot', color: '#DFE6E9', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📌 ━━ TEYVAT INFO ━━',
        channels: [
          { name: '📜・server-guidelines', type: ChannelType.GuildText },
          { name: '📢・patch-and-redeem-codes', type: ChannelType.GuildText },
          { name: '🎭・element-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ TAVERN & CHAT ━━',
        channels: [
          { name: '👋・teyvat-arrivals', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・angel-share-tavern', type: ChannelType.GuildText },
          { name: '✨・gacha-pulls-and-flex', type: ChannelType.GuildText },
          { name: '🤝・co-op-boss-farming', type: ChannelType.GuildText },
          { name: '📊・builds-and-guides', type: ChannelType.GuildText },
          { name: '📖・lore-and-theories', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ CO-OP VOICE ━━',
        channels: [
          { name: '🔊・Teyvat Lounge', type: ChannelType.GuildVoice },
          { name: '⚔️・Domain Farm Squad (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '⚔️・Spiral Abyss Duo (2)', type: ChannelType.GuildVoice, userLimit: 2 }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・knights-hq', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'gaming-moba': {
    id: 'gaming-moba',
    category: '🎮 Gaming',
    name: '⚔️ League of Legends & MOBA Arena',
    description: 'Ranked grind, Champion mastery, Duo queue matching, Scrims, and Esports watch parties.',
    roles: [
      { name: '👑 Challenger / Owner', color: '#F39C12', hoist: true, isOwnerRole: true },
      { name: '🛡️ Grandmaster / Mod', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '💎 Master / VIP', color: '#8E44AD', hoist: true },
      { name: '⚔️ Top Laner', color: '#C0392B', hoist: false },
      { name: '🌲 Jungler', color: '#27AE60', hoist: false },
      { name: '🧙 Mid Laner', color: '#2980B9', hoist: false },
      { name: '🏹 ADC Bot', color: '#D35400', hoist: false },
      { name: '🛡️ Support', color: '#16A085', hoist: false },
      { name: '🤖 Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📢 ━━ SUMMONER RIFT HQ ━━',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText },
          { name: '📢・patch-notes', type: ChannelType.GuildText },
          { name: '🎭・pick-role-and-rank', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ GENERAL & LFG ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・summoner-chat', type: ChannelType.GuildText },
          { name: '🎯・duo-queue-finder', type: ChannelType.GuildText },
          { name: '🏆・flex-5-stack-lfg', type: ChannelType.GuildText },
          { name: '📹・pentakills-and-plays', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ COMMS ━━',
        channels: [
          { name: '🏆・Ranked 5v5 Room 1', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🏆・Ranked 5v5 Room 2', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🎯・Duo Bot/Jg (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🍿・LCS / Worlds Watch Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 🌐 COMMUNITY & AESTHETIC =================
  'community-social': {
    id: 'community-social',
    category: '🌐 Community',
    name: '🌐 Social & Chill Hangout Lounge',
    description: 'A vibrant community space for chatting, making friends, sharing photos, and chill vibes.',
    roles: [
      { name: '👑 Founder', color: '#E67E22', hoist: true, isOwnerRole: true },
      { name: '🛡️ Manager', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '👮 Moderator', color: '#3498DB', hoist: true },
      { name: '🌟 Server Booster', color: '#F47FFF', hoist: true },
      { name: '💎 Active Member', color: '#1ABC9C', hoist: true },
      { name: '🤖 Bot', color: '#7289DA', hoist: true, isBotRole: true },
      { name: '👥 Member', color: '#95A5A6', hoist: false }
    ],
    categories: [
      {
        name: '📌 ━━ WELCOME & INFO ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '📜・rules-and-faq', type: ChannelType.GuildText },
          { name: '📢・announcements', type: ChannelType.GuildText },
          { name: '🎭・roles-selection', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ MAIN LOUNGE ━━',
        channels: [
          { name: '💬・general-lounge', type: ChannelType.GuildText },
          { name: '🙋・introductions', type: ChannelType.GuildText },
          { name: '📸・photos-and-life', type: ChannelType.GuildText },
          { name: '😂・memes-and-fun', type: ChannelType.GuildText },
          { name: '🎵・music-and-vibes', type: ChannelType.GuildText },
          { name: '🤖・bot-playground', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ VOICE CHAT ━━',
        channels: [
          { name: '☕・Casual Hangout', type: ChannelType.GuildVoice },
          { name: '🍿・Watch Together', type: ChannelType.GuildVoice },
          { name: '🎵・Music Chill', type: ChannelType.GuildVoice },
          { name: '🤫・Quiet Room (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '💤・AFK Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛠️ ━━ MODERATION ━━',
        channels: [
          { name: '🔒・staff-hq', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'community-aesthetic': {
    id: 'community-aesthetic',
    category: '🌐 Community',
    name: '🌸 Pastel & Aesthetic Lo-Fi Lounge',
    description: 'Soft pastel vibes, chill lofi music, daily diaries, self-care, and wholesome conversations.',
    roles: [
      { name: '☁️ Angel / Founder', color: '#FFB6C1', hoist: true, isOwnerRole: true },
      { name: '✨ Guardian / Mod', color: '#DDA0DD', hoist: true, isAdminRole: true },
      { name: '🌸 Cutie / VIP', color: '#FFD1DC', hoist: true },
      { name: '🍵 Lo-Fi Listener', color: '#B0E0E6', hoist: false },
      { name: '🌿 Soft Soul', color: '#98FB98', hoist: false },
      { name: '🤖 Bot-chan', color: '#DFE6E9', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '☁️ ━━ GARDEN ENTRANCE ━━',
        channels: [
          { name: '📜・guidelines', type: ChannelType.GuildText },
          { name: '📢・soft-notices', type: ChannelType.GuildText },
          { name: '🎭・pastel-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🌸 ━━ FLOWER CAFE ━━',
        channels: [
          { name: '👋・welcomes', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '☕・tea-room-chat', type: ChannelType.GuildText },
          { name: '📖・daily-diaries-and-thoughts', type: ChannelType.GuildText },
          { name: '📸・aesthetic-gallery', type: ChannelType.GuildText },
          { name: '💖・positivity-and-vent', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🎵 ━━ LO-FI SOUNDS ━━',
        channels: [
          { name: '🍵・Cozy Cafe Voice', type: ChannelType.GuildVoice },
          { name: '🌧️・Rain & Lo-Fi Chill', type: ChannelType.GuildVoice },
          { name: '🌙・Midnight Talks (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '💤・Dreamland (AFK)', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・guardian-room', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'community-dark': {
    id: 'community-dark',
    category: '🌐 Community',
    name: '🌑 Dark Minimalist & Midnight Lounge',
    description: 'Monochrome dark aesthetics, midnight conversations, night owls, and sleek typography.',
    roles: [
      { name: '⚡ Eclipse / Lead', color: '#2C3E50', hoist: true, isOwnerRole: true },
      { name: '🌑 Shadow / Admin', color: '#34495E', hoist: true, isAdminRole: true },
      { name: '🌙 Night Owl', color: '#7F8C8D', hoist: true },
      { name: '🦇 Phantom', color: '#95A5A6', hoist: false },
      { name: '🤖 System', color: '#BDC3C7', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '▪️ ━━ INDEX ━━',
        channels: [
          { name: '📜・terms', type: ChannelType.GuildText },
          { name: '📢・bulletin', type: ChannelType.GuildText },
          { name: '🎭・identity-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '▪️ ━━ MIDNIGHT ━━',
        channels: [
          { name: '👋・arrivals', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・noir-lounge', type: ChannelType.GuildText },
          { name: '📸・monochrome-media', type: ChannelType.GuildText },
          { name: '🎧・soundtracks', type: ChannelType.GuildText }
        ]
      },
      {
        name: '▪️ ━━ AUDIO ━━',
        channels: [
          { name: '🔊・Noir Voice', type: ChannelType.GuildVoice },
          { name: '🌙・Late Night Deep Talks', type: ChannelType.GuildVoice },
          { name: '💤・Void (AFK)', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '▪️ ━━ AUDIT ━━',
        channels: [
          { name: '🔒・staff-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'community-friends': {
    id: 'community-friends',
    category: '🌐 Community',
    name: '🍕 Private Squad & Friends Hangout',
    description: 'Cozy server for real-life friend groups, movie nights, inside jokes, and gaming sessions.',
    roles: [
      { name: '👑 Group Leader', color: '#F1C40F', hoist: true, isOwnerRole: true },
      { name: '🛡️ Deputy', color: '#E67E22', hoist: true, isAdminRole: true },
      { name: '🍿 Movie Host', color: '#9B59B6', hoist: true },
      { name: '🍕 Homie / Bestie', color: '#2ECC71', hoist: false },
      { name: '🤖 Bot Buddy', color: '#7289DA', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📌 ━━ SQUAD BOARD ━━',
        channels: [
          { name: '📢・squad-plans-events', type: ChannelType.GuildText },
          { name: '📅・birthdays-and-milestones', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ HOMIE CHAT ━━',
        channels: [
          { name: '💬・main-group-chat', type: ChannelType.GuildText },
          { name: '😂・inside-jokes-and-memes', type: ChannelType.GuildText },
          { name: '📸・photos-and-trips', type: ChannelType.GuildText },
          { name: '🎮・game-clips-and-clips', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ HANGOUT CALLS ━━',
        channels: [
          { name: '🍿・Movie & Watch Party', type: ChannelType.GuildVoice },
          { name: '🎮・Squad Game Call', type: ChannelType.GuildVoice },
          { name: '☕・Casual Vibing', type: ChannelType.GuildVoice },
          { name: '💤・Sleeping Voice', type: ChannelType.GuildVoice }
        ]
      }
    ]
  },

  'community-safe': {
    id: 'community-safe',
    category: '🌐 Community',
    name: '🌿 Safe Space & Wholesome Lounge',
    description: 'Empathetic, inclusive server focusing on mental health, peer support, positivity, and safe discussions.',
    roles: [
      { name: '👑 Sanctuary Lead', color: '#27AE60', hoist: true, isOwnerRole: true },
      { name: '🛡️ Empathy Guard', color: '#16A085', hoist: true, isAdminRole: true },
      { name: '🤝 Peer Supporter', color: '#2980B9', hoist: true },
      { name: '🌱 Growing Soul', color: '#F39C12', hoist: false },
      { name: '🤖 Care Bot', color: '#95A5A6', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🌿 ━━ SANCTUARY RULES ━━',
        channels: [
          { name: '📜・community-pledge', type: ChannelType.GuildText },
          { name: '📢・resources-helplines', type: ChannelType.GuildText },
          { name: '🎭・pronoun-and-trigger-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ WARM HEARTH ━━',
        channels: [
          { name: '👋・welcomes', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・wholesome-chat', type: ChannelType.GuildText },
          { name: '💖・gratitude-and-wins', type: ChannelType.GuildText },
          { name: '🫂・vent-and-support', type: ChannelType.GuildText },
          { name: '🎨・hobbies-and-pets', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ CALM VOICE ━━',
        channels: [
          { name: '☕・Quiet Conversation Room', type: ChannelType.GuildVoice },
          { name: '🧘・Mindfulness & Meditation', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ MODERATION ━━',
        channels: [
          { name: '🔒・helper-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 🎨 ANIME & CREATIVE =================
  'anime-art': {
    id: 'anime-art',
    category: '🎨 Anime & Creative',
    name: '🎨 Anime, Manga & Digital Art Lounge',
    description: 'Aesthetic theme for anime lovers, manga readers, digital artists, and creative souls.',
    roles: [
      { name: '👑 Sensei', color: '#FF7675', hoist: true, isOwnerRole: true },
      { name: '🛡️ Senpai (Mod)', color: '#FD79A8', hoist: true, isAdminRole: true },
      { name: '🎨 Master Artist', color: '#A29BFE', hoist: true },
      { name: '🍿 Anime Weeb', color: '#FFEAA7', hoist: true },
      { name: '📚 Manga Reader', color: '#55EFC4', hoist: false },
      { name: '🌸 Otaku', color: '#FAB1A0', hoist: false },
      { name: '🤖 Bot-chan', color: '#DFE6E9', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🌸 ━━ SAKURA INFO ━━',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText },
          { name: '📢・announcements', type: ChannelType.GuildText },
          { name: '🎭・pick-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ ANIME CHAT ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '🌸・sakura-lounge', type: ChannelType.GuildText },
          { name: '🍿・weekly-anime-talk', type: ChannelType.GuildText },
          { name: '⚠️・spoilers-talk', type: ChannelType.GuildText },
          { name: '📚・manga-and-webtoons', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🎨 ━━ ART SHOWCASE ━━',
        channels: [
          { name: '🎨・art-gallery', type: ChannelType.GuildText },
          { name: '💡・critiques-and-tips', type: ChannelType.GuildText },
          { name: '📸・cosplay-and-figures', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ VOICE CHILL ━━',
        channels: [
          { name: '🌸・Ramen Lounge', type: ChannelType.GuildVoice },
          { name: '🍿・Anime Watch Party', type: ChannelType.GuildVoice },
          { name: '🎨・Drawing Stream Voice', type: ChannelType.GuildVoice },
          { name: '🎵・J-Pop & Lofi', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ MODERATION ━━',
        channels: [
          { name: '🔒・staff-hq', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'rp-fantasy': {
    id: 'rp-fantasy',
    category: '🎨 Anime & Creative',
    name: '🐉 D&D, Medieval & Fantasy Roleplay Realm',
    description: 'Immersive fantasy realm for tabletop RPGs, custom lore, character submissions, and dice rolling.',
    roles: [
      { name: '👑 Dungeon Master (DM)', color: '#8E44AD', hoist: true, isOwnerRole: true },
      { name: '🛡️ Lore Master / Mod', color: '#2980B9', hoist: true, isAdminRole: true },
      { name: '⚔️ Paladin / Warrior', color: '#E74C3C', hoist: false },
      { name: '🧙 Mage / Wizard', color: '#3498DB', hoist: false },
      { name: '🏹 Rogue / Ranger', color: '#27AE60', hoist: false },
      { name: '📜 Adventurer', color: '#F39C12', hoist: false },
      { name: '🤖 Dice Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📜 ━━ REALM LORE ━━',
        channels: [
          { name: '📜・world-rules-and-lore', type: ChannelType.GuildText },
          { name: '🗺️・world-map-and-factions', type: ChannelType.GuildText },
          { name: '📝・character-submissions', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ TAVERN & OOC ━━',
        channels: [
          { name: '👋・tavern-entrance', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・adventurer-tavern-ooc', type: ChannelType.GuildText },
          { name: '🎲・dice-rolls-and-stats', type: ChannelType.GuildText },
          { name: '🎨・character-art', type: ChannelType.GuildText }
        ]
      },
      {
        name: '⚔️ ━━ IN-CHARACTER RP LOCATIONS ━━',
        channels: [
          { name: '🏰・capital-citadel-rp', type: ChannelType.GuildText },
          { name: '🌲・whispering-forest-rp', type: ChannelType.GuildText },
          { name: '💀・dark-dungeons-rp', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ D&D CAMPAIGN VOICE ━━',
        channels: [
          { name: '🎙️・Main Campaign Table (6)', type: ChannelType.GuildVoice, userLimit: 6 },
          { name: '🎲・Side Quest Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ DM STAFF ━━',
        channels: [
          { name: '🔒・dm-secret-notes', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 📹 CREATORS, STREAMERS & MUSIC =================
  'community-creator': {
    id: 'community-creator',
    category: '📹 Creators & Media',
    name: '📹 Content Creator & YouTuber HQ',
    description: 'For YouTubers, vloggers, influencer community fanbases, stream alerts, and fan interactions.',
    roles: [
      { name: '👑 Content Creator', color: '#FF0000', hoist: true, isOwnerRole: true },
      { name: '🛡️ Head Mod', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '🎬 Video Editor', color: '#9B59B6', hoist: true },
      { name: '🎨 Thumbnail Designer', color: '#F39C12', hoist: true },
      { name: '⭐ Channel Member', color: '#2ECC71', hoist: true },
      { name: '❤️ Super Fan', color: '#E91E63', hoist: true },
      { name: '👥 Subscriber', color: '#95A5A6', hoist: false },
      { name: '🤖 Bot', color: '#7289DA', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📢 ━━ CREATOR FEED ━━',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText },
          { name: '📢・new-videos-stream', type: ChannelType.GuildText },
          { name: '🎁・subscriber-giveaways', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ FAN COMMUNITY ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・fan-chat', type: ChannelType.GuildText },
          { name: '💡・video-ideas-suggestions', type: ChannelType.GuildText },
          { name: '🎨・fan-art', type: ChannelType.GuildText },
          { name: '😂・creator-memes', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ VOICE HANGOUT ━━',
        channels: [
          { name: '🎙️・Live Stream Stage Voice', type: ChannelType.GuildVoice },
          { name: '☕・Community Chill Voice', type: ChannelType.GuildVoice },
          { name: '🍿・Watch Party Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🔒 ━━ PRODUCTION CREW ━━',
        channels: [
          { name: '🔒・creator-and-editors', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'creator-twitch': {
    id: 'creator-twitch',
    category: '📹 Creators & Media',
    name: '🟣 Twitch Streamer & Kick Live Hub',
    description: 'Dedicated to live streamers: Live alerts, VIP/Sub lounges, Clip sharing, and Sub-only voice rooms.',
    roles: [
      { name: '👑 Streamer', color: '#9146FF', hoist: true, isOwnerRole: true },
      { name: '🛡️ Stream Mod', color: '#53FC18', hoist: true, isAdminRole: true },
      { name: '💎 VIP Viewer', color: '#F1C40F', hoist: true },
      { name: '⭐ Tier 3 Sub', color: '#E91E63', hoist: true },
      { name: '⭐ Tier 1 Sub', color: '#3498DB', hoist: true },
      { name: '👥 Follower', color: '#BDC3C7', hoist: false },
      { name: '🤖 Stream Bot', color: '#7289DA', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🟣 ━━ BROADCAST ━━',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText },
          { name: '🔴・stream-live-notifications', type: ChannelType.GuildText },
          { name: '📢・schedule-and-events', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ CHAT & CLIPS ━━',
        channels: [
          { name: '👋・new-viewers', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・stream-chat-offline', type: ChannelType.GuildText },
          { name: '📹・twitch-clips', type: ChannelType.GuildText },
          { name: '🐸・stream-emotes-memes', type: ChannelType.GuildText }
        ]
      },
      {
        name: '⭐ ━━ SUBSCRIBER EXCLUSIVE ━━',
        permissions: [
          { roleName: '⭐ Tier 1 Sub', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ],
        channels: [
          { name: '⭐・sub-lounge', type: ChannelType.GuildText },
          { name: '🔊・Sub Play Along Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🔊 ━━ VOICE COMMS ━━',
        channels: [
          { name: '🎙️・Live Stream Stage Voice', type: ChannelType.GuildVoice },
          { name: '☕・Community Chill', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・mod-squad', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'creator-music': {
    id: 'creator-music',
    category: '📹 Creators & Media',
    name: '🎧 Music Producer, Beatmaker & Audio Studio',
    description: 'For music producers, beatmakers, vocalists, audio engineers, sample sharing, and track feedback.',
    roles: [
      { name: '👑 Studio Head', color: '#E74C3C', hoist: true, isOwnerRole: true },
      { name: '🛡️ Sound Engineer', color: '#E67E22', hoist: true, isAdminRole: true },
      { name: '🎹 Beatmaker / Producer', color: '#9B59B6', hoist: true },
      { name: '🎤 Vocalist / Singer', color: '#3498DB', hoist: true },
      { name: '🎸 Instrumentalist', color: '#2ECC71', hoist: false },
      { name: '🎧 Listener', color: '#95A5A6', hoist: false },
      { name: '🤖 Studio Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📌 ━━ STUDIO INFO ━━',
        channels: [
          { name: '📜・rules', type: ChannelType.GuildText },
          { name: '📢・releases-and-placements', type: ChannelType.GuildText },
          { name: '🎭・daw-roles', type: ChannelType.GuildText, topic: 'FL Studio, Ableton, Logic, Pro Tools' }
        ]
      },
      {
        name: '💬 ━━ PRODUCTION HUB ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・producer-lounge', type: ChannelType.GuildText },
          { name: '🔥・track-feedback-wip', type: ChannelType.GuildText },
          { name: '🤝・collabs-and-features', type: ChannelType.GuildText },
          { name: '🎹・sample-packs-and-presets', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ LISTENING SESSIONS ━━',
        channels: [
          { name: '🎧・Live Beat Review Voice', type: ChannelType.GuildVoice },
          { name: '🎙️・Cookup Collab Room 1 (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🎙️・Cookup Collab Room 2 (2)', type: ChannelType.GuildVoice, userLimit: 2 }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-room', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 💻 DEVELOPER, TECH & AI =================
  'developer-code': {
    id: 'developer-code',
    category: '💻 Developer & Tech',
    name: '💻 Full-Stack Software & Coding Hub',
    description: 'Structured layout for software engineers, web dev, mobile, backend & open-source projects.',
    roles: [
      { name: '🚀 Lead Architect', color: '#E74C3C', hoist: true, isOwnerRole: true },
      { name: '🛠️ Core Maintainer', color: '#E67E22', hoist: true, isAdminRole: true },
      { name: '💻 Senior Dev', color: '#9B59B6', hoist: true },
      { name: '✨ Contributor', color: '#3498DB', hoist: true },
      { name: '🐍 Python', color: '#3572A5', hoist: false },
      { name: '⚡ JavaScript/TS', color: '#F7DF1E', hoist: false },
      { name: '🦀 Rust / Go', color: '#DEA584', hoist: false },
      { name: '🤖 Bot', color: '#95A5A6', hoist: true, isBotRole: true },
      { name: '👥 Coder', color: '#BDC3C7', hoist: false }
    ],
    categories: [
      {
        name: '📌 ━━ INFORMATION ━━',
        channels: [
          { name: '📜・code-of-conduct', type: ChannelType.GuildText },
          { name: '📢・announcements', type: ChannelType.GuildText },
          { name: '🐙・github-releases', type: ChannelType.GuildText },
          { name: '🎭・stack-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ GENERAL TECH ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-dev', type: ChannelType.GuildText },
          { name: '✨・showcase-projects', type: ChannelType.GuildText },
          { name: '💼・jobs-and-freelance', type: ChannelType.GuildText },
          { name: '📚・resources-and-books', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💻 ━━ CODE & DEBUGGING ━━',
        channels: [
          { name: '🌐・web-frontend', type: ChannelType.GuildText },
          { name: '⚙️・backend-and-apis', type: ChannelType.GuildText },
          { name: '📱・mobile-apps', type: ChannelType.GuildText },
          { name: '🆘・debugging-help', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ PAIR CODING VOICE ━━',
        channels: [
          { name: '🎧・Pair Programming 1 (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🎧・Pair Programming 2 (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '💻・Tech Discussion Lounge', type: ChannelType.GuildVoice },
          { name: '🤫・Silent Deep Focus', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🔒 ━━ MAINTAINER HQ ━━',
        channels: [
          { name: '🔒・maintainer-sync', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'developer-ai': {
    id: 'developer-ai',
    category: '💻 Developer & Tech',
    name: '🧠 AI, Machine Learning & LLM Hub',
    description: 'For AI researchers, Prompt engineers, PyTorch/TensorFlow devs, Claude/GPT builders, and GPU rigs.',
    roles: [
      { name: '🧠 Chief AI Scientist', color: '#8E44AD', hoist: true, isOwnerRole: true },
      { name: '🛡️ ML Ops Admin', color: '#2980B9', hoist: true, isAdminRole: true },
      { name: '⚡ Prompt Engineer', color: '#16A085', hoist: true },
      { name: '📊 Data Scientist', color: '#27AE60', hoist: true },
      { name: '🤖 AI Bot', color: '#7289DA', hoist: true, isBotRole: true },
      { name: '👥 AI Enthusiast', color: '#BDC3C7', hoist: false }
    ],
    categories: [
      {
        name: '⚡ ━━ AI HUB INFO ━━',
        channels: [
          { name: '📜・guidelines', type: ChannelType.GuildText },
          { name: '📢・ai-news-papers', type: ChannelType.GuildText },
          { name: '🎭・ai-interests-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ GENERAL & LAB ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-ai-chat', type: ChannelType.GuildText },
          { name: '💡・prompt-engineering', type: ChannelType.GuildText },
          { name: '🔬・papers-and-research', type: ChannelType.GuildText },
          { name: '🖥️・gpu-and-local-models', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🤖 ━━ AI AGENTS & APPS ━━',
        channels: [
          { name: '🛠️・ai-agent-building', type: ChannelType.GuildText },
          { name: '🎨・generative-art-music', type: ChannelType.GuildText },
          { name: '🚀・project-showcase', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ VOICE LAB ━━',
        channels: [
          { name: '🧠・AI Research Roundtable', type: ChannelType.GuildVoice },
          { name: '💻・Model Fine-Tuning Focus', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-room', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'developer-cyber': {
    id: 'developer-cyber',
    category: '💻 Developer & Tech',
    name: '🛡️ Cybersecurity, Ethical Hacking & CTF HQ',
    description: 'For red & blue teams, CTF players, penetration testers, bug bounty hunters, and Linux enthusiasts.',
    roles: [
      { name: '👑 Red Team Lead', color: '#C0392B', hoist: true, isOwnerRole: true },
      { name: '🛡️ SOC Lead / Admin', color: '#2980B9', hoist: true, isAdminRole: true },
      { name: '🚩 CTF Master', color: '#F39C12', hoist: true },
      { name: '🐞 Bug Hunter', color: '#27AE60', hoist: true },
      { name: '🐧 Linux Ninja', color: '#E67E22', hoist: false },
      { name: '🤖 Sentinel Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🛡️ ━━ SEC RULES & NOTICES ━━',
        channels: [
          { name: '📜・whitehat-ethics-rules', type: ChannelType.GuildText },
          { name: '📢・cve-security-alerts', type: ChannelType.GuildText },
          { name: '🎭・specialty-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ MAIN LOUNGE ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・cyber-lounge', type: ChannelType.GuildText },
          { name: '🚩・ctf-challenges-writeups', type: ChannelType.GuildText },
          { name: '🐞・bug-bounty-discussions', type: ChannelType.GuildText },
          { name: '🐧・linux-and-tools', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ OPERATIONS COMMS ━━',
        channels: [
          { name: '🚩・CTF War Room (5)', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '💻・Pentest Study Call', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ OPS HQ ━━',
        channels: [
          { name: '🔒・ops-private', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 📚 EDUCATION & STUDY =================
  'study-exam': {
    id: 'study-exam',
    category: '📚 Study & Education',
    name: '📚 School & University Exam Prep Hub',
    description: 'Productive academic hub for students, exam preparations, group study, and doubt sharing.',
    roles: [
      { name: '🎓 Professor / Head', color: '#1B4F72', hoist: true, isOwnerRole: true },
      { name: '🧑‍🏫 Tutor / Mentor', color: '#117A65', hoist: true, isAdminRole: true },
      { name: '🌟 Top Scholar', color: '#D4AC0D', hoist: true },
      { name: '📐 STEM Student', color: '#884EA0', hoist: false },
      { name: '📖 Humanities', color: '#AF601A', hoist: false },
      { name: '📚 Student', color: '#5D6D7E', hoist: false },
      { name: '🤖 Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🏛️ ━━ STUDY HALL ━━',
        channels: [
          { name: '📜・guidelines', type: ChannelType.GuildText },
          { name: '📢・exam-schedules', type: ChannelType.GuildText },
          { name: '🎯・daily-goals', type: ChannelType.GuildText }
        ]
      },
      {
        name: '📖 ━━ SUBJECT DOUBTS ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '📐・math-and-physics', type: ChannelType.GuildText },
          { name: '🔬・chemistry-and-bio', type: ChannelType.GuildText },
          { name: '💻・computer-science', type: ChannelType.GuildText },
          { name: '📁・notes-and-cheatsheets', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🎧 ━━ FOCUS VOICE ROOMS ━━',
        channels: [
          { name: '🤫・Silent Study (Muted)', type: ChannelType.GuildVoice },
          { name: '🍅・Pomodoro Focus Room', type: ChannelType.GuildVoice },
          { name: '🤝・Group Discussion Voice', type: ChannelType.GuildVoice },
          { name: '☕・Break Room Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-room', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'study-language': {
    id: 'study-language',
    category: '📚 Study & Education',
    name: '🌍 Global Language Exchange Hub',
    description: 'Practice languages with native speakers: English, Japanese, Spanish, Hindi, German & French.',
    roles: [
      { name: '👑 Language Director', color: '#2980B9', hoist: true, isOwnerRole: true },
      { name: '🛡️ Polyglot Mod', color: '#27AE60', hoist: true, isAdminRole: true },
      { name: '🇬🇧 Native English', color: '#E74C3C', hoist: false },
      { name: '🇯🇵 Native Japanese', color: '#E91E63', hoist: false },
      { name: '🇪🇸 Native Spanish', color: '#F1C40F', hoist: false },
      { name: '🇩🇪 Native German', color: '#D35400', hoist: false },
      { name: '🇮🇳 Native Hindi', color: '#E67E22', hoist: false },
      { name: '🤖 Translator Bot', color: '#7289DA', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🌍 ━━ PASSPORT CONTROL ━━',
        channels: [
          { name: '📜・guidelines', type: ChannelType.GuildText },
          { name: '📢・announcements', type: ChannelType.GuildText },
          { name: '🎭・select-languages', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ LANGUAGE CHANNELS ━━',
        channels: [
          { name: '👋・arrivals', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '🇬🇧・english-practice', type: ChannelType.GuildText },
          { name: '🇯🇵・nihongo-japanese', type: ChannelType.GuildText },
          { name: '🇪🇸・espanol-spanish', type: ChannelType.GuildText },
          { name: '🇩🇪・deutsch-german', type: ChannelType.GuildText },
          { name: '🇮🇳・hindi-corner', type: ChannelType.GuildText },
          { name: '💡・vocab-and-grammar-tips', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ PRACTICE VOICE ━━',
        channels: [
          { name: '🇬🇧・English Speaking Practice', type: ChannelType.GuildVoice },
          { name: '🇯🇵・Japanese Voice Room', type: ChannelType.GuildVoice },
          { name: '🌍・Global Voice Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-hq', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 💼 BUSINESS & COMMERCE =================
  'business-crypto': {
    id: 'business-crypto',
    category: '💼 Business & Finance',
    name: '📈 Crypto, Forex & Day Trading Signals Hub',
    description: 'For traders: Market analysis, Crypto/Forex signals, Technical chart breakdowns, and Alpha news.',
    roles: [
      { name: '👑 Master Trader / Owner', color: '#F1C40F', hoist: true, isOwnerRole: true },
      { name: '🛡️ Risk Manager / Admin', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '📊 Signal Analyst', color: '#2ECC71', hoist: true },
      { name: '💎 VIP Trader', color: '#9B59B6', hoist: true },
      { name: '📈 Day Trader', color: '#3498DB', hoist: false },
      { name: '🤖 Price Tracker Bot', color: '#95A5A6', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📢 ━━ MARKET BULLETINS ━━',
        channels: [
          { name: '📜・disclaimer-and-rules', type: ChannelType.GuildText },
          { name: '📢・market-news-alerts', type: ChannelType.GuildText },
          { name: '⭐・vip-signals-preview', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ TRADING FLOOR ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-trading-chat', type: ChannelType.GuildText },
          { name: '📊・charts-and-technical-analysis', type: ChannelType.GuildText },
          { name: '🪙・altcoins-and-gems', type: ChannelType.GuildText },
          { name: '💵・forex-and-indices', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💎 ━━ VIP SIGNALS HQ ━━',
        permissions: [
          { roleName: '💎 VIP Trader', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
        ],
        channels: [
          { name: '🚀・vip-alpha-signals', type: ChannelType.GuildText },
          { name: '🎯・entry-exit-targets', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ LIVE MARKET CALLS ━━',
        channels: [
          { name: '📈・Live Market Session', type: ChannelType.GuildVoice },
          { name: '☕・Trading Lounge Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-lounge', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'business-shop': {
    id: 'business-shop',
    category: '💼 Business & Finance',
    name: '🛒 E-Commerce, Digital Store & Services Marketplace',
    description: 'For digital sellers, graphic designers, coders, services: Catalog, Vouches, Orders, and Support.',
    roles: [
      { name: '👑 Store Owner', color: '#2ECC71', hoist: true, isOwnerRole: true },
      { name: '🛡️ Shop Manager', color: '#E67E22', hoist: true, isAdminRole: true },
      { name: '💼 Official Seller', color: '#3498DB', hoist: true },
      { name: '💎 Verified Customer', color: '#F1C40F', hoist: true },
      { name: '👥 Shopper', color: '#BDC3C7', hoist: false },
      { name: '🤖 Ticket Bot', color: '#7289DA', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🛍️ ━━ STOREFRONT ━━',
        channels: [
          { name: '📜・terms-of-service', type: ChannelType.GuildText },
          { name: '📢・store-announcements', type: ChannelType.GuildText },
          { name: '🏷️・pricing-and-catalog', type: ChannelType.GuildText },
          { name: '⭐・customer-vouches', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ MARKETPLACE ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-inquiries', type: ChannelType.GuildText },
          { name: '🎫・order-tickets', type: ChannelType.GuildText, topic: 'Create ticket to place an order' },
          { name: '🎁・store-giveaways', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ CUSTOMER DESK ━━',
        channels: [
          { name: '💼・Client Consultation Voice', type: ChannelType.GuildVoice },
          { name: '☕・Community Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ MANAGEMENT ━━',
        channels: [
          { name: '🔒・orders-log-private', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 🛡️ ESPORTS & CLANS =================
  'esports-clan': {
    id: 'esports-clan',
    category: '🛡️ Esports & Clan',
    name: '🛡️ Competitive Clan & Esports Roster HQ',
    description: 'Tactical layout for competitive gaming clans, roster management, tournaments, and scrims.',
    roles: [
      { name: '👑 Clan Leader / CEO', color: '#C0392B', hoist: true, isOwnerRole: true },
      { name: '👔 Team Manager', color: '#8E44AD', hoist: true, isAdminRole: true },
      { name: '🎯 Head Coach', color: '#2980B9', hoist: true },
      { name: '⭐ Main Roster', color: '#27AE60', hoist: true },
      { name: '🔄 Academy / Sub', color: '#F39C12', hoist: true },
      { name: '📢 Clan Member', color: '#BDC3C7', hoist: false },
      { name: '🤖 Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '📢 ━━ CLAN HQ ━━',
        channels: [
          { name: '📜・clan-rules', type: ChannelType.GuildText },
          { name: '📢・announcements', type: ChannelType.GuildText },
          { name: '🏆・achievements', type: ChannelType.GuildText },
          { name: '📅・match-schedules', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ CLAN LOUNGE ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-lounge', type: ChannelType.GuildText },
          { name: '🎯・scrim-results', type: ChannelType.GuildText },
          { name: '🧠・strats-and-lineups', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔒 ━━ ROSTER & COACH HQ ━━',
        channels: [
          { name: '🔒・roster-private', type: ChannelType.GuildText },
          { name: '📊・vod-reviews', type: ChannelType.GuildText },
          { name: '🔊・Tournament Match Comms', type: ChannelType.GuildVoice },
          { name: '🔊・Scrim Comms Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🔊 ━━ PUBLIC COMMS ━━',
        channels: [
          { name: '🔊・Team Duo 1', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '🔊・Team Squad 1', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🔊・Team Squad 2', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '☕・Casual Hangout', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・management-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 🏋️ LIFESTYLE & FITNESS =================
  'lifestyle-fitness': {
    id: 'lifestyle-fitness',
    category: '🏋️ Lifestyle & Fitness',
    name: '🏋️ Gym, Bodybuilding & Fitness Community',
    description: 'For fitness enthusiasts: Workout splits, PR flex, Diet/Macro advice, Form checks, and Motivation.',
    roles: [
      { name: '👑 Head Coach / Owner', color: '#D35400', hoist: true, isOwnerRole: true },
      { name: '🛡️ Fitness Mod', color: '#C0392B', hoist: true, isAdminRole: true },
      { name: '🏆 Elite Athlete / VIP', color: '#F1C40F', hoist: true },
      { name: '🥩 Powerlifter', color: '#8E44AD', hoist: false },
      { name: '🥗 Bodybuilder / Calisthenics', color: '#27AE60', hoist: false },
      { name: '🏃 Gym Bro / Member', color: '#3498DB', hoist: false },
      { name: '🤖 Bot', color: '#7F8C8D', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🏋️ ━━ GYM RULES & MOTIVATION ━━',
        channels: [
          { name: '📜・guidelines', type: ChannelType.GuildText },
          { name: '🔥・daily-motivation', type: ChannelType.GuildText },
          { name: '🎭・fitness-goals-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ LOCKER ROOM ━━',
        channels: [
          { name: '👋・new-gym-bros', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-fitness-talk', type: ChannelType.GuildText },
          { name: '🏆・pr-records-flex', type: ChannelType.GuildText },
          { name: '🔍・form-checks-and-advice', type: ChannelType.GuildText },
          { name: '🥩・diet-nutrition-macros', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ WORKOUT COMMS ━━',
        channels: [
          { name: '🎧・Live Workout Session Voice', type: ChannelType.GuildVoice },
          { name: '☕・Locker Room Hangout', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・coach-staff', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 🛡️ ESPORTS & TOURNAMENTS =================
  'esports-lordx-lite': {
    id: 'esports-lordx-lite',
    category: '🛡️ Esports & Clans',
    name: '🏆 Lordx Esports LITE Hub',
    description: 'Professional BGMI Lite tournament & scrims community with T1/T2/T3 tiers, slot registration, and squad voice rooms.',
    roles: [
      { name: '👑 Owner', color: '#FFD700', hoist: true, mentionable: false, isOwnerRole: true },
      { name: '🛡️ Management', color: '#E74C3C', hoist: true, mentionable: false, isAdminRole: true },
      { name: '⚔️ Esports Manager', color: '#3498DB', hoist: true, mentionable: true },
      { name: '🛡️ Scrims Mod', color: '#3498DB', hoist: true, mentionable: true },
      { name: '💬 Chat Mod', color: '#3498DB', hoist: true, mentionable: true },
      { name: '🎙️ Official Caster', color: '#F47FFF', hoist: true, mentionable: false },
      { name: '🎬 Content Creator', color: '#F47FFF', hoist: true, mentionable: false },
      { name: '💎 VIP', color: '#F47FFF', hoist: true, mentionable: false },
      { name: '🏆 T1 Team', color: '#FF4655', hoist: true, mentionable: true },
      { name: '🥇 T2 Team', color: '#F1C40F', hoist: true, mentionable: true },
      { name: '🥈 T3 Team', color: '#BDC3C7', hoist: true, mentionable: true },
      { name: '👑 IGL (In-Game Leader)', color: '#9B59B6', hoist: true, mentionable: true },
      { name: '🎟️ Registered', color: '#2ECC71', hoist: true, mentionable: true },
      { name: '🏆 Conqueror', color: '#FF4655', hoist: true, mentionable: false },
      { name: '⚔️ Ace', color: '#E67E22', hoist: true, mentionable: false },
      { name: '🛡️ Crown', color: '#9B59B6', hoist: true, mentionable: false },
      { name: '🥇 Diamond', color: '#3498DB', hoist: true, mentionable: false },
      { name: '🚀 Server Booster', color: '#F47FFF', hoist: true, mentionable: false },
      { name: '📢 Announcement Ping', color: '#7289DA', hoist: false, mentionable: true },
      { name: '⚔️ Scrims Ping', color: '#7289DA', hoist: false, mentionable: true },
      { name: '🎁 Giveaway Ping', color: '#7289DA', hoist: false, mentionable: true },
      { name: '🤝 LFG Ping', color: '#7289DA', hoist: false, mentionable: true },
      { name: '👥 Member', color: '#99AAB5', hoist: false, mentionable: false }
    ],
    categories: [
      {
        name: '📁 ━━ WELCOME & INFO ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true, topic: 'Welcome to Lordx Esports LITE community!' },
          { name: '📜・rules', type: ChannelType.GuildText, topic: 'Official Server & Scrims Guidelines' },
          { name: '📢・announcements', type: ChannelType.GuildAnnouncement, topic: 'Tournaments, Scrims timings and important updates' },
          { name: '🎭・reaction-roles', type: ChannelType.GuildText, topic: 'Get self roles & Scrims notification pings' }
        ]
      },
      {
        name: '📁 ━━ ESPORTS ZONE ━━',
        channels: [
          { name: '🗓️・scrims-schedule', type: ChannelType.GuildText, topic: 'Daily T1, T2, T3 Custom Room timings and slots' },
          { name: '📝・register-here', type: ChannelType.GuildText, topic: 'Submit your team lineup and format to register for slots' },
          { name: '✅・confirmed-teams', type: ChannelType.GuildText, topic: 'Official verified list of teams with confirmed slots' },
          { name: '🔑・id-pass', type: ChannelType.GuildText, topic: 'Restricted: Only registered teams can see room ID & Password' },
          { name: '📊・results', type: ChannelType.GuildText, topic: 'Match winner screenshots, points table & kill feeds' }
        ]
      },
      {
        name: '📁 ━━ COMMUNITY HUB ━━',
        channels: [
          { name: '💬・general-chat', type: ChannelType.GuildText, topic: 'Main hangout and community discussion chat' },
          { name: '🤝・find-a-squad', type: ChannelType.GuildText, topic: 'Looking for Team / LFG recruitment channel' },
          { name: '🎬・clips-and-highlights', type: ChannelType.GuildText, topic: 'Post your best BGMI clutches, montages & headshots' },
          { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: 'Check ranks, stats and use bot commands' }
        ]
      },
      {
        name: '📁 ━━ SUPPORT / TICKETS ━━',
        channels: [
          { name: '📩・create-a-ticket', type: ChannelType.GuildText, topic: 'Click button to open private ticket for slot disputes or hacker reports' },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true, topic: 'Staff moderation logs' }
        ]
      },
      {
        name: '📁 ━━ VOICE CHANNELS ━━',
        channels: [
          { name: '🔊・Lobby Lounge', type: ChannelType.GuildVoice },
          { name: '🔒・Squad 1 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🔒・Squad 2 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🔒・Squad 3 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🔒・Squad 4 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🔒・Squad 5 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🔒・Squad 6 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🔒・Squad 7 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🔒・Squad 8 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🎙️・Casters Lounge', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🤫・Staff Meeting', type: ChannelType.GuildVoice, userLimit: 10 }
        ]
      }
    ]
  },

  // ================= 🌟 XENON FEATURED & TOP TEMPLATES =================
  'xenon-giveaways': {
    id: 'xenon-giveaways',
    category: '🌐 Community',
    name: '🎁 Xenon Advanced Giveaways & Events Server',
    description: 'Feature-rich giveaways community with flash drops, sponsor channels, winner proof, and donor lounges.',
    roles: [
      { name: '👑 Host / Owner', color: '#FFD700', hoist: true, isOwnerRole: true },
      { name: '🛡️ Giveaway Manager', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '🤝 Official Sponsor', color: '#9B59B6', hoist: true },
      { name: '💎 Premium Donator', color: '#F1C40F', hoist: true },
      { name: '🎉 Active Winner', color: '#2ECC71', hoist: true },
      { name: '🔔 Flash Ping', color: '#7289DA', hoist: false, mentionable: true },
      { name: '🔔 Daily Giveaway Ping', color: '#7289DA', hoist: false, mentionable: true },
      { name: '🤖 Bot', color: '#7289DA', hoist: true, isBotRole: true },
      { name: '👥 Member', color: '#99AAB5', hoist: false }
    ],
    categories: [
      {
        name: '🎁 ━━ GIVEAWAY ZONE ━━',
        channels: [
          { name: '📜・giveaway-rules', type: ChannelType.GuildText, topic: 'Requirements, claim times and eligibility' },
          { name: '📢・big-events', type: ChannelType.GuildAnnouncement, topic: 'Mega nitro, games & cash giveaways' },
          { name: '⚡・flash-drops', type: ChannelType.GuildText, topic: 'Fast 15-minute quick drop giveaways' },
          { name: '🎁・daily-rewards', type: ChannelType.GuildText, topic: 'Daily free giveaways for members' },
          { name: '🏆・winners-proof', type: ChannelType.GuildText, topic: 'Proof of awarded prizes and vouches' },
          { name: '🎭・ping-roles', type: ChannelType.GuildText, topic: 'Pick your giveaway notification pings' }
        ]
      },
      {
        name: '💬 ━━ COMMUNITY ━━',
        channels: [
          { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-lounge', type: ChannelType.GuildText, topic: 'Main hangout chat' },
          { name: '🤖・bot-games', type: ChannelType.GuildText, topic: 'Mini-games, currency and commands' },
          { name: '💎・donators-chat', type: ChannelType.GuildText, topic: 'Exclusive lounge for donors & sponsors' }
        ]
      },
      {
        name: '🔊 ━━ STAGE & VOICE ━━',
        channels: [
          { name: '🎉・Live Giveaway Roll Stage', type: ChannelType.GuildStageVoice },
          { name: '🔊・Event Comms', type: ChannelType.GuildVoice },
          { name: '☕・Chill Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF & LOGS ━━',
        channels: [
          { name: '🔒・giveaway-staff', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-support': {
    id: 'xenon-support',
    category: '💼 Business',
    name: '🎫 Xenon Advanced Customer Support Hub',
    description: 'Complete professional help desk server with multi-tier ticket systems, FAQ, changelogs, and feedback.',
    roles: [
      { name: '👑 Head of Support', color: '#1B4F72', hoist: true, isOwnerRole: true },
      { name: '🛡️ Senior Technician', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '🛠️ Support Agent', color: '#3498DB', hoist: true, mentionable: true },
      { name: '⭐ Verified Customer', color: '#2ECC71', hoist: true },
      { name: '🤖 Ticket Bot', color: '#7289DA', hoist: true, isBotRole: true },
      { name: '👥 Customer', color: '#99AAB5', hoist: false }
    ],
    categories: [
      {
        name: '📋 ━━ INFORMATION ━━',
        channels: [
          { name: '📜・support-guidelines', type: ChannelType.GuildText, topic: 'How to get fast support & rules' },
          { name: '🟢・service-status', type: ChannelType.GuildAnnouncement, topic: 'Live server & uptime updates' },
          { name: '💡・knowledge-base', type: ChannelType.GuildText, topic: 'Frequently asked questions (FAQ)' },
          { name: '🚀・changelogs', type: ChannelType.GuildText, topic: 'Recent product releases and bug fixes' }
        ]
      },
      {
        name: '🎫 ━━ TICKET CENTER ━━',
        channels: [
          { name: '📩・open-ticket', type: ChannelType.GuildText, topic: 'Click buttons below to open a private inquiry' },
          { name: '⭐・customer-reviews', type: ChannelType.GuildText, topic: 'Rate your support experience' },
          { name: '💡・feature-requests', type: ChannelType.GuildText, topic: 'Suggest new features and vote' },
          { name: '🐛・bug-reports', type: ChannelType.GuildText, topic: 'Report platform glitches and issues' }
        ]
      },
      {
        name: '💬 ━━ CUSTOMER LOUNGE ━━',
        channels: [
          { name: '👋・arrivals', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・community-help', type: ChannelType.GuildText, topic: 'Peer-to-peer customer discussions' },
          { name: '🔊・Screen Share Support Voice', type: ChannelType.GuildVoice, userLimit: 3 },
          { name: '🔊・Public Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF QUEUE ━━',
        channels: [
          { name: '🔒・staff-headquarters', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-apocalypse': {
    id: 'xenon-apocalypse',
    category: '🎨 Anime & Creative',
    name: '🧟 Xenon Post-Apocalyptic Survival & Roleplay',
    description: 'Immersive wasteland RPG where humans and survivors build factions, scavenge resources, and fight for survival.',
    roles: [
      { name: '👑 Game Master / Overseer', color: '#900C3F', hoist: true, isOwnerRole: true },
      { name: '🛡️ Faction Leader', color: '#C70039', hoist: true, isAdminRole: true },
      { name: '⚔️ Wasteland Ranger', color: '#E67E22', hoist: true },
      { name: '🔧 Scavenger / Medic', color: '#F1C40F', hoist: true },
      { name: '💀 Raider / Rogue', color: '#581845', hoist: true },
      { name: '🌱 Fresh Survivor', color: '#2ECC71', hoist: false }
    ],
    categories: [
      {
        name: '☣️ ━━ WASTELAND LORE ━━',
        channels: [
          { name: '📜・survival-rules', type: ChannelType.GuildText },
          { name: '🗺️・world-map-and-lore', type: ChannelType.GuildText, topic: 'Current state of the post-apocalyptic world' },
          { name: '🎭・faction-alignment', type: ChannelType.GuildText, topic: 'Choose your alliance and traits' }
        ]
      },
      {
        name: '📝 ━━ REGISTRATION ━━',
        channels: [
          { name: '👋・quarantine-entry', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '📝・character-submissions', type: ChannelType.GuildText, topic: 'Submit your OC character sheet' },
          { name: '✅・approved-survivors', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🏙️ ━━ ROLEPLAY ZONES ━━',
        channels: [
          { name: '🏚️・ruined-city-center', type: ChannelType.GuildText, topic: 'Scavenge for supplies in the crumbling ruins' },
          { name: '🛡️・settlement-safezone', type: ChannelType.GuildText, topic: 'Trading post and peaceful market' },
          { name: '🌲・toxic-wilderness', type: ChannelType.GuildText, topic: 'Dangerous radiation zone filled with beasts' },
          { name: '📻・emergency-broadcast', type: ChannelType.GuildText, topic: 'Shortwave radio chatter' }
        ]
      },
      {
        name: '🔊 ━━ PROXIMITY AUDIO ━━',
        channels: [
          { name: '📻・Radio Frequency Alpha', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '📻・Radio Frequency Bravo', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '⛺・Campfire Voice Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ MODERATION ━━',
        channels: [
          { name: '🔒・game-master-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-chillzone': {
    id: 'xenon-chillzone',
    category: '🌐 Community',
    name: '☕ Xenon ChillZone V5 Aesthetic Lounge',
    description: 'Clean minimalist aesthetic server with lo-fi vibes, late night talks, photo albums, and cozy corners.',
    roles: [
      { name: '⚡ Founder', color: '#D4AC0D', hoist: true, isOwnerRole: true },
      { name: '🌸 Caretaker / Mod', color: '#F1948A', hoist: true, isAdminRole: true },
      { name: '💎 Sweetheart / VIP', color: '#BB8FCE', hoist: true },
      { name: '🌙 Night Owl', color: '#85C1E9', hoist: true },
      { name: '☕ Regular / Member', color: '#A3E4D7', hoist: false }
    ],
    categories: [
      {
        name: '☕ ━━ WELCOME ━━',
        channels: [
          { name: '👋・arrivals', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '📜・etiquette', type: ChannelType.GuildText, topic: 'Be kind, respectful and peaceful' },
          { name: '📢・announcements', type: ChannelType.GuildAnnouncement },
          { name: '🎭・aesthetic-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💬 ━━ LOUNGE ━━',
        channels: [
          { name: '💬・cafe-talk', type: ChannelType.GuildText, topic: 'Cozy general chat for everyone' },
          { name: '📸・aesthetic-gallery', type: ChannelType.GuildText, topic: 'Photography, pets, food & sunset pictures' },
          { name: '💭・confessions', type: ChannelType.GuildText, topic: 'Anonymous thoughts and vents' },
          { name: '🎧・music-recommendations', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ AUDIO VIBES ━━',
        channels: [
          { name: '☕・Cafe Voice Lounge', type: ChannelType.GuildVoice },
          { name: '🌙・Late Night Whispers (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '📖・Study With Me', type: ChannelType.GuildVoice },
          { name: '💤・Sleep Room (Muted)', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-lounge', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-classroom': {
    id: 'xenon-classroom',
    category: '📚 Education',
    name: '🏫 Xenon School, University & Online Classroom',
    description: 'Organized educational layout for teachers, professors, tutors, homework help, and study groups.',
    roles: [
      { name: '🎓 Professor / Head Teacher', color: '#1B4F72', hoist: true, isOwnerRole: true },
      { name: '👨‍🏫 Teaching Assistant / TA', color: '#117A65', hoist: true, isAdminRole: true },
      { name: '📚 Student Council', color: '#D4AC0D', hoist: true },
      { name: '✏️ Class Student', color: '#3498DB', hoist: false },
      { name: '🤖 Study Bot', color: '#7289DA', hoist: true, isBotRole: true }
    ],
    categories: [
      {
        name: '🏫 ━━ CLASS INFO ━━',
        channels: [
          { name: '📜・syllabus-and-rules', type: ChannelType.GuildText },
          { name: '📢・class-bulletin', type: ChannelType.GuildAnnouncement, topic: 'Exam dates, assignment deadlines & schedule' },
          { name: '📂・course-materials', type: ChannelType.GuildText, topic: 'Lecture slides, PDF books & resources' }
        ]
      },
      {
        name: '✏️ ━━ ASSIGNMENTS & HELP ━━',
        channels: [
          { name: '👋・student-registration', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '📝・assignment-drop-box', type: ChannelType.GuildText },
          { name: '❓・homework-help', type: ChannelType.GuildText, topic: 'Ask questions and get help from tutors' },
          { name: '💬・student-commons', type: ChannelType.GuildText, topic: 'Casual chat between classes' }
        ]
      },
      {
        name: '🔊 ━━ LECTURE & STUDY PODS ━━',
        channels: [
          { name: '🎙️・Main Lecture Hall', type: ChannelType.GuildStageVoice },
          { name: '👨‍🏫・Professor Office Hours (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '📖・Study Pod Alpha (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '📖・Study Pod Beta (4)', type: ChannelType.GuildVoice, userLimit: 4 },
          { name: '🤫・Silent Study Room', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ FACULTY ONLY ━━',
        channels: [
          { name: '🔒・faculty-lounge', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-memes': {
    id: 'xenon-memes',
    category: '📹 Creators',
    name: '🐸 Xenon Meme Vault & Media Central',
    description: 'High-energy community dedicated to funny memes, video shitposts, cursed images, and media sharing.',
    roles: [
      { name: '👑 Meme Lord / Owner', color: '#27AE60', hoist: true, isOwnerRole: true },
      { name: '🛡️ Admin', color: '#E74C3C', hoist: true, isAdminRole: true },
      { name: '⭐ Certified Memer', color: '#F1C40F', hoist: true },
      { name: '🎬 Video Editor', color: '#9B59B6', hoist: true },
      { name: '👥 Member', color: '#99AAB5', hoist: false }
    ],
    categories: [
      {
        name: '📢 ━━ HUB ━━',
        channels: [
          { name: '📜・guidelines', type: ChannelType.GuildText },
          { name: '📢・announcements', type: ChannelType.GuildAnnouncement },
          { name: '🏆・meme-of-the-week', type: ChannelType.GuildText, topic: 'Winning memes from community contests' }
        ]
      },
      {
        name: '🐸 ━━ THE VAULT ━━',
        channels: [
          { name: '👋・arrivals', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・general-banter', type: ChannelType.GuildText },
          { name: '🐸・dank-memes', type: ChannelType.GuildText, topic: 'Only top tier memes here' },
          { name: '💀・cursed-images', type: ChannelType.GuildText },
          { name: '📹・video-shitposts', type: ChannelType.GuildText },
          { name: '🤖・meme-bot-commands', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ HANGOUT ━━',
        channels: [
          { name: '🎙️・Meme Review Stage', type: ChannelType.GuildStageVoice },
          { name: '🔊・Chaos Voice', type: ChannelType.GuildVoice },
          { name: '🍿・Watch Party Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ STAFF ━━',
        channels: [
          { name: '🔒・staff-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-police-rp': {
    id: 'xenon-police-rp',
    category: '🎮 Gaming',
    name: '🚨 Xenon Emergency Services & Police RP (FiveM / Roblox)',
    description: 'Full law enforcement, 911 dispatch, SWAT, Fire & EMS emergency services roleplay community.',
    roles: [
      { name: '👑 Police Chief / Owner', color: '#1B4F72', hoist: true, isOwnerRole: true },
      { name: '⭐ Assistant Chief', color: '#2471A3', hoist: true, isAdminRole: true },
      { name: '🚨 SWAT Commander', color: '#17202A', hoist: true },
      { name: '👮 Police Officer', color: '#2E86C1', hoist: true, mentionable: true },
      { name: '🚑 Fire & EMS Paramedic', color: '#E74C3C', hoist: true, mentionable: true },
      { name: '📻 911 Dispatcher', color: '#F39C12', hoist: true, mentionable: true },
      { name: '🚗 Citizen / Civilian', color: '#27AE60', hoist: false }
    ],
    categories: [
      {
        name: '🚨 ━━ DISPATCH HQ ━━',
        channels: [
          { name: '📜・penal-code-rules', type: ChannelType.GuildText },
          { name: '📢・department-notices', type: ChannelType.GuildAnnouncement },
          { name: '🚨・911-call-logs', type: ChannelType.GuildText, topic: 'Live incident dispatches' },
          { name: '🎭・unit-callsign-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '👮 ━━ POLICE OPERATIONS ━━',
        channels: [
          { name: '👋・academy-intake', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・precinct-chat', type: ChannelType.GuildText },
          { name: '🚔・patrol-roster', type: ChannelType.GuildText },
          { name: '⚖️・warrants-and-arrests', type: ChannelType.GuildText },
          { name: '📸・bodycam-footage', type: ChannelType.GuildText }
        ]
      },
      {
        name: '📻 ━━ RADIO COMMS ━━',
        channels: [
          { name: '📻・Dispatch Main (TAC 1)', type: ChannelType.GuildVoice },
          { name: '📻・Patrol Division (TAC 2)', type: ChannelType.GuildVoice },
          { name: '📻・SWAT Tactical Channel', type: ChannelType.GuildVoice, userLimit: 6 },
          { name: '🚑・Fire & EMS Comms', type: ChannelType.GuildVoice, userLimit: 8 },
          { name: '☕・Locker Room Voice', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ COMMAND STAFF ━━',
        channels: [
          { name: '🔒・high-command-chat', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-clan-wars': {
    id: 'xenon-clan-wars',
    category: '🛡️ Esports & Clans',
    name: '⚔️ Xenon Clan Wars & Faction Stronghold',
    description: 'Competitive gaming clan base for Clash of Clans, Rust, Ark, Destiny, and MMO war factions.',
    roles: [
      { name: '👑 Clan Warlord', color: '#900C3F', hoist: true, isOwnerRole: true },
      { name: '🛡️ High Commander', color: '#C0392B', hoist: true, isAdminRole: true },
      { name: '⚔️ Raid Captain', color: '#E67E22', hoist: true, mentionable: true },
      { name: '🛡️ Elite Warrior', color: '#F1C40F', hoist: true },
      { name: '🏹 Clan Recruit', color: '#27AE60', hoist: false },
      { name: '📢 Clan War Ping', color: '#7289DA', hoist: false, mentionable: true }
    ],
    categories: [
      {
        name: '🏰 ━━ FORTRESS INTEL ━━',
        channels: [
          { name: '📜・clan-codex', type: ChannelType.GuildText },
          { name: '📢・war-declarations', type: ChannelType.GuildAnnouncement },
          { name: '🗓️・raid-schedule', type: ChannelType.GuildText, topic: 'Upcoming clan wars, bosses and battle times' },
          { name: '🎭・roster-roles', type: ChannelType.GuildText }
        ]
      },
      {
        name: '⚔️ ━━ WAR ROOM ━━',
        channels: [
          { name: '👋・recruits-intake', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・clan-tavern', type: ChannelType.GuildText },
          { name: '🗺️・tactical-maps', type: ChannelType.GuildText, topic: 'Base layouts and war coordinates' },
          { name: '🏆・hall-of-glory', type: ChannelType.GuildText, topic: 'Victories, trophies and loot screenshots' }
        ]
      },
      {
        name: '🔊 ━━ TACTICAL COMMS ━━',
        channels: [
          { name: '⚔️・War Room Comms', type: ChannelType.GuildVoice },
          { name: '🛡️・Raid Squad Alpha (5)', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🛡️・Raid Squad Bravo (5)', type: ChannelType.GuildVoice, userLimit: 5 },
          { name: '🍺・Tavern Hangout', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ COUNCIL ━━',
        channels: [
          { name: '🔒・warlords-council', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  'xenon-bot-dev': {
    id: 'xenon-bot-dev',
    category: '💻 Tech & Dev',
    name: '🤖 Xenon Discord Bot Development & API Lab',
    description: 'Server template for bot creators, open source tools, webhook integrations, and developer testing.',
    roles: [
      { name: '👑 Lead Developer', color: '#2C3E50', hoist: true, isOwnerRole: true },
      { name: '🛡️ Core Contributor', color: '#1ABC9C', hoist: true, isAdminRole: true },
      { name: '🧪 Beta Tester', color: '#F39C12', hoist: true },
      { name: '💻 Developer', color: '#3498DB', hoist: false },
      { name: '🤖 Bot', color: '#7289DA', hoist: true, isBotRole: true },
      { name: '👥 Member', color: '#99AAB5', hoist: false }
    ],
    categories: [
      {
        name: '🤖 ━━ BOT STATUS ━━',
        channels: [
          { name: '📜・terms-of-service', type: ChannelType.GuildText },
          { name: '📢・release-notes', type: ChannelType.GuildAnnouncement, topic: 'v1.0.0 updates and breaking changes' },
          { name: '🟢・bot-uptime', type: ChannelType.GuildText },
          { name: '📖・api-documentation', type: ChannelType.GuildText }
        ]
      },
      {
        name: '💻 ━━ DEV & FEEDBACK ━━',
        channels: [
          { name: '👋・welcome-devs', type: ChannelType.GuildText, isWelcomeChannel: true },
          { name: '💬・bot-discussions', type: ChannelType.GuildText },
          { name: '💡・suggestions', type: ChannelType.GuildText },
          { name: '🐛・bug-tracker', type: ChannelType.GuildText },
          { name: '🧪・beta-testing', type: ChannelType.GuildText },
          { name: '💻・code-review', type: ChannelType.GuildText }
        ]
      },
      {
        name: '🔊 ━━ VOICE ━━',
        channels: [
          { name: '🎧・Pair Programming Voice (2)', type: ChannelType.GuildVoice, userLimit: 2 },
          { name: '💡・Brainstorming Lounge', type: ChannelType.GuildVoice }
        ]
      },
      {
        name: '🛡️ ━━ MANAGEMENT ━━',
        channels: [
          { name: '🔒・dev-team-private', type: ChannelType.GuildText },
          { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
        ]
      }
    ]
  },

  // ================= 🌟 SCRAPED & LIVE XENON.BOT TEMPLATES =================
  'xenon-community-starter': {
    "id": "xenon-community-starter",
    "xenonCode": "FdqzpAambZyy",
    "category": "🌐 Community",
    "name": "🖼️ Community Starter",
    "description": "A simple template for new public community servers, find more info at https://chris.land/starter",
    "roles": [
        {
            "name": "Regular",
            "color": "#e67e22",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Muted",
            "color": "#000222",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Bots",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Staff",
            "color": "#2ecc71",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Owner",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "Information",
            "channels": [
                {
                    "name": "welcome",
                    "type": ChannelType.GuildText,
                    "topic": "Welcome to this guild. Make sure to read the rules. | Template created by Chris#8304, more info at h"
                },
                {
                    "name": "announcements",
                    "type": ChannelType.GuildText,
                    "topic": "Important information and announcements."
                },
                {
                    "name": "rules",
                    "type": ChannelType.GuildText,
                    "topic": "A list of rules you should follow in this server."
                }
            ]
        },
        {
            "name": "Chat",
            "channels": [
                {
                    "name": "general",
                    "type": ChannelType.GuildText,
                    "topic": "The main place for talking."
                },
                {
                    "name": "off-topic",
                    "type": ChannelType.GuildText,
                    "topic": "The place for talking about something different."
                },
                {
                    "name": "commands",
                    "type": ChannelType.GuildText,
                    "topic": "This is the channel for using the servers bots."
                }
            ]
        },
        {
            "name": "Staff",
            "channels": [
                {
                    "name": "staff-chat",
                    "type": ChannelType.GuildText,
                    "topic": "The place for staff members to talk to each other."
                },
                {
                    "name": "admin-chat",
                    "type": ChannelType.GuildText,
                    "topic": "Channel for the server owner and administrators."
                },
                {
                    "name": "staff-commands",
                    "type": ChannelType.GuildText,
                    "topic": "Any commands that you want hidden from normal members should be done here."
                },
                {
                    "name": "bot-log",
                    "type": ChannelType.GuildText,
                    "topic": "Logs created by any bots are posted here."
                }
            ]
        },
        {
            "name": "💬 Voice chats",
            "channels": [
                {
                    "name": "🔊 General 🔊",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 15
                },
                {
                    "name": "🎮 Gaming 🎮",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 15
                },
                {
                    "name": "🌟 Regulars only 🌟",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🔒 Staff only 🔒",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 20
                },
                {
                    "name": "💤 AFK 💤",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 20
                },
                {
                    "name": "voice-chat",
                    "type": ChannelType.GuildText,
                    "topic": "Don't have a mic? Don't want to talk? Use this chat to type to people in voice chats."
                }
            ]
        }
    ]
},

  'xenon-advanced-private-server': {
    "id": "xenon-advanced-private-server",
    "xenonCode": "EaJx6N83Pee9",
    "category": "🎮 Gaming",
    "name": "🧑‍🏫 Advanced Private Server",
    "description": "A complete, modern, and feature-rich private server. For help in setup join https://discord.gg/DhDxz9E",
    "roles": [
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Bot",
            "color": "#ffc3c3",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Member",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Team",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Friend",
            "color": "#2ecc71",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Admin",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Owner",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "DELETE THIS",
            "channels": [
                {
                    "name": "Read #rules topic",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Best Bot: dub.sh/nova-bot",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "💳 | ==== Important ==== | 💳",
            "channels": [
                {
                    "name": "👋・welcome",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📜・rules",
                    "type": ChannelType.GuildText,
                    "topic": "<:spoke_info:761214506310565900> **Hey,** thanks for using my template! Please **read** below to get"
                },
                {
                    "name": "📣・announcements",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📦・resources",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "👥 | ====== Main ====== | 👥",
            "channels": [
                {
                    "name": "💬・general",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👥・team-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📅・meeting-plans",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📬・off-topic",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔊 | ====== Voice ====== | 🔊",
            "channels": [
                {
                    "name": "🔊・Lounge",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🎵・Music",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "📅・Meeting",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🎮・Gaming",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💤・AFK",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "🌀 | === Playing Rooms === | 🌀",
            "channels": [
                {
                    "name": "🌀・Duos",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "🌀・Trios",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "🌀・Squads",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                }
            ]
        },
        {
            "name": "🎯 | ===== Private ===== | 🎯",
            "channels": [
                {
                    "name": "🎓・private-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔎・logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔐・private voice",
                    "type": ChannelType.GuildVoice
                }
            ]
        }
    ]
},

  'xenon-gaming': {
    "id": "xenon-gaming",
    "xenonCode": "R2xY28n8grGZ",
    "category": "🎮 Gaming",
    "name": "🎲 Gaming",
    "description": "To play with friends. Bots needed: MEE6, Member Count, Fredboat, PatchBot, Rythm, Xenon. Please vote me if this helped!",
    "roles": [
        {
            "name": "🎵Dj🎵",
            "color": "#e91e63",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Dota-Team",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "📺Movie-Streamer📺",
            "color": "#607d8b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👽Bot👽",
            "color": "#2ecc71",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🐕The Pet🐕",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🎥Streamer🎥",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💖VIP💖",
            "color": "#9b59b6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌌Crew🌌",
            "color": "#08c3f7",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "😈Owner😈",
            "color": "#ff0000",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "📋SERVER INFO📋",
            "channels": [
                {
                    "name": "۩͇̿V͇̿I͇̿P͇̿Изв҉ин҉и҉те҉V͇̿I͇̿P ۩͇̿",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Member Count: 270",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Bot Count: 3",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "User Count: 267",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Channel Count: 78",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Role Count: 20",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "📝Text Channels📝",
            "channels": [
                {
                    "name": "👋welcome",
                    "type": ChannelType.GuildText,
                    "topic": "Contact me for help Извините#3398"
                },
                {
                    "name": "📂rules-verification",
                    "type": ChannelType.GuildText,
                    "topic": "Contact me for help Извините#3398"
                },
                {
                    "name": "💠moderator-only",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💬general",
                    "type": ChannelType.GuildText,
                    "topic": "https://www.twitch.tv/xc0r3_94"
                },
                {
                    "name": "🎥streams",
                    "type": ChannelType.GuildText,
                    "topic": "Contact me for help Извините#3398"
                },
                {
                    "name": "🎵music-bot-controls",
                    "type": ChannelType.GuildText,
                    "topic": "Contact me for help Извините#3398"
                },
                {
                    "name": "🔒private-music🎵",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📺movies-talk",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📃News📃",
            "channels": [
                {
                    "name": "📰csgo-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰cycle-frontier-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰dota-2-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰apex-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰gta-v-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰wow-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰dead-by-daylight-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰lol-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰rainbox6siege-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰pubg-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰fivem-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰rdr2-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰raft-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰stocks-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰cod-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰pvu",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰new-world-news",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🎧Voice Channels🎧",
            "channels": [
                {
                    "name": "🔒Private😈",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔒Private💪",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔒Private💖",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "📺 Movies",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔊General",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔊General",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "📺Streaming",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💤afk",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "🌌Dota 2🌌",
            "channels": [
                {
                    "name": "🔒Dota-Team",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🌌Dota 2",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🌌Dota 2 party",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🌌Dota 2 party",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🌌Dota 2 team 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "🌌Dota 2 Team 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "🌌dota-2-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💠Rust💠",
            "channels": [
                {
                    "name": "💠Rust",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💠Rust",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💠rust-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "Gta-fiveM",
            "channels": [
                {
                    "name": "🚁Gta5",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🚁gta-5",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "new-world",
            "channels": [
                {
                    "name": "🔮New World",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔮New World",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔮new-world",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "Tarkov",
            "channels": [
                {
                    "name": "💥Tarkov",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💥Tarkov",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💥tarkov-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💣ApeX💣",
            "channels": [
                {
                    "name": "💣ApeX",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💣ApeX",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💣apex-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💥Carlos Duti💥",
            "channels": [
                {
                    "name": "💥Carlos Duti",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "💥carlos-duti-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "👹 DBD 👹",
            "channels": [
                {
                    "name": "🔪 Killer 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "🔪 Killer 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "👹dbd-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏃💨 Survivors 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "🏃💨 Survivors 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                }
            ]
        },
        {
            "name": "👻AMONG-US👻",
            "channels": [
                {
                    "name": "👻among-us-passwords",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👻Among Us",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 11
                },
                {
                    "name": "👻Among Us",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 11
                }
            ]
        },
        {
            "name": "🔫Fortnite🔫",
            "channels": [
                {
                    "name": "🔫fortnite-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔫Duo",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "🔫Squad",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                }
            ]
        },
        {
            "name": "💎PubG💎",
            "channels": [
                {
                    "name": "💎pubg-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💎Duo",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "💎Squad",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                }
            ]
        },
        {
            "name": "🎮CSGO🎮",
            "channels": [
                {
                    "name": "🎮csgo-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎮CSGO",
                    "type": ChannelType.GuildVoice
                }
            ]
        }
    ]
},

  'xenon-simple-server-template': {
    "id": "xenon-simple-server-template",
    "xenonCode": "r2uhQjNFKYHA",
    "category": "🎮 Gaming",
    "name": "🕹️ Simple Server Template",
    "description": "Read the channel topic of #read-channel-topic for info. Support server: srnyx.com/discord",
    "roles": [
        {
            "name": "Bot",
            "color": "#607d8b",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⠀",
            "color": "#202024",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "More Pings",
            "color": "#979c9f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Member",
            "color": "#95a5a6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⠀",
            "color": "#202024",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "✨ Active [LVL 5]",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⭐ Super Active [LVL 10]",
            "color": "#18ad8f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌟 Extremely Active [LVL 20]",
            "color": "#159d83",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💫 Insanely Active [LVL 30]",
            "color": "#138f76",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌠 Most Active [LVL 50]",
            "color": "#11806a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🏆 Champion",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👑 VIP",
            "color": "#9b59b6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Muted",
            "color": "#546e7a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⠀",
            "color": "#202024",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Staff",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Moderator",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Head Moderator",
            "color": "#992d22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Administrator",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Owner",
            "color": "#206694",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "⠀",
            "color": "#202024",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "*",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "read-channel-topic",
                    "type": ChannelType.GuildText,
                    "topic": "👋 **Hey, thanks for using my template!** ℹ️ **Important information:** You can customize the server"
                },
                {
                    "name": "Template created by:",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "srnyx.com/discord",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "📌 Important",
            "channels": [
                {
                    "name": "📜rules",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "❔information",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🆘support",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📢announcements",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💬 General",
            "channels": [
                {
                    "name": "🔊 General 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "general",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔊 General 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "bot-commands",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "suggestions",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "vip-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🚧 Staff",
            "channels": [
                {
                    "name": "Mod Chat",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "Admin Chat",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "staff-announcements",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "mod-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "head-mod-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "admin-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "reports",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "logs",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-modelo-pt-br': {
    "id": "xenon-modelo-pt-br",
    "xenonCode": "HnqY8F9hDxgC",
    "category": "🎮 Gaming",
    "name": "⭐ MODELO pt-BR",
    "description": "Esse modelo é apenas uma base para o seu servidor, faça as alterações conforme suas necessidades. 🎁🤝",
    "roles": [
        {
            "name": "Votações",
            "color": "#feabff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Atualizações Servidor",
            "color": "#feabff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sorteios/Eventos",
            "color": "#feabff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ﾠﾠﾠﾠﾠ ﾠﾠﾠ NOTIFICAÇÕESﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Seguindo a Vida",
            "color": "#adffad",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Estudando",
            "color": "#adffad",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Trabalhando",
            "color": "#adffad",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "18+ anos",
            "color": "#7760ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "16-17 anos",
            "color": "#7760ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "13-15 anos",
            "color": "#7760ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Não-binário",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Feminino",
            "color": "#ff7272",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Masculino",
            "color": "#69b5ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Membro",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ﾠﾠﾠﾠ ﾠﾠﾠ ﾠﾠﾠ  PERFILﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Nice Suggestion",
            "color": "#a2ffdb",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Event Winner",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Apoiador TOP.GG",
            "color": "#54e360",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Membro Ativo",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NVL 2+",
            "color": "#8ae84c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NVL 5+",
            "color": "#ebef4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NVL 10+",
            "color": "#ff8d42",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NVL 25+",
            "color": "#945ef9",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NVL 50+",
            "color": "#c91fbb",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NVL 75+",
            "color": "#ff3b3b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NVL 100+",
            "color": "#00a9ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ﾠﾠﾠﾠﾠ ﾠﾠﾠﾠCONQUISTAS ﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠﾠ",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Khaki",
            "color": "#f0e68c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Yellow",
            "color": "#ffff00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Gold",
            "color": "#ffd700",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Orange",
            "color": "#ffa500",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkOrange",
            "color": "#ff8c00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "OrangeRed",
            "color": "#ff4500",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Red",
            "color": "#ff0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Tomato",
            "color": "#ff6347",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Coral",
            "color": "#ff7f50",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightSalmon",
            "color": "#ffa07a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkSalmon",
            "color": "#e9967a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Salmon",
            "color": "#fa8072",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Brown",
            "color": "#a52a2a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "FireBrick",
            "color": "#b22222",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkRed",
            "color": "#8b0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Maroon",
            "color": "#800000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Crimsom",
            "color": "#dc143c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "IndianRed",
            "color": "#cd5c5c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightCoral",
            "color": "#f08080",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Pink",
            "color": "#ffc0cb",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightPink",
            "color": "#ffb6c1",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "PaleVioletRed",
            "color": "#db7093",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "HotPink",
            "color": "#ff69b4",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DeepPink",
            "color": "#ff1493",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumVioletRed",
            "color": "#c71585",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Plum",
            "color": "#dda0dd",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Orchid",
            "color": "#da70d6",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Violet",
            "color": "#ee82ee",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Fuchsia",
            "color": "#ff00ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkMagenta",
            "color": "#8b008b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Purple",
            "color": "#a020f0",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumOrchid",
            "color": "#ba55d3",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkOrchid",
            "color": "#9932cc",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkViolet",
            "color": "#9400d3",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Indigo",
            "color": "#4b0082",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "BlueViolet",
            "color": "#8a2be2",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumPurple",
            "color": "#9370db",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumSlateBlue",
            "color": "#7b68ee",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Tan",
            "color": "#d2b48c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "BurlyWood",
            "color": "#deb887",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Wheat",
            "color": "#f5deb3",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "NavajoWhite",
            "color": "#ffdead",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SandyBrown",
            "color": "#f4a460",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Chocolate",
            "color": "#d2691e",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Peru",
            "color": "#cd853f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "RosyBrown",
            "color": "#bc8f8f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Siena",
            "color": "#a0522d",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SaddleBrown",
            "color": "#8b4513",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkGoldenrod",
            "color": "#b8860b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Goldenrod",
            "color": "#daa520",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkKhaki",
            "color": "#bdb76b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Olive",
            "color": "#808000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkOliveGreen",
            "color": "#556b2f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "OliveDrab",
            "color": "#6b8e23",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "YellowGreen",
            "color": "#9acd32",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "GreenYellow",
            "color": "#adff2f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Chartreuse",
            "color": "#7fff00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LawnGreen",
            "color": "#7cfc00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Lime",
            "color": "#00ff00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LimeGreen",
            "color": "#32cd32",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ForestGreen",
            "color": "#228b22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Green",
            "color": "#008000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkGreen",
            "color": "#006400",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SeaGreen",
            "color": "#2e8b57",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumSeaGreen",
            "color": "#3cb371",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkSeaGreen",
            "color": "#8fbc8f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightGreen",
            "color": "#90ee90",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "PaleGreen",
            "color": "#98fb98",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SpringGreen",
            "color": "#00ff7f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumSpringGreen",
            "color": "#00fa9a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "CadetBlue",
            "color": "#5f9ea0",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumAquamarine",
            "color": "#66cdaa",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Aquamarine",
            "color": "#7fffd4",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Seal",
            "color": "#008080",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkCyan",
            "color": "#008b8b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightSeaGreen",
            "color": "#20b2aa",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumTurquoise",
            "color": "#48d1cc",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Turquoise",
            "color": "#40e0d0",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkTurquoise",
            "color": "#00ced1",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cyan",
            "color": "#00ffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightSlateGray",
            "color": "#778899",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SlateGray",
            "color": "#708090",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightSteelBlue",
            "color": "#b0c4de",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SteelBlue",
            "color": "#4682b4",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightBlue",
            "color": "#add8e6",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SkyBlue",
            "color": "#87ceeb",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightSkyBlue",
            "color": "#87cefa",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DeepSkyBlue",
            "color": "#00bfff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DodgerBlue",
            "color": "#1e90ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "RoyalBlue",
            "color": "#4169e1",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "CornflowerBlue",
            "color": "#6495ed",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue",
            "color": "#0000ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MediumBlue",
            "color": "#0000cd",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkBlue",
            "color": "#00008b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Navy",
            "color": "#000080",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MidnightBlue",
            "color": "#191970",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkSlateBlue",
            "color": "#483d8b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SlateBlue",
            "color": "#6a5acd",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "White",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Gainsboro",
            "color": "#dcdcdc",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LightGrey",
            "color": "#d3d3d3",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Silver",
            "color": "#c0c0c0",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DarkGray",
            "color": "#a9a9a9",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Gray",
            "color": "#808080",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "DimGray",
            "color": "#696969",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Black",
            "color": "#0c0b0b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💎 Vip",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💗 Suporte",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👮 Mod",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "🤖 Bot",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Admin",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "🛠️",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👑 Dono",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "🎀 discord.gg/seuconvite",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "🔐 STAFF",
            "channels": [
                {
                    "name": "💬┃chat-staff",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👾┃cmd¹",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🍸┃Call Staff",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔌┃cmd²",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📂┃server-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📂┃mod-logs",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⭐ INFO",
            "channels": [
                {
                    "name": "👋┃boas-vindas",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📌┃regras",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📝┃registro",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📯┃anúncios",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎉┃sorteios",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎨┃cores",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "✨┃cargos",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🛒┃seja-vip",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💬 CHATS",
            "channels": [
                {
                    "name": "💎┃chat-vip",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💬┃chat-geral",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤖┃comandos",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "😄┃memes-e-mídias",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🐦┃artes",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔊 CALLS",
            "channels": [
                {
                    "name": "┃☕・Chilling",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "┃🎵・Music",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "┃🎮・Gaming",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╰💤⠂ Afk",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╭🔇・sem-mic",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🎲 DIVERSÃO",
            "channels": [
                {
                    "name": "👒┃mudae",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🧙┃akinator",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🦝┃pokétwo",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎨┃gartic",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💗 SUPORTE",
            "channels": [
                {
                    "name": "🔍┃faq",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💭┃suporte-geral",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💡┃sugestões",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🚫┃denúncias",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📞┃atendimento",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-advanced-support-server': {
    "id": "xenon-advanced-support-server",
    "xenonCode": "Tha94ebKmwEX",
    "category": "🎮 Gaming",
    "name": "🎒 Advanced Support Server",
    "description": "A complete, modern, and feature-rich support server. For help in setup join https://discord.gg/DhDxz9E",
    "roles": [
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Bots",
            "color": "#ffe6e6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Members",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Voter",
            "color": "#61bcff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Partners",
            "color": "#9b59b6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Patreons",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Support",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Moderators",
            "color": "#dff159",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Administrators",
            "color": "#2ecc71",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Developers",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "DELETE THIS",
            "channels": [
                {
                    "name": "Read #information topic",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Best Bot: dub.sh/nova-bot",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "💳 | ==== Important ==== | 💳",
            "channels": [
                {
                    "name": "📑・information",
                    "type": ChannelType.GuildText,
                    "topic": "<:spoke_info:761214506310565900> **Hey,** thanks for using my template! Please **read** below to get"
                },
                {
                    "name": "🔔・announcements",
                    "type": ChannelType.GuildText,
                    "topic": "Important server & bot updates."
                },
                {
                    "name": "📜・changelog",
                    "type": ChannelType.GuildText,
                    "topic": "In this channel are displayed the change-logs of each update applied."
                },
                {
                    "name": "📡・bot-status",
                    "type": ChannelType.GuildText,
                    "topic": "Check if the bot is online!"
                },
                {
                    "name": "🔗・github-feeds",
                    "type": ChannelType.GuildText,
                    "topic": "Live github-feeds and updates to keep you updated!"
                },
                {
                    "name": "👋・joins-leaves",
                    "type": ChannelType.GuildText,
                    "topic": "Well, this one is obvious..."
                }
            ]
        },
        {
            "name": "🎯 | ====== Main ====== | 🎯",
            "channels": [
                {
                    "name": "💬・general",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎫・support",
                    "type": ChannelType.GuildText,
                    "topic": "If you need help, or have any questions, this is the right channel for you!"
                },
                {
                    "name": "📚・suggestions",
                    "type": ChannelType.GuildText,
                    "topic": "In this channel you can suggest features that you would like to see in future-updates!"
                },
                {
                    "name": "📁・bug-reports",
                    "type": ChannelType.GuildText,
                    "topic": "If you've found any bug or problem on the bot, make sure to report it in this channel."
                },
                {
                    "name": "🤖・commands",
                    "type": ChannelType.GuildText,
                    "topic": "In this channel you can interact with all bots on the server."
                }
            ]
        },
        {
            "name": "🔊 | ====== Voice ====== | 🔊",
            "channels": [
                {
                    "name": "🔊・General",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🎵・Music",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔐・Private",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "💤・AFK",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "🎯 | ====== Staff ====== | 🎯",
            "channels": [
                {
                    "name": "📪・staff-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎓・staff-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔐・staff-commands",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📧・community-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📥・discord-updates",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📛・moderation-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔎・utility-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👥・invites",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔧 | ==== Bot Logs ==== | 🔧",
            "channels": [
                {
                    "name": "📥・guild-join",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📤・guild-leave",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📛・bot-errors",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-gaming-community-etc': {
    "id": "xenon-gaming-community-etc",
    "xenonCode": "KVayW7WhJuYj",
    "category": "🎮 Gaming",
    "name": "👾 Gaming community etc",
    "description": "Pre-configured Discord server template from Xenon.bot",
    "roles": [
        {
            "name": "Muted",
            "color": "#808080",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "This person is a server support",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯|🍀|Lucky Gaming ™|🍀|⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🛡️",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🛡️│Bots",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|🔵|BOTS|🔵|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔑│Member",
            "color": "#546e7a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|🌍|MEMBERS|🌍|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "❤️️｜trusted",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "❤️️",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌀",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌀│Friend",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|🔸|ELITE|🔸|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💠",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💠│Helper",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔨",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔨│Mod",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "┗⎯⎯⎯|🔹|STAFF TEAM|🔹|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔒",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔒│Admin",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "┗⎯⎯|🔷|ADMINISTRATION|🔷|⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "🌀",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌀│CoOwner",
            "color": "#da004e",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "👑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👑│Owner",
            "color": "#ff0000",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "┗⎯⎯|📊|SERVER STATS|📊|⎯⎯┑",
            "channels": [
                {
                    "name": "〔🍪〕Members: 3",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "┗⎯⎯⎯|🍀|SERVER INFO|🍀|⎯⎯⎯┑",
            "channels": [
                {
                    "name": "〔📌〕annoucments",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔📊〕welcome",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔🆙〕level-up",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔📄〕rules",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔📕〕news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔🎉〕giveaway",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔🎫〕tickets",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "┗⎯⎯⎯⎯⎯⎯|💭|CHAT|💭|⎯⎯⎯⎯⎯⎯┑",
            "channels": [
                {
                    "name": "〔💬〕main-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔📷〕off-topic",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔🤖〕bot-commands",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔💡〕suggestions",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "partnership",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "┗⎯⎯⎯⎯⎯⎯|📞|VOICE|📞|⎯⎯⎯⎯⎯⎯┑",
            "channels": [
                {
                    "name": "〔🔊〕Public #1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "〔🔊〕Public #2",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "〔🔊〕Public #3",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "〔🔐〕Private",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "〔🔐〕Private",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "〔🔐〕Private",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "〔🔇〕AFK",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "┗⎯⎯⎯⎯⎯|🎵|MUSIC|🎵|⎯⎯⎯⎯⎯┑",
            "channels": [
                {
                    "name": "〔🎶〕Music #1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "〔🎶〕Music #2",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "〔🎶〕music",
                    "type": ChannelType.GuildText,
                    "topic": "| » 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗙𝗢𝗥 𝗠𝗨𝗦𝗜𝗖 𝗕𝗢𝗧𝗦 [.]-[-]-[p]-[ _ ] « |"
                }
            ]
        },
        {
            "name": "┗⎯⎯⎯⎯⎯|🌀|STAFF|🌀|⎯⎯⎯⎯⎯┑",
            "channels": [
                {
                    "name": "〔🚀〕staff-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "partnerships",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〔🚀〕staff voice",
                    "type": ChannelType.GuildVoice
                }
            ]
        }
    ]
},

  'xenon-alone-v5-0': {
    "id": "xenon-alone-v5-0",
    "xenonCode": "WwE6cF9Bg2XZ",
    "category": "🎮 Gaming",
    "name": "🎮 ALone V5. 0",
    "description": "ChillZone Server Template",
    "roles": [
        {
            "name": "╭───𒌋𒀖 「🜲・PARTNERHIP PINGS」",
            "color": "#48aaff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・GIVEAWAY PINGS」",
            "color": "#48aaff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・YOUTUBE PINGS」",
            "color": "#48aaff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・  P I N G S  ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・TALKATIVE」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・SONG LOVER」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MINGLE」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・SINGLE」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・BELOW 18」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ABOVE 18」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・EMULATOR」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・IOS」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ANDROID」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・FEMALE」",
            "color": "#f34885",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MALE」",
            "color": "#419cf0",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・  A B O U T  M E   ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ BOTS」",
            "color": "#c546ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MEMBERS」",
            "color": "#eb9dff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・CLOSΣ  OПΣS」",
            "color": "#ff6ef4",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ΩP GΛMΣRS」",
            "color": "#101111",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・FRIENDS」",
            "color": "#4cffa1",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・PARTNERS」",
            "color": "#97ffba",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・SECURITY ROLES   ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 5丨BEGINNER」",
            "color": "#ffcccc",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 10丨NICE」",
            "color": "#fcb0b0",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 15丨COOL」",
            "color": "#ff8787",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 20丨SUPERB」",
            "color": "#ff7979",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 25丨EXTREME」",
            "color": "#ff5858",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 30丨INSANE」",
            "color": "#ffa55e",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 35丨MASTER」",
            "color": "#ea903a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 40丨PROFESSIONAL」",
            "color": "#ff7300",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 45丨HACKER」",
            "color": "#def72e",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 50丨CHAMPION」",
            "color": "#2fc028",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 55丨GRAND MASTER」",
            "color": "#25c059",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 60丨GREAT」",
            "color": "#84ffad",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 65丨ACE」",
            "color": "#46ff8b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 70丨SHINGAMI」",
            "color": "#3fffae",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 75丨LAWLIET L」",
            "color": "#20e5ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 80丨KIRA 」",
            "color": "#319bff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 85丨MEGA Y 」",
            "color": "#7c71f3",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 90丨MEGA X 」",
            "color": "#1900ff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 95丨LEGEND」",
            "color": "#ff5050",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・LEVEL 100丨GOD」",
            "color": "#ff0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・ L E V E L  ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・GIVEAWAY MANAGER」",
            "color": "#99acff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・OFFICIALS」",
            "color": "#fcff94",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・STAFF」",
            "color": "#00d1ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・TRAIL MODERATOR」",
            "color": "#7cb5ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "╭────────⎝ ・STAFF POWERS ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・HΣLPΣRS」",
            "color": "#ff8179",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・GIRL MODERATOR」",
            "color": "#ff5bf5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ⱮΩDΣᏒΛƬΩᏒ」",
            "color": "#65ffae",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ᏟHΛƬ MΩDΣᏒΛƬΩᏒ」",
            "color": "#99ffd9",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・SΣПIΩᏒ MΩDΣᏒΛƬΩᏒ」",
            "color": "#ffbb85",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・HΣΛD MΩDΣᏒΛƬΩᏒ」",
            "color": "#fff600",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・SUPPORT TEAM 」",
            "color": "#9287ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MΛNΛGEMENƬ DIᏒΣᏟƬΩᏒ」",
            "color": "#f340ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ΛDMIN」",
            "color": "#0d0e0f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・HΣΛD MΛNΛGΣMΣNƬ 」",
            "color": "#06ff29",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・ SUPREME POWERS ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MANAGE CHANNELS PERMS」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MANAGE SERVER PERMS」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MANAGE ROLES PERMS」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・AUDITLOG PERMS」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MANAGE EMOJI PERMS」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・KICK-BAN PERMS」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・  PERMS ACCESS  ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・MOST ACTIVE [CHAT]」",
            "color": "#080808",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ПAME IS ENOUGH」",
            "color": "#ffffff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・DIᏒΣᏟƬΩᏒ」",
            "color": "#4caaff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ΣXΣᏟUƬIVΣ」",
            "color": "#4aff87",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ᏟØ-FΩUNDΣᏒ」",
            "color": "#2ad6ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・  FULL POWER  ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・CΣØ/FØUПDΣR」",
            "color": "#f7ff00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・Ꮯ Ꮢ Σ Λ Ƭ Ω Ꮢ」",
            "color": "#ff00ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ F Ω U П D Σ R」",
            "color": "#ff0f00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭────────⎝ ・  S Σ Ꮯ U R Σ D  ・ ⎠───────➤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "╭───𒌋𒀖 「🜲・ 👑」",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "❍──────🔥───➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔥・TOTAL: X",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔥・GOAL: Y",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "❍──────🔥───➤",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "❍──────WELCOME───➤",
            "channels": [
                {
                    "name": "╭・❄・welcome",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・❄・left",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・❄・rules",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╰・❄・self-roles",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "❍──────IMPORTANT───➤",
            "channels": [
                {
                    "name": "╭・🌨・announcements",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🌨・giveaways",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🌨・giveaway-proof",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╰・🌨・booster",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "❍──────REWARDS───➤",
            "channels": [
                {
                    "name": "╭・🍁・invite-rewards",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╰・🍁・proof",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "❍──────GENERAL───➤",
            "channels": [
                {
                    "name": "╭・🎄・chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎄・bot-commands",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎄・media",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎄・paid-promotion",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╰・🎄・partners",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "❍──────FUN-GAMES───➤",
            "channels": [
                {
                    "name": "╭・🎀・dank-memer",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎀・truth-or-dare",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎀・anigame",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎀・ai-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎀・zero-two",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎀・akinator",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎀・poketwo",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🎀・casino",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╰・🎀・owo",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "❍──────CHECK───➤",
            "channels": [
                {
                    "name": "╭・💞・rank-check",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╰・💞・rank-up",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "❍──────MUSIC───➤",
            "channels": [
                {
                    "name": "╭・🎵・groovy-command",
                    "type": ChannelType.GuildText,
                    "topic": "Command [-]"
                },
                {
                    "name": "├・🎵・hydra-commands",
                    "type": ChannelType.GuildText,
                    "topic": "⏯ Pause/Resume the song. ⏹ Stop and empty the queue. ⏭ Skip the song. 🔄 Switch between the loop mod"
                },
                {
                    "name": "├・🎵・rythm-commands",
                    "type": ChannelType.GuildText,
                    "topic": "Command [!]"
                },
                {
                    "name": "╰・🎵・octave-command",
                    "type": ChannelType.GuildText,
                    "topic": "Command [ _ ]"
                },
                {
                    "name": "╭────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・📀・GROOVY [-]",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・📀・RYTHM [!]",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・📀・HYDRA [.]",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・📀・OCTAVE [ _ ]",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╰────────────➤",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "❍──────VOICE───➤",
            "channels": [
                {
                    "name": "╭────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・🎤・CLUB",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "├────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・🎤・CLUB",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "├────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・🎤・CLUB",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "├────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・🎤・CLUB",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "├────────────➤",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "├・🎤・CLUB",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "╰────────────➤",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "❍──────LOGS───➤",
            "channels": [
                {
                    "name": "╭・🚨・mod-mail",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・🚨・application-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╰・🚨・vortex-logs",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "❍──────ADMIN-PANEL───➤",
            "channels": [
                {
                    "name": "╰・👿・STAFF VC",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╭・👿・dashboard",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "├・👿・server-cmd",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-chill-s-spooky-template': {
    "id": "xenon-chill-s-spooky-template",
    "xenonCode": "H5qAZdEEeWdR",
    "category": "🎮 Gaming",
    "name": "🏫 Chill's Spooky Template",
    "description": "A simple discord all in one template  Neat,Simple & Clean My Server: https://discord.gg/XJhf754K29 ~Chill",
    "roles": [
        {
            "name": "giveaway winner",
            "color": "#c8fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "noob inviter",
            "color": "#00ff93",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "godly inviter",
            "color": "#d2ff00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "crazy inviter",
            "color": "#ff0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "SUPPORTER",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬👻MISC▬▬",
            "color": "#05af55",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "FOTD pings",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "event ping",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Giveaway Ping",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "announcement ping",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "chat revival",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬😁PINGS▬▬",
            "color": "#c00202",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "BOTS",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬🤖BOTS▬▬",
            "color": "#a02efe",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Members",
            "color": "#fd7400",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Youtuber",
            "color": "#f8ff00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Partner",
            "color": "#00ffd6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬🔮GENERAL▬▬",
            "color": "#8d6cff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⭐ Active",
            "color": "#14ff00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌟 Super Active",
            "color": "#10ff00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💫 Extremely Active",
            "color": "#a9ffca",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌠 Insanely Active",
            "color": "#f4ff89",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬⚡LEVEL ROLE'S▬▬",
            "color": "#ff4e00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Muted",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Helper",
            "color": "#49ca75",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Trainee Mod",
            "color": "#fff69c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Moderator",
            "color": "#00d4ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Admin",
            "color": "#ff0000",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "▬▬🔨STAFFS▬▬",
            "color": "#ffc900",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Founder",
            "color": "#2ae469",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "▬▬👑OWNER▬▬",
            "color": "#ff9d55",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "▬▬WELCOME▬▬",
            "channels": [
                {
                    "name": "👋│welcome",
                    "type": ChannelType.GuildText,
                    "topic": "**Welcome to Chill's World! Make sure to read out the <#749646288391372841>! **"
                },
                {
                    "name": "👋│introduction",
                    "type": ChannelType.GuildText,
                    "topic": "**who are you? We dont know let us know you here by introducing yourself**"
                }
            ]
        },
        {
            "name": "▬▬IMPORTANT▬▬",
            "channels": [
                {
                    "name": "📃│rules",
                    "type": ChannelType.GuildText,
                    "topic": "**<a:rules_book:748524069594595339> A channel that lists all the rules. Please follow all of these!<"
                },
                {
                    "name": "🌈│reaction-roles",
                    "type": ChannelType.GuildText,
                    "topic": "**React to the messages in this channel to be pinged for various things in the server! 🏓**"
                }
            ]
        },
        {
            "name": "▬▬UPDATES▬▬",
            "channels": [
                {
                    "name": "📣┃announcements",
                    "type": ChannelType.GuildText,
                    "topic": "<:important:748157026319990804> A channel for important notices. <:important:748157026319990804>"
                }
            ]
        },
        {
            "name": "▬▬GIVEAWAYS▬▬",
            "channels": [
                {
                    "name": "🎉│giveaways",
                    "type": ChannelType.GuildText,
                    "topic": "**<a:AIO_freakouteyes:749322455125983315>Epic Giveaways are done here <a:emoji_15:748320120207704140"
                },
                {
                    "name": "🎉│drops",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬TEMPLATE▬▬",
            "channels": [
                {
                    "name": "☕│general-chat",
                    "type": ChannelType.GuildText,
                    "topic": "Join my discord server for help or to have fun https://discord.gg/XJhf754K29"
                },
                {
                    "name": "🌍│global",
                    "type": ChannelType.GuildText,
                    "topic": "**[All Languages] This channel is for people to talk other languages! **"
                },
                {
                    "name": "📕│homework",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬MISC▬▬",
            "channels": [
                {
                    "name": "🎨│fan-art",
                    "type": ChannelType.GuildText,
                    "topic": "**Fan art of ChillPlayz can be posted here**"
                },
                {
                    "name": "📷│media",
                    "type": ChannelType.GuildText,
                    "topic": "**A channel where you can post images, and discuss things about images and videos where you normally"
                },
                {
                    "name": "🤣│memes",
                    "type": ChannelType.GuildText,
                    "topic": "** a channel in which memes can be posted!**"
                },
                {
                    "name": "😎│commands",
                    "type": ChannelType.GuildText,
                    "topic": "** A channel purely for bot commands**"
                }
            ]
        },
        {
            "name": "▬▬FUN▬▬",
            "channels": [
                {
                    "name": "【🐸】dank-memer",
                    "type": ChannelType.GuildText,
                    "topic": "**A channel purely made for dank memer comamnds in <#749631718537035876>**"
                },
                {
                    "name": "【🍕】truth-or-dare",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "【🔢】counting",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "【🔢】counting-2",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "【🎮】rpg",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬PARTNERS▬▬",
            "channels": [
                {
                    "name": "💫│partner-info",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤝│partners",
                    "type": ChannelType.GuildText,
                    "topic": "**Our partners ads are posted here you can be a partner by Messaging Chill or any Staff member**"
                },
                {
                    "name": "👑│our-ad",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬SELF PROMO▬▬",
            "channels": [
                {
                    "name": "💜│advertising",
                    "type": ChannelType.GuildText,
                    "topic": "**here everyone can promote their server,twitch,insta,snap,facebook,twitter,youtube 1ad every hour"
                },
                {
                    "name": "👑│booster-ads",
                    "type": ChannelType.GuildText,
                    "topic": "**This channel is for all type of advertisment of  :cyclone: server boosters**"
                }
            ]
        },
        {
            "name": "▬▬STAFFS AREA▬▬",
            "channels": [
                {
                    "name": "Staff Voice",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "staff-announcements",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "staff-chat",
                    "type": ChannelType.GuildText,
                    "topic": "**Here all staffs can talk this channel and it can only be seen by <@&749631610886029473> <@&7496316"
                },
                {
                    "name": "staff-commands",
                    "type": ChannelType.GuildText,
                    "topic": "**This channel is for setting up bots rather then in public**"
                }
            ]
        },
        {
            "name": "▬▬LOGS▬▬",
            "channels": [
                {
                    "name": "🚨│dyno-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🚨│mee6-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🚨│message-logs",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬MAIN VOICE▬▬",
            "channels": [
                {
                    "name": "AFK",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "general",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Minecraft",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Live Stream",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "▬▬MUSIC▬▬",
            "channels": [
                {
                    "name": "🎧 | Groovy [-]",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🎧 | Rythm [ry!]",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🎵│music-commands",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-community-server-advanced-serveur-fran-ais': {
    "id": "xenon-community-server-advanced-serveur-fran-ais",
    "xenonCode": "DrSmxY3ZhMQB",
    "category": "🎮 Gaming",
    "name": "🎮 Community Server Advanced (serveur français)",
    "description": "⚠🇫🇷 French server / serveur français 🇫🇷⚠ Meilleur serveur pour la communauté 😜 #read-the-desc Pls upvote <3",
    "roles": [
        {
            "name": "DJ",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "📱 Joueur mobile",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🎮 Joueur Ps4",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🎮 Joueur Xbox",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💻 Joueur PC",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💫 Joueur Slime Rancher",
            "color": "#3498db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💫 Joueur Overwatch",
            "color": "#3498db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔪 Joueur CS:GO",
            "color": "#3498db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🚗 Joueur Forza",
            "color": "#3498db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌍 Joueur Créatif",
            "color": "#3498db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔫 Joueur S.L.M",
            "color": "#3498db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💣 Joueur B.R",
            "color": "#3498db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🗺 Joueur Fortnite",
            "color": "#3498db",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💎 Bots VIP",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🤖 Bots",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔔 Informations Fortnite",
            "color": "#1ba8e0",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔔 Notifs Youtube/Twitch",
            "color": "#282828",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🚧 Prisonnier",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👀 Gardé à vue",
            "color": "#e0401c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⛔ Muted",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "😄 Membres",
            "color": "#1f8b4c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌌 Actifs",
            "color": "#1ac9e7",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🎥 Youtuber/streamer",
            "color": "#6441a4",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔎 Détective pro",
            "color": "#206694",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Les potes",
            "color": "#db9517",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🎀 Donateurs",
            "color": "#c543e6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🎈 Informateurs",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌺 Helpers",
            "color": "#da521a",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⛔ Modérateurs",
            "color": "#e91414",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "👑 Fondateur",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Admin",
            "color": "#c27c0e",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "🤖 Bot",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "Nouveaux !",
            "channels": [
                {
                    "name": "⚠-read-the-desc",
                    "type": ChannelType.GuildText,
                    "topic": "All rights reserved at <@511135190622535691> . His server: https://discord.gg/tbUQ6xZ   Enjoy the se"
                },
                {
                    "name": "😄-bienvenue",
                    "type": ChannelType.GuildText,
                    "topic": "Bienvenue à vous ! Lisez les règles"
                },
                {
                    "name": "📜-règles",
                    "type": ChannelType.GuildText,
                    "topic": "IMPORTANT: N'oubliez pas de cocher la réaction. A lire pour avoir une bonne entente avec tout le mon"
                },
                {
                    "name": "🔑-explication-des-rôles",
                    "type": ChannelType.GuildText,
                    "topic": "Les rôles que vous pouvez obtenir sont expliquer :)"
                },
                {
                    "name": "🔑-sélection-de-rôles",
                    "type": ChannelType.GuildText,
                    "topic": "Sélectionnez des rôles affecter à une action grâce à ca salon"
                }
            ]
        },
        {
            "name": "Informations",
            "channels": [
                {
                    "name": "📢-annonces",
                    "type": ChannelType.GuildText,
                    "topic": "Ici vous retrouverez toutes les annonces concernant le serveur et la communauté :)"
                },
                {
                    "name": "🎉-giveaway",
                    "type": ChannelType.GuildText,
                    "topic": "Je vous offre des choses :)"
                },
                {
                    "name": "🚀-liens-utiles",
                    "type": ChannelType.GuildText,
                    "topic": "Tous les liens utiles du Discord :)"
                },
                {
                    "name": "❓-sondages",
                    "type": ChannelType.GuildText,
                    "topic": "De temps en temps des petits sondages sur la vie du serveur font pas de mal :)"
                },
                {
                    "name": "🔔-nouvelles-vidéos-lives",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔍-mystère",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "Informations Fortnite",
            "channels": [
                {
                    "name": "✔-infos-fortnite",
                    "type": ChannelType.GuildText,
                    "topic": "Ici sont présentes toutes les information de Fortnite Battle-Royale et Créatif :)"
                },
                {
                    "name": "🛒-boutique-battle-royale",
                    "type": ChannelType.GuildText,
                    "topic": "Vous voulez connaître la boutique du jour mais vous avez la flemme ou pas la temps d'ouvrir votre je"
                },
                {
                    "name": "🥇-défis",
                    "type": ChannelType.GuildText,
                    "topic": "Vous voulez connaître les nouveaux défis ou vous avez besoin d'aide pour les réaliser?! C'est par ic"
                },
                {
                    "name": "🔑-patch-fortnite",
                    "type": ChannelType.GuildText,
                    "topic": "Une MAJ Fortnite arrive, vous recherchez le patch note?! Il est ici! Vous trouverez aussi son résumé"
                }
            ]
        },
        {
            "name": "Salons textuels",
            "channels": [
                {
                    "name": "💬-général",
                    "type": ChannelType.GuildText,
                    "topic": "Parlez ici de tout et n'importe quoi en respectant les #:scroll:-règles :)"
                },
                {
                    "name": "💬-général-vip",
                    "type": ChannelType.GuildText,
                    "topic": "Amusez-vous entre donateurs avec quelques bots fun et parlez 'secrètement' aussi! Liste des commande"
                },
                {
                    "name": "🎮-recherche-de-joueurs",
                    "type": ChannelType.GuildText,
                    "topic": "Vous cherchez quelqu'un pour jouer avec vous, c'est ici :)"
                },
                {
                    "name": "🔍-général-mystère",
                    "type": ChannelType.GuildText,
                    "topic": "Parlez de ce mystère installer sur le serveur!"
                },
                {
                    "name": "❓-vos-sondages",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔥-les-potes",
                    "type": ChannelType.GuildText,
                    "topic": "Toutes les personnes que je connais IRL et qui ont le rôle Les potes peuvent parler \"secrètement\" ic"
                }
            ]
        },
        {
            "name": "Partage",
            "channels": [
                {
                    "name": "📷-images",
                    "type": ChannelType.GuildText,
                    "topic": "Postez toutes vos image: photos, screenshots, memes etc.. :)"
                },
                {
                    "name": "⌨-tech",
                    "type": ChannelType.GuildText,
                    "topic": "Si vous voulez parler de tech, vous allez trouver votre bonheur par ici ! :)"
                },
                {
                    "name": "🎨-graphisme",
                    "type": ChannelType.GuildText,
                    "topic": "Montrez vos créations et donnez des avis constructifs pour pouvoir s’améliorer !"
                }
            ]
        },
        {
            "name": "BOT",
            "channels": [
                {
                    "name": "🖥-bots",
                    "type": ChannelType.GuildText,
                    "topic": "Connaissez toutes les commandes des bots grâce à ce salon :)"
                },
                {
                    "name": "🤖-commandes-bot",
                    "type": ChannelType.GuildText,
                    "topic": "Vous voulez savoir votre rang, faire une commande d'un bot, c'est ici :) Merci de ne pas taper la di"
                }
            ]
        },
        {
            "name": "Vos réseaux",
            "channels": [
                {
                    "name": "🗯-pub",
                    "type": ChannelType.GuildText,
                    "topic": "Balancez vos pubs: vidéos, lives etc et même vos serveurs Discord :)"
                },
                {
                    "name": "🎲-recrutements",
                    "type": ChannelType.GuildText,
                    "topic": "Présentez votre Team et le type de joueurs qu'elle recherche. __Formulaire à respecter pour publier "
                }
            ]
        },
        {
            "name": "🚫 Staff",
            "channels": [
                {
                    "name": "❗-informations-staff",
                    "type": ChannelType.GuildText,
                    "topic": "Toutes les infos concernant le staff seront posté ici :)"
                },
                {
                    "name": "⛔-général-staff",
                    "type": ChannelType.GuildText,
                    "topic": "Seul les membres du staff peuvent parler et débattre sur les autres membres ici à l'abri des regards"
                },
                {
                    "name": "👑-admin",
                    "type": ChannelType.GuildText,
                    "topic": "Entre admins et fondateur"
                },
                {
                    "name": "🔍-préparation-énigme",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⭕-infractions",
                    "type": ChannelType.GuildText,
                    "topic": "Les personnes ayant reçu un warn sera affiché ici :)"
                },
                {
                    "name": "🤖-test-bot",
                    "type": ChannelType.GuildText,
                    "topic": "Vous pouvez tester et configurer les bots ici :)"
                },
                {
                    "name": "📻-radio-links",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🙁-bye-bye",
                    "type": ChannelType.GuildText,
                    "topic": "Dites au revoir 😭"
                }
            ]
        },
        {
            "name": "🔒 Salons vocaux privés",
            "channels": [
                {
                    "name": "🎥 Streaming",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "👊 Team Zojo",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🚫 Staff",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔥 Les potes",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔴 Recording",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "🔊 Salons vocaux",
            "channels": [
                {
                    "name": "⚡ Général",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔇-sans-micro",
                    "type": ChannelType.GuildText,
                    "topic": "Vous ne pouvez pas parlez, pas de problèmes: utilisez ce salon!"
                }
            ]
        },
        {
            "name": "🎵 musique",
            "channels": [
                {
                    "name": "🎶 Musique",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "📻 Radio 24/7 🔊",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🎧-commandes-musique",
                    "type": ChannelType.GuildText,
                    "topic": "Salon à utiliser pour faire les commandes du bot **Rythm**. Merci de lire les messages épinglés :) E"
                }
            ]
        },
        {
            "name": "🗣 Salons vocaux de jeux",
            "channels": [
                {
                    "name": "📺 Stream de jeu",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "👥 Duo #1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "👥 Duo #2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "👥👥 Squad #1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "👥👥 Squad #2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "🌍 Créatif #1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 16
                },
                {
                    "name": "🗺 Terrain de jeu #1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 16
                },
                {
                    "name": "☠ STW",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "🎮 Multigaming #1",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "🆘 assitance",
            "channels": [
                {
                    "name": "⁉-bug",
                    "type": ChannelType.GuildText,
                    "topic": "Un bug sur le serveur, merci de nous le signaler dans ce salon :)"
                },
                {
                    "name": "❔-questions",
                    "type": ChannelType.GuildText,
                    "topic": "Une question à propos du serveur, c'est ici. Un membre du staff vous répondra."
                },
                {
                    "name": "💡-suggestion-discord",
                    "type": ChannelType.GuildText,
                    "topic": "Une idée qui peut être utile pour le serveur, c'est ici :) Merci pour vos suggestions"
                }
            ]
        },
        {
            "name": "🚨 Police",
            "channels": [
                {
                    "name": "🔨 Jugement",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🏛-prison",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏢-commisariat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🚫-mute",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "AFK",
            "channels": [
                {
                    "name": "💤 AFK 💤",
                    "type": ChannelType.GuildVoice
                }
            ]
        }
    ]
},

  'xenon-youtube-server': {
    "id": "xenon-youtube-server",
    "xenonCode": "yC7c8k8BSPzm",
    "category": "🎮 Gaming",
    "name": "🎮 YouTube server",
    "description": "It makes you amazing channel and roles.all can be use but u have to add bots and reaction roles ur own",
    "roles": [
        {
            "name": "new role",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "new role",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "new role",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "COMPUTER",
            "color": "#5b2076",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MOBILE",
            "color": "#970045",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "KID",
            "color": "#6694da",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "FEMALE",
            "color": "#ff00bb",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MALE",
            "color": "#f8f8f9",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Rose Wine",
            "color": "#b8306e",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Yellow Corona",
            "color": "#e8ff0b",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Belgian White",
            "color": "#f8f8f9",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Amber Wine",
            "color": "#ff8d00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Peach puff",
            "color": "#ebb487",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LEVEL 5",
            "color": "#195080",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LEVEL 10",
            "color": "#d6680e",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LEVEL 15",
            "color": "#1a7939",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "LEVEL 30",
            "color": "#970045",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Muted",
            "color": "#808080",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "₪》│Bots",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "₪》│Member",
            "color": "#00aeff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "₪》│Friend",
            "color": "#00ff09",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "₪》│𝚅𝙸𝙿",
            "color": "#ecfb45",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "₪》│Helper",
            "color": "#00ff98",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Aqua",
            "color": "#00f6ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "₪》│Mod",
            "color": "#1b00ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "₪》│Admin",
            "color": "#ff0000",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "green",
            "color": "#48ffa4",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "₪》│Owner",
            "color": "#00ffe7",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "—͟͞͞⌬』│𝚕𝚘𝚐𝚜",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "|| S T A T S ||",
            "channels": [
                {
                    "name": "۝ 𝙰𝚕𝚕 𝚖𝚎𝚖𝚋𝚎𝚛𝚜 : 21",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "۝ 𝙼𝚎𝚖𝚋𝚎𝚛𝚜 : 3",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "۝ 𝙱𝚘𝚝𝚜 : 18",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "||  G A T E   W A Y ||",
            "channels": [
                {
                    "name": "—͟͞͞⌬』│𝚆𝚎𝚕𝚌𝚘𝚖𝚎",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "—͟͞͞⌬』│𝙸𝚗𝚟𝚒𝚝𝚜",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "—͟͞͞⌬』│𝚝𝚊𝚝𝚊⛄",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "|| I M P O R T A N T ||",
            "channels": [
                {
                    "name": "🎄〣𝚁𝚞𝚕𝚎§",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎄〣𝙰𝚗𝚗𝚘𝚞𝚗𝚌𝚖𝚎𝚗𝚝",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎄〣𝙶𝚒𝚟𝚎𝚊𝚠𝚊𝚢-𝚒𝚗𝚏𝚘",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎄〣𝙶𝚒𝚟𝚎𝚊𝚠𝚊𝚢",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎄〣𝚙𝚛𝚘𝚘𝚏",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "|| R O L E S ||",
            "channels": [
                {
                    "name": "𒀽〢𝚁𝚘𝚕𝚎𝚜-𝚒𝚗𝚏𝚘",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒀽〢𝚜𝚎𝚕𝚏-𝚛𝚘𝚕𝚎𝚜",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒀽〢ᴄᴏʟᴏᴜʀs",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "|| G E N E R A L ||",
            "channels": [
                {
                    "name": "☃『𝙲𝚑𝚊𝚝』",
                    "type": ChannelType.GuildText,
                    "topic": "《 See rules  》or 《¿warn》"
                },
                {
                    "name": "☃『𝙼𝚎𝚍𝚒𝚊』",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "☃『𝙼𝚎𝚖𝚎𝚜』",
                    "type": ChannelType.GuildText,
                    "topic": "《Have fun》"
                }
            ]
        },
        {
            "name": "|| V O I C E ||",
            "channels": [
                {
                    "name": "⛄《𝙶𝚎𝚗𝚎𝚛𝚊𝚕 𝚅𝚌》",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                }
            ]
        },
        {
            "name": "|| E X T R A A S ||",
            "channels": [
                {
                    "name": "〄│𝚂𝚎𝚕𝚏-𝚙𝚛𝚘𝚖𝚘𝚝𝚒𝚘𝚗",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〄│𝚂𝚞𝚐𝚐𝚎𝚜𝚝𝚒𝚘𝚗𝚜",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "|| L E V E L || R A N K ||",
            "channels": [
                {
                    "name": "✮》𝙻𝚎𝚟𝚎𝚕-𝚄𝚙",
                    "type": ChannelType.GuildText,
                    "topic": "《Spam = ban》"
                },
                {
                    "name": "✮》𝚁𝚊𝚗𝚔-𝙲𝚑𝚎𝚌𝚔",
                    "type": ChannelType.GuildText,
                    "topic": "《!rank》"
                },
                {
                    "name": "✮》𝙸𝚗𝚟𝚒𝚝𝚎𝚜",
                    "type": ChannelType.GuildText,
                    "topic": "《.invites》"
                }
            ]
        },
        {
            "name": "|| V E R I F I C A T I O N ||",
            "channels": [
                {
                    "name": "乄│𝚅𝚎𝚛𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 𝚅𝙲",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "乄│𝚅𝚎𝚛𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "|| M U S I C ||",
            "channels": [
                {
                    "name": "❄】𝙶𝚛𝚘𝚟𝚟𝚢【",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "❄】𝚁𝚢𝚝𝚑𝚖【",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "❄】𝚁𝚢𝚝𝚑𝚖【",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "❄】𝙶𝚛𝚘𝚟𝚟𝚢【",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "|| T I M E  P A S S ||",
            "channels": [
                {
                    "name": "▍𝙾𝚠𝙾",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "▍𝙲𝚛𝚊𝚏𝚝𝚢",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "▍𝙼𝚎𝚘𝚠",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "▍𝚃𝚛𝚒𝚟𝚒𝚊",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "▍𝙼𝚒𝚗𝚎𝙲𝚛𝚊𝚏𝚝",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "▍𝙰𝙺𝙸",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-discord-template-sujit': {
    "id": "xenon-discord-template-sujit",
    "xenonCode": "mzuRHDrKwSDW",
    "category": "🎮 Gaming",
    "name": "🎲 DISCORD TEMPLATE SUJIT",
    "description": "Explore gaming community  Free fire. Pubgm and Minecraft",
    "roles": [
        {
            "name": "Gold Role",
            "color": "#ffd700",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⚡only selected ⚡",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "piggyusers",
            "color": "#9b59b6",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Muted",
            "color": "#808080",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🛡️",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "This person is a server support",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯|🍀|ROZAX GAMER YT|🍀|⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|🔵|BOTS|🔵|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🛡️│Bots",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|🌍|MEMBERS|🌍|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔑│Member",
            "color": "#546e7a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|🔸|ELITE|🔸|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|♦️|MAXXED|♦️|⎯⎯⎯┑",
            "color": "#5b2076",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "❤️️│Girl",
            "color": "#f700ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌀│Friend",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯⎯|🔹|STAFF TEAM|🔹|⎯⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "💠│Helper",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔨│Mod",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "𝚅𝙸𝙿",
            "color": "#d7342a",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "𝚂-𝚅𝙸𝙿",
            "color": "#d7342a",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "𝚄-𝚅𝙸𝙿",
            "color": "#d7342a",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "┗⎯⎯|🔷|ADMINISTRATION|🔷|⎯⎯┑",
            "color": "#2f3136",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "🔒│Admin",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "MODERATOR",
            "color": "#277ecd",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "🌀│CoOwner",
            "color": "#da004e",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "👑│Owner",
            "color": "#ff0000",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "rules",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "moderator-only",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "Online Members: 11",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Total Members: 26",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "『 G A T E - W A Y 』",
            "channels": [
                {
                    "name": "—͟͞͞⌬』│ᴡᴇʟᴄᴏᴍᴇ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "—͟͞͞⌬』│ᴊᴏɪɴ-and-leave-ʟᴏɢs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "—͟͞͞⌬』│ɢᴏᴏᴅʙʏᴇ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "—͟͞͞⌬』│-ʜᴀᴘᴘʏ-ʙɪʀᴛʜᴅᴀʏ",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📃 | I M P O R T A N T",
            "channels": [
                {
                    "name": "〣☣〣ʀᴜʟᴇs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〣☣〣ᴀɴɴᴏᴜɴᴄᴍᴇɴᴛ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〣☣〣ɪɴᴠɪᴛᴇ-ʀᴇᴡᴀʀᴅs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〣☣〣ɢɪᴠᴇᴀᴡᴀʏ-ᴀɴɴᴏᴜɴᴄᴍᴇɴᴛ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〣☣〣ɢɪᴠᴇᴀᴡᴀʏ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〣☣〣ɢɪᴠᴇᴀᴡᴀʏ-ᴘʀᴏᴏғ",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🏷 | R O L E Z",
            "channels": [
                {
                    "name": "𒀽〢ʀᴏʟᴇs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒀽〢ʀᴏʟᴇs-ɪɴғᴏ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒀽〢sᴇʟғ-ʀᴏʟᴇs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒀽〢ᴄᴏʟᴏᴜʀs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒀽〢ᴍᴏᴅs-ᴀᴅᴍɪɴs",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💬 | G E N E R A L",
            "channels": [
                {
                    "name": "💬│𝙼𝙰𝙸𝙽-𝙲𝙷𝙰𝚃",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📷│𝙿𝙸𝙲𝚃𝚄𝚁𝙴-𝙼𝙴𝙳𝙸𝙰",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "☣│𝚃𝙾𝚇𝙸𝙲-𝙲𝙷𝙰𝚃",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔖│𝙼𝙴𝙼𝙴𝚂-𝚆𝙾𝚁𝙻𝙳",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔑¶-id-pass",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📣 | V O I C E",
            "channels": [
                {
                    "name": "𒆜ɢᴇɴᴇʀᴀʟ-ᴠᴄ𒆜",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "𒆜 𝙻𝙾𝙱𝙱𝚈 𒆜 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 20
                },
                {
                    "name": "𒆜 𝙻𝙾𝙱𝙱𝚈 𒆜 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 20
                },
                {
                    "name": "𒆜 𝙳𝚄𝙾 𒆜 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "𒆜 𝙳𝚄𝙾 𒆜 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "𒆜 𝚃𝚁𝙸𝙾 𒆜 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "𒆜 𝚃𝚁𝙸𝙾 𒆜 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "𒆜 𝚂𝚀𝚄𝙰𝙳 𒆜 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "𒆜 𝚂𝚀𝚄𝙰𝙳 𒆜 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "𒆜FREE FIRE𒆜",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 27
                },
                {
                    "name": "𒆜MINECRAFT𒆜",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 53
                },
                {
                    "name": "𒆜AMONG US𒆜",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 40
                },
                {
                    "name": "𒆜FREE FIRE PRIVATE𒆜",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 16
                },
                {
                    "name": "𒆜AMONG US PRIVATE𒆜",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 19
                },
                {
                    "name": "𒆜MINECRAFT PRIVATE𒆜",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 35
                }
            ]
        },
        {
            "name": "📖 | E X T R A A S",
            "channels": [
                {
                    "name": "〄│sᴇʟғ-ᴘʀᴏᴍᴏᴛɪᴏɴ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〄│ᴅᴘ-ʙᴀᴛᴛʟᴇ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "〄│ᴅᴘ-ʙᴀᴛᴛʟᴇ-ʀᴇɢɪsᴛʀᴀᴛɪᴏɴ",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📊 | R A N K S",
            "channels": [
                {
                    "name": "✮》ʟᴇᴠᴇʟ-ᴜᴘ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "✮》ʟᴇᴠᴇʟ-ᴄʜᴇᴄᴋ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "✮》ɪɴᴠɪᴛᴇ-ᴄʜᴇᴄᴋ",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔎| V E R I F I C A T I O N   C O R N E R",
            "channels": [
                {
                    "name": "乄│ᴠᴇʀɪғɪᴄᴀᴛɪᴏɴ-ᴠᴄ",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "乄│ᴠᴇʀɪғɪᴄᴀᴛɪᴏɴ",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "乄│ᴠᴇʀɪғɪᴇᴅ",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔴 | Q U E R I E S",
            "channels": [
                {
                    "name": "𒌇〢-help-and-support",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒌇〢complaints",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𒌇〢💡〢𝚂𝚄𝙶𝙶𝙴𝚂𝚃𝙸𝙾𝙽𝚂",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "== PIGGY PLAYGROUND ==",
            "channels": [
                {
                    "name": "piggy-play",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "piggy-battleground",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🎶= CHILL ZONE",
            "channels": [
                {
                    "name": "🎶 music",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "music-command",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔐 private",
            "channels": [
                {
                    "name": "🔐 voice",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔐chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⚡only selected⚡",
            "channels": [
                {
                    "name": "⚡voice⚡",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "⚡chats⚡",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-eternal-artz-sunucusu-zel-public': {
    "id": "xenon-eternal-artz-sunucusu-zel-public",
    "xenonCode": "j5gCp7KbUcNS",
    "category": "🎮 Gaming",
    "name": "🏫 Eternal Artz Sunucusu (Özel - Public)",
    "description": "Sunucumuz özenle hazırlanmıştır.",
    "roles": [
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴀɴᴋᴀʀᴀɢᴜᴄᴜ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ɢᴏᴢᴛᴇᴘᴇ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏sɪᴠᴀssᴘᴏʀ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴀɴᴛᴀʟʏᴀsᴘᴏʀ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʙᴜʀsᴀsᴘᴏʀ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴛʀᴀʙᴢᴏɴsᴘᴏʀ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʙᴇsɪᴋᴛᴀs",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ɢᴀʟᴀᴛᴀsᴀʀᴀʏ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ғᴇɴᴇʀʙᴀʜᴄᴇ",
            "color": "#b14b4c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴍɪɴᴇᴄʀᴀғᴛ",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴘᴜʙɢ ᴍᴏʙɪʟᴇ",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴘᴜʙɢ",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴍᴏʙɪʟᴇ ʟᴇɢᴇɴᴅs",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʟᴇᴀɢᴜᴇ ᴏғ ʟᴇɢᴇɴᴅs",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴄs.ɢᴏ",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ɢᴛᴀ ᴠ",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴀᴘᴇx ʟᴇɢᴇɴᴅs",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴠᴏʟᴏʀᴀɴᴛ",
            "color": "#e3fa00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʙᴀʟɪᴋ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴋᴏᴠᴀ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴏɢʟᴀᴋ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʏᴀʏ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴀᴋʀᴇᴘ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴛᴇʀᴀᴢɪ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʙᴀsᴀᴋ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴀsʟᴀɴ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ ʏᴇɴɢᴇᴄ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ɪᴋɪᴢʟᴇʀ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʙᴏɢᴀ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴋᴏᴄ ʙᴜʀᴄᴜ",
            "color": "#206694",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏sᴇᴠɢɪʟɪᴍ ʏᴏᴋ",
            "color": "#f51111",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏sᴇᴠɢɪʟɪᴍ ᴠᴀʀ",
            "color": "#f50a0a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴍᴜᴛᴇᴅ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#818386",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʙᴏᴛs ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#277ecd",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴜɴʀᴇɢɪsᴛᴇʀᴇᴅ",
            "color": "#a5f596",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴜsᴇʀ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#1a7939",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴅᴇsɪɴɢɴᴇʀ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#acacec",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴘᴀʀᴛɴᴇʀ",
            "color": "#d6680e",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʏᴏᴜᴛᴜʙᴇʀ",
            "color": "#a52dff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏sᴘᴏɴsᴏʀ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#9c3f3f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏sᴜᴘᴘᴏʀᴛᴇʀ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#c573b1",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴠ.ɪ.ᴘ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#fdff00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴠᴀᴍᴘɪʀᴇ ᴛᴇᴀᴍ",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ɪɴᴠɪᴛᴇʀ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#deb1b1",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴅᴇɴᴇᴍᴇ ʏᴇᴛᴋɪʟɪ",
            "color": "#5260da",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴄʜᴀᴛ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#df8e58",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʙᴀɴ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#df8e58",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ʀᴇʙᴇʟs ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#2c0e3a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴍᴏᴅ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#ff0000",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴀᴅᴍɪɴ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👑 | ʀᴇsᴇʀᴠᴇ ᴀᴄᴄᴏᴜɴᴛs",
            "color": "#036c72",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Susturulmuş",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "▬▬▬▬▬▬▬▬",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "乡╏ᴏwɴᴇʀ ᴏғ ᴠᴀᴍᴘɪʀᴇ",
            "color": "#72a0c0",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "önemli-yazılar-vs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "moderator-only",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ᴋᴀʏɪᴛ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "🔐・kayıt",
                    "type": ChannelType.GuildText,
                    "topic": "Kayıt olmak için :white_check_mark: tıklayınız"
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ɢᴇɴᴇʟ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "💭・sohbet",
                    "type": ChannelType.GuildText,
                    "topic": "+18 söylem ve reklam yasak!"
                },
                {
                    "name": "🤖・komut",
                    "type": ChannelType.GuildText,
                    "topic": "Müzik komutu hariç bütün botların komutlarını kullanabilirsiniz."
                },
                {
                    "name": "📷・foto-sohbet",
                    "type": ChannelType.GuildText,
                    "topic": "Buraya +18 içerik atmak yasak! Yalnızca attığınız fotoğraflar hakkında konuşulacaktır."
                },
                {
                    "name": "📹・video-sohbet",
                    "type": ChannelType.GuildText,
                    "topic": "Buraya +18 içerik atmak yasak! Yalnızca attığınız videolar hakkında konuşulacaktır."
                },
                {
                    "name": "🔒・log",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ᴏɴᴇᴍʟɪ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "📃・kurallar",
                    "type": ChannelType.GuildText,
                    "topic": "Sunucu Kuralları"
                },
                {
                    "name": "📋・anket",
                    "type": ChannelType.GuildText,
                    "topic": "Burada yalnızca anketler olacaktır."
                },
                {
                    "name": "📮・öneri-şikayet",
                    "type": ChannelType.GuildText,
                    "topic": "Buraya sunucu hakkında öneri ve şikayetlerinizi bildirebilirsiniz."
                },
                {
                    "name": "⏫・seviye-atlama",
                    "type": ChannelType.GuildText,
                    "topic": "Her level atladığında otomatikmen burada etiketlenirsin."
                },
                {
                    "name": "💼・yetkili-alım",
                    "type": ChannelType.GuildText,
                    "topic": "Yetkilileri formlar ile seçtiğimiz oda. Yetkili olmak için formları doldurmalısınız."
                }
            ]
        },
        {
            "name": "▬▬▬▬ ● ᴄᴇᴋɪʟɪs ● ▬▬▬▬",
            "channels": [
                {
                    "name": "🎉・çekiliş",
                    "type": ChannelType.GuildText,
                    "topic": "Burada çekilişlerimiz olacaktır."
                },
                {
                    "name": "🎁・drop",
                    "type": ChannelType.GuildText,
                    "topic": "Burada çeşitli droplar olacaktır, hızlı olan kazanır."
                },
                {
                    "name": "🎈・çekiliş-başlatma",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ʙᴏᴏsᴛ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "📗・boost-bilgi",
                    "type": ChannelType.GuildText,
                    "topic": "Boost basanlar için özel sürprizleri öğrenmek için okuyunuz."
                },
                {
                    "name": "🚀・boost",
                    "type": ChannelType.GuildText,
                    "topic": "Boost basanların ismi ve kaç tane bastıkları burada gözükecektir."
                }
            ]
        },
        {
            "name": "▬▬▬▬ ● ɪɴᴠɪᴛᴇ ● ▬▬▬▬",
            "channels": [
                {
                    "name": "📥・gelenler",
                    "type": ChannelType.GuildText,
                    "topic": "Gelenler yalnızca bu odada gözükecektir."
                },
                {
                    "name": "📤・gidenler",
                    "type": ChannelType.GuildText,
                    "topic": "Gidenler yalnızca bu odada gözükecektir."
                },
                {
                    "name": "📈・sayaç",
                    "type": ChannelType.GuildText,
                    "topic": "Buradan sunucumuzun kaç kişi olduğunu adım adım takip edebilirsiniz."
                },
                {
                    "name": "👥・otorol",
                    "type": ChannelType.GuildText,
                    "topic": "Burada sunucumuza gelen kişiye MC-AT otomatik Üye rolü verir."
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ᴅᴇsᴛᴇᴋ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "🎫・destek",
                    "type": ChannelType.GuildText,
                    "topic": "Gerekenleri yaptıktan sonra ödül almak için :tickets: basarak destek odası açmalısınız."
                }
            ]
        },
        {
            "name": "▬▬▬▬ ● ᴏᴅᴜʟʟᴇʀ ● ▬▬▬▬",
            "channels": [
                {
                    "name": "🎨・tasarım-örnekleri",
                    "type": ChannelType.GuildText,
                    "topic": "Örnek tasarımlarımız burada gözükecektir."
                },
                {
                    "name": "🎨・tasarım-ödüller",
                    "type": ChannelType.GuildText,
                    "topic": "Sunucumuzda bulunan hediyeler ve satılan şeyler burada olacaktır."
                },
                {
                    "name": "💰・diğer-ödüller",
                    "type": ChannelType.GuildText,
                    "topic": "Sunucumuzda bulunan hediyeler ve satılan şeyler burada olacaktır."
                },
                {
                    "name": "💰・invite-ödülleri",
                    "type": ChannelType.GuildText,
                    "topic": "Sunucumuzda bulunan hediyeleri ve davet karşılığı verilen şeyler burada olacaktır."
                },
                {
                    "name": "✅・kanıt",
                    "type": ChannelType.GuildText,
                    "topic": "Sunucumuzun güvenilir olduğuna dair ss olarak kanıtları burada olacaktır."
                }
            ]
        },
        {
            "name": "▬▬▬▬ ● ᴘᴀʀᴛɴᴇʀ ● ▬▬▬▬",
            "channels": [
                {
                    "name": "📄・partner-şartlar",
                    "type": ChannelType.GuildText,
                    "topic": "Partner olmak için şartlar buradadır."
                },
                {
                    "name": "💎・partner-text",
                    "type": ChannelType.GuildText,
                    "topic": "Sunucumuzun Partner Text kısmı , burada sunucumuzun textini alabilirsiniz."
                },
                {
                    "name": "🤝・partner",
                    "type": ChannelType.GuildText,
                    "topic": "Sunucumuzda bizimle partner olan diğer sunucular."
                }
            ]
        },
        {
            "name": "▬▬▬▬ ● ʀᴏʟ ᴀʟᴍᴀ ● ▬▬▬▬",
            "channels": [
                {
                    "name": "❤・sevgili-rolleri",
                    "type": ChannelType.GuildText,
                    "topic": "Emojiye tıklayarak rollerden birini alabilirsiniz."
                },
                {
                    "name": "♈・burç-rolleri",
                    "type": ChannelType.GuildText,
                    "topic": "Emojiye tıklayarak rollerden birini alabilirsiniz."
                },
                {
                    "name": "🎮・oyun-roleri",
                    "type": ChannelType.GuildText,
                    "topic": "Emojiye tıklayarak rollerden birini alabilirsiniz."
                },
                {
                    "name": "🏆・takım-rolleri",
                    "type": ChannelType.GuildText,
                    "topic": "Emojiye tıklayarak rollerden birini alabilirsiniz."
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● sɪᴢɪɴ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "🌹・geceye-söz-bırak",
                    "type": ChannelType.GuildText,
                    "topic": "Geceye güzel bir söz bırakabilirsiniz."
                },
                {
                    "name": "🤯・anı-anlatma",
                    "type": ChannelType.GuildText,
                    "topic": "İstediğiniz bir anıyı anlatabilirsiniz."
                },
                {
                    "name": "😳・sizin-itiraflarınız",
                    "type": ChannelType.GuildText,
                    "topic": "İstediğiniz şeyi itiraf edebilirsiniz ( Gizli Kalacak ! ) . . ."
                },
                {
                    "name": "📝・hobileriniz",
                    "type": ChannelType.GuildText,
                    "topic": "Hobilerinizi bizimle paylaşabilirsiniz."
                },
                {
                    "name": "🎂・doğum-günleriniz",
                    "type": ChannelType.GuildText,
                    "topic": "Doğum günlerinizi yazabilirsiniz."
                },
                {
                    "name": "💻・sizin-videolar",
                    "type": ChannelType.GuildText,
                    "topic": "Youtube için çektiğiniz videoların linklerini atabilirsiniz."
                },
                {
                    "name": "👍・ınstagram",
                    "type": ChannelType.GuildText,
                    "topic": "Instangram isminizi yazabilirsiniz, Takipçi artsın ;)"
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ᴏɴᴇʀɪ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "🎬・film-dizi-öneri",
                    "type": ChannelType.GuildText,
                    "topic": "Önerdiğiniz film veya dizileri yazabilirsiniz."
                },
                {
                    "name": "🎧・şarkı-öneri",
                    "type": ChannelType.GuildText,
                    "topic": "Önerdiğiniz şarkıları yazabilirsiniz."
                },
                {
                    "name": "📚・kitap-öneri",
                    "type": ChannelType.GuildText,
                    "topic": "Önerdiğiniz kitapları yazabilirsiniz."
                },
                {
                    "name": "🎮・oyun-öneri",
                    "type": ChannelType.GuildText,
                    "topic": "Önerdiğiniz oyunları yazabilirsiniz."
                },
                {
                    "name": "📁pp-öneri",
                    "type": ChannelType.GuildText,
                    "topic": "Önerdiğiniz pp (profil resmi)'ni atabilirsiniz."
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ᴇɢʟᴇɴᴄᴇ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "💬・kelime-türetme",
                    "type": ChannelType.GuildText,
                    "topic": "Kelime türetme oyununda eğlenebilirsiniz. örneğin ; armu - t t - elevizyon"
                },
                {
                    "name": "🔢・sayı-sayma",
                    "type": ChannelType.GuildText,
                    "topic": "Sayı sayma oyununda eğlenebilirsiniz."
                },
                {
                    "name": "🤷・tuttu-tutmadı",
                    "type": ChannelType.GuildText,
                    "topic": "Tuttu tutmadı oyunu oynayabilirsiniz."
                },
                {
                    "name": "💣・bom",
                    "type": ChannelType.GuildText,
                    "topic": "Bom oyunu oynayabilirsiniz."
                }
            ]
        },
        {
            "name": "▬▬▬▬ ● sᴇsʟɪ ● ▬▬▬▬",
            "channels": [
                {
                    "name": "🎤・mikrofonsuzlar",
                    "type": ChannelType.GuildText,
                    "topic": "Mikrofonu olmayanlar buradan sohbet edebilirler."
                },
                {
                    "name": "SOHBET",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 20
                },
                {
                    "name": "MÜZİK",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 20
                }
            ]
        },
        {
            "name": "▬▬▬▬ ● ᴅᴄ ᴏʏᴜɴ ● ▬▬▬▬",
            "channels": [
                {
                    "name": "doğruluk-cesaretlik",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "D.C ¹",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "D.C ²",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "▬▬▬▬▬ ● ᴠᴋ ᴏʏᴜɴ ● ▬▬▬▬▬",
            "channels": [
                {
                    "name": "vampi̇r-köylü",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "V.K ¹",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "V.K ²",
                    "type": ChannelType.GuildVoice
                }
            ]
        }
    ]
},

  'xenon-advanced-giveaways-server': {
    "id": "xenon-advanced-giveaways-server",
    "xenonCode": "EcR2tfPTc8x5",
    "category": "🎮 Gaming",
    "name": "🏫 Advanced Giveaways Server",
    "description": "A complete, modern, and feature-rich giveaways server. For help in setup join https://discord.gg/DhDxz9E",
    "roles": [
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Bot",
            "color": "#ffe6e6",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Member",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Partner",
            "color": "#9b59b6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Customer",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Reward Claimed",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Event Host",
            "color": "#5e93ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Giveaway Host",
            "color": "#43ffd2",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Support",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Moderator",
            "color": "#dff159",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "AD-Manager",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Administrator",
            "color": "#2ecc71",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Owner",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "DELETE THIS",
            "channels": [
                {
                    "name": "Read #server-rules topic",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Best Bot: dub.sh/nova-bot",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "「INformation」",
            "channels": [
                {
                    "name": "📜・server-rules",
                    "type": ChannelType.GuildText,
                    "topic": "<:spoke_info:761214506310565900> **Hey,** thanks for using my template! Please **read** below to get"
                },
                {
                    "name": "🔔・announcements",
                    "type": ChannelType.GuildText,
                    "topic": "Important server announcements."
                },
                {
                    "name": "❌・scammer-list",
                    "type": ChannelType.GuildText,
                    "topic": "Untrusted servers, fake & scam servers!"
                },
                {
                    "name": "🌸・boosters",
                    "type": ChannelType.GuildText,
                    "topic": "Boosters that support the server!"
                },
                {
                    "name": "🔮・invites",
                    "type": ChannelType.GuildText,
                    "topic": "Well, this one is obvious..."
                }
            ]
        },
        {
            "name": "「Events」",
            "channels": [
                {
                    "name": "🎪・events",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎀・vouches",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "「Advertisements」",
            "channels": [
                {
                    "name": "🛒・ad-prices",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎀・vouches",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "「Legitimacy」",
            "channels": [
                {
                    "name": "📷・proofs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎀・vouches",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "「Giveaways」",
            "channels": [
                {
                    "name": "🎁・giveaways¹",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎁・giveaways²",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎉・drop¹",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎉・drop²",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎊・no-req¹",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎊・no-req²",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "「Administration」",
            "channels": [
                {
                    "name": "📪・staff-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎓・staff-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔐・staff-commands",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📛・moderation-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔎・utility-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👥・invites-backup",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📧・community-news",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-public-sunucusu-odalar-n-simgesi-yenilendi': {
    "id": "xenon-public-sunucusu-odalar-n-simgesi-yenilendi",
    "xenonCode": "fcHCWdMPAtfV",
    "category": "🎮 Gaming",
    "name": "🏫 Public Sunucusu | Odaların Simgesi Yenilendi",
    "description": "Tüm kanallar ve roller ayarlıdır. Güle güle kullanın.",
    "roles": [
        {
            "name": "Susturulmuş",
            "color": "#6b6b6b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Muted",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MANİTA ARANIR <33",
            "color": "#ff0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♎| Terazi",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♓| Balık",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♒| Kova",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♉| Boğa",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♈| Koç",
            "color": "#331243",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♑| Oğlak",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♐| Yay",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♌| Aslan",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♋| Yengeç",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♊| İkizler",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♍| Başak",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "♏| Akrep",
            "color": "#39144a",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Trabzonspor ♥️",
            "color": "#52130f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Beşiktaş ♥️",
            "color": "#2a2a2b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Galatasaray ♥️",
            "color": "#da2b2b",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Fenerbahçe ♥️",
            "color": "#c89e00",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sevgili Yapmıyorum 😉",
            "color": "#103250",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sevgilim yok💔",
            "color": "#103250",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sevgilim var♥️",
            "color": "#103250",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Ralex Spammer",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Müzik Botu",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Moderatör Bot",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "⌭ | Kayıtsız Üye",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔑|Partner görme",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🎮|Oyuncu",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | cezalı",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Mutelendin",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Mutecı",
            "color": "#b9bbbe",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Bancı",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Erkek Üye",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Bayan üye",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ |  Smart Of Surface",
            "color": "#4c89af",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Special Member Of Surface",
            "color": "#17ac86",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Friend Of Surface",
            "color": "#6c1a15",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Vip Of Surface",
            "color": "#607d8b",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Familia Of Surface",
            "color": "#8b5b5b",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Kayıt Sorumlusu",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Moderator Of Surface",
            "color": "#25c059",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "⌭ | Admin Of Surface",
            "color": "#2d5753",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "♤",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Endless Of Surface",
            "color": "#992d22",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Hiper Of Surface",
            "color": "#e8c02a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Hero Of Surface",
            "color": "#1f8b4c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ |  Chatty Of Surface",
            "color": "#843da4",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Star Of Surface",
            "color": "#eb4d4d",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Crown Of The Head Of Surface",
            "color": "#5c79d1",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "⌭ | lucifer Of Surface",
            "color": "#b0ff8f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ |  Monster Of Surface",
            "color": "#9db14b",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "★",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Crazy Of Surface",
            "color": "#b17374",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Partner Of Surface",
            "color": "#0b2733",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Chat Sorumlusu Of Surface",
            "color": "#ebb487",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Partner Maneger Of Surface",
            "color": "#c4ff00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Sorun Çözücü Of Surface",
            "color": "#4b93d5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Ranger Of Surface",
            "color": "#4c4d2d",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Supreme Of Surface",
            "color": "#4b93d5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Discord Personeli Of Surface",
            "color": "#bb812a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | ZirveBot",
            "color": "#831f18",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "☾",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | King Of Surface",
            "color": "#e1ff00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Lord Of Surface",
            "color": "#330066",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Princess Of Surface",
            "color": "#ff0000",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Yardımcı Owner",
            "color": "#d6680e",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "⌭ | Surface Owner",
            "color": "#020202",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "♕",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⌭| Founder Of Surface",
            "color": "#020202",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "HEDİYEMİZ OLSUN SİZE",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "⌭-kayıt-⌭",
            "channels": [
                {
                    "name": "⌭・kayıt-odası",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・hoşgeldiniz",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭| kayıt sesli 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "⌭| kayıt sesli 2",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "⌭| kayıt sesli 3",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "⌭-information-⌭",
            "channels": [
                {
                    "name": "⌭・kurallar",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・duyurular",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・çıkış-yapanlar",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・boost-avantajları",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・server-boosting",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・tagımızı-alanlar",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・level-odası",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・invite-log",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・sponsor-destek",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⌭-artıcle-room-⌭",
            "channels": [
                {
                    "name": "⌭・chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・photo-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・bot-command",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・güne-bir-söz-bırak",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・instagram",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・gif-pp",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⌭-eğlence-odaları-⌭",
            "channels": [
                {
                    "name": "⌭・sayı-sayma",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・kelime-türetme",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・tuttu-tutmadı",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・doğruluk-cesaret",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・bom",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・forseti-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・owo-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・cortex-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⌭-rol seç-⌭",
            "channels": [
                {
                    "name": "⌭・iliski-rolleri",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・burç-rolleri",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・takım-rolleri",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・oyuncu-rolü",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "yetkili sohbet",
            "channels": [
                {
                    "name": "⌭・yetkili-duyuru",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・yetkili-sohbet",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・yetkili-foto-video",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⌭-denetim-odaları-⌭",
            "channels": [
                {
                    "name": "⌭・mod-log",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・botları-yönetme",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・ceza-yiyenler",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・guard-log",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⌭-owner-ses-⌭",
            "channels": [
                {
                    "name": "⌭|OWNER SES",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "⌭|YARDIMCI OWNER SES",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "⌭-public-room-⌭",
            "channels": [
                {
                    "name": "⌭| Strong of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 50
                },
                {
                    "name": "⌭| King of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 50
                },
                {
                    "name": "⌭| Cosmos of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 50
                },
                {
                    "name": "⌭| Smart of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 50
                },
                {
                    "name": "⌭| Talk of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 50
                },
                {
                    "name": "⌭| Solo of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 50
                },
                {
                    "name": "⌭| Music of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 50
                }
            ]
        },
        {
            "name": "⌭-private-room-⌭",
            "channels": [
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "⌭| Secret of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 6
                }
            ]
        },
        {
            "name": "⌭-afk-room-⌭",
            "channels": [
                {
                    "name": "⌭| Surface-of-[AFK]",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "⌭-game-room-⌭",
            "channels": [
                {
                    "name": "⌭・game-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭| Game of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "⌭| Game of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "⌭| Game of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "⌭| Game of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                },
                {
                    "name": "⌭| Game of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 5
                }
            ]
        },
        {
            "name": "⌭-alone-room-⌭",
            "channels": [
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                },
                {
                    "name": "⌭| Alone of Surface",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                }
            ]
        },
        {
            "name": "⌭-partner-⌭",
            "channels": [
                {
                    "name": "⌭・partner-görme",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・partner",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌭・partner-text",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-clerisy': {
    "id": "xenon-clerisy",
    "xenonCode": "P2UA7MXddPfs",
    "category": "🎮 Gaming",
    "name": "🧑‍🏫 Clerisy",
    "description": "Chill and AESTHETIC server template with a lot of colour roles for you and ya friends.",
    "roles": [
        {
            "name": "N S F W",
            "color": "#36393e",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Community",
            "color": "#43bfc7",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Friends",
            "color": "#ff3fff",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Discord Shadow",
            "color": "#36393e",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Crimson",
            "color": "#db2c5a",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Purple",
            "color": "#8e35ef",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Crocus Purple",
            "color": "#9172ec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Tyrian Purple",
            "color": "#c45aec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Mauve",
            "color": "#e0b0ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blush Pink",
            "color": "#e6a9ec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Aztech Purple",
            "color": "#893bff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Helitrope Purple",
            "color": "#d462ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Lovely Purple",
            "color": "#7f38ec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Purple Mimosa",
            "color": "#9e7bff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Purple Flower",
            "color": "#a74ac7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Violet",
            "color": "#8d38c9",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Magneta",
            "color": "#ff00ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Neon Pink",
            "color": "#f535aa",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Purple Ametyhst",
            "color": "#a74ac7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Plum",
            "color": "#ff00ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Deep Pink",
            "color": "#f52887",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Watermelon Pink",
            "color": "#fc6c85",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Pink",
            "color": "#faafba",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Hot Pink",
            "color": "#f660ab",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Carnation Pink",
            "color": "#f778a1",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cotton Candy",
            "color": "#fcdfff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Rose Gold",
            "color": "#ecc5c0",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Pig Pink",
            "color": "#fdd7e4",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cadillac Pink",
            "color": "#e38aae",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Rose",
            "color": "#e8adaa",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Love Red",
            "color": "#e41b17",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Red Wine",
            "color": "#990012",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Scarlet",
            "color": "#ff2400",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cherry Red",
            "color": "#c24641",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Valentine Red",
            "color": "#e55451",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Coral",
            "color": "#e77471",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Bean Red",
            "color": "#f75d59",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Red",
            "color": "#ff0004",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Coral",
            "color": "#ff7f50",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Mango Orange",
            "color": "#ff8040",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Salmon",
            "color": "#f9966b",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cantaloupe",
            "color": "#ffa62f",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Orange",
            "color": "#ffa500",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Saffron",
            "color": "#fbb917",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Gold",
            "color": "#ffd700",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Mustard",
            "color": "#ffdb58",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Bright Gold",
            "color": "#fdd017",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Champagne",
            "color": "#f7e7ce",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cream",
            "color": "#ffffcc",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Lemon Chiffon",
            "color": "#fff8c6",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Parchment",
            "color": "#ffffc2",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Electric Yellow",
            "color": "#ffff33",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Yellow",
            "color": "#f2ff00",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Yellow",
            "color": "#fafaaa",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Green Yellow",
            "color": "#b1fb17",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Harvest Gold",
            "color": "#ede275",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Mint Green",
            "color": "#98ff98",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Lawn Green",
            "color": "#87f717",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Chartreuse",
            "color": "#8afb17",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Dragon Green",
            "color": "#6afb92",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sun Yellow",
            "color": "#ffe87c",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Green",
            "color": "#00ff00",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Algae Green",
            "color": "#64e986",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Stoplight Go Green",
            "color": "#57e964",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Avocado Green",
            "color": "#b2c248",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Hummingbird Green",
            "color": "#7fe817",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Nebula Green",
            "color": "#59e817",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Literally Shrek",
            "color": "#88a517",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Hoja Green",
            "color": "#54c571",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Kelly Green",
            "color": "#4cc552",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Lime Green",
            "color": "#41a317",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Alien Green",
            "color": "#6cc417",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Forest Green",
            "color": "#4e9258",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Jungle Green",
            "color": "#347c2c",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sage Green",
            "color": "#848b79",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Medium Spring Green",
            "color": "#348017",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Medium Sea Green",
            "color": "#306754",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Venom Green",
            "color": "#728c00",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Fern Green",
            "color": "#667c26",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Hazel Green",
            "color": "#617c58",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Greenish Blue",
            "color": "#307d7e",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Teal",
            "color": "#008080",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Grayish Turquoise",
            "color": "#5e7d7e",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sea Green",
            "color": "#008080",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sea Turtle Green",
            "color": "#438d80",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Medium Aquamarine",
            "color": "#348781",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Dark Turquoise",
            "color": "#3b9c9c",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Sea Green",
            "color": "#3ea99f",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Macaw Blue Green",
            "color": "#43bfc7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Green",
            "color": "#7bccb5",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Turquoise",
            "color": "#43c6db",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Medium Turquoise",
            "color": "#48cccd",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Hosta",
            "color": "#77bfc7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Jelly Fish",
            "color": "#46c7c7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Tiffany Blue",
            "color": "#81d8d0",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Northern Lights Blue",
            "color": "#78c7c7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cyan Opaque",
            "color": "#92c7c7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Diamond",
            "color": "#4ee2ec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cyan, Aqua",
            "color": "#00ffff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Zircon",
            "color": "#57feff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Aquamarine",
            "color": "#7fffd4",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Aquamarine",
            "color": "#93ffe8",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Electric Blue",
            "color": "#9afeff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Slate",
            "color": "#ccffff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Cyan",
            "color": "#e0ffff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Robbin Egg Blue",
            "color": "#bdedff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Coral Blue",
            "color": "#afdcec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Blue",
            "color": "#addfff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Pastel Blue",
            "color": "#b4cfec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Angel",
            "color": "#b7ceec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Day Sky Blue",
            "color": "#82caff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Sky Blue",
            "color": "#82cafa",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Jeans Blue",
            "color": "#a0cfec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Lagoon",
            "color": "#8eebec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Denim Blue",
            "color": "#79baec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Crystal Blue",
            "color": "#5cb3ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Iceberg",
            "color": "#56a5ec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Deep Sky Blue",
            "color": "#3bb9ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cornflower Blue",
            "color": "#6495ed",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sky Blue",
            "color": "#6698ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Butterfly Blue",
            "color": "#38acec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Dress",
            "color": "#157dec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Ocean Blue",
            "color": "#2b65ec",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Steel Blue",
            "color": "#728fce",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Dodger Blue",
            "color": "#1589ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Columbia Blue",
            "color": "#87afc7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Baby Blue",
            "color": "#95b9c7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Koi",
            "color": "#659ec7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Ivy",
            "color": "#3090c7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Silk Blue",
            "color": "#488ac7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Windows Blue",
            "color": "#357ec7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Slate Blue",
            "color": "#736aff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Glacial Blue Ice",
            "color": "#368bc1",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Royal Blue",
            "color": "#2b60de",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Orchid",
            "color": "#1f45fc",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Eyes",
            "color": "#1569c7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Sapphire Blue",
            "color": "#2554c7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blueberry Blue",
            "color": "#0041c2",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cobalt Blue",
            "color": "#0039ff",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Navy Blue",
            "color": "#000080",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Jay",
            "color": "#2b547e",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Midnight Blue",
            "color": "#151b54",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Metallic Silver",
            "color": "#bcc6cc",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Light Slate Gray",
            "color": "#6d7b8d",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Steel Blue",
            "color": "#4863a0",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Blue Gray",
            "color": "#98afc7",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Night",
            "color": "#0c090a",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Black",
            "color": "#080707",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Moderator",
            "color": "#5dc5ff",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Bots",
            "color": "#e5e4e2",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Admin",
            "color": "#e0ffff",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Owner",
            "color": "#7ef4ff",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "ˋˏ⁀➷",
            "channels": [
                {
                    "name": "・welcome",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "・about",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "・rules",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "・roles",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "♣ ︵",
            "channels": [
                {
                    "name": "・general",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "doujins",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "・memes",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "・netflix",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "・bot-commands",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "・nsfw",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "vc",
            "channels": [
                {
                    "name": "❖ Owner's Lounge",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "❖ General",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 69
                },
                {
                    "name": "❖ Music",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 69
                },
                {
                    "name": "❖ Gaming Room 1",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 69
                },
                {
                    "name": "❖ Gaming Room 2",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 69
                },
                {
                    "name": "❖ AFK",
                    "type": ChannelType.GuildVoice
                }
            ]
        }
    ]
},

  'xenon-advanced-among-us': {
    "id": "xenon-advanced-among-us",
    "xenonCode": "JBVr2qvqJQ6y",
    "category": "🎮 Gaming",
    "name": "🏫 Advanced Among Us",
    "description": "The Best Among Us server template you can find. For help in bots setup join https://discord.gg/DhDxz9E",
    "roles": [
        {
            "name": "Member",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "MVP",
            "color": "#9b59b6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Captain",
            "color": "#e67e22",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Moderator",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Administrator",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Organizers",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Founder",
            "color": "#ff6993",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "DELETE THIS",
            "channels": [
                {
                    "name": "Read #information topic",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Best Bot: dub.sh/nova-bot",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "─── 📑 IMPORTANT 📑 ───",
            "channels": [
                {
                    "name": "📜┃information",
                    "type": ChannelType.GuildText,
                    "topic": "<:spoke_info:761214506310565900> **Hey,** thanks for using my template! Please **read** below to get"
                },
                {
                    "name": "📣┃announcements",
                    "type": ChannelType.GuildText,
                    "topic": "All important news related to the server."
                },
                {
                    "name": "🌍┃self-roles",
                    "type": ChannelType.GuildText,
                    "topic": "Free roles you can get by clicking on a reaction."
                },
                {
                    "name": "📡┃matchmaking",
                    "type": ChannelType.GuildText,
                    "topic": "Join a lobby and play with many players around the world."
                },
                {
                    "name": "🏆┃tournaments",
                    "type": ChannelType.GuildText,
                    "topic": "Frequent Among Us Tournaments."
                }
            ]
        },
        {
            "name": "───── 🌍 MAIN 🌍 ─────",
            "channels": [
                {
                    "name": "💬┃general",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤖┃commands",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "😂┃memes",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "─── 🪐 Among US 🪐 ───",
            "channels": [
                {
                    "name": "🔎┃searching-players",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔎┃searching-team",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "❌┃reports",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "──── 🎧 VOICE 🎧 ────",
            "channels": [
                {
                    "name": "🔊┃General",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 25
                },
                {
                    "name": "🎵┃Music",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 15
                },
                {
                    "name": "💤┃AFK",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                }
            ]
        },
        {
            "name": "──── 🔪 LOBBIES 🔪 ────",
            "channels": [
                {
                    "name": "🎮┃Lobby [1]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [2]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [3]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [4]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [5]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                }
            ]
        },
        {
            "name": "──── 🔪 LOBBIES 🔪 ────",
            "channels": [
                {
                    "name": "🎮┃Lobby [6]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [7]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [8]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [9]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                },
                {
                    "name": "🎮┃Lobby [10]",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 10
                }
            ]
        },
        {
            "name": "── 🎓 SERVER STAFF 🎓 ──",
            "channels": [
                {
                    "name": "📁┃staff-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔎┃utility-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📛┃moderation-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👥┃invites",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👔┃discord-updates",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📪┃community-news",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-escola-col-gio': {
    "id": "xenon-escola-col-gio",
    "xenonCode": "346MKKevJWtr",
    "category": "📚 Study & Education",
    "name": "🎒 🍒 Escola (Colégio) 🎓",
    "description": "Uma escola simples para os Brasileiros querem um Grupo para fazerem suas Aulas e se Divertirem",
    "roles": [
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 9º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 8º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 7º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 6º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 5º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 4º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 3º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 2º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🌹 Professor (a) do 1º Ano",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 9º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 8º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 7º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 6º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 5º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 4º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 3º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 2º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔥 Turma 1º Ano",
            "color": "#1abc9c",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🍎 No Intervalo",
            "color": "#ff0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🔨 ADMIN",
            "color": "#3498db",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "😝",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "😭",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "😁",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "《🚀》 Fila 3",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "《🚀》 Fila 2",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "《🚀》 Fila 1",
            "color": "#2ecc71",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "❰💎❱ Estudantes",
            "color": "#9b59b6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "『🌈』Em Aula",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🍒 Ajudante do DIA",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "❰🎓❱ Professor (a)",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "❰📋❱ Diretor (a)",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "━━━━━━",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "》🏠 Bem Vindos (as)",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "💖 Portaria de Estudos",
            "channels": [
                {
                    "name": "【💖】entradas",
                    "type": ChannelType.GuildText,
                    "topic": "💖 Olá Jovem, está com uma Dúvida? Entrem em https://discord.gg/xAHVMpA tem Tudo sobre o Discord que"
                }
            ]
        },
        {
            "name": "📜 Regras",
            "channels": [
                {
                    "name": "❰📜❱-regras",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "『💬』Chats da Escola",
            "channels": [
                {
                    "name": "💬※1",
                    "type": ChannelType.GuildText,
                    "topic": "💖 Olá Jovem, está com uma Dúvida? Entrem em https://discord.gg/xAHVMpA tem Tudo sobre o Discord que"
                },
                {
                    "name": "💬※2",
                    "type": ChannelType.GuildText,
                    "topic": "💖 Olá Jovem, está com uma Dúvida? Entrem em https://discord.gg/xAHVMpA tem Tudo sobre o Discord que"
                },
                {
                    "name": "💬※3",
                    "type": ChannelType.GuildText,
                    "topic": "💖 Olá Jovem, está com uma Dúvida? Entrem em https://discord.gg/xAHVMpA tem Tudo sobre o Discord que"
                }
            ]
        },
        {
            "name": "🔔 Notificações",
            "channels": [
                {
                    "name": "《🔔》-avisos",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "Aulas",
            "channels": [
                {
                    "name": "🔥 Aula Online",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "❬🚧❭ Esperando para Entrar",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔥",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🎶 Músicas",
            "channels": [
                {
                    "name": "🎶",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🎶",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🎓 Ajuda na Escola",
            "channels": [
                {
                    "name": "〈🍒〉",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "📕",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📗",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📘",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📙",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📋 Sala de Descanso",
            "channels": [
                {
                    "name": "《📋》-status-da-escola",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💬※chat-professores",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "（🧾）Diretoria",
            "channels": [
                {
                    "name": "🔒",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📋 Notas",
            "channels": [
                {
                    "name": "『📋』",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🦴 Pra ver os Custosos",
            "channels": [
                {
                    "name": "🦴",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "👀",
            "channels": [
                {
                    "name": "👀-vigias",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔒 Auditorias",
            "channels": [
                {
                    "name": "〈🔒〉",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-swift': {
    "id": "xenon-swift",
    "xenonCode": "eN8kcuA2gGxb",
    "category": "📹 Creators & Media",
    "name": "😀 Swift",
    "description": "Pre-configured Discord server template from Xenon.bot",
    "roles": [
        {
            "name": "new role",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Question Of The Day",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Product Updates",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "News",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Status",
            "color": "#ffffff",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Member",
            "color": "#ecffba",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Active",
            "color": "#9f71ec",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Notable",
            "color": "#ffe700",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Ducky Plus",
            "color": "#ae8eff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Support",
            "color": "#f4ffa9",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Junior",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Senior",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Lead",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Online",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Moderation",
            "color": "#e93737",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Trial Engineer",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Engineer",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Lead Engineer",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Engineering Team",
            "color": "#026dff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Support Manager",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Management",
            "color": "#3affce",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Operations Manager",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Managing Director",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Core Team",
            "color": "#0050ff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎‎ ‎ ‎ ‎ ‎ ‎",
            "color": "#231f1f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Quarantine",
            "color": "#b38844",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "moderator-only",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "general",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "wick-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "modlogs",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📬 Bulletin",
            "channels": [
                {
                    "name": "information",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🏠 Community",
            "channels": [
                {
                    "name": "Lounge",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "general",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "media",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "commands",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🏷️ Product Updates",
            "channels": [
                {
                    "name": "suggestions",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📬 Support",
            "channels": [
                {
                    "name": "support",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "faq",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🦺 Staff",
            "channels": [
                {
                    "name": "Staff Lounge 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "Staff Lounge 2",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "staff-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "staff-guide",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "staff-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "transcripts",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "escalations",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔧 Support",
            "channels": [
                {
                    "name": "support-news",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "support-guide",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "support-chat",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-aion-2': {
    "id": "xenon-aion-2",
    "xenonCode": "aBpCK58Bz4Jf",
    "category": "🎮 Gaming",
    "name": "💯 Aion 2",
    "description": "Sanırım Güzel oldu",
    "roles": [
        {
            "name": "🤝 Misafir",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "📝 Klan Adayı",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "⚔️ Klan Üyesi",
            "color": "#9b59b6",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "🛡️ Yetkili",
            "color": "#e91e63",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "👑 Klan Lideri",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "𒄆𝑰̇𝑴𝑴𝑶𝑹𝑻𝑨𝑳𒄆",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "📌 GİRİŞ",
            "channels": [
                {
                    "name": "👋・hoş-geldin",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📜・kurallar",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📢・duyurular",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📝・klana-başvur",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔒 KLAN MERKEZİ",
            "channels": [
                {
                    "name": "💬・klan-sohbet",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📢・klan-duyuruları",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📅・etkinlik-planlama",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏆・başarılarımız",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📸・ekran-görüntüleri",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⚔️ AION 2",
            "channels": [
                {
                    "name": "💬・aion2-genel",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📰・oyun-haberleri",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔄・güncellemeler",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "❓・soru-cevap",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📚 KARAKTERLER",
            "channels": [
                {
                    "name": "🛡️・templar-tank",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⚔️・gladiator-savaşcı",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🗡️・assassin-suikastçı",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏹・ranger-okçu",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔥・sorcerer-büyücü",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "✨・cleric-rahip",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👻・spiritmaster-elemantel",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎵・chanter-karma",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🥊・brawler",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🏰 PVE",
            "channels": [
                {
                    "name": "🔍・grup-arama",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👹・bosslar",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏰・dungeon",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💎・loot",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🧪・build-tartışmaları",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⚔️ PVP",
            "channels": [
                {
                    "name": "🔍・pvp-grup",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🌌・abyss",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⚔️・pvp-taktikleri",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🧪・pvp-buildleri",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔊 SES KANALLARI",
            "channels": [
                {
                    "name": "🔊-klan-sohbet",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔊-klan-sohbet-1",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔊-klan-sohbet-2",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔊-dungeon-1",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔊-dungeon-2",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔊-pvp-abyss",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔇 A F K 🔇",
            "channels": [
                {
                    "name": "Sigara Molası",
                    "type": ChannelType.GuildVoice
                }
            ]
        }
    ]
},

  'xenon-nogodream': {
    "id": "xenon-nogodream",
    "xenonCode": "dpAcJTX26Wy2",
    "category": "🎮 Gaming",
    "name": "🏉 Nogodream",
    "description": "Communauté de Nogodi",
    "roles": [],
    "categories": [
        {
            "name": "📢 UNIVERS NOGODI",
            "channels": [
                {
                    "name": "📌-bienvenue",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📢-annonces",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔴-live-stream",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎁-concours",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💬 [COMMUNAUTÉ]",
            "channels": [
                {
                    "name": "💬-général",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎥-clips-et-highlights",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "⚽ [ESPACE SPORT]",
            "channels": [
                {
                    "name": "⚽-football",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏉-rugby",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🚴-cyclisme",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📌-autres-sports",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🎮 [ESPACE GAMING]",
            "channels": [
                {
                    "name": "🎮-actu-gaming",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎯-cherche-joueurs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔥-multi-compétitif",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🕹️-jeux-solo-et-coop",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💬-blabla-gaming",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎬-clips-de-jeux",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🔊 [SALONS VOCAUX]",
            "channels": [
                {
                    "name": "🔊-équipe 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔊-Équipe 2",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔊-Équipe 3",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "🔊-espace-communautaire",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔊-zone-soirée-match",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-': {
    "id": "xenon-",
    "xenonCode": "hsZN8VFzgdVt",
    "category": "🎭 Roleplay & Lore",
    "name": "🪖 Шаблон для всяких служб по типу КГБ/ЦРУ/ФСБ/ФБР",
    "description": "Шаблон для всяких служб по типу КГБ/ЦРУ/ФСБ/ФБР",
    "roles": [
        {
            "name": "Управляющий Делами председателя ВСБ",
            "color": "#720000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Доступ к особой папке",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Доступ к архивам ВСБ",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Центральный Аппарат ВСБ",
            "color": "#ff0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ПУ-2726",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ПУ-8179",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ПУ-1813",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ПУ-1722",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ПУ-7731",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "ПУ-2271",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Админка беляева",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Президентский Полк",
            "color": "#e67e22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Пятое Управление ВСБ",
            "color": "#e67e22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Следственное Управление",
            "color": "#e67e22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Первый Отдел при ЦА ВСБ",
            "color": "#c27c0e",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— ШТАБ —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Отделение —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Гражданин",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Кандидат на Службу",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Рядовой Сотрудник Безопасности",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Младший Сержант Безопасности",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Сержант Безопасности",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Старший Сержант Безопасности",
            "color": "#1abc9c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Ряд.Состав —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Младший Лейтенант Безопасности",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Лейтенант Безопасности",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Старший Лейтенант Безопасности",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Капитан Безопасности",
            "color": "#e91e63",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Мл.Оф.Состав —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Майор Безопасности",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Подполковник Безопасности",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Полковник Безопасности",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Высш.Оф.Состав —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Руководитель Следственного Управления",
            "color": "#e67e22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Начальник Пятого Отдела",
            "color": "#e67e22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Начальник Первого Отдела при ЦА ВСБ",
            "color": "#e67e22",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Руководство Отделов —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Генерал-Майор Безопасности",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Генерал-Лейтенант Безопасности",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Генерал-Полковник Безопасности",
            "color": "#e74c3c",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Генерал Службы Безопасности Новляндии",
            "color": "#992d22",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Ген.Состав —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Первый Заместитель Директора Внутренней Службы Безопасности",
            "color": "#f1c40f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Председатель Внутренней Службы Безопасности Новляндии",
            "color": "#992d22",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Высш.Звание ВСБ —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Высший Директор ВСБ Новляндии",
            "color": "#3498db",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "— Президентское Звание —",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Server builder",
            "color": "#95a5a6",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "СзФ",
            "color": "#992d22",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": ".",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "rules",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "moderator-only",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "заявка-на-роль",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "『👤』 ·  Основное",
            "channels": [
                {
                    "name": "╚『📜』информация-о-всб",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "『📝』 ·  Вступление",
            "channels": [
                {
                    "name": "╔『🧾』заявление-на-вступление-в-всб",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╚『❓』как-вступить-в-всб",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "『📣』 ·  Главное ВСБ",
            "channels": [
                {
                    "name": "╟『📜』структура-всб",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╚『🗂️』документация",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "『⭐』 ·  Штаб ВСБ",
            "channels": [
                {
                    "name": "╔『⭐』чат-увсб",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『⭐』информация",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『☎️』Рация 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╟『☎️』Рация 2",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╟『☎️』Рация 3",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╚『🚪』Кабинет",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                }
            ]
        },
        {
            "name": "『🔔』 · 1-ое управление",
            "channels": [
                {
                    "name": "╟『📜』регламент",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『📄』устав",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗄️』структура-первого-упр",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🖼️』галерея",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『💬』чат-первого-упр",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗂️』документации",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『📃』рапорт",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『☎️』Рация 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╚『☎️』Рация 2",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "『🔔』 · Следственное Управление",
            "channels": [
                {
                    "name": "╟『📄』устав",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗄️』структура-су",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🖼️』галерея",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『💬』чат-су",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗂️』документации",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『📃』рапорт",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『☎️』Рация 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╚『☎️』Рация 2",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "『🔔』 · 5-ое управление",
            "channels": [
                {
                    "name": "╟『📄』устав",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗄️』структура-пятого-упр",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🖼️』галерея",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『💬』чат-пятого-упр",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗂️』документации",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『📃』рапорт",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🕶️』ростер",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『☎️』Рация 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╚『☎️』Рация 2",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "『🔔』 · Президентский Полк",
            "channels": [
                {
                    "name": "╟『📜』регламент",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『📄』устав",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗄️』структура-президентского-полка",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🖼️』галерея",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『💬』чат-президентского-полка",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗂️』документации",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『📃』рапорт",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『☎️』Рация 1",
                    "type": ChannelType.GuildVoice
                },
                {
                    "name": "╚『☎️』Рация 2",
                    "type": ChannelType.GuildVoice
                }
            ]
        },
        {
            "name": "『🗂️』 · Архив",
            "channels": [
                {
                    "name": "╔『🗃️』архив",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╟『🗂️』особая-папка",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "╚『💬』чат-архива",
                    "type": ChannelType.GuildText
                }
            ]
        }
    ]
},

  'xenon-clan': {
    "id": "xenon-clan",
    "xenonCode": "rHDT9ZP8zd2d",
    "category": "🛡️ Esports & Clans",
    "name": "🥶 Clan",
    "description": "Clan template",
    "roles": [],
    "categories": [
        {
            "name": "» Spawn",
            "channels": [
                {
                    "name": "🕸️〢",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏝️〢spawn",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📋〢rulez",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔮〢booster",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "✅〢activity",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "» Important",
            "channels": [
                {
                    "name": "📢〢announcement",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏆〢achivement",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💸〢paid-promos",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎥〢uploadz",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📸〢memories",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎭〢self-role",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "» Team Logs",
            "channels": [
                {
                    "name": "🪖〢war-logs",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⚔️〢tvt",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⚔〢clan-v-clan",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤡〢clown",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🗡️〢roaster",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤝〢allies",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "» Main Area",
            "channels": [
                {
                    "name": "💬〢chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎬〢mediaz",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤖〢cmdz",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "» Support",
            "channels": [
                {
                    "name": "🎫〢ticket",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "» Recruiter Logs",
            "channels": [
                {
                    "name": "👁️〢recruiter",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⚜️〢role-movement",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "» General Hangout",
            "channels": [
                {
                    "name": "🍹 • Chill Vc",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "🍹 • Chill Vc²",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "⏳ • Global Vc",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "💿 • Music Vc",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 30
                },
                {
                    "name": "🗣️ • Squad Vc",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "🗣️ • Squad Vc²",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 4
                },
                {
                    "name": "🗣️ • Trio Vc",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "🗣️ • Trio Vc²",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 3
                },
                {
                    "name": "🗣️ • Duo Vc",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 2
                },
                {
                    "name": "💤 • afk",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 1
                }
            ]
        }
    ]
},

  'xenon-pro-era-2': {
    "id": "xenon-pro-era-2",
    "xenonCode": "s8mpRZu9T28X",
    "category": "🌐 Community",
    "name": "😄 Pro era 2",
    "description": "Pro era full",
    "roles": [
        {
            "name": "Owner",
            "color": "#003efa",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": true,
            "isAdminRole": false
        },
        {
            "name": "PNFL Admin",
            "color": "#992d22",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Staff",
            "color": "#0d009e",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Mod",
            "color": "#33006a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "bots",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "𝐏𝐃𝐓𝐂 (𝐏𝐥𝐚𝐲𝐞𝐫 𝐃𝐞𝐯 𝐓𝐫𝐚𝐢𝐭 𝐂𝐨𝐦𝐦𝐢𝐭𝐭𝐞𝐞)",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Referee",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "[—————————League————————]",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "[————————--Player———————]",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Suspended",
            "color": "#680808",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Head Coach",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": true
        },
        {
            "name": "Assistant Coach",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Free Agent",
            "color": "#99AAB5",
            "hoist": true,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Superstar X-Factor Dev Trait",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Superstar Dev Trait",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Star Dev Trait",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Normal Dev Trait",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Hidden Dev Trait",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Unverified",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Arizona Cardinals",
            "color": "#97233f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Atlanta Falcons",
            "color": "#a71930",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Baltimore Ravens",
            "color": "#1a195f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Buffalo Bills",
            "color": "#00338d",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Carolina Panthers",
            "color": "#0085ca",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Chicago Bears",
            "color": "#c83803",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cincinnati Bengals",
            "color": "#fb4f14",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Cleveland Browns",
            "color": "#ff3c00",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Dallas Cowboys",
            "color": "#003594",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Denver Broncos",
            "color": "#fb4f14",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Detroit Lions",
            "color": "#0076b6",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Green Bay Packers",
            "color": "#183028",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Houston Texans",
            "color": "#03202f",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Indianapolis Colts",
            "color": "#002c5f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Jacksonville Jaguars",
            "color": "#006778",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Kansas City Chiefs",
            "color": "#ff0027",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Los Angeles Chargers",
            "color": "#ffc20e",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Los Angeles Rams",
            "color": "#003594",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Las Vegas Raiders",
            "color": "#a5acaf",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Miami Dolphins",
            "color": "#008e97",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Minnesota Vikings",
            "color": "#4f2683",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "New England Patriots",
            "color": "#002244",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "New Orleans Saints",
            "color": "#d3bc8d",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "New York Giants",
            "color": "#012352",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "New York Jets",
            "color": "#125740",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Philadelphia Eagles",
            "color": "#004c54",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Pittsburgh Steelers",
            "color": "#ffb612",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Seattle Seahawks",
            "color": "#69be28",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "San Francisco 49ers",
            "color": "#aa0000",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Tampa Bay Buccaneers",
            "color": "#d50a0a",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "😎Retired",
            "color": "#009bff",
            "hoist": true,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Tennessee Titans",
            "color": "#4b92db",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Washington Commanders",
            "color": "#5a1414",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "[————————-Awards———————-]",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "S1 MVP",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "S1 OPOTY",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "S1 DPOTY",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "S1 OROTY",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "S1 DROTY",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "S1 COTY",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "1x Probowler",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Superbowl Champion (S1)",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Superbowl MVP (S1)",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Receptions In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Passing Touchdowns In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Rushing Touchdowns In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Receiving Touchdowns In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Sacks In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Interceptions In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Tackles In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Passing Touchdowns In a Playoff Game",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Rushing Touchdowns In a Playoff Game",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Receptions In a Playoff Game",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Receiving Touchdowns In a Playoff Game",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Sacks In a Playoff Game",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Interceptions In a Playoff Game",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Tackes In a Playoff Game",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most PBUs In a Season",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Passing Touchdowns In a Superbowl",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Rushing Touchdowns In a Superbowl",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Receptions In a Superbowl",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Receiving Touchdowns In a Superbowl",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Sacks In a Superbowl",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Most Interceptions In a Superbowl",
            "color": "#f1c40f",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "[—————————-Other————————]",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Scrim Ping",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Graphics Artist🎨",
            "color": "#00ff04",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Graphics Ping",
            "color": "#e91e63",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "Szn 2 Draft",
            "color": "#3a03e0",
            "hoist": false,
            "mentionable": false,
            "isOwnerRole": false,
            "isAdminRole": false
        },
        {
            "name": "New ping",
            "color": "#99AAB5",
            "hoist": false,
            "mentionable": true,
            "isOwnerRole": false,
            "isAdminRole": false
        }
    ],
    "categories": [
        {
            "name": "💬 ━━ GENERAL ━━",
            "channels": [
                {
                    "name": "moderator-only",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "rules",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "moderator-only",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🚪𝐖𝐄𝐋𝐂𝐎𝐌𝐄🚪",
            "channels": [
                {
                    "name": "🤲｜𝐖𝐞𝐥𝐜𝐨𝐦𝐞",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🔢｜𝐀𝐠𝐞-𝐂𝐨𝐧𝐟𝐢𝐫𝐦𝐚𝐭𝐢𝐨𝐧",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🆔｜𝐎𝐜𝐮𝐥𝐮𝐬-𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "🚨𝐈𝐌𝐏𝐎𝐑𝐓𝐀𝐍𝐓🚨",
            "channels": [
                {
                    "name": "📣┃𝐀𝐧𝐧𝐨𝐮𝐧𝐜𝐞𝐦𝐞𝐧𝐭𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🚨┃𝐑𝐮𝐥𝐞𝐁𝐨𝐨𝐤",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏁┃𝐑𝐞𝐟𝐞𝐫𝐞𝐞𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📮┃𝐒𝐮𝐠𝐠𝐞𝐬𝐭𝐢𝐨𝐧𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📂┃𝐑𝐨𝐥𝐞𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💈┃𝐏𝐨𝐥𝐥𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📈┃𝐒𝐭𝐚𝐭-𝐈𝐧𝐟𝐨",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🧾┃𝐀𝐩𝐩𝐥𝐢𝐜𝐚𝐭𝐢𝐨𝐧",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📲┃𝐒𝐨𝐜𝐢𝐚𝐥𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "✨｜𝐒𝐞𝐫𝐯𝐞𝐫𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💵｜𝐅𝐫𝐚𝐧𝐜𝐡𝐢𝐬𝐞-𝐎𝐰𝐧𝐞𝐫𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📋｜𝐂𝐨𝐧𝐭𝐫𝐚𝐜𝐭",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⭐｜𝐃𝐞𝐯-𝐓𝐫𝐚𝐢𝐭𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎟️┃𝙏𝙞𝙘𝙠𝙚𝙩-𝙀𝙣𝙩𝙧𝙮",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "💬𝐂𝐇𝐀𝐓𝐒💬",
            "channels": [
                {
                    "name": "🏝️｜𝐂𝐚𝐧𝐜𝐮𝐧-𝐂𝐡𝐚𝐭",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🐤｜𝐓𝐰𝐢𝐭𝐭𝐞𝐫",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🗣️┃𝐆𝐞𝐧𝐞𝐫𝐚𝐥-𝐂𝐡𝐚𝐭",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏁｜𝐑𝐞𝐟-𝐂𝐡𝐚𝐭",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "☁️｜𝐒𝐜𝐫𝐢𝐦-𝐂𝐡𝐚𝐭",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📀｜𝐆𝐚𝐦𝐞-𝐂𝐥𝐢𝐩𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤖｜𝐁𝐨𝐭-𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🤦｜𝐖𝐚𝐥𝐥-𝐎𝐟-𝐒𝐡𝐚𝐦𝐞",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "💭｜𝐐𝐮𝐨𝐭𝐞𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "head-coach-chat",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📁𝐋𝐞𝐚𝐠𝐮𝐞 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧📁",
            "channels": [
                {
                    "name": "🏅｜𝐒𝐭𝐚𝐧𝐝𝐢𝐧𝐠𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🗓️｜𝐒𝐜𝐡𝐞𝐝𝐮𝐥𝐞",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⌚｜𝐆𝐚𝐦𝐞-𝐓𝐢𝐦𝐞𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🚦｜𝐒𝐜𝐨𝐫𝐞𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📦｜𝐁𝐨𝐱-𝐒𝐜𝐨𝐫𝐞𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "♻️｜𝐓𝐫𝐚𝐧𝐬𝐚𝐜𝐭𝐢𝐨𝐧𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👥｜𝐅𝐫𝐞𝐞-𝐀𝐠𝐞𝐧𝐜𝐲",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👤｜𝐍𝐏𝐅𝐋-𝐓𝐞𝐚𝐦𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🫂｜𝐑𝐨𝐬𝐭𝐞𝐫𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👥｜𝐏𝐫𝐚𝐜𝐭𝐢𝐜𝐞-𝐒𝐪𝐮𝐚𝐝-𝐑𝐨𝐬𝐭𝐞𝐫",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏈｜𝐒𝐢𝐠𝐧𝐢𝐧𝐠𝐬-𝐂𝐮𝐭𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🥋｜𝐏𝐫𝐚𝐜𝐭𝐢𝐜𝐞-𝐒𝐪𝐮𝐚𝐝-𝐌𝐨𝐯𝐢𝐧𝐠𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "👨｜𝐂𝐨𝐚𝐜𝐡-𝐒𝐢𝐠𝐧𝐢𝐧𝐠𝐬-𝐂𝐮𝐭𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🩹｜𝐈𝐧𝐣𝐮𝐫𝐲-𝐑𝐞𝐩𝐨𝐫𝐭",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📋｜𝐃𝐫𝐚𝐟𝐭-𝐏𝐢𝐜𝐤𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏆｜𝐑𝐞𝐜𝐨𝐫𝐝𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "⭐｜𝐏𝐥𝐚𝐲𝐞𝐫𝐬-𝐎𝐟-𝐓𝐡𝐞-𝐖𝐞𝐞𝐤",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🌟｜𝐏𝐥𝐚𝐲𝐞𝐫𝐬-𝐎𝐟-𝐓𝐡𝐞-𝐌𝐨𝐧𝐭𝐡",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏆｜𝐒𝐮𝐩𝐞𝐫𝐛𝐨𝐰𝐥-𝐇𝐢𝐬𝐭𝐨𝐫𝐲",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🥇｜𝐘𝐞𝐚𝐫𝐥𝐲-𝐀𝐰𝐚𝐫𝐝𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏅｜𝐇𝐚𝐥𝐥-𝐨𝐟-𝐅𝐚𝐦𝐞",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏆｜𝐏𝐫𝐨𝐁𝐨𝐰𝐥-𝐇𝐢𝐬𝐭𝐨𝐫𝐲",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📊 stats 📊",
            "channels": [
                {
                    "name": "𝐏𝐑𝐎-𝐒𝐓𝐀𝐓𝐒",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "𝐄𝐑𝐀-𝐒𝐓𝐀𝐓𝐒",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "📊｜𝐂𝐚𝐫𝐞𝐞𝐫-𝐒𝐭𝐚𝐭𝐬",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "playoff-stats",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "📰 league news channels 📰",
            "channels": [
                {
                    "name": "🖨️｜𝐒𝐏𝐎𝐑𝐓𝐒-𝐀𝐂𝐂𝐄𝐒𝐒",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🖨️｜𝐏𝐄𝐒𝐍",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏈｜𝐒𝐩𝐨𝐫𝐭𝐬-𝐍𝐞𝐭𝐰𝐨𝐫𝐤",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🏟️｜𝐀𝐋𝐋-𝐒𝐏𝐎𝐑𝐓𝐒-𝐍𝐄𝐓𝐖𝐎𝐑𝐊",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "🎙️｜𝐆𝐀𝐌𝐄𝐃𝐀𝐘",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "staff",
            "channels": [
                {
                    "name": "staff-chat",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "pdtc",
                    "type": ChannelType.GuildText
                },
                {
                    "name": "bot",
                    "type": ChannelType.GuildText
                }
            ]
        },
        {
            "name": "Vcs",
            "channels": [
                {
                    "name": "Draft",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                },
                {
                    "name": "Draft",
                    "type": ChannelType.GuildVoice,
                    "userLimit": 99
                }
            ]
        }
    ]
}
};
