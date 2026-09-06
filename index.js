// Force IPv4-first DNS resolution (Essential for Render/Cloud hosts where IPv6 route tables drop packets)
const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();
const path = require('path');
const fs = require('fs');
const http = require('http');

// In-Memory Ring Log Buffer (Preserves the last 200 system/gateway events for live inspection via /logs)
const LOG_BUFFER_LIMIT = 200;
const botLogs = [];

function recordLog(level, ...args) {
  const timestamp = new Date().toISOString().substring(11, 19);
  const text = args.map(arg => {
    if (typeof arg === 'string') return arg;
    try { return JSON.stringify(arg); } catch { return String(arg); }
  }).join(' ');
  const entry = `[${timestamp}] [${level.toUpperCase()}] ${text}`;
  botLogs.push(entry);
  if (botLogs.length > LOG_BUFFER_LIMIT) botLogs.shift();
}

const origLog = console.log;
const origWarn = console.warn;
const origError = console.error;

console.log = function(...args) { recordLog('INFO', ...args); origLog.apply(console, args); };
console.warn = function(...args) { recordLog('WARN', ...args); origWarn.apply(console, args); };
console.error = function(...args) { recordLog('ERROR', ...args); origError.apply(console, args); };

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
const config = require('./config.json');

// Initialize Client with all necessary intents and REST timeouts
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
  ],
  rest: {
    timeout: 20000,
    retries: 3
  }
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
    console.error('[COMMAND SYNC ERROR]', error.message || error);
  }
}

// 4. Global Anti-Crash / Error Handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('[ANTI-CRASH] Unhandled Rejection:', reason?.message || reason);
});

process.on('uncaughtException', (err, origin) => {
  console.error('[ANTI-CRASH] Uncaught Exception:', err?.message || err, 'origin:', origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.error('[ANTI-CRASH] Uncaught Exception Monitor:', err?.message || err);
});

// 5. Client & Gateway Monitoring
let lastBotError = null;
let lastDiagnostics = null;
let isConnecting = false;
let reconnectTimeout = null;

client.rest.on('rateLimited', (info) => {
  console.warn(`[DJS REST RATELIMIT] Route: ${info.route || info.url} | retryAfter: ${info.retryAfter}ms | global: ${info.global}`);
});

client.rest.on('invalidRequestWarning', (info) => {
  console.warn(`[DJS REST INVALID WARNING] Count: ${info.count} | remaining: ${info.remainingTime}ms`);
});

client.rest.on('response', (request, response) => {
  // Ignore routine 404 Not Found (e.g. deleted channels / missing stats channels)
  if (response.status >= 400 && response.status !== 404) {
    console.warn(`[DJS REST ERROR ${response.status}] ${request.method} ${request.route}`);
  }
});

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
  console.warn(`[SHARD ${shardId} DISCONNECT] Code: ${event.code}, reason: ${event.reason || 'None'}`);
  scheduleReconnect(10000);
});

client.on('shardReconnecting', (shardId) => {
  console.log(`[SHARD ${shardId} RECONNECTING] Re-establishing connection...`);
});

// 6. Network & Discord API Diagnostic Suite
async function runDiagnostics(currentToken) {
  const results = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    outboundIp: 'unknown',
    dns: {},
    discordApiUsersMe: 'untested',
    discordGatewayBot: 'untested',
    tokenSanity: {
      configured: Boolean(currentToken && currentToken !== 'your_bot_token_here'),
      length: currentToken ? currentToken.length : 0,
      prefix: currentToken ? `${currentToken.substring(0, 6)}...` : 'NONE',
      suffix: currentToken && currentToken.length > 8 ? `...${currentToken.slice(-4)}` : 'NONE'
    }
  };

  // 1. IP check
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      results.outboundIp = data.ip;
    } else {
      results.outboundIp = `HTTP ${res.status}`;
    }
  } catch (e) {
    results.outboundIp = `Error: ${e.message}`;
  }

  // 2. DNS resolution check
  try {
    const d1 = await dns.promises.lookup('discord.com');
    results.dns['discord.com'] = d1.address;
  } catch (e) {
    results.dns['discord.com'] = `Failed: ${e.message}`;
  }

  try {
    const d2 = await dns.promises.lookup('gateway.discord.gg');
    results.dns['gateway.discord.gg'] = d2.address;
  } catch (e) {
    results.dns['gateway.discord.gg'] = `Failed: ${e.message}`;
  }

  // 3. Direct Discord REST API check
  if (results.tokenSanity.configured) {
    try {
      const res = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bot ${currentToken}` },
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        const user = await res.json();
        results.discordApiUsersMe = { status: 200, botUser: `${user.username}#${user.discriminator || '0'}`, id: user.id };
      } else {
        const text = await res.text().catch(() => '');
        results.discordApiUsersMe = { status: res.status, body: text.substring(0, 150) };
      }
    } catch (e) {
      results.discordApiUsersMe = { error: e.message };
    }

    try {
      const res = await fetch('https://discord.com/api/v10/gateway/bot', {
        headers: { Authorization: `Bot ${currentToken}` },
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        const gw = await res.json();
        results.discordGatewayBot = { status: 200, url: gw.url, shards: gw.shards, sessionLimit: gw.session_start_limit };
      } else {
        const text = await res.text().catch(() => '');
        results.discordGatewayBot = { status: res.status, body: text.substring(0, 150) };
      }
    } catch (e) {
      results.discordGatewayBot = { error: e.message };
    }
  }

  return results;
}

// 7. Resilient Connection Manager with Timeout & Exponential Backoff
const rawToken = process.env.DISCORD_TOKEN;
const token = rawToken ? rawToken.trim().replace(/^["']|["']$/g, '') : null;
const rawClientId = process.env.CLIENT_ID;
const clientId = rawClientId ? rawClientId.trim().replace(/^["']|["']$/g, '') : null;
const rawGuildId = process.env.GUILD_ID;
const guildId = rawGuildId ? rawGuildId.trim().replace(/^["']|["']$/g, '') : null;

function scheduleReconnect(delayMs = 15000) {
  if (reconnectTimeout) return;
  console.log(`⏱️ Scheduling bot reconnect attempt in ${Math.round(delayMs / 1000)}s...`);
  reconnectTimeout = setTimeout(() => {
    reconnectTimeout = null;
    connectBot();
  }, delayMs);
}

async function connectBot(force = false) {
  if (isConnecting) return;
  if (!force && client.isReady()) {
    console.log('Bot is already connected & ready.');
    return;
  }

  if (!token || token === 'your_bot_token_here') {
    lastBotError = 'DISCORD_TOKEN is missing or set to placeholder in environment variables.';
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  ACTION REQUIRED: DISCORD BOT TOKEN MISSING');
    console.log('='.repeat(60));
    console.log('Please set DISCORD_TOKEN in your environment variables or .env file.');
    console.log('='.repeat(60) + '\n');
    return;
  }

  isConnecting = true;
  console.log('🔍 Running Discord pre-flight diagnostic check...');
  try {
    lastDiagnostics = await runDiagnostics(token);
    console.log(`[PRE-FLIGHT] Outbound IP: ${lastDiagnostics.outboundIp} | DNS: ${JSON.stringify(lastDiagnostics.dns)}`);
    console.log(`[PRE-FLIGHT] Discord @me: ${JSON.stringify(lastDiagnostics.discordApiUsersMe)}`);
    console.log(`[PRE-FLIGHT] Gateway Bot: ${JSON.stringify(lastDiagnostics.discordGatewayBot)}`);
  } catch (err) {
    console.warn('[PRE-FLIGHT WARNING]', err.message);
  }

  console.log('🔑 Logging into Discord Gateway (with 30s timeout safeguard)...');

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Gateway connection timed out after 30 seconds (Network dropped or rate-limited)'));
    }, 30000);
  });

  try {
    await Promise.race([client.login(token), timeoutPromise]);
    console.log(`✅ Successfully logged in as ${client.user?.tag || 'Hinata'}!`);
    lastBotError = null;
    isConnecting = false;

    if (clientId && clientId !== 'your_client_id_here') {
      await registerCommands(token, clientId, guildId);
    }
  } catch (err) {
    isConnecting = false;
    lastBotError = err.message || String(err);
    console.error('[LOGIN FAILURE]', err.message);

    // Clean up client state and schedule retry
    try {
      await client.destroy().catch(() => null);
    } catch {}

    scheduleReconnect(15000);
  }
}

// Start bot connection
connectBot();

// 8. Detailed HTTP Health, Diagnostic & Web Monitoring Server
const PORT = process.env.PORT || 3000;
const WS_STATE_NAMES = ['READY', 'CONNECTING', 'RECONNECTING', 'IDLE', 'NEARLY', 'DISCONNECTED', 'WAITING_FOR_GUILDS', 'IDENTIFYING', 'RESUMING'];

http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;
  const currentWsState = WS_STATE_NAMES[client.ws?.status] || String(client.ws?.status || 'UNKNOWN');
  const isOnline = client.isReady();

  // 1. Live logs stream: /logs or /logs.txt
  if (pathname === '/logs' || pathname === '/logs.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(botLogs.join('\n') || 'No logs captured yet.');
  }

  // 2. Active network probe: /diag or /test
  if (pathname === '/diag' || pathname === '/test') {
    const liveDiag = await runDiagnostics(token);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      online: isOnline,
      wsStatus: currentWsState,
      diagnostic: liveDiag
    }, null, 2));
  }

  // 3. Force reconnect trigger: /reconnect
  if (pathname === '/reconnect') {
    connectBot(true);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      message: 'Reconnection triggered',
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  // 4. Structured JSON status: /status, /json, /health
  if (pathname === '/status' || pathname === '/json' || pathname === '/health' || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({
      bot: client.user?.tag || 'Hinata',
      online: isOnline,
      wsStatus: currentWsState,
      guildsCount: client.guilds?.cache?.size || 0,
      tokenConfigured: Boolean(token && token !== 'your_bot_token_here'),
      tokenLength: token ? token.length : 0,
      tokenPrefix: token ? `${token.substring(0, 6)}...` : 'NONE',
      tokenSuffix: token && token.length > 8 ? `...${token.slice(-4)}` : 'NONE',
      clientIdConfigured: Boolean(clientId && clientId !== 'your_client_id_here'),
      lastError: lastBotError,
      lastDiagnostics: lastDiagnostics,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  // 5. Default visual health dashboard
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hinata Bot Status</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; margin: 0; }
    .card { max-width: 650px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 13px; letter-spacing: 0.5px; }
    .online { background: #059669; color: #fff; }
    .offline { background: #d97706; color: #fff; }
    h1 { margin: 16px 0 8px; font-size: 24px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #334155; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #94a3b8; }
    .value { font-weight: 500; }
    .links { margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap; }
    .links a { padding: 8px 16px; background: #0284c7; color: #fff; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
    .links a:hover { background: #0369a1; }
    .err-box { margin-top: 16px; padding: 12px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 8px; color: #fca5a5; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge ${isOnline ? 'online' : 'offline'}">${isOnline ? 'ONLINE 24/7' : currentWsState}</span>
    <h1>Hinata Discord Bot</h1>
    <div class="row"><span class="label">Gateway Status</span><span class="value">${isOnline ? '🟢 Connected' : '🟡 ' + currentWsState}</span></div>
    <div class="row"><span class="label">Bot Identity</span><span class="value">${client.user?.tag || 'Hinata#1530'}</span></div>
    <div class="row"><span class="label">Connected Servers</span><span class="value">${client.guilds?.cache?.size || 0}</span></div>
    <div class="row"><span class="label">Process Uptime</span><span class="value">${Math.floor(process.uptime())}s</span></div>
    <div class="row"><span class="label">Outbound Container IP</span><span class="value">${lastDiagnostics?.outboundIp || 'Checking...'}</span></div>
    ${lastBotError ? `<div class="err-box">⚠️ <strong>Error:</strong> ${lastBotError}</div>` : ''}
    <div class="links">
      <a href="/status">JSON Status</a>
      <a href="/logs">Live Logs</a>
      <a href="/diag">Run Diagnostics</a>
      <a href="/reconnect">Force Reconnect</a>
    </div>
  </div>
</body>
</html>`);
}).listen(PORT, () => {
  console.log(`🌐 Health check server listening on port ${PORT}`);

  // 9. Automated 24/7 Keep-Alive Self-Pinger for Render (keeps free tier container awake)
  const keepAliveUrl = process.env.RENDER_EXTERNAL_URL || process.env.KEEP_ALIVE_URL;
  if (keepAliveUrl) {
    const PING_INTERVAL = 8 * 60 * 1000; // 8 minutes (Render sleeps after 15m)
    console.log(`⏱️ [24/7 KEEP-ALIVE] Auto-pinger enabled for: ${keepAliveUrl} (Every 8m)`);
    setInterval(() => {
      try {
        const urlToPing = keepAliveUrl.endsWith('/') ? `${keepAliveUrl}status` : `${keepAliveUrl}/status`;
        const clientLib = urlToPing.startsWith('https') ? require('https') : require('http');
        clientLib.get(urlToPing, (res) => {
          console.log(`[KEEP-ALIVE] Ping sent -> ${res.statusCode} at ${new Date().toISOString().substring(11, 19)}`);
        }).on('error', (err) => {
          console.warn(`[KEEP-ALIVE WARNING] Ping failed:`, err.message);
        });
      } catch (err) {
        console.warn(`[KEEP-ALIVE ERROR]:`, err.message);
      }
    }, PING_INTERVAL);
  }
});

