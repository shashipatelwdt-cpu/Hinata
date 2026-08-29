const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'lordx-esports',
  category: '🏆 Esports & Clan',
  name: '👑 ⚡ LORDX ESPORTS • OFFICIAL HQ ⚡ 👑',
  description: 'Official Tier-1 Competitive Esports Server Layout for LordX Esports with dedicated Lineups, Scrims Hub, LordX VIP Rooms, Music, Fun Area & 100% Automated Setup.',
  roles: [
    { name: '👑 ＬＯＲＤＸ ＦＯＵＮＤＥＲ / ＣＥＯ', color: '#FF0D00', hoist: true, mentionable: false, isOwnerRole: true },
    { name: '🛡️ ＬＯＲＤＸ ＨＥＡＤ ＭＡＮＡＧＥＭＥＮＴ', color: '#FF793F', hoist: true, mentionable: false, isAdminRole: true },
    { name: '👔 ＬＯＲＤＸ ＴＥＡＭ ＭＡＮＡＧＥＲ', color: '#8854D0', hoist: true, mentionable: true },
    { name: '🎯 ＬＯＲＤＸ ＨＥＡＤ ＣＯＡＣＨ', color: '#3867D6', hoist: true, mentionable: true, isModRole: true },
    { name: '⚡ ＬＯＲＤＸ ＳＣＲＩＭＳ ＨＯＳＴ', color: '#20BF6B', hoist: true, mentionable: true },
    { name: '🏆 ＬＯＲＤＸ ＭＡＩＮ ＲＯＳＴＥＲ (Tier 1)', color: '#FFD32A', hoist: true, mentionable: true },
    { name: '⚔️ ＬＯＲＤＸ ＣＨＡＬＬＥＮＧＥＲ (Lineup 2)', color: '#FFA801', hoist: true, mentionable: true },
    { name: '🌟 ＬＯＲＤＸ ＡＣＡＤＥＭＹ (Lineup 3)', color: '#00D2D3', hoist: true, mentionable: true },
    { name: '🌸 ＬＯＲＤＸ ＶＡＬＫＹＲＩＥ (Girls Lineup)', color: '#FD79A8', hoist: true, mentionable: true },
    { name: '🎙️ ＬＯＲＤＸ ＣＯＮＴＥＮＴ ＣＲＥＡＴＯＲ', color: '#E056FD', hoist: true, mentionable: true },
    { name: '💎 ＬＯＲＤＸ ＶＩＰ / ＢＯＯＳＴＥＲ', color: '#FF4D4D', hoist: true, mentionable: false },
    { name: '🤖 ＬＯＲＤＸ ＢＯＴＳ', color: '#718093', hoist: true, mentionable: false, isBotRole: true },
    { name: '👥 ＬＯＲＤＸ ＣＬＡＮ ＭＥＭＢＥＲＳ', color: '#D2DAE2', hoist: false, mentionable: false, isMemberRole: true }
  ],
  categories: [
    // 1. GATEWAY & WELCOME
    {
      name: '🚪・━━ 👑 ＬＯＲＤＸ ＧＡＴＥＷＡＹ 👑 ━━・🚪',
      channels: [
        { name: '👋・welcome-arrivals', type: ChannelType.GuildText, topic: '⚡ Welcome to LordX Esports Official Organization!', isWelcomeChannel: true },
        { name: '📜・lordx-rules', type: ChannelType.GuildText, topic: '📜 Official LordX Clan regulations, code of conduct & esports rules', isRulesChannel: true },
        { name: '⚡・verify-here', type: ChannelType.GuildText, topic: '🛡️ 1-Click Verification to unlock LordX Esports server access' },
        { name: '📢・official-announcements', type: ChannelType.GuildText, topic: '📢 Official roster transfers, match updates & clan announcements' },
        { name: '🎭・pick-roles', type: ChannelType.GuildText, topic: '🎨 Choose notification pings, game tags & favorite lineups', isRolesChannel: true },
        { name: '💎・booster-perks', type: ChannelType.GuildText, topic: '✨ LordX Booster perks, custom badges & VIP access' },
        { name: '🚪・leave-goodbyes', type: ChannelType.GuildText, topic: '👋 Member departure log stream' }
      ]
    },

    // 2. IMPORTANT & CLAN ACHIEVEMENTS
    {
      name: '📌・━━ 🏆 ＩＭＰＯＲＴＡＮＴ & ＩＮＦＯ 🏆 ━━・📌',
      channels: [
        { name: '📌・about-lordx', type: ChannelType.GuildText, topic: 'ℹ️ About LordX Esports history, vision & organization hierarchy' },
        { name: '🏆・trophies-and-achievements', type: ChannelType.GuildText, topic: '🏆 Official tournament championships, titles & prize winnings' },
        { name: '📅・scrims-and-tournaments', type: ChannelType.GuildText, topic: '⏰ Official match dates, LAN schedules & scrim timings' },
        { name: '🎁・lordx-giveaways', type: ChannelType.GuildText, topic: '🎁 Discord Nitro, Battle Passes, UC / VP & gaming gear drops' },
        { name: '🔗・official-handles', type: ChannelType.GuildText, topic: '🌐 YouTube, Instagram, Loco, Rooter, Twitter & Discord links' }
      ]
    },

    // 3. LORDX LINEUPS & COMPETITIVE ROSTERS
    {
      name: '⚔️・━━ 🛡️ ＬＯＲＤＸ ＬＩＮＥＵＰＳ 🛡️ ━━・⚔️',
      channels: [
        { name: '👑・lineup-announcements', type: ChannelType.GuildText, topic: '⭐ Official announcements for all LordX Competitive Lineups' },
        { name: '📋・scrims-registration', type: ChannelType.GuildText, topic: '📋 Slot bookings & opponent team registrations' },
        { name: '📝・lineup-roster-submission', type: ChannelType.GuildText, topic: '📝 Submit player in-game IGN, UID & Discord IDs' },
        { name: '🎯・scrims-id-pass', type: ChannelType.GuildText, topic: '🔒 Custom Room ID & Password (shared 15 min before match)' },
        { name: '📊・scrims-results', type: ChannelType.GuildText, topic: '📊 End-game scorecards, kill totals & Chicken Dinners' },
        { name: '📈・leaderboard-points', type: ChannelType.GuildText, topic: '🏆 Daily tournament standings & clan leaderboard' },
        { name: '🧠・strats-and-tactics', type: ChannelType.GuildText, topic: '🎯 Map drops, zone rotations, coach review & lineups' }
      ]
    },

    // 4. LORDX SQUAD VOICE COMMS (ALL TEAMS)
    {
      name: '🎙️・━━ ⚡ ＴＥＡＭ ＣＯＭＭＳ ⚡ ━━・🎙️',
      channels: [
        { name: '🏆・LordX Alpha [Lineup 1]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '⚔️・LordX Bravo [Lineup 2]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🌟・LordX Charlie [Lineup 3]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🌸・LordX Valkyrie [Lineup 4]', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🎙️・Official Tournament Comms', type: ChannelType.GuildVoice, userLimit: 5 },
        { name: '📊・Coaching & VODs Room', type: ChannelType.GuildVoice, userLimit: 10 }
      ]
    },

    // 5. LORDX CLAN ROOMS & VIP LOUNGE
    {
      name: '👑・━━ ⚡ ＬＯＲＤＸ ＲＯＯＭＳ ⚡ ━━・👑',
      permissions: [
        { roleName: '👑 ＬＯＲＤＸ ＦＯＵＮＤＥＲ / ＣＥＯ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🛡️ ＬＯＲＤＸ ＨＥＡＤ ＭＡＮＡＧＥＭＥＮＴ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '👔 ＬＯＲＤＸ ＴＥＡＭ ＭＡＮＡＧＥＲ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🎯 ＬＯＲＤＸ ＨＥＡＤ ＣＯＡＣＨ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🏆 ＬＯＲＤＸ ＭＡＩＮ ＲＯＳＴＥＲ (Tier 1)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '⚔️ ＬＯＲＤＸ ＣＨＡＬＬＥＮＧＥＲ (Lineup 2)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🌟 ＬＯＲＤＸ ＡＣＡＤＥＭＹ (Lineup 3)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🌸 ＬＯＲＤＸ ＶＡＬＫＹＲＩＥ (Girls Lineup)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '💎 ＬＯＲＤＸ ＶＩＰ / ＢＯＯＳＴＥＲ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '👥 ＬＯＲＤＸ ＣＬＡＮ ＭＥＭＢＥＲＳ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] }
      ],
      channels: [
        { name: '👑・lordx-exclusive-chat', type: ChannelType.GuildText, topic: '⭐ VIP chat for LordX Clan Members, Rosters & Boosters' },
        { name: '🎯・squad-finder-lfg', type: ChannelType.GuildText, topic: '🎯 Find squad & duo teammates for competitive rank push' },
        { name: '🔊・LordX Lounge [Open]', type: ChannelType.GuildVoice },
        { name: '🔒・LordX Squad 1 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🔒・LordX Squad 2 (4)', type: ChannelType.GuildVoice, userLimit: 4 },
        { name: '🔒・LordX Duo 1 (2)', type: ChannelType.GuildVoice, userLimit: 2 },
        { name: '🔒・LordX Duo 2 (2)', type: ChannelType.GuildVoice, userLimit: 2 }
      ]
    },

    // 6. COMMUNITY & GENERAL CHAT
    {
      name: '💬・━━ 🎮 ＧＥＮＥＲＡＬ ＣＨＡＴ 🎮 ━━・💬',
      channels: [
        { name: '💬・lordx-main-chat', type: ChannelType.GuildText, topic: '💬 Main lounge for all LordX community members & fans' },
        { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: '🤖 Use bot commands & utilities here' },
        { name: '🔥・clutches-and-highlights', type: ChannelType.GuildText, topic: '🎥 Share your best 1v4 clutches, aces & gameplay clips' },
        { name: '💡・clan-suggestions', type: ChannelType.GuildText, topic: '💡 Share feedback & ideas to grow LordX Esports' },
        { name: '🐸・memes-and-banter', type: ChannelType.GuildText, topic: '😂 Esports memes, trolling & fun banter' }
      ]
    },

    // 7. MUSIC & CHILL AREA
    {
      name: '🎵・━━ 🎧 ＭＵＳＩＣ & ＶＩＢＥＳ 🎧 ━━・🎵',
      channels: [
        { name: '🎵・music-commands', type: ChannelType.GuildText, topic: '🎶 Control music playback (play, skip, pause, loop)' },
        { name: '📻・song-recommendations', type: ChannelType.GuildText, topic: '🎧 Share top tracks, phonk & hype gaming playlists' },
        { name: '🎧・Music Room 1', type: ChannelType.GuildVoice },
        { name: '🎧・Music Room 2', type: ChannelType.GuildVoice },
        { name: '📻・24/7 Phonk & Lo-Fi Beats', type: ChannelType.GuildVoice },
        { name: '🎙️・Karaoke / Jamming Stage', type: ChannelType.GuildVoice }
      ]
    },

    // 8. FUN & GAMES
    {
      name: '🎉・━━ 🎲 ＦＵＮ & ＧＡＭＥＳ 🎲 ━━・🎉',
      channels: [
        { name: '🎮・mini-games', type: ChannelType.GuildText, topic: '🕹️ Play OwO, Karuta, Dank Memer, Akinator & trivia' },
        { name: '🔢・counting-streak', type: ChannelType.GuildText, topic: '🔢 1, 2, 3... count together, don\'t break the streak!' },
        { name: '💬・truth-or-dare', type: ChannelType.GuildText, topic: '🎯 Truth or Dare party game questions' },
        { name: '🎰・casino-and-bets', type: ChannelType.GuildText, topic: '💰 Virtual clan coin bets, dice rolls & coin flips' },
        { name: '🕹️・Casual Hangout VC', type: ChannelType.GuildVoice },
        { name: '🍿・Watch Party / Stream VC', type: ChannelType.GuildVoice }
      ]
    },

    // 9. STAFF & SECURITY HQ
    {
      name: '🛡️・━━ 🔒 ＬＯＲＤＸ ＳＴＡＦＦ ＨＱ 🔒 ━━・🛡️',
      permissions: [
        { roleName: '👑 ＬＯＲＤＸ ＦＯＵＮＤＥＲ / ＣＥＯ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🛡️ ＬＯＲＤＸ ＨＥＡＤ ＭＡＮＡＧＥＭＥＮＴ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '👔 ＬＯＲＤＸ ＴＥＡＭ ＭＡＮＡＧＥＲ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] },
        { roleName: '🎯 ＬＯＲＤＸ ＨＥＡＤ ＣＯＡＣＨ', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect] }
      ],
      channels: [
        { name: '🔒・staff-war-room', type: ChannelType.GuildText, topic: '🔒 Private leadership decisions, roster signings & planning' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: '🛡️ Automated audit stream & AutoMod safety logs', isModLogChannel: true },
        { name: '🎫・tickets-desk', type: ChannelType.GuildText, topic: '📩 Player support, roster tryouts & sponsorship inquiries', isTicketsChannel: true },
        { name: '🔊・Staff Private Voice VC', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
