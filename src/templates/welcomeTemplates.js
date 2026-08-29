/**
 * Pre-Made High Quality Welcome Message Templates Catalog for Hinata Discord Bot
 */

const welcomeTemplates = [
  {
    id: 'gaming',
    name: '🎮 Gaming & Esports',
    emoji: '🎮',
    category: 'Gaming',
    description: 'Action-packed gaming vibe with squad callouts and level-up theme.',
    title: '🎮 LEVEL UP! Welcome to {server}!',
    color: '#5865F2',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
    message: 
      `Hey {user}, grab your controller and squad up! 🕹️\n` +
      `You just dropped into **{server}** as player **#{count}**.\n\n` +
      `⚔️ **Quick Start Checklist:**\n` +
      `• Read the server guidelines in <#rules>\n` +
      `• Pick your favorite game roles in <#roles>\n` +
      `• Jump into the voice lounge and let's get that victory! 🏆`,
    dmMessage: `Hey {username}! Welcome to **{server}** 🎮! Grab your game roles and squad up with us!`,
    buttons: [
      { label: '📜 Rules', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '🎭 Game Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🎭' }
    ]
  },
  {
    id: 'anime',
    name: '🌸 Anime & Aesthetic',
    emoji: '🌸',
    category: 'Anime',
    description: 'Cute, pastel, cozy Japanese anime aesthetic with Kaomoji.',
    title: '🌸 Konnichiwa! Welcome to {server} ~',
    color: '#FF70A6',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    message:
      `Haii {user} (≧◡≦) ♡\n` +
      `We are so thrilled to welcome you to **{server}**!\n` +
      `You are our lovely **#{count}** community member ✨\n\n` +
      `🍵 **Make yourself at home:**\n` +
      `• Check out our server rules\n` +
      `• Grab your cute aesthetic colors & pronouns in roles\n` +
      `• Say hello in general chat and share your favorite anime! 🍡`,
    dmMessage: `Konnichiwa {username}! Welcome to **{server}** 🌸! We hope you have an amazing time with us (◕‿◕✿)`,
    buttons: [
      { label: '📜 Rules', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '🌸 Aesthetic Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🌸' }
    ]
  },
  {
    id: 'community',
    name: '🌟 Cozy Community Lounge',
    emoji: '🌟',
    category: 'Community',
    description: 'Warm, friendly, coffee-shop hangout greeting for social servers.',
    title: '🌟 Welcome to {server}!',
    color: '#FEE75C',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    message:
      `Welcome home {user}! ☕\n` +
      `You are our **#{count}** friend to join the lounge.\n\n` +
      `✨ **What to do next:**\n` +
      `• Read through our friendly guidelines\n` +
      `• Pick your notification pings & interest roles\n` +
      `• Drop an intro and chat with everyone in general! 👋`,
    dmMessage: `Hey {username}! Welcome to **{server}** 🌟! We're super happy to have you here!`,
    buttons: [
      { label: '📜 Guidelines', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '🎭 Self-Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🎭' }
    ]
  },
  {
    id: 'developer',
    name: '💻 Developer & Tech Terminal',
    emoji: '💻',
    category: 'Developer',
    description: 'Code blocks, syntax highlighting and terminal-style developer greeting.',
    title: '💻 git clone --user {username} | {server}',
    color: '#00D26A',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    message:
      `Hello World, {user}! 🚀\n` +
      `New node connection established. Member ID: **#{count}**\n\n` +
      `\`\`\`js\n` +
      `const member = new Member('{username}');\n` +
      `await member.join('{server}');\n` +
      `console.log('Status 200: Ready to code, build & deploy!');\n` +
      `\`\`\`\n` +
      `📌 **Initialization Steps:**\n` +
      `• Review server code of conduct in <#rules>\n` +
      `• Select your programming language & tech stack roles\n` +
      `• Share your projects in showcase and collaborate! 🛠️`,
    dmMessage: `Welcome to **{server}** {username}! 💻 Grab your tech stack roles and happy coding!`,
    buttons: [
      { label: '📜 Dev Rules', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '⚙️ Tech Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '⚙️' }
    ]
  },
  {
    id: 'cyberpunk',
    name: '⚡ Cyberpunk & Neon Sci-Fi',
    emoji: '⚡',
    category: 'Sci-Fi',
    description: 'Futuristic neural link verification & operative mainframe aesthetic.',
    title: '⚡ NEURAL LINK ESTABLISHED: Welcome to {server}',
    color: '#00F0FF',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80',
    message:
      `Greetings Operative {user}. 🌐\n` +
      `Biometric signature authorized. Identification index: **#{count}**.\n\n` +
      `🔮 **System Directives:**\n` +
      `[01] Decrypt server protocols in <#rules>\n` +
      `[02] Calibrate sensory roles and permissions in <#roles>\n` +
      `[03] Enter the mainframe chat and commence data exchange 📡`,
    dmMessage: `Access Granted, Operative {username}. Welcome to the **{server}** network ⚡`,
    buttons: [
      { label: '📜 Protocols', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '🔮 Cyber Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🔮' }
    ]
  },
  {
    id: 'minimal',
    name: '💎 Minimalist & Modern VIP',
    emoji: '💎',
    category: 'Minimal',
    description: 'Sleek, clean, professional luxury VIP aesthetic.',
    title: '💎 Welcome to {server}',
    color: '#2B2D31',
    banner: null,
    message:
      `We are pleased to welcome you, {user}.\n\n` +
      `• **Member Status:** **#{count}**\n` +
      `• **Community:** **{server}**\n\n` +
      `Please take a moment to review our server guidelines and select your roles below for the optimal experience.`,
    dmMessage: `Welcome to **{server}**, {username}. We are glad to have you with us.`,
    buttons: [
      { label: '📜 Server Rules', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '💎 Get Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '💎' }
    ]
  },
  {
    id: 'study',
    name: '📚 Study & Academic Lounge',
    emoji: '📚',
    category: 'Study',
    description: 'Focus, Pomodoro timer, library & student study community theme.',
    title: '📚 Study Session: Welcome to {server}!',
    color: '#4E9F3D',
    banner: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80',
    message:
      `Welcome to the study lounge, {user}! 🎓\n` +
      `You are student **#{count}** enrolled in our learning community.\n\n` +
      `📖 **Getting Started:**\n` +
      `• Check our academic integrity guidelines\n` +
      `• Grab your subject & study-goal roles\n` +
      `• Join a 24/7 Pomodoro study voice room and let's achieve our goals! ✍️`,
    dmMessage: `Welcome to the study hub **{server}**, {username}! 📚 Let's stay productive together!`,
    buttons: [
      { label: '📜 Campus Rules', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '📚 Subject Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '📚' }
    ]
  },
  {
    id: 'esports',
    name: '🏆 Clan & Competitive Esports',
    emoji: '🏆',
    category: 'Esports',
    description: 'Recruit roster update, scrims and battle-ready team presentation.',
    title: '🏆 ROSTER UPDATE: Welcome {user}!',
    color: '#E02401',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80',
    message:
      `Attention team! New recruit {user} has officially entered **{server}**! 🎯\n` +
      `Total Roster Count: **#{count}**\n\n` +
      `🛡️ **Roster Orders:**\n` +
      `• Review clan rules & scrim etiquette\n` +
      `• Equip your game rank & platform roles\n` +
      `• Join the training grounds and prepare for the next match! ⚔️`,
    dmMessage: `Welcome to the team **{server}**, {username}! 🏆 Check scrim schedules and gear up!`,
    buttons: [
      { label: '📜 Clan Rules', style: 'Primary', customId: 'welcome_rules_btn', emoji: '📜' },
      { label: '🛡️ Team Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🛡️' }
    ]
  }
];

function getAllWelcomeTemplates() {
  return welcomeTemplates;
}

function getWelcomeTemplate(id) {
  return welcomeTemplates.find(t => t.id.toLowerCase() === id.toLowerCase()) || null;
}

module.exports = {
  welcomeTemplates,
  getAllWelcomeTemplates,
  getWelcomeTemplate
};
