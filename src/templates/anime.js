const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'anime',
  name: '🎨 Anime & Art Lounge',
  description: 'Aesthetic theme for anime lovers, manga readers, digital artists, and creative souls.',
  roles: [
    { name: '👑 Sensei (Owner)', color: '#FF7675', hoist: true, mentionable: false },
    { name: '🛡️ Senpai (Mod)', color: '#FD79A8', hoist: true, mentionable: true },
    { name: '🎨 Master Artist', color: '#A29BFE', hoist: true, mentionable: false },
    { name: '🍿 Anime Weeb', color: '#FFEAA7', hoist: true, mentionable: false },
    { name: '📚 Manga Reader', color: '#55EFC4', hoist: false, mentionable: false },
    { name: '🤖 Bot-chan', color: '#DFE6E9', hoist: true, mentionable: false },
    { name: '🌸 Otaku', color: '#FAB1A0', hoist: false, mentionable: false }
  ],
  categories: [
    {
      name: '🌸 ━━ INFORMATION ━━',
      channels: [
        { name: '📜・rules', type: ChannelType.GuildText, topic: 'Anime community guidelines' },
        { name: '📢・announcements', type: ChannelType.GuildText, topic: 'Server news & seasonal anime releases' },
        { name: '🎭・waifu-husbando-roles', type: ChannelType.GuildText, topic: 'Pick your anime roles' }
      ]
    },
    {
      name: '💬 ━━ GENERAL & CHAT ━━',
      channels: [
        { name: '🌸・sakura-lounge', type: ChannelType.GuildText, topic: 'General chill conversations' },
        { name: '🍿・anime-discussion', type: ChannelType.GuildText, topic: 'Weekly episodes & seasonal anime thoughts' },
        { name: '⚠️・spoilers-talk', type: ChannelType.GuildText, topic: 'Manga / anime leaks & spoiler discussions' },
        { name: '📚・manga-and-webtoons', type: ChannelType.GuildText, topic: 'Manga, Manhwa, Light Novels' },
        { name: '🐸・anime-memes', type: ChannelType.GuildText, topic: 'Wholesome & funny anime memes' }
      ]
    },
    {
      name: '🎨 ━━ ART & CREATIVE ━━',
      channels: [
        { name: '🎨・art-showcase', type: ChannelType.GuildText, topic: 'Post your original artwork & fanart' },
        { name: '💡・feedback-and-tips', type: ChannelType.GuildText, topic: 'Ask for art advice and critiques' },
        { name: '📸・cosplay-and-merch', type: ChannelType.GuildText, topic: 'Show off your figures, posters, and cosplay' }
      ]
    },
    {
      name: '🔊 ━━ VOICE CHILL ━━',
      channels: [
        { name: '🌸・Ramen Lounge', type: ChannelType.GuildVoice },
        { name: '🍿・Anime Watch Party', type: ChannelType.GuildVoice },
        { name: '🎨・Drawing Together Stream', type: ChannelType.GuildVoice },
        { name: '🎵・J-Pop & Lofi Chill', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🛡️ ━━ STAFF & MODERATION ━━',
      permissions: [
        { roleName: '👑 Sensei (Owner)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '🛡️ Senpai (Mod)', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・staff-hq', type: ChannelType.GuildText, topic: 'Staff private discussion & command hub' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: 'Automated moderation logs stream' },
        { name: '🔊・Staff Voice', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
