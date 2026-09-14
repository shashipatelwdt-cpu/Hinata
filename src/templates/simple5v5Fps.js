const { ChannelType } = require('discord.js');

module.exports = {
  id: 'simple-5v5',
  category: '🎮 Gaming & FPS',
  name: '🎯 WEX • SIMPLE 5v5 FPS & GAMING COMMUNITY',
  description: 'Clean, modern, and minimal 5v5 FPS community template with sleek arrow prefixes, Important, General, Squad Voice, and Level roles.',
  roles: [
    { name: '👑 Team Leader', color: '#FF4655', hoist: true, mentionable: false, isOwnerRole: true },
    { name: '🛡️ Management', color: '#E74C3C', hoist: true, mentionable: false, isAdminRole: true },
    { name: '⚖️ Moderator', color: '#3498DB', hoist: true, mentionable: true, isModRole: true },
    { name: '🎬 Content Creator', color: '#2ECC71', hoist: true, mentionable: false },
    { name: '🎙️ VC Lvl 20', color: '#9B59B6', hoist: true, mentionable: false },
    { name: '💬 Lvl 10', color: '#F1C40F', hoist: true, mentionable: false },
    { name: '🎙️ VC Lvl 10', color: '#E67E22', hoist: true, mentionable: false },
    { name: '🤖 Bots', color: '#7289DA', hoist: true, mentionable: false, isBotRole: true },
    { name: '👥 Community', color: '#95A5A6', hoist: false, mentionable: false, isMemberRole: true }
  ],
  categories: [
    // 1. IMPORTANT
    {
      name: 'Important',
      channels: [
        { name: '☑ ➢server_rules', type: ChannelType.GuildText, topic: '📜 Server rules, regulations, and community guidelines', isRulesChannel: true },
        { name: '📢 ➢socials', type: ChannelType.GuildText, topic: '🔗 Official social media links, twitch, and discord invites' },
        { name: '📢 ➢announcement', type: ChannelType.GuildText, topic: '📢 Official server and community announcements' },
        { name: '📢 ➢game_updates', type: ChannelType.GuildText, topic: '⚡ Game patch notes, meta changes, and tournament news' },
        { name: '📢 ➢server_updates', type: ChannelType.GuildText, topic: '🛠️ Server changes, bot updates, and new features' },
        { name: '📢 ➢youtube', type: ChannelType.GuildText, topic: '🎥 YouTube video releases, highlights, and stream alerts' }
      ]
    },

    // 2. GENERAL
    {
      name: 'General',
      channels: [
        { name: '➢general_chat', type: ChannelType.GuildText, topic: '💬 Main community hangout and casual chat', isWelcomeChannel: true },
        { name: '➢media_share', type: ChannelType.GuildText, topic: '📸 Share your gameplay clips, screenshots, and pictures' },
        { name: '➢memes_zone', type: ChannelType.GuildText, topic: '🤣 Funny memes and viral entertainment' },
        { name: '➢fan_art', type: ChannelType.GuildText, topic: '🎨 Community artwork, digital designs, and creative edits' },
        { name: '➢bot_commands', type: ChannelType.GuildText, topic: '🤖 Bot interactions, mini-games, and music commands' }
      ]
    },

    // 3. VOICE CHANNELS
    {
      name: 'Voice Channels',
      channels: [
        { name: '🔊 ➢lobby_lounge', type: ChannelType.GuildVoice, topic: 'Public voice lounge for casual conversations' },
        { name: '🎮 ➢squad_1 (5)', type: ChannelType.GuildVoice, userLimit: 5, topic: 'Competitive 5-man squad room' },
        { name: '🎮 ➢squad_2 (5)', type: ChannelType.GuildVoice, userLimit: 5, topic: 'Competitive 5-man squad room' },
        { name: '👥 ➢duo_trio (3)', type: ChannelType.GuildVoice, userLimit: 3, topic: 'Duo and trio matchmaking voice' },
        { name: '💤 ➢afk_corner', type: ChannelType.GuildVoice, topic: 'Inactive / AFK voice channel' }
      ]
    },

    // 4. TEAM / STAFF ONLY
    {
      name: '🔒 │ TEAM WEX',
      channels: [
        { name: '🔒 ➢team_chat', type: ChannelType.GuildText, topic: '🔒 Private discussions for team members and staff' },
        { name: '📜 ➢mod_logs', type: ChannelType.GuildText, topic: '🛡️ Automated moderation audit logs and alerts', isModLogChannel: true },
        { name: '🔒 ➢Team Voice', type: ChannelType.GuildVoice, userLimit: 10, topic: 'Private staff & team voice lounge' }
      ]
    }
  ]
};
