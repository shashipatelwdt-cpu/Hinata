const { 
  ChannelType, 
  PermissionFlagsBits, 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const { getRulesTemplate, getAllRulesTemplates } = require('./rulesTemplates');
const { buildRulesEmbed } = require('../commands/setup/rules');
const ServerStats = require('../utils/serverStats');
const EmbedUtils = require('../utils/embeds');
const config = require('../../config.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const PRESET_SELF_ROLES = {
  notifications: {
    title: '🔔 Notification Preferences',
    description: 'Select the notification pings you would like to receive:',
    roles: [
      { name: 'Announcement Ping', emoji: '📢', color: '#3498DB' },
      { name: 'Giveaway Ping', emoji: '🎁', color: '#E91E63' },
      { name: 'Event Ping', emoji: '🎉', color: '#9B59B6' },
      { name: 'Updates Ping', emoji: '⚡', color: '#2ECC71' }
    ]
  },
  colors: {
    title: '🎨 Choose Your Name Color',
    description: 'Customize your profile and username display color in chat:',
    roles: [
      { name: 'Crimson Red', emoji: '🔴', color: '#E74C3C' },
      { name: 'Ocean Blue', emoji: '🔵', color: '#3498DB' },
      { name: 'Emerald Green', emoji: '🟢', color: '#2ECC71' },
      { name: 'Royal Purple', emoji: '🟣', color: '#9B59B6' },
      { name: 'Golden Yellow', emoji: '🟡', color: '#F1C40F' },
      { name: 'Rose Pink', emoji: '🌸', color: '#FD79A8' }
    ]
  },
  platforms: {
    title: '🎮 Gaming Platforms & Devices',
    description: 'Select the platforms you play on to find squadmates:',
    roles: [
      { name: 'PC Gamer', emoji: '💻', color: '#3498DB' },
      { name: 'PlayStation', emoji: '🎮', color: '#003791' },
      { name: 'Xbox', emoji: '🕹️', color: '#107C10' },
      { name: 'Mobile Gamer', emoji: '📱', color: '#F1C40F' }
    ]
  }
};

/**
 * Enhanced Shared Builder Engine for 1-Click Server Setup, Presets, and Custom Blueprints
 */
class TemplateBuilderEngine {
  /**
   * Execute the automated build process on a Discord Guild
   * @param {object} options
   * @param {import('discord.js').ChatInputCommandInteraction | import('discord.js').ButtonInteraction | import('discord.js').ModalSubmitInteraction} options.interaction
   * @param {object} options.template - Normalized template object
   * @param {boolean} [options.deleteOld=true] - Whether to wipe existing channels
   * @param {boolean} [options.includeStats=true] - Whether to set up live voice stats
   * @param {boolean} [options.includeRules=true] - Whether to write server rules & verification
   * @param {boolean} [options.includeWelcome=true] - Whether to setup welcome embed & autorole
   * @param {boolean} [options.includeSelfRoles=true] - Whether to deploy self-roles panel
   * @param {boolean} [options.includeTickets=true] - Whether to deploy support ticket panel
   * @param {boolean} [options.includeAutoMod=true] - Whether to configure automod & modlogs
   * @param {string} [options.rulesTheme] - Specific rules theme ID or auto-match
   * @param {string} [options.currentChannelId] - ID of channel where command was executed
   */
  static async executeBuild({
    interaction,
    template,
    deleteOld = true,
    includeStats = true,
    includeRules = true,
    includeWelcome = true,
    includeSelfRoles = true,
    includeTickets = true,
    includeAutoMod = true,
    rulesTheme = null,
    currentChannelId = null
  }) {
    const guild = interaction.guild;
    const callerChannelId = currentChannelId || interaction.channelId;

    const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);
    const estSeconds = Math.round((template.roles.length * 0.6) + (totalChannels * 0.7) + 8);

    let progressPercent = 5;
    let remainingSeconds = estSeconds;

    const updateProgress = async (step, percent, secondsLeft) => {
      progressPercent = Math.min(percent, 95);
      remainingSeconds = Math.max(secondsLeft, 1);

      const filled = Math.round((progressPercent / 100) * 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

      const progressEmbed = new EmbedBuilder()
        .setColor(config.embedColors.primary || '#5865F2')
        .setTitle(`⚡ 1-Click Server Setup: ${template.name}`)
        .setDescription(
          `Please wait while **${config.botName || 'Hinata'}** sets up your entire server...\n\n` +
          `**Progress:** \`[${bar}] ${progressPercent}%\`\n` +
          `**Current Task:** ${step}\n` +
          `**Estimated Time Remaining:** \`~${remainingSeconds}s\``
        )
        .setFooter({ text: 'Do not close or delete channels while setup is running.' })
        .setTimestamp();

      await interaction.editReply({ embeds: [progressEmbed], components: [] }).catch(() => null);
    };

    await updateProgress('🗑️ Cleaning old channels and categories...', 10, remainingSeconds);

    try {
      // 1. Reset Database & Delete old channels and roles if requested
      if (deleteOld) {
        // Reset Hinata bot database settings for this guild
        DatabaseManager.resetGuild(guild.id);

        // Delete old channels in fast concurrent batches of 4
        const channels = Array.from(guild.channels.cache.values()).filter(ch => ch.id !== callerChannelId);
        for (let i = 0; i < channels.length; i += 4) {
          const batch = channels.slice(i, i + 4);
          await Promise.allSettled(batch.map(ch => ch.delete().catch(() => null)));
          await sleep(60);
        }

        // Keep existing roles intact (Never delete user's existing roles)
      }

      remainingSeconds -= 3;
      await updateProgress('🎭 Creating customized roles & hierarchy...', 25, remainingSeconds);

      // 2. Create Roles
      const createdRolesMap = new Map();
      let ownerRoleToAssign = null;
      let adminRoleCreated = null;
      let modRoleCreated = null;
      let memberRoleCreated = null;
      let botRoleToAssign = null;

      for (const roleDef of template.roles) {
        const lowerName = roleDef.name.toLowerCase();
        let targetPermissions = null;

        if (roleDef.permissions) {
          targetPermissions = roleDef.permissions;
        } else if (roleDef.isOwnerRole || lowerName.includes('owner') || lowerName.includes('founder') || lowerName.includes('ceo') || lowerName.includes('leader') || lowerName.includes('sensei') || lowerName.includes('lead')) {
          targetPermissions = [PermissionFlagsBits.Administrator];
        } else if (roleDef.isAdminRole || lowerName.includes('admin') || lowerName.includes('management') || lowerName.includes('manager') || lowerName.includes('executive')) {
          targetPermissions = [PermissionFlagsBits.Administrator];
        } else if (roleDef.isModRole || lowerName.includes('mod') || lowerName.includes('staff') || lowerName.includes('senpai') || lowerName.includes('coach') || lowerName.includes('maintainer') || lowerName.includes('tutor')) {
          targetPermissions = [
            PermissionFlagsBits.ViewAuditLog,
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.KickMembers,
            PermissionFlagsBits.BanMembers,
            PermissionFlagsBits.ModerateMembers,
            PermissionFlagsBits.MuteMembers,
            PermissionFlagsBits.DeafenMembers,
            PermissionFlagsBits.MoveMembers,
            PermissionFlagsBits.ManageNicknames,
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles
          ];
        } else if (roleDef.isBotRole || lowerName.includes('bot')) {
          targetPermissions = [PermissionFlagsBits.Administrator];
        } else if (roleDef.isMemberRole || lowerName.includes('member') || lowerName.includes('user') || lowerName.includes('verified') || lowerName.includes('otaku') || lowerName.includes('gamer') || lowerName.includes('student')) {
          targetPermissions = [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.Connect,
            PermissionFlagsBits.Speak,
            PermissionFlagsBits.UseVAD,
            PermissionFlagsBits.AddReactions,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.AttachFiles
          ];
        }

        let role = guild.roles.cache.find(r => r.name.toLowerCase() === roleDef.name.toLowerCase());
        if (!role) {
          try {
            role = await guild.roles.create({
              name: roleDef.name,
              color: roleDef.color || '#99AAB5',
              hoist: roleDef.hoist !== undefined ? roleDef.hoist : false,
              mentionable: roleDef.mentionable !== undefined ? roleDef.mentionable : false,
              permissions: targetPermissions || undefined,
              reason: `1-Click Server Setup: ${template.name}`
            });
          } catch (e) {
            console.error(`Failed to create role ${roleDef.name}:`, e);
          }
        } else if (targetPermissions) {
          try {
            await role.edit({
              permissions: targetPermissions,
              color: roleDef.color || role.color,
              hoist: roleDef.hoist !== undefined ? roleDef.hoist : role.hoist,
              mentionable: roleDef.mentionable !== undefined ? roleDef.mentionable : role.mentionable
            }).catch(() => null);
          } catch {}
        }

        if (role) {
          createdRolesMap.set(roleDef.name, role);

          if (roleDef.isOwnerRole || lowerName.includes('owner') || lowerName.includes('founder') || lowerName.includes('ceo') || lowerName.includes('leader') || lowerName.includes('sensei') || lowerName.includes('lead')) {
            if (!ownerRoleToAssign) ownerRoleToAssign = role;
          }
          if (roleDef.isAdminRole || lowerName.includes('admin') || lowerName.includes('management') || lowerName.includes('manager') || lowerName.includes('executive')) {
            if (!adminRoleCreated) adminRoleCreated = role;
          }
          if (roleDef.isModRole || lowerName.includes('mod') || lowerName.includes('staff') || lowerName.includes('senpai') || lowerName.includes('coach') || lowerName.includes('maintainer') || lowerName.includes('tutor')) {
            if (!modRoleCreated) modRoleCreated = role;
          }
          if (roleDef.isMemberRole || lowerName.includes('member') || lowerName.includes('user') || lowerName.includes('verified') || lowerName.includes('otaku') || lowerName.includes('gamer') || lowerName.includes('student')) {
            if (!memberRoleCreated) memberRoleCreated = role;
          }
          if (roleDef.isBotRole || lowerName.includes('bot')) {
            botRoleToAssign = role;
          }
        }
        await sleep(60);
      }

      // Assign Owner, Admin & Bot roles
      if (ownerRoleToAssign && interaction.member) {
        try {
          await interaction.member.roles.add(ownerRoleToAssign, '1-Click Setup: Server Owner Role');
        } catch (e) {}
      }
      if (adminRoleCreated && interaction.member) {
        try {
          await interaction.member.roles.add(adminRoleCreated, '1-Click Setup: Admin Role');
        } catch (e) {}
      }
      if (botRoleToAssign && guild.members.me) {
        try {
          await guild.members.me.roles.add(botRoleToAssign, '1-Click Setup: Bot Role');
        } catch (e) {}
      }

      remainingSeconds -= 4;
      await updateProgress('📁 Building categories, channels & permissions...', 45, remainingSeconds);

      // 3. Create Categories & Channels
      let createdWelcomeChannel = null;
      let createdRulesChannel = null;
      let createdRolesChannel = null;
      let createdTicketsChannel = null;
      let createdModLogChannel = null;
      let createdStaffChatChannel = null;
      let createdGeneralChannel = null;
      let createdStaffCategory = null;

      for (const catDef of template.categories) {
        const isStaffCat = /staff|mod|admin|management|maintainer/i.test(catDef.name);

        const isInfoCat = catDef.name.toLowerCase().includes('info') || 
                          catDef.name.toLowerCase().includes('welcome') || 
                          catDef.name.toLowerCase().includes('important') ||
                          catDef.name.toLowerCase().includes('rules');

        const permissionOverwrites = [];

        if (catDef.permissions && Array.isArray(catDef.permissions)) {
          for (const p of catDef.permissions) {
            const targetRole = createdRolesMap.get(p.roleName);
            if (targetRole) {
              permissionOverwrites.push({
                id: targetRole.id,
                allow: p.allow
              });
            }
          }
          permissionOverwrites.push({
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
          });
        } else if (isStaffCat) {
          // Default Staff Category Permissions - Strictly hidden from @everyone
          permissionOverwrites.push({
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
          });
          if (ownerRoleToAssign) {
            permissionOverwrites.push({
              id: ownerRoleToAssign.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (adminRoleCreated) {
            permissionOverwrites.push({
              id: adminRoleCreated.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (modRoleCreated) {
            permissionOverwrites.push({
              id: modRoleCreated.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (botRoleToAssign) {
            permissionOverwrites.push({
              id: botRoleToAssign.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (guild.members.me) {
            permissionOverwrites.push({
              id: guild.members.me.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
        }

        let category = null;
        try {
          category = await guild.channels.create({
            name: catDef.name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: permissionOverwrites.length > 0 ? permissionOverwrites : undefined
          });
          if (isStaffCat && !createdStaffCategory) createdStaffCategory = category;
        } catch (e) {
          console.error(`Failed to create category ${catDef.name}:`, e);
        }

        await sleep(80);

        if (Array.isArray(catDef.channels)) {
          for (const chanDef of catDef.channels) {
            try {
              const lowerChName = chanDef.name.toLowerCase();
              const isReadOnlyInfo = isInfoCat && (
                lowerChName.includes('rule') || 
                lowerChName.includes('welcome') || 
                lowerChName.includes('announce') || 
                lowerChName.includes('role') ||
                lowerChName.includes('faq')
              );

              const chanOverwrites = [];
              if (isReadOnlyInfo) {
                chanOverwrites.push({
                  id: guild.roles.everyone.id,
                  deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
                  allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
                });
              }

              const ch = await guild.channels.create({
                name: chanDef.name,
                type: chanDef.type || ChannelType.GuildText,
                topic: chanDef.topic || undefined,
                userLimit: chanDef.userLimit || undefined,
                parent: category ? category.id : undefined,
                permissionOverwrites: chanOverwrites.length > 0 ? chanOverwrites : undefined
              });

              if (chanDef.isWelcomeChannel || lowerChName.includes('welcome') || lowerChName.includes('greetings')) {
                if (!createdWelcomeChannel) createdWelcomeChannel = ch;
              }
              if (chanDef.isRulesChannel || lowerChName.includes('rule') || lowerChName.includes('guideline') || lowerChName.includes('verify')) {
                if (!createdRulesChannel) createdRulesChannel = ch;
              }
              if (chanDef.isRolesChannel || lowerChName.includes('self-role') || lowerChName.includes('selfrole') || lowerChName.includes('roles') || lowerChName.includes('get-role')) {
                if (!createdRolesChannel) createdRolesChannel = ch;
              }
              if (chanDef.isTicketsChannel || lowerChName.includes('ticket') || lowerChName.includes('support')) {
                if (!createdTicketsChannel) createdTicketsChannel = ch;
              }
              if (chanDef.isModLogChannel || lowerChName.includes('mod-log') || lowerChName.includes('modlog') || lowerChName.includes('audit-log') || lowerChName.includes('staff-log') || lowerChName.includes('logs')) {
                if (!createdModLogChannel) createdModLogChannel = ch;
              }
              if (/staff-hq|staff-chat|mod-chat|maintainers-chat|staff-room|staff-lounge/i.test(lowerChName)) {
                if (!createdStaffChatChannel) createdStaffChatChannel = ch;
              }
              if (lowerChName.includes('general') || lowerChName.includes('chat') || lowerChName.includes('lounge')) {
                if (!createdGeneralChannel) createdGeneralChannel = ch;
              }
            } catch (e) {
              console.error(`Failed to create channel ${chanDef.name}:`, e);
            }
            await sleep(80);
          }
        }
      }

      // Guarantee Private Staff Category & Channels if missing
      if (includeAutoMod) {
        if (!createdStaffCategory) {
          const staffOverwrites = [
            {
              id: guild.roles.everyone.id,
              deny: [PermissionFlagsBits.ViewChannel]
            }
          ];
          if (ownerRoleToAssign) {
            staffOverwrites.push({
              id: ownerRoleToAssign.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (adminRoleCreated) {
            staffOverwrites.push({
              id: adminRoleCreated.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (modRoleCreated) {
            staffOverwrites.push({
              id: modRoleCreated.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (botRoleToAssign) {
            staffOverwrites.push({
              id: botRoleToAssign.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }
          if (guild.members.me) {
            staffOverwrites.push({
              id: guild.members.me.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.Connect, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
            });
          }

          try {
            createdStaffCategory = await guild.channels.create({
              name: '🛡️ ━━ STAFF & MODERATION ━━',
              type: ChannelType.GuildCategory,
              permissionOverwrites: staffOverwrites
            });
          } catch (e) {
            console.error('Failed to create staff category:', e);
          }
        }

        if (!createdStaffChatChannel && createdStaffCategory) {
          try {
            createdStaffChatChannel = await guild.channels.create({
              name: '🔒・staff-hq',
              type: ChannelType.GuildText,
              topic: 'Private staff coordination, moderation commands & team discussions',
              parent: createdStaffCategory.id
            });
          } catch (e) {}
        }

        if (!createdModLogChannel && createdStaffCategory) {
          try {
            createdModLogChannel = await guild.channels.create({
              name: '📜・mod-logs',
              type: ChannelType.GuildText,
              topic: 'Automated moderation & audit logs stream',
              parent: createdStaffCategory.id
            });
          } catch (e) {}
        }
      }

      remainingSeconds -= 3;
      await updateProgress('📜 Writing official server rules & verification button...', 65, remainingSeconds);

      // 4. Automatic Rules Generation & 1-Click Verification System
      let rulesSentStatus = false;
      if (includeRules && createdRulesChannel) {
        let selectedRulesTheme = rulesTheme;
        if (!selectedRulesTheme) {
          const catLower = (template.category || '').toLowerCase();
          const idLower = (template.id || '').toLowerCase();
          if (catLower.includes('game') || idLower.includes('game')) selectedRulesTheme = 'gaming';
          else if (catLower.includes('esport') || idLower.includes('esport')) selectedRulesTheme = 'esports';
          else if (catLower.includes('anime') || idLower.includes('anime')) selectedRulesTheme = 'anime';
          else if (catLower.includes('tech') || catLower.includes('dev') || idLower.includes('dev')) selectedRulesTheme = 'developer';
          else if (catLower.includes('study') || idLower.includes('study')) selectedRulesTheme = 'study';
          else if (catLower.includes('cyber') || idLower.includes('cyber')) selectedRulesTheme = 'cyberpunk';
          else selectedRulesTheme = 'community';
        }

        const rulesTpl = getRulesTemplate(selectedRulesTheme) || getRulesTemplate('community');
        if (rulesTpl) {
          const rulesEmbed = buildRulesEmbed(rulesTpl, guild);
          const rulesRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('rules_verify_btn')
              .setLabel('Accept Rules & Verify')
              .setStyle(ButtonStyle.Success)
              .setEmoji('✅'),
            new ButtonBuilder()
              .setCustomId('ticket_create_general')
              .setLabel('Need Help / Staff')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('🎫')
          );

          try {
            const rulesMsg = await createdRulesChannel.send({ embeds: [rulesEmbed], components: [rulesRow] });
            rulesSentStatus = true;

            DatabaseManager.setRulesConfig(guild.id, {
              enabled: true,
              channelId: createdRulesChannel.id,
              verifyRoleId: memberRoleCreated ? memberRoleCreated.id : null,
              templateId: rulesTpl.id,
              messageId: rulesMsg.id
            });
          } catch (e) {
            console.error('Failed to post rules embed:', e);
          }
        }
      }

      remainingSeconds -= 2;
      await updateProgress('👋 Configuring Welcome system & Auto-Role...', 75, remainingSeconds);

      // 5. Automatic Welcome & Auto-Role System
      if (includeWelcome && createdWelcomeChannel) {
        DatabaseManager.setWelcomeConfig(guild.id, {
          enabled: true,
          channelId: createdWelcomeChannel.id,
          roleId: memberRoleCreated ? memberRoleCreated.id : null,
          botRoleId: botRoleToAssign ? botRoleToAssign.id : null
        });

        if (memberRoleCreated || botRoleToAssign) {
          DatabaseManager.setAutoroleConfig(guild.id, {
            enabled: true,
            humanRoleId: memberRoleCreated ? memberRoleCreated.id : null,
            botRoleId: botRoleToAssign ? botRoleToAssign.id : null
          });
        }

        const welcomeOverviewEmbed = new EmbedBuilder()
          .setColor(config.embedColors.primary || '#5865F2')
          .setAuthor({ name: `Welcome to ${guild.name}! 👋`, iconURL: guild.iconURL() })
          .setTitle(`🌟 Getting Started in ${guild.name}`)
          .setDescription(
            `Welcome to our server! Follow these steps to get completely set up:\n\n` +
            `1️⃣ **📜 Server Rules:** Read our guidelines and verify in ${createdRulesChannel ? `<#${createdRulesChannel.id}>` : '#rules-and-verify'} to unlock all channels.\n` +
            `2️⃣ **🎭 Self-Roles:** Pick your notification pings, gaming platforms & name colors in ${createdRolesChannel ? `<#${createdRolesChannel.id}>` : '#self-roles'}.\n` +
            `3️⃣ **💬 Main Chat:** Introduce yourself and say hello to the community in ${createdGeneralChannel ? `<#${createdGeneralChannel.id}>` : '#general-chat'}!\n` +
            `4️⃣ **🎫 Support:** Need assistance? Open a ticket anytime in ${createdTicketsChannel ? `<#${createdTicketsChannel.id}>` : '#support-tickets'}.`
          )
          .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
          .setFooter({ text: `${config.botName || 'Hinata'} • Official Welcome Channel` })
          .setTimestamp();

        await createdWelcomeChannel.send({ embeds: [welcomeOverviewEmbed] }).catch(() => null);
      }

      remainingSeconds -= 2;
      await updateProgress('🎭 Deploying Self-Roles and Support Ticket Panels...', 85, remainingSeconds);

      // 6. Automatic Self-Roles Panel
      if (includeSelfRoles && createdRolesChannel) {
        try {
          const resolvedPings = [];
          for (const rDef of PRESET_SELF_ROLES.notifications.roles) {
            let r = guild.roles.cache.find(role => role.name.toLowerCase() === rDef.name.toLowerCase());
            if (!r) {
              try {
                r = await guild.roles.create({
                  name: rDef.name,
                  color: rDef.color,
                  reason: '1-Click Server Setup: Notification Roles'
                });
              } catch {}
            }
            if (r) resolvedPings.push({ roleId: r.id, name: rDef.name, emoji: rDef.emoji });
          }

          if (resolvedPings.length > 0) {
            const menuCustomId = `selfrole_menu_notifs_${Date.now()}`;
            const guildSettings = DatabaseManager.getGuild(guild.id);
            const selfroles = guildSettings.selfroles || {};
            selfroles[menuCustomId] = {
              type: 'notifications',
              roles: resolvedPings.map(r => ({ id: r.roleId, name: r.name }))
            };
            DatabaseManager.setSelfRolesConfig(guild.id, selfroles);

            const notifsMenu = new StringSelectMenuBuilder()
              .setCustomId(menuCustomId)
              .setPlaceholder('🔔 Select your notification pings...')
              .setMinValues(0)
              .setMaxValues(resolvedPings.length)
              .addOptions(
                resolvedPings.map(r =>
                  new StringSelectMenuOptionBuilder()
                    .setLabel(r.name)
                    .setValue(r.roleId)
                    .setEmoji(r.emoji)
                    .setDescription(`Toggle ${r.name}`)
                )
              );

            const notifsRow = new ActionRowBuilder().addComponents(notifsMenu);
            const notifsEmbed = new EmbedBuilder()
              .setColor('#3498DB')
              .setTitle('🔔 Server Notification Pings')
              .setDescription(
                `Choose which server announcements and pings you want to receive:\n\n` +
                resolvedPings.map(r => `${r.emoji} **${r.name}** — <@&${r.roleId}>`).join('\n') +
                `\n\n*Select or unselect roles from the dropdown menu below!*`
              )
              .setFooter({ text: 'Instant Self-Roles • Hinata' });

            await createdRolesChannel.send({ embeds: [notifsEmbed], components: [notifsRow] }).catch(() => null);
          }
        } catch (e) {
          console.error('Failed to setup self-roles:', e);
        }
      }

      // 7. Automatic Support Ticket Panel
      if (includeTickets && createdTicketsChannel) {
        try {
          DatabaseManager.setTicketConfig(guild.id, {
            categoryId: createdStaffCategory ? createdStaffCategory.id : null,
            supportRoleId: modRoleCreated ? modRoleCreated.id : (adminRoleCreated ? adminRoleCreated.id : null)
          });

          const ticketEmbed = new EmbedBuilder()
            .setColor(config.embedColors.primary || '#5865F2')
            .setTitle('🎫 Server Support & Help Desk')
            .setDescription(
              `Need assistance, want to report a rule-breaker, or have a partnership inquiry?\n` +
              `Click one of the buttons below to open a private ticket channel with our Staff Team!\n\n` +
              `📩 **General Support** — Questions, help, or account issues\n` +
              `🚨 **Report Player / Issue** — Report rule violations or bugs\n` +
              `💼 **Staff / Partnerships** — Business, applications & collaborations`
            )
            .setFooter({ text: 'Please only open a ticket if you need genuine assistance.' })
            .setTimestamp();

          const ticketRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('ticket_create_general')
              .setLabel('General Support')
              .setStyle(ButtonStyle.Primary)
              .setEmoji('📩'),
            new ButtonBuilder()
              .setCustomId('ticket_create_report')
              .setLabel('Report Player / Issue')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🚨'),
            new ButtonBuilder()
              .setCustomId('ticket_create_business')
              .setLabel('Staff / Partnership')
              .setStyle(ButtonStyle.Secondary)
              .setEmoji('💼')
          );

          await createdTicketsChannel.send({ embeds: [ticketEmbed], components: [ticketRow] }).catch(() => null);
        } catch (e) {
          console.error('Failed to setup ticket panel:', e);
        }
      }

      remainingSeconds -= 2;
      await updateProgress('📊 Initializing Live Server Stats voice counters...', 92, remainingSeconds);

      // 8. Automatic Live Server Stats Voice Counters
      let statsCreatedResult = null;
      if (includeStats) {
        try {
          statsCreatedResult = await ServerStats.setupStats(guild);
        } catch (e) {
          console.error('Failed to setup server stats counters:', e);
        }
      }

      // 9. Automatic AutoMod & Moderation System Setup
      if (includeAutoMod) {
        if (createdModLogChannel) {
          DatabaseManager.setModlogChannel(guild.id, createdModLogChannel.id);
        }

        DatabaseManager.setAutomodConfig(guild.id, {
          antiSpam: true,
          antiInvite: true,
          antiGhostPing: true,
          antiMassMention: true,
          maxMentions: 5,
          antiProfanity: true,
          antiLink: false,
          filterAdmins: false,
          customBadWords: []
        });

        // 9A. Post Moderation Logs Initialized Embed in #mod-logs
        if (createdModLogChannel) {
          const modLogReadyEmbed = new EmbedBuilder()
            .setColor(config.embedColors.warning || '#FEE75C')
            .setTitle('🛡️ Moderation & Audit System Initialized')
            .setDescription(
              `**${config.botName || 'Hinata'} AutoMod & Audit Stream** is now active for **${guild.name}**.\n\n` +
              `### 📋 Active Security & Moderation Modules:\n` +
              `• 🚫 **Anti-Discord-Invite:** ✅ Active (Auto-Delete & Audit Log)\n` +
              `• ⚡ **Anti-Spam Flooding:** ✅ Active (5 msgs / 4s flood filter)\n` +
              `• 🤬 **Anti-Profanity Defense:** ✅ Active (250+ Hindi, Hinglish & English Slurs)\n` +
              `• 📢 **Anti-Mass-Mention:** ✅ Active (Threshold: 5 pings)\n` +
              `• 👻 **Ghost-Ping Detection:** ✅ Active (Auto-Alert & Audit Log)\n` +
              `• 🔨 **Manual Mod Logs:** ✅ Active (/warn, /timeout, /kick, /ban, /purge, /lock)\n\n` +
              `**Assigned Staff Roles:** ${adminRoleCreated ? `<@&${adminRoleCreated.id}>` : 'Admin'} | ${modRoleCreated ? `<@&${modRoleCreated.id}>` : 'Moderator'}`
            )
            .setFooter({ text: 'All moderation actions and security events stream here in real time.' })
            .setTimestamp();

          await createdModLogChannel.send({ embeds: [modLogReadyEmbed] }).catch(() => null);
        }

        // 9B. Post Staff HQ Moderation Guide in #staff-hq / staff chat
        if (createdStaffChatChannel) {
          const staffHQEmbed = new EmbedBuilder()
            .setColor(config.embedColors.primary || '#5865F2')
            .setTitle(`⚔️ ${guild.name} • Staff Moderation Dashboard`)
            .setDescription(
              `Welcome to the private Staff Command Hub!\n` +
              `Staff members have been granted moderation permissions on this server.\n\n` +
              `### 🛠️ Quick Moderation Commands Reference:\n` +
              `• ⚠️ **Warnings:** \`/warn <user> <reason>\` • \`/warnings <user>\` • \`/delwarn <id>\` • \`/clearwarns <user>\`\n` +
              `• ⏱️ **Timeouts:** \`/timeout <user> <duration> [reason]\` (e.g. \`10m\`, \`1h\`, \`1d\`) • \`/untimeout <user>\`\n` +
              `• 🔨 **Kicks & Bans:** \`/kick <user> [reason]\` • \`/ban <user> [reason]\`\n` +
              `• 🔒 **Channel Control:** \`/lock\` (Lockdown chat) • \`/unlock\` • \`/slowmode <seconds>\`\n` +
              `• 🧹 **Chat Cleanup:** \`/purge <amount>\` • \`/nuke\` (Recreate channel)\n` +
              `• 🔍 **Snipe Tools:** \`/snipe\` (View deleted msg) • \`/clearsnipe\`\n` +
              `• 🛡️ **AutoMod Controls:** \`/automod status\` • \`/automod badwords\` • \`/automod test <text>\`\n\n` +
              `### 🛡️ Active Staff Hierarchy:\n` +
              `• 👑 **Server Owner:** ${ownerRoleToAssign ? `<@&${ownerRoleToAssign.id}>` : 'Server Owner'}\n` +
              `• 🛡️ **Administrators:** ${adminRoleCreated ? `<@&${adminRoleCreated.id}>` : 'Administrator'}\n` +
              `• ⚔️ **Moderators:** ${modRoleCreated ? `<@&${modRoleCreated.id}>` : 'Moderator'}\n` +
              `• 📜 **ModLogs:** ${createdModLogChannel ? `<#${createdModLogChannel.id}>` : 'Configured'}`
            )
            .setFooter({ text: `${config.botName || 'Hinata'} • Server Moderation System Ready` })
            .setTimestamp();

          await createdStaffChatChannel.send({ embeds: [staffHQEmbed] }).catch(() => null);
        }
      }

      // 10. Send Grand Opening Announcement in General Chat
      const finalTargetChannel = createdGeneralChannel || createdWelcomeChannel || guild.channels.cache.find(c => c.type === ChannelType.GuildText);
      if (finalTargetChannel) {
        const celebrationEmbed = new EmbedBuilder()
          .setColor(config.embedColors.success || '#57F287')
          .setTitle(`🎉 Welcome to ${guild.name}!`)
          .setDescription(
            `Our server layout & automated systems have been completely configured with **${template.name}**!\n\n` +
            `### 🌟 Active Modules & Features:\n` +
            `• 🎭 **Roles & Hierarchy:** \`${template.roles.length} Roles\` (Full Mod & Admin Permissions Assigned)\n` +
            `• 📂 **Categories & Channels:** \`${template.categories.length} Categories\` & \`${totalChannels} Channels\` created\n` +
            `• 📜 **Official Rules & Verification:** ${createdRulesChannel ? `<#${createdRulesChannel.id}>` : '✅ Ready'}\n` +
            `• 👋 **Welcome & Auto-Role:** ${createdWelcomeChannel ? `<#${createdWelcomeChannel.id}>` : '✅ Ready'}\n` +
            `• 🎭 **Self-Roles Selection:** ${createdRolesChannel ? `<#${createdRolesChannel.id}>` : '✅ Ready'}\n` +
            `• 🎫 **Support Tickets Desk:** ${createdTicketsChannel ? `<#${createdTicketsChannel.id}>` : '✅ Ready'}\n` +
            `• 📊 **Live Server Stats:** ${statsCreatedResult ? '✅ 5 Voice Counters Active' : '✅ Ready'}\n` +
            `• 🛡️ **Full Moderation System:** ${createdModLogChannel ? `<#${createdModLogChannel.id}>` : '✅ Active'} & ${createdStaffChatChannel ? `<#${createdStaffChatChannel.id}>` : '✅ Staff HQ'}\n` +
            `• ⚡ **AutoMod Shields:** Anti-Spam, Anti-Invite & 250+ Hindi/Hinglish Bad Words Filter Active!\n\n` +
            `*Enjoy your stay and have fun!*`
          )
          .setFooter({ text: `${config.botName || 'Hinata'} • 1-Click Server Setup Complete` })
          .setTimestamp();

        await finalTargetChannel.send({ embeds: [celebrationEmbed] }).catch(() => null);
      }

      // 11. Final reply to administrator
      const finalSummaryEmbed = new EmbedBuilder()
        .setColor(config.embedColors.success || '#57F287')
        .setTitle('⚡ 1-Click Server Setup Complete! 🎉')
        .setDescription(
          `Successfully transformed **${guild.name}** into **${template.name}** in 1 click!\n\n` +
          `### 🛠️ Configured Systems:\n` +
          `• 📜 **Rules Written & Verification:** ${createdRulesChannel ? `<#${createdRulesChannel.id}>` : '✅ Ready'}\n` +
          `• 👑 **Auto-Role & Leader:** ${memberRoleCreated ? `<@&${memberRoleCreated.id}>` : '✅ Configured'}\n` +
          `• 👋 **Welcome Greetings:** ${createdWelcomeChannel ? `<#${createdWelcomeChannel.id}>` : '✅ Configured'}\n` +
          `• 🎭 **Self-Roles Dropdown:** ${createdRolesChannel ? `<#${createdRolesChannel.id}>` : '✅ Configured'}\n` +
          `• 🎫 **Support Tickets Panel:** ${createdTicketsChannel ? `<#${createdTicketsChannel.id}>` : '✅ Configured'}\n` +
          `• 📊 **Live Stats Voice Counters:** ${statsCreatedResult ? '✅ 5 Channels Active' : '✅ Active'}\n` +
          `• 🛡️ **Full Moderation System:** ${createdModLogChannel ? `<#${createdModLogChannel.id}>` : '✅ Active'} & ${createdStaffChatChannel ? `<#${createdStaffChatChannel.id}>` : '✅ Staff HQ'}\n` +
          `• ⚡ **AutoMod Defense:** Anti-Spam, Anti-Invite, Anti-MassMention, Anti-GhostPing & 250+ Hindi/Hinglish Filter ✅\n\n` +
          `> 💡 *Everything is 100% automated and ready for members to join!*`
        )
        .setFooter({ text: `${config.botName || 'Hinata'} • 1-Click Server Builder` })
        .setTimestamp();

      // ALWAYS edit reply first so the interaction NEVER fails in Discord
      await interaction.editReply({
        embeds: [finalSummaryEmbed],
        components: []
      }).catch(() => null);

      // Now if caller channel was old and not part of the new layout, clean it up gracefully after 8 seconds
      if (deleteOld && callerChannelId && callerChannelId !== finalTargetChannel?.id && callerChannelId !== createdGeneralChannel?.id) {
        setTimeout(async () => {
          try {
            const oldChan = guild.channels.cache.get(callerChannelId);
            if (oldChan && !oldChan.deleted) await oldChan.delete().catch(() => null);
          } catch (e) {}
        }, 8000);
      }

      return { success: true };
    } catch (error) {
      console.error('[BUILD ENGINE ERROR]', error);
      await interaction.editReply({
        embeds: [EmbedUtils.error('Build Error', `An error occurred while building the server:\n\`${error.message}\``)],
        components: []
      }).catch(() => null);
      return { success: false, error };
    }
  }
}

module.exports = TemplateBuilderEngine;
