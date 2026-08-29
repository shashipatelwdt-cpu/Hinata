const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'esports',
  name: '🛡️ Clan / Guild / Esports Team',
  description: 'Tactical layout for competitive gaming clans, roster management, tournaments, and scrims.',
  roles: [
    { name: '👑 Clan Leader / CEO', color: '#C0392B', hoist: true, mentionable: false },
    { name: '👔 Team Manager', color: '#8E44AD', hoist: true, mentionable: true },
    { name: '🎯 Head Coach', color: '#2980B9', hoist: true, mentionable: true },
    { name: '⭐ Main Roster', color: '#27AE60', hoist: true, mentionable: true },
    { name: '🔄 Substitute / Academy', color: '#F39C12', hoist: true, mentionable: false },
    { name: '📢 Clan Member', color: '#BDC3C7', hoist: false, mentionable: false }
  ],
  categories: [
    {
      name: '📢 ━━ HEADQUARTERS ━━',
      channels: [
        { name: '📜・clan-rules', type: ChannelType.GuildText, topic: 'Clan expectations & guidelines' },
        { name: '📢・announcements', type: ChannelType.GuildText, topic: 'Tournaments and official news' },
        { name: '🏆・achievements', type: ChannelType.GuildText, topic: 'Trophies and tournament victories' },
        { name: '📅・match-schedules', type: ChannelType.GuildText, topic: 'Upcoming match dates and times' }
      ]
    },
    {
      name: '💬 ━━ CLAN CHAT ━━',
      channels: [
        { name: '💬・general-lounge', type: ChannelType.GuildText, topic: 'General conversation' },
        { name: '🎯・scrim-results', type: ChannelType.GuildText, topic: 'Post practice match results & stats' },
        { name: '🧠・strats-and-lineups', type: ChannelType.GuildText, topic: 'Map tactics, utility, game plans' }
      ]
    },
    {
      name: '🔒 ━━ ROSTER & COACH HQ ━━',
      permissions: [
        { roleName: '👑 Clan Leader / CEO', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '👔 Team Manager', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '🎯 Head Coach', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '⭐ Main Roster', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・roster-private', type: ChannelType.GuildText, topic: 'Exclusive team discussions' },
        { name: '📊・vod-reviews', type: ChannelType.GuildText, topic: 'VOD analysis and coaching notes' },
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
    }
  ]
};
