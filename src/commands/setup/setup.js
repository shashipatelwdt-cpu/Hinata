const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('⚙️ All-In-One Bot Setup, 1-Click Server Builder & Configuration Dashboard')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
    const autorole = guildSettings.autorole || {};
    const welcome = guildSettings.welcome || {};
    const leave = guildSettings.leave || {};
    const automod = guildSettings.automod || {};
    const serverstats = guildSettings.serverstats || {};
    const rules = guildSettings.rules || {};
    const ticket = guildSettings.ticket || {};
    const modlog = guildSettings.modlog_channel;

    const autoroleDisplay = autorole.enabled && (autorole.humanRoleId || autorole.botRoleId)
      ? `✅ Enabled (${autorole.humanRoleId ? `<@&${autorole.humanRoleId}>` : 'Bots Only'})`
      : (autorole.humanRoleId ? `⏸️ Paused (\`/autorole toggle\`)` : '❌ Not Set (\`/autorole set\`)');

    const rulesDisplay = rules.channelId
      ? `✅ Posted in <#${rules.channelId}> ${rules.verifyRoleId ? `(Verify Role: <@&${rules.verifyRoleId}>)` : ''}`
      : '❌ Not Set (\`/rules send\` or \`/autoserver\`)';

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary || '#5865F2')
      .setTitle(`⚙️ ${config.botName || 'Hinata'} - Setup Dashboard`)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
      .setDescription(
        `Welcome to the **${config.botName || 'Hinata'} Bot Control Panel** for **${interaction.guild.name}**!\n` +
        `Below is the current configuration status of your server modules.\n\n` +
        `### ⚡ 1-Click Automated Setup\n` +
        `• **🚀 Instant Full Server Setup:** Use \`/autoserver\` or click the **1-Click Auto Setup** button below to create entire layouts, write rules, configure tickets & stats in 1-click!\n\n` +
        `### 📊 System Status Overview\n` +
        `• **📜 Rules & Verify Button:** ${rulesDisplay}\n` +
        `• **👑 Auto-Role System:** ${autoroleDisplay}\n` +
        `• **👋 Welcome Greetings:** ${welcome.enabled ? `✅ Enabled (<#${welcome.channelId}>)` : '❌ Disabled (\`/welcome setup\`)'}\n` +
        `• **📊 Live Server Stats:** ${serverstats.enabled ? `✅ Active (\`/serverstats status\`)` : '❌ Disabled (\`/serverstats setup\`)'}\n` +
        `• **🎫 Support Tickets:** ${ticket.categoryId || ticket.supportRoleId ? `✅ Configured` : '❌ Not Set (\`/ticket panel\`)'}\n` +
        `• **🛡️ ModLog Channel:** ${modlog ? `<#${modlog}>` : '❌ Not Set (\`/automod modlog\`)'}\n` +
        `• **⚡ AutoMod Protection:** ${automod.antiSpam || automod.antiInvite ? '✅ Active' : '⚠️ Default (\`/automod status\`)'}\n` +
        `• **🔗 Invite Tracker:** ✅ Active (\`/invites check\`, \`/invites leaderboard\`)\n` +
        `• **🎭 Self-Roles Menus:** \`/selfroles preset\` (Gaming, Colors, Notifications)\n` +
        `• **🏗️ Server Templates:** \`/template list\` (37+ Themes & Xenon Importer)`
      )
      .setFooter({ text: `${config.botName || 'Hinata'} All-In-One Bot • Discord.js v14` })
      .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_setup_autoserver_open')
        .setLabel('⚡ 1-Click Auto Setup')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🚀'),
      new ButtonBuilder()
        .setCustomId('btn_setup_rules')
        .setLabel('Rules & Verify')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📜'),
      new ButtonBuilder()
        .setCustomId('btn_setup_autorole')
        .setLabel('Auto-Role')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('👑'),
      new ButtonBuilder()
        .setCustomId('btn_setup_templates')
        .setLabel('Templates')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🏗️'),
      new ButtonBuilder()
        .setCustomId('btn_setup_welcome')
        .setLabel('Welcome')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('👋')
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('btn_setup_automod')
        .setLabel('AutoMod')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🛡️'),
      new ButtonBuilder()
        .setCustomId('btn_setup_tickets')
        .setLabel('Tickets')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🎫'),
      new ButtonBuilder()
        .setCustomId('btn_setup_invites')
        .setLabel('Invite Tracker')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('📊')
    );

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp({ embeds: [embed], components: [row1, row2] }).catch(() => null);
    } else {
      return interaction.reply({ embeds: [embed], components: [row1, row2] }).catch(() => null);
    }
  }
};
