const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'vx-esports',
  category: '🏆 Esports & Clan',
  name: '⚡ ⚔️ VX ESPORTS & GAMING EMPIRE ⚔️ ⚡',
  description: 'Pro-tier competitive Esports layout for VX Esports with dedicated Lineups (Alpha, Bravo, Charlie, Valkyrie), Scrims Hub, VX VIP Rooms, Music, Fun Area & Auto Setup.',
  roles: [
    { name: '👑 ＶＸ ＯＷＮＥＲ / ＣＥＯ', color: '#FF3838', hoist: true, mentionable: false, isOwnerRole: true },
    { name: '🛡️ ＶＸ ＨＥＡＤ ＭＡＮＡＧＥＭＥＮＴ', color: '#FF9F1A', hoist: true, mentionable: false, isAdminRole: true },
    { name: '👔 ＶＸ ＴＥＡＭ ＭＡＮＡＧＥＲ', color: '#9B59B6', hoist: true, mentionable: true },
    { name: '🎯 ＶＸ ＨＥＡＤ ＣＯＡＣＨ', color: '#3498DB', hoist: true, mentionable: true, isModRole: true },
    { name: '⚡ ＶＸ ＳＣＲＩＭＳ ＨＯＳＴ', color: '#17C0EB', hoist: true, mentionable: true },
    { name: '🏆 ＶＸ ＡＬＰＨＡ (Lineup 1 - Tier 1)', color: '#FFD32A', hoist: true, mentionable: true },
    { name: '⚔️ ＶＸ ＢＲＡＶＯ (Lineup 2 - Tier 2)', color: '#FFA801', hoist: true, mentionable: true },
    { name: '🌟 ＶＸ ＣＨＡＲＬＩＥ (Lineup 3 - Academy)', color: '#00D2D3', hoist: true, mentionable: true },
    { name: '🌸 ＶＸ ＶＡＬＫＹＲＩＥ (Girls Lineup)', color: '#FD79A8', hoist: true, mentionable: true },
    { name: '🎙️ ＶＸ ＣＯＮＴＥＮＴ ＣＲＥＡＴＯＲ', color: '#E056FD', hoist: true, mentionable: true },
    { name: '💎 ＶＸ ＶＩＰ / ＢＯＯＳＴＥＲ', color: '#FF4D4D', hoist: true, mentionable: false },
    { name: '🤖 ＶＸ ＢＯＴＳ', color: '#718093', hoist: true, mentionable: false, isBotRole: true },
    { name: '👥 ＶＸ ＭＥＭＢＥＲＳ', color: '#D2DAE2', hoist: false, mentionable: false, isMemberRole: true }
  ],
  categories: [
    // 1. GATEWAY
    {
      name: '🚪・━━ ⚡ ＶＸ ＧＡＴＥＷＡＹ ⚡ ━━・🚪',
      channels: [
        { name: '👋・welcome-arrivals', type: ChannelType.GuildText, topic: '⚡ Welcome to VX Esports & Gaming Hub!', isWelcomeChannel: true },
        { name: '📜・vx-rules', type: ChannelType.GuildText, topic: '📜 Official VX community & clan regulations', isRulesChannel: true },
        { name: '⚡・verify-here', type: ChannelType.GuildText, topic: '🛡️ 1-Click Verification to unlock VX server access' },
        { name: '📢・official-announcements', type: ChannelType.GuildText, topic: '📢 Tournaments, roster updates & server announcements' },
        { name: '🎭・pick-roles', type: ChannelType.GuildText, topic: '🎨 Choose your notification pings, game tags & lineup roles', isRolesChannel: true },
        { name: '💎・booster-perks', type: ChannelType.GuildText, topic: '✨ Server booster rewards, custom roles & badges' },
        { name: '🚪・leave-goodbyes', type: ChannelType.GuildText, topic: '👋 Member departure logs' }
      ]
    },

    // 2. IMPORTANT
    {
      name: '📌・━━ 🏆 ＩＭＰＯＲＴＡＮＴ 🏆 ━━・📌',
      channels: [
        { name: '📌・vx-esports-info', type: ChannelType.GuildText, topic: 'ℹ️ About VX Esports organization, roster & achievements' },
        { name: '🏆・trophies-and-titles', type: ChannelType.GuildText, topic: '🏆 Official championships, trophies & prize winnings' },
        { name: '📅・scrims-and-tournaments', type: ChannelType.GuildText, topic: '⏰ Daily T1/T2/T3 Scrims slots & tournament schedules' },
        { name: '🎁・vx-giveaways', type: ChannelType.GuildText, topic: '🎁 Discord Nitro, Battle Passes, UC / VP giveaways' },
        { name: '🔗・official-handles', type: ChannelType.GuildText, topic: '🌐 YouTube, Twitch, Instagram, Twitter & Discord links' }
      ]
    },

    // 3. VX COMPETITIVE LINEUPS HUB
    {
      name: '⚔️・━━ 🛡️ ＶＸ ＬＩＮＥＵＰＳ 🛡️ ━━・⚔️',
      channels: [
        { name: '👑・lineup-announcements', type: ChannelType.GuildText, topic: '⭐ Official announcements for all VX Competitive Lineups' },
        { name: '📋・scrims-registration', type: ChannelType.GuildText, topic: '📋 Register your team & reserve scrim slots' },
        { name: '📝・lineup-roster-submission', type: ChannelType.GuildText, topic: '📝 Submit player in-game IGN, UID & Discord IDs' },
        { name: '🎯・scrims-id-pass', type: ChannelType.GuildText, topic: '🔒 Custom room ID & Password (shared before match)' },
        { name: '📊・scrims-results', type: ChannelType.GuildText, topic: '📊 Match end screenshots, kill counts & chicken dinners' },
        { name: '📈・leaderboard-points', type: ChannelType.GuildText, topic: '🏆 Daily scrims & tournament leaderboard standings' },
        { name: '🧠・strats-and-tactics', type: ChannelType.GuildText, topic: '🎯 Map rotations, tactics & coach review notes' }
      ]
    },

    // 4. TEAM SQUAD VOICE COMMS
    {
      name: '🎙️・━━ ⚡ ＴＥＡＭ ＣＯＭＭＳ ⚡ ━━・🎙️',
      channels: [
        { name: '🏆・VX Alpha [Lineup 1]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '⚔️・VX Bravo [Lineup 2]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🌟・VX Charlie [Lineup 3]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🌸・VX Valkyrie [Lineup 4]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🎙️・Official Match Comms', type: ChannelType.GuildVoice, userLimit: 5 },
        { name: '📊・Coaching & VODs VC', type: ChannelType.GuildVoice, userLimit: 10 }
      ]
    },

    // 5. VX ROOMS (VIP & Squad Rooms)
    {
      name: '⚡・━━ 👑 ＶＸ ＲＯＯＭＳ 👑 ━━・⚡',
      permissions: [
        { roleName: '👑 ＶＸ ＯＷＮＥＲ / ＣＥＯ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🛡️ ＶＸ ＨＥＡＤ ＭＡＮＡＧＥＭＥＮＴ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '👔 ＶＸ ＴＥＡＭ ＭＡＮＡＧＥＲ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🎯 ＶＸ ＨＥＡＤ ＣＯＡＣＨ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🏆 ＶＸ ＡＬＰＨＡ (Lineup 1 - Tier 1)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '⚔️ ＶＸ ＢＲＡＶＯ (Lineup 2 - Tier 2)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🌟 ＶＸ ＣＨＡＲＬＩＥ (Lineup 3 - Academy)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🌸 ＶＸ ＶＡＬＫＹＲＩＥ (Girls Lineup)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '💎 ＶＸ ＶＩＰ / ＢＯＯＳＴＥＲ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '👥 ＶＸ ＭＥＭＢＥＲＳ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] }
      ],
      channels: [
        { name: '👑・vx-exclusive-chat', type: ChannelType.GuildText, topic: '⭐ Dedicated VIP chat for VX Members & Rosters' },
        { name: '🎯・vx-squad-finder', type: ChannelType.GuildText, topic: '🎯 Find duo / squad teammates for rank push' },
        { name: '🔊・VX Lounge [Open]', type: ChannelType.GuildVoice },
        { name: '🔒・VX Squad 1 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🔒・VX Squad 2 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🔒・VX Duo 1 (2)', type: ChannelType.GuildVoice, userLimit: 2 },
        { name: '🔒・VX Duo 2 (2)', type: ChannelType.GuildVoice, userLimit: 2 }
      ]
    },

    // 6. GENERAL CHAT
    {
      name: '💬・━━ 🎮 ＧＥＮＥＲＡＬ 🎮 ━━・💬',
      channels: [
        { name: '💬・vx-main-chat', type: ChannelType.GuildText, topic: '💬 Main lounge for all VX members to chat & chill' },
        { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: '🤖 Use bot commands & utilities here' },
        { name: '📸・clips-and-media', type: ChannelType.GuildText, topic: '🔥 Share your best clutches, aces & highlights' },
        { name: '💡・suggestions', type: ChannelType.GuildText, topic: '💡 Share ideas to improve VX Esports & Server' },
        { name: '🐸・memes-lounge', type: ChannelType.GuildText, topic: '😂 Esports memes, clips & fun banter' }
      ]
    },

    // 7. MUSIC AREA
    {
      name: '🎵・━━ 🎧 ＭＵＳＩＣ ＡＲＥＡ 🎧 ━━・🎵',
      channels: [
        { name: '🎵・music-commands', type: ChannelType.GuildText, topic: '🎶 Play, pause, skip, and control music bots' },
        { name: '📻・song-recommendations', type: ChannelType.GuildText, topic: '🎧 Share your favorite playlist and tracks' },
        { name: '🎧・Music Room 1', type: ChannelType.GuildVoice },
        { name: '🎧・Music Room 2', type: ChannelType.GuildVoice },
        { name: '📻・24/7 Lo-Fi Beats', type: ChannelType.GuildVoice },
        { name: '🎙️・Karaoke / Jam Stage', type: ChannelType.GuildVoice }
      ]
    },

    // 8. FUN AREA
    {
      name: '🎉・━━ 🎲 ＦＵＮ ＡＲＥＡ 🎲 ━━・🎉',
      channels: [
        { name: '🎮・mini-games', type: ChannelType.GuildText, topic: '🕹️ Play OwO, Karuta, Dank Memer, Akinator & trivia' },
        { name: '🔢・counting-channel', type: ChannelType.GuildText, topic: '🔢 Count 1, 2, 3... don\'t break the streak!' },
        { name: '💬・truth-or-dare', type: ChannelType.GuildText, topic: '🎯 Fun party questions and challenges' },
        { name: '🎰・casino-and-bets', type: ChannelType.GuildText, topic: '💰 Bot coin flips, dice roll & virtual betting' },
        { name: '🕹️・Casual Hangout VC', type: ChannelType.GuildVoice },
        { name: '🍿・Watch Party / Stream VC', type: ChannelType.GuildVoice }
      ]
    },

    // 9. STAFF & MODERATION HQ
    {
      name: '🛡️・━━ 🔒 ＶＸ ＳＴＡＦＦ ＨＱ 🔒 ━━・🛡️',
      permissions: [
        { roleName: '👑 ＶＸ ＯＷＮＥＲ / ＣＥＯ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🛡️ ＶＸ ＨＥＡＤ ＭＡＮＡＧＥＭＥＮＴ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '👔 ＶＸ ＴＥＡＭ ＭＡＮＡＧＥＲ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🎯 ＶＸ ＨＥＡＤ ＣＯＡＣＨ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] }
      ],
      channels: [
        { name: '🔒・staff-hq', type: ChannelType.GuildText, topic: '🔒 Private leadership & administrative decisions' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: '🛡️ Automated audit log stream & AutoMod actions', isModLogChannel: true },
        { name: '🎫・tickets-desk', type: ChannelType.GuildText, topic: '📩 Player support tickets & tournament queries', isTicketsChannel: true },
        { name: '🔊・Staff War Room VC', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
