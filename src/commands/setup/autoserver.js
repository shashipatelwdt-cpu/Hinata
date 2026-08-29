const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
const { getTemplate, getAllTemplates } = require('../../templates');
const TemplateBuilderEngine = require('../../templates/builderEngine');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

const THEME_CHOICES = [
  { name: '🎯 5v5 Tactical Game & Community (Dev Logs, Leaks, 5-Man Squad Voice Rooms)', value: 'tactical-5v5' },
  { name: '✨ Good Looking (Ultra-Stylish Aesthetic Lounge)', value: 'good-looking' },
  { name: '🍜 NOMI Bot Official RPG & Arcade (Cooking, Quests, Crafting, UNO & Founder Lounge)', value: 'nomi-rpg' },
  { name: '👑 LordX Esports Official HQ (Lineups, Scrims, LordX VIP Rooms, Music & Fun)', value: 'lordx-esports' },
  { name: '🐾 OwO & Bot Gaming Arcade (Grind Zones, High-Roller Casino, Safe Trades)', value: 'owo-arcade' },
  { name: '⚡ VX Esports & Gaming Empire (VX Rooms, Teams, Scrims, Music, Fun)', value: 'vx-esports' },
  { name: '🌸 Japanese Tokyo Aesthetic & Giveaways (Tokyo Aesthetic, Grinds, Nitro Drops)', value: 'nomi-japanese' },
  { name: '🌐 Universal Community & Hangout (General, YouTubers, Friends)', value: 'community' },
  { name: '🎮 Gaming & Esports Arena (LFG, Voice Comms, Tournaments)', value: 'gaming' },
  { name: '🌸 Anime & Aesthetic Lounge (Kaomoji, Spoilers, Cozy)', value: 'anime' },
  { name: '💻 Developer & Tech Hub (Code help, Projects, GitHub)', value: 'developer' },
  { name: '🏆 Esports Clan & Competitive (Scrims, Rosters, Tryouts)', value: 'esports' },
  { name: '📚 Study & Academic Campus (Study rooms, Homework, Focus)', value: 'study' },
  { name: '⚡ Cyberpunk & Network Security (Dark / Tech aesthetic)', value: 'cyberpunk_net' }
];

const RULES_CHOICES = [
  { name: '🌐 Universal Community Guidelines', value: 'community' },
  { name: '🎮 Gaming & Anti-Cheat Guidelines', value: 'gaming' },
  { name: '🌸 Anime & SFW Cozy Rules', value: 'anime' },
  { name: '💻 Developer & Code Etiquette', value: 'developer' },
  { name: '🏆 Competitive Clan & Scrim Rules', value: 'esports' },
  { name: '⚡ Cyberpunk Security Directives', value: 'cyberpunk' },
  { name: '📚 Study & Campus Code of Conduct', value: 'study' },
  { name: '🎧 Chill Music & Vibe Guidelines', value: 'chill' },
  { name: '💎 Minimalist Executive Rules', value: 'minimal' },
  { name: '🛒 Marketplace & Trading Safety', value: 'marketplace' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoserver')
    .setDescription('⚡ 1-Click Complete Server Setup (Layout, Rules, Full Moderation System, Tickets, Stats & AutoMod)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt
        .setName('theme')
        .setDescription('Select or search server theme & layout (e.g. good-looking, nomi, lordx)')
        .setRequired(false)
        .setAutocomplete(true)
    )
    .addStringOption(opt =>
      opt
        .setName('rules_theme')
        .setDescription('Select specific rules theme to automatically write')
        .setRequired(false)
        .addChoices(...RULES_CHOICES)
    )
    .addBooleanOption(opt =>
      opt
        .setName('delete_old_channels')
        .setDescription('Delete all old channels and start 100% fresh? (Recommended: True)')
        .setRequired(false)
    )
    .addBooleanOption(opt =>
      opt
        .setName('include_stats')
        .setDescription('Automatically create live voice stats counters? (Default: True)')
        .setRequired(false)
    )
    .addBooleanOption(opt =>
      opt
        .setName('include_tickets')
        .setDescription('Automatically deploy interactive support ticket panel? (Default: True)')
        .setRequired(false)
    )
    .addBooleanOption(opt =>
      opt
        .setName('include_selfroles')
        .setDescription('Automatically deploy reaction self-roles dropdown? (Default: True)')
        .setRequired(false)
    ),

  async autocomplete(interaction) {
    const focused = interaction.options.getFocused() || '';
    const query = focused.toLowerCase().trim();

    const matches = THEME_CHOICES.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.value.toLowerCase().includes(query) ||
      (query.includes('good') && (c.value.includes('good') || c.name.toLowerCase().includes('good'))) ||
      (query.includes('look') && (c.value.includes('look') || c.name.toLowerCase().includes('look'))) ||
      (query.includes('style') && (c.value.includes('style') || c.name.toLowerCase().includes('style') || c.value.includes('good'))) ||
      (query.includes('aesth') && (c.value.includes('aesthetic') || c.name.toLowerCase().includes('aesthetic') || c.value.includes('good'))) ||
      (query.includes('nomi') && c.value.includes('nomi'))
    );

    try {
      await interaction.respond(
        matches.slice(0, 25).map(c => ({
          name: c.name.substring(0, 100),
          value: c.value
        }))
      );
    } catch {}
  },

  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Guild Only', 'This command can only be used in a Discord server!')],
        ephemeral: true
      });
    }

    await interaction.deferReply().catch(() => null);

    const safeReply = async (payload) => {
      if (interaction.deferred || interaction.replied) {
        return interaction.editReply(payload).catch(() => null);
      }
      return interaction.reply(payload).catch(() => null);
    };

    // Check bot permissions
    const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
    if (!botMember) {
      return safeReply({
        embeds: [EmbedUtils.error('Error', 'Could not verify bot permissions.')]
      });
    }

    if (!botMember.permissions.has(PermissionFlagsBits.Administrator) &&
        !botMember.permissions.has(PermissionFlagsBits.ManageGuild | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageRoles)) {
      return safeReply({
        embeds: [
          EmbedUtils.error(
            'Missing Permissions',
            `I need **Administrator** or **Manage Channels**, **Manage Roles** and **Manage Server** permissions to build your server automatically.`
          )
        ]
      });
    }

    const themeKey = interaction.options.getString('theme') || 'good-looking';
    const rulesTheme = interaction.options.getString('rules_theme') || null;
    const deleteOld = interaction.options.getBoolean('delete_old_channels') ?? true;
    const includeStats = interaction.options.getBoolean('include_stats') ?? true;
    const includeTickets = interaction.options.getBoolean('include_tickets') ?? true;
    const includeSelfRoles = interaction.options.getBoolean('include_selfroles') ?? true;

    const template = getTemplate(themeKey) || getTemplate('good-looking');
    if (!template) {
      return safeReply({
        embeds: [EmbedUtils.error('Theme Error', `Could not find preset template for theme: \`${themeKey}\``)]
      });
    }

    const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);

    const confirmEmbed = new EmbedBuilder()
      .setColor(config.embedColors.primary || '#5865F2')
      .setTitle(`⚡ 1-Click Server Setup: ${template.name}`)
      .setDescription(
        `You are about to launch **1-Click Automatic Server Setup** for **${guild.name}**!\n\n` +
        `### 🚀 What Will Be Automatically Done:\n` +
        `• 🗑️ **Wipe Old Channels:** \`${deleteOld ? 'YES (Clean Fresh Start)' : 'NO (Keep Old)'}\`\n` +
        `• 🎭 **Roles & Hierarchy:** \`${template.roles.length} Roles\` (👑 Owner, 🛡️ Admin, ⚔️ Mod, 👥 Member, 🤖 Bot)\n` +
        `• 🛡️ **Full Moderation System:** Kick/Ban/Timeout/Warn permissions granted to Mod & Admin roles\n` +
        `• 🔒 **Private Staff Hub:** \`#staff-hq\` (Staff Guides) & \`#mod-logs\` (Audit Stream) strictly hidden from @everyone\n` +
        `• 📂 **Categories & Channels:** \`${template.categories.length} Categories\` & \`${totalChannels} Channels\`\n` +
        `• 📜 **Automatic Rules Writing:** Rules written in \`#rules\` with \`[ ✅ Accept Rules & Verify ]\` button\n` +
        `• 👋 **Welcome & Auto-Role:** Getting started guide + instant role on join & verify\n` +
        `• 🎭 **Self-Roles Panel:** \`${includeSelfRoles ? '✅ Yes (Notifications, Colors, Platforms)' : '❌ Disabled'}\`\n` +
        `• 🎫 **Support Tickets Panel:** \`${includeTickets ? '✅ Yes (3-Department Buttons)' : '❌ Disabled'}\`\n` +
        `• 📊 **Live Server Stats:** \`${includeStats ? '✅ Yes (5 Voice Counter Channels)' : '❌ Disabled'}\`\n` +
        `• ⚡ **AutoMod Defense:** ✅ Active (Anti-Spam, Anti-Invite, Anti-MassMention, Anti-GhostPing & 250+ Hindi/Hinglish Bad Words Filter)\n\n` +
        `⚠️ **Warning:** Starting clean will delete all existing channels in this server.\n` +
        `Click **🚀 Launch 1-Click Server Setup** below to begin!`
      )
      .setFooter({ text: `${config.botName || 'Hinata'} • 1-Click Server Builder` })
      .setTimestamp();

    const confirmBtn = new ButtonBuilder()
      .setCustomId('cmd_confirm_autoserver')
      .setLabel('🚀 Launch 1-Click Server Setup!')
      .setStyle(ButtonStyle.Success);

    const cancelBtn = new ButtonBuilder()
      .setCustomId('cmd_cancel_autoserver')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('✖️');

    const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

    let promptMsg;
    if (interaction.deferred || interaction.replied) {
      promptMsg = await interaction.editReply({
        embeds: [confirmEmbed],
        components: [row]
      }).catch(() => null);
    } else {
      promptMsg = await interaction.reply({
        embeds: [confirmEmbed],
        components: [row],
        fetchReply: true
      }).catch(() => null);
    }

    if (!promptMsg) return;

    const collector = promptMsg.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id,
      time: 60000,
      max: 1
    });

    collector.on('collect', async i => {
      if (i.customId === 'cmd_cancel_autoserver') {
        return i.update({
          embeds: [EmbedUtils.info('Setup Cancelled', '1-Click Server Setup was cancelled. No changes were made.')],
          components: []
        });
      }

      await i.deferUpdate();

      await TemplateBuilderEngine.executeBuild({
        interaction: i,
        template,
        deleteOld,
        includeStats,
        includeRules: true,
        includeWelcome: true,
        includeSelfRoles,
        includeTickets,
        includeAutoMod: true,
        rulesTheme,
        currentChannelId: interaction.channelId
      });
    });

    collector.on('end', async (collected, reason) => {
      if (reason === 'time' && collected.size === 0) {
        await interaction.editReply({
          embeds: [EmbedUtils.warning('Timed Out', '1-Click Server Setup confirmation timed out.')],
          components: []
        }).catch(() => null);
      }
    });
  }
};
