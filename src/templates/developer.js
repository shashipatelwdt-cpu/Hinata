const { ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'developer',
  name: '💻 Developer & Tech Community',
  description: 'Professional layout for software developers, open-source projects, coders, and engineers.',
  roles: [
    { name: '🚀 Project Lead', color: '#E74C3C', hoist: true, mentionable: false },
    { name: '🛠️ Core Maintainer', color: '#E67E22', hoist: true, mentionable: true },
    { name: '💻 Senior Dev', color: '#9B59B6', hoist: true, mentionable: true },
    { name: '✨ Contributor', color: '#3498DB', hoist: true, mentionable: false },
    { name: '🐍 Pythonist', color: '#3572A5', hoist: false, mentionable: false },
    { name: '⚡ JS/TS Dev', color: '#F7DF1E', hoist: false, mentionable: false },
    { name: '🦀 Rustacean', color: '#DEA584', hoist: false, mentionable: false },
    { name: '🤖 Bot', color: '#95A5A6', hoist: true, mentionable: false },
    { name: '👥 Member', color: '#BDC3C7', hoist: false, mentionable: false }
  ],
  categories: [
    {
      name: '📌 ━━ INFORMATION ━━',
      channels: [
        { name: '📜・guidelines', type: ChannelType.GuildText, topic: 'Code of conduct & server rules' },
        { name: '📢・announcements', type: ChannelType.GuildText, topic: 'Tech news & project releases' },
        { name: '🐙・github-feed', type: ChannelType.GuildText, topic: 'GitHub commits, PRs, and releases' },
        { name: '🎭・tech-roles', type: ChannelType.GuildText, topic: 'Select your tech stack and language roles' }
      ]
    },
    {
      name: '💬 ━━ GENERAL ━━',
      channels: [
        { name: '💬・general-dev', type: ChannelType.GuildText, topic: 'General tech discussion and chill' },
        { name: '✨・showcase-projects', type: ChannelType.GuildText, topic: 'Show off what you have built!' },
        { name: '💼・jobs-and-freelance', type: ChannelType.GuildText, topic: 'Job postings, hiring, and freelance' },
        { name: '📚・resources-and-tools', type: ChannelType.GuildText, topic: 'Awesome libraries, blogs, and tutorials' }
      ]
    },
    {
      name: '💻 ━━ CODE & HELP ━━',
      channels: [
        { name: '🌐・web-frontend', type: ChannelType.GuildText, topic: 'React, Vue, HTML/CSS, Tailwind' },
        { name: '⚙️・backend-and-apis', type: ChannelType.GuildText, topic: 'Node, Python, Go, Rust, Databases' },
        { name: '🤖・ai-and-ml', type: ChannelType.GuildText, topic: 'LLMs, PyTorch, TensorFlow, Computer Vision' },
        { name: '📱・mobile-dev', type: ChannelType.GuildText, topic: 'Flutter, React Native, Swift, Kotlin' },
        { name: '🆘・debugging-help', type: ChannelType.GuildText, topic: 'Ask coding questions and paste error snippets' }
      ]
    },
    {
      name: '🔊 ━━ PAIR CODING VOICE ━━',
      channels: [
        { name: '🎧・Pair Programming 1', type: ChannelType.GuildVoice, userLimit: 3 },
        { name: '🎧・Pair Programming 2', type: ChannelType.GuildVoice, userLimit: 3 },
        { name: '💻・Tech Talk Lounge', type: ChannelType.GuildVoice },
        { name: '🤫・Silent Focus Room', type: ChannelType.GuildVoice }
      ]
    },
    {
      name: '🔒 ━━ MAINTAINER HQ ━━',
      permissions: [
        { roleName: '🚀 Project Lead', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        { roleName: '🛠️ Core Maintainer', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ],
      channels: [
        { name: '🔒・maintainers-chat', type: ChannelType.GuildText, topic: 'Internal team planning' },
        { name: '📜・mod-logs', type: ChannelType.GuildText, topic: 'Audit log' },
        { name: '🔊・Lead Sync Voice', type: ChannelType.GuildVoice }
      ]
    }
  ]
};
