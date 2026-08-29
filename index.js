require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Initialize Client with all necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
    Partials.GuildMember
  ]
});

client.commands = new Collection();
const slashCommandsData = [];

// 1. Load Commands recursively
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        slashCommandsData.push(command.data.toJSON());
      } else {
        console.warn(`[WARNING] Command at ${filePath} is missing "data" or "execute" property.`);
      }
    }
  }
}

console.log(`📦 Loaded ${client.commands.size} slash commands.`);

// 2. Load Events
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

console.log(`📡 Loaded ${eventFiles.length} event listeners.`);

// 3. Register Slash Commands automatically when bot logs in
async function registerCommands(token, clientId, guildId) {
  try {
    const rest = new REST({ version: '10' }).setToken(token);
    console.log(`🔄 Auto-syncing ${slashCommandsData.length} application (/) commands...`);

    // Global deployment
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: slashCommandsData }
    );
    console.log(`✅ Deployed ${slashCommandsData.length} global commands.`);

    // Also sync directly to all connected guilds for 0-delay instant updates on client
    for (const g of client.guilds.cache.values()) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, g.id),
        { body: slashCommandsData }
      ).catch(() => null);
    }
    console.log(`⚡ Instant-synced slash commands to ${client.guilds.cache.size} guilds.`);
  } catch (error) {
    console.error('[COMMAND SYNC ERROR]', error);
  }
}

// 4. Global Anti-Crash / Error Handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('\n[ANTI-CRASH] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err, origin) => {
  console.error('\n[ANTI-CRASH] Uncaught Exception:', err, 'origin:', origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('\n[ANTI-CRASH] Uncaught Exception Monitor:', err, 'origin:', origin);
});

// 5. Check Token & Login
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || token === 'your_bot_token_here') {
  console.log('\n' + '='.repeat(60));
  console.log('⚠️  ACTION REQUIRED: DISCORD BOT TOKEN MISSING');
  console.log('='.repeat(60));
  console.log('Please set DISCORD_TOKEN in your environment variables or .env file.');
  console.log('='.repeat(60) + '\n');
} else {
  console.log('🔑 Logging into Discord Gateway...');
  client.login(token)
    .then(async () => {
      console.log(`✅ Successfully logged in as ${client.user?.tag || 'Hinata'}!`);
      if (clientId && clientId !== 'your_client_id_here') {
        await registerCommands(token, clientId, guildId);
      }
    })
    .catch((err) => {
      console.error('[LOGIN ERROR] Failed to login to Discord:', err.message);
    });
}

// 6. Lightweight HTTP health check server (Essential for Render / Koyeb / UptimeRobot 24/7)
const http = require('http');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('🎵 Apex Discord Bot is 24/7 Online and Healthy!');
}).listen(PORT, () => {
  console.log(`🌐 Health check server listening on port ${PORT}`);
});

