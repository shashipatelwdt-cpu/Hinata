require('dotenv').config();
const path = require('path');

// Ensure FFmpeg is registered in PATH & FFMPEG_PATH for Discord voice audio decoding
try {
  const ffmpegStatic = require('ffmpeg-static');
  if (ffmpegStatic) {
    process.env.FFMPEG_PATH = ffmpegStatic;
    const ffmpegDir = path.dirname(ffmpegStatic);
    process.env.PATH = `${ffmpegDir}${path.delimiter}${process.env.PATH}`;
  }
} catch (e) {
  console.warn('[FFMPEG INIT WARNING]:', e.message);
}

const { Client, GatewayIntentBits, Partials, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
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

    // Global deployment (Standard Discord practice)
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: slashCommandsData }
    );
    console.log(`✅ Deployed ${slashCommandsData.length} global commands.`);

    // Clear any legacy guild-specific commands to prevent 2x duplicate command listings in Discord
    for (const g of client.guilds.cache.values()) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, g.id),
        { body: [] }
      ).catch(() => null);
    }
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
const rawToken = process.env.DISCORD_TOKEN;
const token = rawToken ? rawToken.trim().replace(/^["']|["']$/g, '') : null;
const rawClientId = process.env.CLIENT_ID;
const clientId = rawClientId ? rawClientId.trim().replace(/^["']|["']$/g, '') : null;
const rawGuildId = process.env.GUILD_ID;
const guildId = rawGuildId ? rawGuildId.trim().replace(/^["']|["']$/g, '') : null;

let lastBotError = null;

client.on('debug', (info) => {
  if (info.includes('Heartbeat') || info.includes('latency') || info.includes('Preparing keys')) return;
  console.log('[DJS DEBUG]', info);
});

client.on('warn', (info) => {
  console.warn('[DJS WARN]', info);
});

client.on('error', (err) => {
  lastBotError = err.message || String(err);
  console.error('[DJS ERROR]', err);
});

client.on('shardError', (err, shardId) => {
  lastBotError = `Shard ${shardId}: ${err.message || String(err)}`;
  console.error(`[SHARD ${shardId} ERROR]`, err);
});

client.on('shardDisconnect', (event, shardId) => {
  console.warn(`[SHARD ${shardId} DISCONNECT] Code: ${event.code}, reason: ${event.reason}`);
});

client.on('shardReconnecting', (shardId) => {
  console.log(`[SHARD ${shardId} RECONNECTING] Re-establishing connection...`);
});

if (!token || token === 'your_bot_token_here') {
  lastBotError = 'DISCORD_TOKEN is missing or set to placeholder in environment variables.';
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
      lastBotError = null;
      if (clientId && clientId !== 'your_client_id_here') {
        await registerCommands(token, clientId, guildId);
      }
    })
    .catch((err) => {
      lastBotError = err.message || String(err);
      console.error('[LOGIN ERROR] Failed to login to Discord:', err.message);
    });
}

// 6. Detailed HTTP Health & Diagnostic Server (Essential for Render / Koyeb / UptimeRobot 24/7)
const http = require('http');
const PORT = process.env.PORT || 3000;
const WS_STATE_NAMES = ['READY', 'CONNECTING', 'RECONNECTING', 'IDLE', 'NEARLY', 'DISCONNECTED', 'WAITING_FOR_GUILDS', 'IDENTIFYING', 'RESUMING'];

http.createServer((req, res) => {
  const currentWsState = WS_STATE_NAMES[client.ws?.status] || String(client.ws?.status || 'UNKNOWN');
  const isOnline = client.isReady();

  // If JSON requested or path is /status or /json or /health
  if (req.url === '/status' || req.url === '/json' || req.url === '/health' || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      bot: client.user?.tag || 'Hinata',
      online: isOnline,
      wsStatus: currentWsState,
      guildsCount: client.guilds?.cache?.size || 0,
      tokenConfigured: Boolean(token && token !== 'your_bot_token_here'),
      tokenLength: token ? token.length : 0,
      tokenPrefix: token ? `${token.substring(0, 6)}...` : 'NONE',
      clientIdConfigured: Boolean(clientId && clientId !== 'your_client_id_here'),
      lastError: lastBotError,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  // Default plaintext response for UptimeRobot / browsers
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(
    isOnline
      ? `🟢 Hinata Discord Bot is 24/7 ONLINE as ${client.user.tag} (${client.guilds.cache.size} servers)`
      : `🟡 Hinata Bot Web Service Running (Gateway: ${currentWsState}${lastBotError ? ` | Error: ${lastBotError}` : ''}${!token ? ' | TOKEN MISSING' : ''})`
  );
}).listen(PORT, () => {
  console.log(`🌐 Health check server listening on port ${PORT}`);
});

