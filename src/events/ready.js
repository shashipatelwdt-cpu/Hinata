const { ActivityType, Events } = require('discord.js');
const ServerStats = require('../utils/serverStats');
const InviteTracker = require('../utils/inviteTracker');
const UpdateAnnouncer = require('../utils/updateAnnouncer');
const config = require('../../config.json');

module.exports = {
  name: Events.ClientReady || 'clientReady',
  once: true,
  async execute(client) {
    // Start Live Server Stats auto-scheduler
    ServerStats.startStatsScheduler(client);

    // Initialize Invite Tracker Cache
    InviteTracker.init(client).catch(err => console.error('[INVITE TRACKER INIT ERROR]', err));

    // Send Automatic Update / Deployment announcement to designated channel
    UpdateAnnouncer.checkAndSendUpdateAnnouncement(client).catch(err => console.error('[UPDATE ANNOUNCER ERROR]', err));

    const fakeServers = config.fakeServerCount || 5434;

    console.log(`\n==================================================`);
    console.log(`🤖 ${config.botName} is ONLINE as ${client.user.tag}!`);
    console.log(`🌐 Displaying: ${fakeServers.toLocaleString()} server(s) | Real: ${client.guilds.cache.size} server(s)`);
    console.log(`⚡ Slash Commands registered & ready.`);
    console.log(`👀 Watching Status: "5434 server / setup"`);
    console.log(`==================================================\n`);

    // Activity mapper helper
    const getActivityType = (typeStr) => {
      switch (typeStr?.toLowerCase()) {
        case 'watching': return ActivityType.Watching;
        case 'listening': return ActivityType.Listening;
        case 'playing': return ActivityType.Playing;
        case 'competing': return ActivityType.Competing;
        default: return ActivityType.Watching;
      }
    };

    // Dynamic rotating status presence (Fake Watching Status)
    const configuredActivities = config.presence?.activities || [
      { name: '5434 server / setup', type: 'Watching' },
      { name: '/help | 5434 servers', type: 'Watching' },
      { name: '/setup • 5434 servers', type: 'Watching' },
      { name: '5434 server / setup | /template', type: 'Watching' }
    ];

    const activities = configuredActivities.map(act => ({
      name: act.name,
      type: typeof act.type === 'string' ? getActivityType(act.type) : act.type
    }));

    let i = 0;
    client.user.setPresence({
      activities: [activities[0]],
      status: config.presence?.status || 'online'
    });

    if (config.presence?.rotating !== false && activities.length > 1) {
      setInterval(() => {
        i = (i + 1) % activities.length;
        client.user.setPresence({
          activities: [activities[i]],
          status: config.presence?.status || 'online'
        });
      }, 15000);
    }
  }
};
