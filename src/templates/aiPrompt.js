/**
 * AI Prompt Generator for ChatGPT / Gemini / Claude
 * Generates copy-ready prompts that instruct AI models to output
 * valid JSON / Markdown server blueprints for Hinata bot.
 */

class AIPromptGenerator {
  /**
   * Generate a prompt for ChatGPT to create a custom server blueprint
   * @param {string} theme - The theme or purpose of the server (e.g. 'Gym & Fitness', 'Bakery Cafe', 'FiveM Roleplay')
   * @returns {string} Ready-to-copy AI prompt
   */
  static generatePrompt(theme = 'Gaming and Community') {
    return `Create a complete, professional Discord server template blueprint for a "${theme}" server.

Please format your response strictly as valid JSON inside a \`\`\`json codeblock with the following structure:

\`\`\`json
{
  "name": "${theme} Community HQ",
  "description": "Professional server layout for ${theme}",
  "roles": [
    { "name": "👑 Server Owner", "color": "#FFD700", "hoist": true, "isOwnerRole": true },
    { "name": "🛡️ Head Admin", "color": "#E74C3C", "hoist": true, "isAdminRole": true },
    { "name": "⚔️ Moderator", "color": "#3498DB", "hoist": true },
    { "name": "💎 VIP", "color": "#9B59B6", "hoist": true },
    { "name": "🤖 Bot", "color": "#7289DA", "hoist": true, "isBotRole": true },
    { "name": "👥 Member", "color": "#99AAB5", "hoist": false }
  ],
  "categories": [
    {
      "name": "📢 ━━ INFORMATION ━━",
      "channels": [
        { "name": "📜・rules", "type": "text", "topic": "Server rules & guidelines" },
        { "name": "📢・announcements", "type": "text", "topic": "Important server updates" },
        { "name": "🎭・roles", "type": "text", "topic": "Self-role selection" }
      ]
    },
    {
      "name": "💬 ━━ GENERAL LOUNGE ━━",
      "channels": [
        { "name": "👋・welcome", "type": "text", "isWelcomeChannel": true },
        { "name": "💬・general-chat", "type": "text", "topic": "Main hangout channel" },
        { "name": "📸・media-share", "type": "text", "topic": "Photos, clips and links" },
        { "name": "🤖・bot-commands", "type": "text", "topic": "Use bot commands here" }
      ]
    },
    {
      "name": "🔊 ━━ VOICE CHAT ━━",
      "channels": [
        { "name": "🔊・General Voice", "type": "voice" },
        { "name": "🎮・Duo Room (2)", "type": "voice", "userLimit": 2 },
        { "name": "🎮・Squad Room (5)", "type": "voice", "userLimit": 5 },
        { "name": "💤・AFK Lounge", "type": "voice" }
      ]
    },
    {
      "name": "🛡️ ━━ STAFF HQ ━━",
      "channels": [
        { "name": "🔒・staff-chat", "type": "text", "topic": "Staff discussion" },
        { "name": "📜・mod-logs", "type": "text", "isModLogChannel": true }
      ]
    }
  ]
}
\`\`\`

Requirements:
1. Make sure channel names look clean and aesthetic (using emojis like 💬・chat, 📢・announcements).
2. Include at least 4-6 custom roles with HEX color codes (#HEX).
3. Include at least 3-5 categories with relevant text & voice channels.
4. Mark one welcome channel with \`"isWelcomeChannel": true\` and one mod log channel with \`"isModLogChannel": true\`.`;
  }

  /**
   * Quick example JSON template
   */
  static getSampleJson() {
    return JSON.stringify({
      name: "🚀 Cyberpunk Gaming Lounge",
      description: "Neon aesthetic server for squads, tournaments and chill voice rooms.",
      roles: [
        { name: "👑 Cyber Overlord", color: "#00FFFF", hoist: true, isOwnerRole: true },
        { name: "🛡️ Netrunner Admin", color: "#FF007F", hoist: true, isAdminRole: true },
        { name: "⚔️ Neon Mod", color: "#FFE600", hoist: true },
        { name: "💎 Cyber VIP", color: "#9B59B6", hoist: true },
        { name: "🤖 Bot-AI", color: "#7289DA", hoist: true, isBotRole: true },
        { name: "👥 Street Runner", color: "#A0A0A0", hoist: false }
      ],
      categories: [
        {
          name: "⚡ ━━ MAINFRAME ━━",
          channels: [
            { name: "📜・rules", type: "text", topic: "Community protocols" },
            { name: "📢・cyber-news", type: "text", topic: "Server updates" },
            { name: "🎭・select-roles", type: "text", topic: "Pick your cyber roles" }
          ]
        },
        {
          name: "💬 ━━ NEON DISTRICT ━━",
          channels: [
            { name: "👋・arrival-pad", type: "text", isWelcomeChannel: true },
            { name: "💬・cyber-lounge", type: "text", topic: "Main chat area" },
            { name: "📸・holo-clips", type: "text", topic: "Gaming media and clips" },
            { name: "🤖・ai-terminal", type: "text", topic: "Bot commands" }
          ]
        },
        {
          name: "🔊 ━━ AUDIO MATRIX ━━",
          channels: [
            { name: "🔊・Cyber Lounge Voice", type: "voice" },
            { name: "🎮・Duo Netrunners (2)", type: "voice", userLimit: 2 },
            { name: "🎮・Squad Matrix (5)", type: "voice", userLimit: 5 },
            { name: "💤・Cryo Sleep (AFK)", type: "voice" }
          ]
        },
        {
          name: "🛡️ ━━ SECURITY HQ ━━",
          channels: [
            { name: "🔒・security-chat", type: "text" },
            { name: "📜・audit-logs", type: "text", isModLogChannel: true }
          ]
        }
      ]
    }, null, 2);
  }
}

module.exports = AIPromptGenerator;
