const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'study',
  name: '📚 Study & Academic Server',
  description: 'Structured layout for study groups, students, school/university clubs, and productive focus sessions.',
  roles: [
    { name: '🎓 Professor / Head', color: '#1B4F72', hoist: true, mentionable: false },
    { name: '🧑‍🏫 Tutor / Mentor', color: '#117A65', hoist: true, mentionable: true },
    { name: '🌟 Top Scholar', color: '#D4AC0D', hoist: true, mentionable: false },
    { name: '📐 STEM Student', color: '#884EA0', hoist: false, mentionable: false },
    { name: '📖 Humanities', color: '#AF601A', hoist: false, mentionable: false },
    { name: '🤖 Study Bot', color: '#7F8C8D', hoist: true, mentionable: false },
    { name: '📚 Student', color: '#5D6D7E', hoist: false, mentionable: false }
  ],
  categories: [
    {
      name: '🏛️ ━━ STUDY HALL INFO ━━',
      channels: [
        { name: '📜・study-rules', type: ChannelType.GuildText, topic: 'Study guidelines & respect' },
        { name: '📢・announcements', type: ChannelType.GuildText, topic: 'Exams, schedules & deadlines' },
        { name: '🎯・daily-goals', type: ChannelType.GuildText, topic: 'Share your daily study goals and checklist' },
        { name: '🎭・subject-roles', type: ChannelType.GuildText, topic: 'Pick your major/subjects' }
      ]
    },
    {
      name: '📖 ━━ SUBJECT CHANNELS ━━',
      channels: [
        { name: '📐・math-and-physics', type: ChannelType.GuildText, topic: 'Math, Calculus, Physics help' },
        { name: '🔬・chemistry-and-bio', type: ChannelType.GuildText, topic: 'Chemistry and Biology discussions' },
        { name: '💻・computer-science', type: ChannelType.GuildText, topic: 'CS, algorithms and coding doubts' },
        { name: '📚・literature-and-history', type: ChannelType.GuildText, topic: 'Essays, history and language learning' },
        { name: '📁・notes-and-resources', type: ChannelType.GuildText, topic: 'Share PDF notes, flashcards, cheatsheets' }
      ]
    },
    {
      name: '☕ ━━ BREAK LOUNGE ━━',
      channels: [
        { name: '💬・break-chat', type: ChannelType.GuildText, topic: 'Relax and chat during breaks' },
        { name: '🎵・lofi-beats', type: ChannelType.GuildText, topic: 'Chill and study music recommendations' }
      ]
    },
    {
      name: '🎧 ━━ FOCUS VOICE ROOMS ━━',
      channels: [
        { name: '🤫・Silent Study 1 (Muted)', type: ChannelType.GuildVoice },
        { name: '🤫・Silent Study 2 (Muted)', type: ChannelType.GuildVoice },
        { name: '🍅・Pomodoro Focus Room', type: ChannelType.GuildVoice },
        { name: '🤝・Group Discussion Voice', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🛡️ ━━ STAFF & MODERATION ━━',
      permissions: [
        { roleName: '🎓 Professor / Head', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '🧑‍🏫 Tutor / Mentor', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・staff-room', type: ChannelType.GuildText, topic: 'Faculty and tutor coordination' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: 'Automated moderation logs' },
        { name: '🔊・Staff Meeting', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
