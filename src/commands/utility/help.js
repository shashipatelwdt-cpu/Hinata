const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ComponentType
} = require('discord.js');
const config = require('../../../config.json');

// Master Registry of all Bot Categories and Commands
const HELP_CATEGORIES = {
  home: {
    name: 'Home Overview',
    emoji: '🏠',
    description: 'Main dashboard, quick start setup guide, and statistics.'
  },
  setup: {
    name: 'Server Setup & Stats',
    emoji: '⚙️',
    description: 'All-in-one setup dashboard, auto-roles, and live server stats.',
    commands: [
      {
        name: '/autoserver',
        syntax: '/autoserver [theme:<preset>] [rules_theme:<theme>] [delete_old:<true/false>]',
        desc: '⚡ 1-Click Complete Automatic Server Setup (Channels, Roles, Rules, Tickets, Stats & AutoMod).',
        perms: 'Administrator'
      },
      {
        name: '/setup',
        syntax: '/setup',
        desc: 'Interactive 1-click dashboard to view & configure all server modules.',
        perms: 'Administrator'
      },
      {
        name: '/autorole set',
        syntax: '/autorole set role:<@role> [bot_role:<@role>]',
        desc: 'Auto-assign roles immediately when humans or bots join the server.',
        perms: 'Manage Roles'
      },
      {
        name: '/autorole status',
        syntax: '/autorole status',
        desc: 'Check active auto-role settings and hierarchy position.',
        perms: 'Manage Roles'
      },
      {
        name: '/serverstats setup',
        syntax: '/serverstats setup [category_name:<text>]',
        desc: 'Creates locked voice channels displaying real-time member & bot counters.',
        perms: 'Administrator'
      },
      {
        name: '/serverstats status',
        syntax: '/serverstats status',
        desc: 'Check live update scheduler status and stats channels.',
        perms: 'Manage Channels'
      },
      {
        name: '/leveling config',
        syntax: '/leveling config enabled:<true/false> [channel:<#channel>] [multiplier:<0.5-5.0>]',
        desc: 'Enable or disable chat XP leveling, set announcement channel, and configure double XP multipliers.',
        perms: 'Manage Server'
      },
      {
        name: '/leveling reward_add',
        syntax: '/leveling reward_add level:<X> role:<@role> | /leveling reward_remove level:<X>',
        desc: 'Configure automatic role rewards for reaching specific levels.',
        perms: 'Manage Server'
      },
      {
        name: '/leveling set_level',
        syntax: '/leveling set_level user:<@user> level:<X> | /leveling reset_user user:<@user>',
        desc: 'Admin controls to manually adjust or reset member XP and level.',
        perms: 'Manage Server'
      }
    ]
  },
  templates: {
    name: 'Templates & AI Blueprints',
    emoji: '🏗️',
    description: '27+ server layout presets, visual slider carousel, and ChatGPT importer.',
    commands: [
      {
        name: '/template list',
        syntax: '/template list [category:<name>]',
        desc: 'Interactive Visual Slider Carousel with 27+ ready-to-use server layouts.',
        perms: 'Administrator'
      },
      {
        name: '/template preview',
        syntax: '/template preview preset:<preset_id>',
        desc: 'Detailed channel & role structure breakdown with autocomplete preview.',
        perms: 'Administrator'
      },
      {
        name: '/template apply',
        syntax: '/template apply preset:<preset_id> [clean_wipe:<true/false>]',
        desc: '1-Click deploy an entire Discord server layout with channels and permissions.',
        perms: 'Administrator'
      },
      {
        name: '/template custom',
        syntax: '/template custom',
        desc: 'Build custom server structures directly from ChatGPT JSON or Markdown blueprints.',
        perms: 'Administrator'
      },
      {
        name: '/template ai-prompt',
        syntax: '/template ai-prompt [theme:<name>]',
        desc: 'Generates ready-to-copy AI prompt to craft custom blueprints with ChatGPT.',
        perms: 'Everyone'
      },
      {
        name: '/template import',
        syntax: '/template import url:<xenon_or_discord_link>',
        desc: 'Import templates directly from Xenon bot or Discord template links.',
        perms: 'Administrator'
      },
      {
        name: '/template export',
        syntax: '/template export [format:<json/markdown>]',
        desc: 'Export & backup the current server structure and channels.',
        perms: 'Administrator'
      },
      {
        name: '/template wipe',
        syntax: '/template wipe [create_general:<true/false>]',
        desc: '🗑️ Wipe all channels & categories cleanly from the server with confirmation.',
        perms: 'Administrator'
      },
      {
        name: '/role-builder create',
        syntax: '/role-builder create',
        desc: 'Paste bulk role lists with emojis & colors to generate 30+ roles in seconds.',
        perms: 'Manage Roles'
      }
    ]
  },
  moderation: {
    name: 'Moderation & Logs',
    emoji: '🛡️',
    description: 'Fast, secure moderation tools with modlogs and warnings tracking.',
    commands: [
      {
        name: '/ban',
        syntax: '/ban user:<@user> [reason:<text>] [delete_days:<0-7>]',
        desc: 'Ban a rule-breaker permanently and clean up recent messages.',
        perms: 'Ban Members'
      },
      {
        name: '/kick',
        syntax: '/kick user:<@user> [reason:<text>]',
        desc: 'Kick a member from the server.',
        perms: 'Kick Members'
      },
      {
        name: '/timeout',
        syntax: '/timeout user:<@user> duration:<1m/1h/1d> [reason:<text>]',
        desc: 'Temporarily mute/timeout a member (e.g., 10m, 2h, 1d).',
        perms: 'Moderate Members'
      },
      {
        name: '/untimeout',
        syntax: '/untimeout user:<@user> [reason:<text>]',
        desc: 'Remove timeout restriction from a member early.',
        perms: 'Moderate Members'
      },
      {
        name: '/warn',
        syntax: '/warn user:<@user> reason:<text>',
        desc: 'Issue a formal logged warning to a member.',
        perms: 'Moderate Members'
      },
      {
        name: '/warnings',
        syntax: '/warnings user:<@user>',
        desc: 'View all past warnings and infractions for a member.',
        perms: 'Moderate Members'
      },
      {
        name: '/delwarn',
        syntax: '/delwarn warn_id:<id>',
        desc: 'Delete a specific warning ID.',
        perms: 'Moderate Members'
      },
      {
        name: '/clearwarns',
        syntax: '/clearwarns user:<@user>',
        desc: 'Clear all warnings history for a user.',
        perms: 'Moderate Members'
      },
      {
        name: '/purge',
        syntax: '/purge amount:<1-100> [filter:<bots/humans/links/user>]',
        desc: 'Bulk delete messages with advanced filters.',
        perms: 'Manage Messages'
      },
      {
        name: '/nuke',
        syntax: '/nuke [confirmation:<YES>]',
        desc: 'Clone and recreate current channel to completely wipe spam.',
        perms: 'Manage Channels'
      },
      {
        name: '/deletechannels',
        syntax: '/deletechannels [create_general:<true/false>]',
        desc: '🗑️ Delete all channels & categories in the server (Clean Server Reset with confirmation).',
        perms: 'Administrator'
      },
      {
        name: '/wipechannels',
        syntax: '/wipechannels [create_general:<true/false>]',
        desc: '🗑️ Wipe all channels & categories cleanly from the server with confirmation.',
        perms: 'Administrator'
      },
      {
        name: '/lock',
        syntax: '/lock [channel:<#channel>] [reason:<text>]',
        desc: 'Lockdown a channel to prevent regular members from chatting.',
        perms: 'Manage Channels'
      },
      {
        name: '/unlock',
        syntax: '/unlock [channel:<#channel>]',
        desc: 'Unlock a locked channel and restore chat permissions.',
        perms: 'Manage Channels'
      },
      {
        name: '/slowmode',
        syntax: '/slowmode seconds:<0-21600> [channel:<#channel>]',
        desc: 'Set channel slowmode rate limit (0 to disable).',
        perms: 'Manage Channels'
      },
      {
        name: '/nick',
        syntax: '/nick user:<@user> [nickname:<new_name>]',
        desc: 'Change or reset a member\'s nickname.',
        perms: 'Manage Nicknames'
      },
      {
        name: '/role',
        syntax: '/role add/remove user:<@user> role:<@role>',
        desc: 'Add or remove a role from a member.',
        perms: 'Manage Roles'
      },
      {
        name: '/clearsnipe',
        syntax: '/clearsnipe [channel:<#channel>]',
        desc: 'Purge deleted and edited message history from snipe memory.',
        perms: 'Manage Messages'
      },
      {
        name: '/botmute',
        syntax: '/botmute <mute/unmute/list> bot:<@bot> [channel:<#channel>] [reason:<text>]',
        desc: '🔇 Mute/Block a specific bot in a channel so nobody can use it there.',
        perms: 'Manage Channels'
      },
      {
        name: '/botunmute',
        syntax: '/botunmute bot:<@bot> [channel:<#channel>]',
        desc: '🔊 Unmute a channel-muted bot and restore access.',
        perms: 'Manage Channels'
      }
    ]
  },
  automod: {
    name: 'AutoMod Security',
    emoji: '🤖',
    description: 'Autonomous 24/7 server defense against raids, spam, invites, and profanity.',
    commands: [
      {
        name: '/automod status',
        syntax: '/automod status',
        desc: 'View active protection filters, whitelist, and modlog channel.',
        perms: 'Administrator'
      },
      {
        name: '/automod anti-link',
        syntax: '/automod anti-link enable:<true/false>',
        desc: 'Automatically delete unauthorized external links.',
        perms: 'Administrator'
      },
      {
        name: '/automod anti-invite',
        syntax: '/automod anti-invite enable:<true/false>',
        desc: 'Block Discord server invites (discord.gg / discord.com/invite).',
        perms: 'Administrator'
      },
      {
        name: '/automod anti-spam',
        syntax: '/automod anti-spam enable:<true/false>',
        desc: 'Detect and delete fast repeated messages & flood spam.',
        perms: 'Administrator'
      },
      {
        name: '/automod anti-mention',
        syntax: '/automod anti-mention enable:<true/false> [max_mentions:<number>]',
        desc: 'Block mass ping raids (e.g. >5 mentions in 1 message).',
        perms: 'Administrator'
      },
      {
        name: '/automod badwords',
        syntax: '/automod badwords action:<add/remove/list> [word:<text>]',
        desc: 'Custom blacklisted words filter with auto-delete.',
        perms: 'Administrator'
      },
      {
        name: '/automod modlog',
        syntax: '/automod modlog channel:<#channel>',
        desc: 'Designate channel for all moderation and automod audit logs.',
        perms: 'Administrator'
      }
    ]
  },
  welcome: {
    name: 'Welcome & Goodbye',
    emoji: '👋',
    description: 'Custom embeds, 10 aesthetic themes, member counters, and DM greetings.',
    commands: [
      {
        name: '/welcome setup',
        syntax: '/welcome setup channel:<#channel> [role:<@role>] [bot_role:<@role>] [banner_url:<url>]',
        desc: 'Complete welcome system setup with channel, auto-roles & banners.',
        perms: 'Administrator'
      },
      {
        name: '/welcome gallery',
        syntax: '/welcome gallery',
        desc: 'Interactive gallery to browse & 1-click apply 10 pre-styled welcome themes.',
        perms: 'Administrator'
      },
      {
        name: '/welcome preview',
        syntax: '/welcome preview',
        desc: 'Preview how your current welcome message looks.',
        perms: 'Manage Guild'
      },
      {
        name: '/welcome test',
        syntax: '/welcome test',
        desc: 'Dispatch a live simulated welcome message to your welcome channel.',
        perms: 'Administrator'
      },
      {
        name: '/welcome dm',
        syntax: '/welcome dm enable:<true/false> [message:<text>]',
        desc: 'Send a private direct message to new members when they join.',
        perms: 'Administrator'
      },
      {
        name: '/leave setup',
        syntax: '/leave setup channel:<#channel> [message:<text>]',
        desc: 'Configure goodbye messages when members leave.',
        perms: 'Administrator'
      },
      {
        name: '/leave test',
        syntax: '/leave test',
        desc: 'Send a live test goodbye message.',
        perms: 'Administrator'
      }
    ]
  },
  rules: {
    name: 'Rules & Verification',
    emoji: '📜',
    description: '10+ rich rules templates, 1-click verification buttons, and custom rules builder.',
    commands: [
      {
        name: '/rules templates',
        syntax: '/rules templates',
        desc: 'Interactive gallery to browse, preview & deploy 10+ styled rules presets.',
        perms: 'Administrator'
      },
      {
        name: '/rules send',
        syntax: '/rules send preset:<name> channel:<#channel> [verify_role:<@role>]',
        desc: 'Post a formatted rules layout with interactive verification button to channel.',
        perms: 'Administrator'
      },
      {
        name: '/rules verify-role',
        syntax: '/rules verify-role role:<@role>',
        desc: 'Configure member role awarded when clicking "✅ Accept Rules & Verify".',
        perms: 'Administrator'
      },
      {
        name: '/rules custom',
        syntax: '/rules custom channel:<#channel>',
        desc: 'Interactive popup modal to craft personalized server rules.',
        perms: 'Administrator'
      },
      {
        name: '/rules preview',
        syntax: '/rules preview [preset:<name>]',
        desc: 'Ephemeral preview of any rules preset or current server rules.',
        perms: 'Everyone'
      }
    ]
  },
  invites: {
    name: 'Invite Tracker',
    emoji: '📊',
    description: 'Track regular, leaves, fake accounts, bonus invites, ranks, and leaderboards.',
    commands: [
      {
        name: '/invites check',
        syntax: '/invites check [user:<@user>]',
        desc: 'Detailed invite stats card with net count, regular/leaves/fake breakdown & rank.',
        perms: 'Everyone'
      },
      {
        name: '/invites leaderboard',
        syntax: '/invites leaderboard',
        desc: 'Display server-wide top inviters leaderboard with ranks & medals.',
        perms: 'Everyone'
      },
      {
        name: '/invites audit',
        syntax: '/invites audit user:<@user>',
        desc: 'Inspect who invited a specific member, code used, and fake/alt status.',
        perms: 'Everyone'
      },
      {
        name: '/invites-manage add',
        syntax: '/invites-manage add user:<@user> amount:<number>',
        desc: 'Add bonus invites to a specific member.',
        perms: 'Manage Guild'
      },
      {
        name: '/invites-manage remove',
        syntax: '/invites-manage remove user:<@user> amount:<number>',
        desc: 'Deduct bonus invites from a specific member.',
        perms: 'Manage Guild'
      },
      {
        name: '/invites-manage reset-user',
        syntax: '/invites-manage reset-user user:<@user>',
        desc: 'Reset all invite stats for a single user.',
        perms: 'Manage Guild'
      },
      {
        name: '/invites-manage reset-all',
        syntax: '/invites-manage reset-all confirm:true',
        desc: 'Completely wipe and reset all server invite records.',
        perms: 'Administrator'
      }
    ]
  },
  selfroles: {
    name: 'Self-Roles & builder',
    emoji: '🎭',
    description: 'Reaction roles, interactive dropdown menus, and bulk role creators.',
    commands: [
      {
        name: '/selfroles preset',
        syntax: '/selfroles preset theme:<colors/gaming/notifications/pronouns/regions>',
        desc: 'Deploy high-converting self-role select menus in seconds.',
        perms: 'Manage Roles'
      },
      {
        name: '/selfroles custom',
        syntax: '/selfroles custom title:<text> roles:<@role1, @role2...>',
        desc: 'Create custom multi-select dropdown menus for any roles.',
        perms: 'Manage Roles'
      },
      {
        name: '/role-builder create',
        syntax: '/role-builder create',
        desc: 'Modal role generator - paste formatted role lists to auto-create all roles.',
        perms: 'Manage Roles'
      }
    ]
  },
  tickets: {
    name: 'Support Tickets',
    emoji: '🎫',
    description: 'Button-based private support ticket panels with auto-permissions & logs.',
    commands: [
      {
        name: '/ticket panel',
        syntax: '/ticket panel channel:<#channel> [category:<#category>] [support_role:<@role>]',
        desc: 'Deploy interactive ticket panel with General, Billing & Report buttons.',
        perms: 'Administrator'
      },
      {
        name: '/ticket close',
        syntax: '/ticket close [reason:<text>]',
        desc: 'Safely close and clean up an active ticket channel.',
        perms: 'Manage Channels'
      },
      {
        name: '/ticket add',
        syntax: '/ticket add user:<@user>',
        desc: 'Grant a user private access to the current ticket channel.',
        perms: 'Manage Channels'
      },
      {
        name: '/ticket remove',
        syntax: '/ticket remove user:<@user>',
        desc: 'Revoke a user\'s access from the ticket channel.',
        perms: 'Manage Channels'
      }
    ]
  },
  giveaway: {
    name: 'Giveaways System',
    emoji: '🎉',
    description: 'Interactive button giveaways with automated countdowns and fair winner picking.',
    commands: [
      {
        name: '/giveaway start',
        syntax: '/giveaway start duration:<1h/1d> winners:<1-10> prize:<text> [channel:<#channel>]',
        desc: 'Launch a button giveaway with live countdown and auto-drawing.',
        perms: 'Manage Guild'
      },
      {
        name: '/giveaway reroll',
        syntax: '/giveaway reroll message_id:<id>',
        desc: 'Reroll new winner(s) for a previously concluded giveaway.',
        perms: 'Manage Guild'
      },
      {
        name: '/giveaway end',
        syntax: '/giveaway end message_id:<id>',
        desc: 'End a running giveaway immediately and pick winners.',
        perms: 'Manage Guild'
      }
    ]
  },
  utility: {
    name: 'Utility & Tools',
    emoji: '🛠️',
    description: 'Snipe ghost pings, inspect users/servers, create polls, and build rich embeds.',
    commands: [
      {
        name: '/botinfo',
        syntax: '/botinfo',
        desc: 'System statistics, latency, uptime, memory, and hosting stats.',
        perms: 'Everyone'
      },
      {
        name: '/serverinfo',
        syntax: '/serverinfo',
        desc: 'Detailed server overview (creation date, verification, boosts, channels).',
        perms: 'Everyone'
      },
      {
        name: '/userinfo',
        syntax: '/userinfo [user:<@user>]',
        desc: 'Inspect account age, join date, highest role, and avatar.',
        perms: 'Everyone'
      },
      {
        name: '/avatar',
        syntax: '/avatar [user:<@user>]',
        desc: 'View and download full-resolution user avatars.',
        perms: 'Everyone'
      },
      {
        name: '/ghostping',
        syntax: '/ghostping [index:<1-15>] [channel:<#channel>]',
        desc: '👻 Check recently deleted or edited ghost-pings (who mentioned whom & message content).',
        perms: 'Everyone'
      },
      {
        name: '/announce',
        syntax: '/announce send channel:<#channel> message:<text> [ping:<everyone/here/role>] | /announce modal',
        desc: '📢 Send rich server announcements with banners, embeds, and role/@everyone pings.',
        perms: 'Manage Messages'
      },
      {
        name: '/snipe',
        syntax: '/snipe [index:<1-10>] [channel:<#channel>]',
        desc: '🎯 Recover recently deleted messages, images, author, and ghost ping alerts.',
        perms: 'Everyone'
      },
      {
        name: '/editsnipe',
        syntax: '/editsnipe [index:<1-10>] [channel:<#channel>]',
        desc: 'Reveal original content before a message was edited.',
        perms: 'Everyone'
      },
      {
        name: '/poll',
        syntax: '/poll question:<text> options:<opt1 | opt2 | opt3...>',
        desc: 'Create multi-choice reaction polls with emoji voting.',
        perms: 'Manage Messages'
      },
      {
        name: '/embed-builder',
        syntax: '/embed-builder [channel:<#channel>]',
        desc: 'Interactive popup modal to craft custom formatted embeds.',
        perms: 'Manage Messages'
      },
      {
        name: '/help',
        syntax: '/help [command:<name>]',
        desc: 'Open this interactive command guide and documentation browser.',
        perms: 'Everyone'
      },
      {
        name: '/counting setup',
        syntax: '/counting setup channel:<#channel> | /counting stats | /counting leaderboard',
        desc: '🔢 Next-gen server counting game with streaks, records, and anti-double counting.',
        perms: 'Manage Server'
      },
      {
        name: '/afk set',
        syntax: '/afk set [reason:<text>] | /afk clear | /afk list',
        desc: '💤 Set AFK status with auto [AFK] nickname, mention alerts & missed pings log.',
        perms: 'Everyone'
      },
      {
        name: '/rank',
        syntax: '/rank [user:<@user>] [color:<#hex/reset>]',
        desc: '🎖️ Ultra-premium Rank Card with Tier Badges (Bronze to Immortal), custom accent colors, and milestones.',
        perms: 'Everyone'
      },
      {
        name: '/levels leaderboard',
        syntax: '/levels leaderboard | /levels rewards',
        desc: '🏆 View server top-10 XP leaderboard, tier rankings, and personalized role reward roadmap.',
        perms: 'Everyone'
      }
    ]
  },
  music: {
    name: 'Music & Audio',
    emoji: '🎵',
    description: 'High quality music streaming with interactive button controls, queue, lyrics, and volume.',
    commands: [
      {
        name: '/play',
        syntax: '/play query:<song / url / spotify / soundcloud>',
        desc: 'Stream songs or full playlists with live search autocomplete.',
        perms: 'Everyone'
      },
      {
        name: '/pause',
        syntax: '/pause',
        desc: 'Pause the currently playing audio stream.',
        perms: 'Everyone'
      },
      {
        name: '/resume',
        syntax: '/resume',
        desc: 'Resume paused music playback.',
        perms: 'Everyone'
      },
      {
        name: '/skip',
        syntax: '/skip [to:<number>]',
        desc: 'Skip current track or jump to a specific track number.',
        perms: 'Everyone'
      },
      {
        name: '/stop',
        syntax: '/stop',
        desc: 'Stop playback, clear queue, and leave voice channel.',
        perms: 'Everyone'
      },
      {
        name: '/queue',
        syntax: '/queue [page:<number>]',
        desc: 'Display upcoming queued songs with duration & pagination.',
        perms: 'Everyone'
      },
      {
        name: '/nowplaying',
        syntax: '/nowplaying',
        desc: 'Rich interactive player embed with visualizer and control buttons.',
        perms: 'Everyone'
      },
      {
        name: '/volume',
        syntax: '/volume percent:<1-150>',
        desc: 'Dynamically scale music volume.',
        perms: 'Everyone'
      },
      {
        name: '/loop',
        syntax: '/loop [mode:<off/track/queue>]',
        desc: 'Toggle between repeat single song, repeat queue, or loop off.',
        perms: 'Everyone'
      },
      {
        name: '/shuffle',
        syntax: '/shuffle',
        desc: 'Randomize waiting queue songs order.',
        perms: 'Everyone'
      },
      {
        name: '/lyrics',
        syntax: '/lyrics [song:<text>]',
        desc: 'Fetch full song lyrics from Genius.',
        perms: 'Everyone'
      },
      {
        name: '/playlist',
        syntax: '/playlist <create/add/addcurrent/play/list/view/remove/delete/clear>',
        desc: '🎵 Spotify-style personal playlists: create, manage, and play your own playlists.',
        perms: 'Everyone'
      },
      {
        name: '/autoplay',
        syntax: '/autoplay [mode:<on/off>]',
        desc: '📻 Smart Spotify/YouTube Radio: automatically queue similar songs matching your taste.',
        perms: 'Everyone'
      },
      {
        name: '/radio',
        syntax: '/radio query:<song / artist / genre>',
        desc: '📻 Launch 24/7 non-stop music radio for any song, artist or mood.',
        perms: 'Everyone'
      },
      {
        name: '/leave',
        syntax: '/leave',
        desc: '👋 Disconnect bot from voice channel and reset player.',
        perms: 'Everyone'
      },
      {
        name: '/musicpanel',
        syntax: '/musicpanel',
        desc: 'Deploy a permanent interactive 24/7 Music Control Panel in the channel.',
        perms: 'Manage Channels'
      }
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 Complete command list, feature guides, and server setup tutorials')
    .addStringOption(option =>
      option
        .setName('command')
        .setDescription('Specific command name to view detailed documentation & syntax')
        .setRequired(false)
        .setAutocomplete(true)
    ),

  // Autocomplete support for fast search
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const allCommands = [];

    for (const [catKey, cat] of Object.entries(HELP_CATEGORIES)) {
      if (catKey === 'home' || !cat.commands) continue;
      for (const cmd of cat.commands) {
        const cleanName = cmd.name.replace('/', '');
        allCommands.push({
          name: `${cmd.name} — ${cmd.desc.substring(0, 50)}`,
          value: cleanName
        });
      }
    }

    const filtered = allCommands
      .filter(c => c.name.toLowerCase().includes(focusedValue) || c.value.toLowerCase().includes(focusedValue))
      .slice(0, 25);

    await interaction.respond(filtered);
  },

  async execute(interaction) {
    const specificCmdQuery = interaction.options.getString('command');

    // 1. If user searched for a specific command
    if (specificCmdQuery) {
      const cleanQuery = specificCmdQuery.toLowerCase().replace('/', '').trim();
      let matchedCmd = null;
      let matchedCat = null;

      for (const [catKey, cat] of Object.entries(HELP_CATEGORIES)) {
        if (catKey === 'home' || !cat.commands) continue;
        for (const cmd of cat.commands) {
          const cName = cmd.name.toLowerCase().replace('/', '');
          if (cName === cleanQuery || cName.startsWith(cleanQuery)) {
            matchedCmd = cmd;
            matchedCat = cat;
            break;
          }
        }
        if (matchedCmd) break;
      }

      if (matchedCmd) {
        const cmdEmbed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle(`📖 Command: \`${matchedCmd.name}\``)
          .setDescription(`**Category:** ${matchedCat.emoji} **${matchedCat.name}**\n\n${matchedCmd.desc}`)
          .addFields(
            { name: '⚡ Syntax & Usage', value: `\`\`\`text\n${matchedCmd.syntax}\n\`\`\``, inline: false },
            { name: '🔒 Required Permission', value: `\`${matchedCmd.perms}\``, inline: true },
            { name: '🌐 Slash Command', value: `\`/${matchedCmd.name.replace('/', '')}\``, inline: true }
          )
          .setFooter({ text: `${config.botName} Documentation • Run /help to view all categories` })
          .setTimestamp();

        return interaction.reply({ embeds: [cmdEmbed] });
      }
    }

    // 2. Build Interactive Main Help Menu
    const client = interaction.client;
    const fakeServerCount = config.fakeServerCount || 5434;
    const totalCmdCount = Object.values(HELP_CATEGORIES).reduce((acc, cat) => acc + (cat.commands?.length || 0), 0);

    const renderHomeEmbed = () => {
      return new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(`📖 ${config.botName} - Advanced Discord Assistant`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(
          `Welcome to **${config.botName}**! An all-in-one Discord bot featuring **Server Templates**, **AutoMod Defense**, **Auto-Roles**, **Welcome Themes**, **Self-Roles**, **Tickets**, and **Moderation**.\n\n` +
          `### 🚀 Quick Start Guide\n` +
          `1️⃣ **Dashboard:** Run \`/setup\` to view all modules and 1-click guides.\n` +
          `2️⃣ **Server Layout:** Run \`/template list\` to browse 27+ ready-to-use themes.\n` +
          `3️⃣ **Auto-Role:** Run \`/autorole set\` to assign roles to new members automatically.\n` +
          `4️⃣ **Welcome:** Run \`/welcome gallery\` to pick from 10 stylish greetings.\n` +
          `5️⃣ **AutoMod:** Run \`/automod status\` to enable anti-spam & anti-invite filters.\n\n` +
          `### 📊 Bot Overview\n` +
          `• 🌐 **Watching Servers:** \`${fakeServerCount.toLocaleString()} servers\`\n` +
          `• ⚡ **Total Commands:** \`${totalCmdCount} Slash Commands\`\n` +
          `• 📡 **WebSocket Ping:** \`${client.ws.ping >= 0 ? client.ws.ping : '15'}ms\`\n` +
          `• 🤖 **Status:** \`Watching 5434 server / setup\`\n\n` +
          `*Select a category from the dropdown menu below to view full command lists & permissions!*`
        )
        .addFields(
          { name: '🛡️ Moderation (16)', value: '`/ban`, `/kick`, `/timeout`, `/purge`, `/nuke`, `/warn`...', inline: true },
          { name: '🤖 AutoMod (7)', value: 'Anti-Link, Anti-Invite, Anti-Spam, Anti-Mention, Badwords...', inline: true },
          { name: '⚙️ Server Setup (5)', value: '`/setup`, `/autorole`, `/serverstats`, Live Counters...', inline: true },
          { name: '🏗️ Templates (8)', value: '`/template list`, `/template apply`, ChatGPT Importer...', inline: true },
          { name: '👋 Welcome (7)', value: '10 Themes, Auto-Role, DM Welcome, Placeholders...', inline: true },
          { name: '🎭 Self-Roles (3)', value: 'Interactive Dropdowns, Colors, Gaming, Role-Builder...', inline: true },
          { name: '🎫 Tickets (4)', value: 'Multi-Department Panels, Transcripts, Auto-Permissions...', inline: true },
          { name: '🎉 Giveaways (3)', value: 'Live Timers, Multi-Winners, Instant Reroll...', inline: true },
          { name: '🎵 Music & Audio (12)', value: '`/play`, `/queue`, `/nowplaying`, `/skip`, `/volume`, `/musicpanel`...', inline: true },
          { name: '🛠️ Utility (9)', value: '`/botinfo`, `/snipe`, `/poll`, `/embed-builder`...', inline: true }
        )
        .setFooter({ text: `${config.botName} All-In-One Bot • Select a category below` })
        .setTimestamp();
    };

    const renderCategoryEmbed = (catKey) => {
      const cat = HELP_CATEGORIES[catKey];
      if (!cat) return renderHomeEmbed();

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(`${cat.emoji} ${cat.name} Commands (${cat.commands?.length || 0})`)
        .setDescription(`*${cat.description}*\n\n`)
        .setFooter({ text: `${config.botName} Help Menu • Use /help [command] for detailed syntax` })
        .setTimestamp();

      for (const cmd of cat.commands) {
        embed.addFields({
          name: `${cmd.name}`,
          value: `📝 ${cmd.desc}\n⚡ \`${cmd.syntax}\`\n🔒 **Required Perm:** \`${cmd.perms}\``,
          inline: false
        });
      }

      return embed;
    };

    const getComponents = (activeKey = 'home') => {
      const menuOptions = Object.entries(HELP_CATEGORIES).map(([key, cat]) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(cat.name)
          .setValue(`help_cat_${key}`)
          .setDescription(cat.description.substring(0, 95))
          .setEmoji(cat.emoji)
          .setDefault(key === activeKey)
      );

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help_category_select')
        .setPlaceholder(`📂 Current: ${HELP_CATEGORIES[activeKey]?.name || 'Home Overview'}`)
        .addOptions(menuOptions);

      const menuRow = new ActionRowBuilder().addComponents(selectMenu);

      const btnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('help_btn_home')
          .setLabel('Home Overview')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🏠'),
        new ButtonBuilder()
          .setCustomId('btn_setup_templates')
          .setLabel('Templates')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🏗️'),
        new ButtonBuilder()
          .setCustomId('btn_setup_autorole')
          .setLabel('Auto-Role')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('👑'),
        new ButtonBuilder()
          .setCustomId('btn_setup_automod')
          .setLabel('AutoMod')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🛡️')
      );

      return [menuRow, btnRow];
    };

    // Send the initial response
    const replyMsg = await interaction.reply({
      embeds: [renderHomeEmbed()],
      components: getComponents('home'),
      fetchReply: true
    });

    // Create Component Collector for rich real-time interaction
    const collector = replyMsg.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 120000
    });

    collector.on('collect', async i => {
      if (i.isStringSelectMenu() && i.customId === 'help_category_select') {
        const selectedCatKey = i.values[0].replace('help_cat_', '');
        if (selectedCatKey === 'home') {
          return i.update({
            embeds: [renderHomeEmbed()],
            components: getComponents('home')
          });
        } else {
          return i.update({
            embeds: [renderCategoryEmbed(selectedCatKey)],
            components: getComponents(selectedCatKey)
          });
        }
      }

      if (i.isButton()) {
        if (i.customId === 'help_btn_home') {
          return i.update({
            embeds: [renderHomeEmbed()],
            components: getComponents('home')
          });
        }
      }
    });

    collector.on('end', async () => {
      // Optional: keep components or disable them when expired
      const disabledRow = ActionRowBuilder.from(replyMsg.components[0]);
      disabledRow.components.forEach(c => c.setDisabled(true));
      await interaction.editReply({ components: [disabledRow] }).catch(() => null);
    });
  }
};
