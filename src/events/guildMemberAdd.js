const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const ModLogger = require('../utils/logger');
const ServerStats = require('../utils/serverStats');
const InviteTracker = require('../utils/inviteTracker');
const config = require('../../config.json');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const guild = member.guild;

    // 0. Update Live Server Stats Counters
    ServerStats.updateGuildStats(guild).catch(() => null);

    // 1. Process Invite Tracker with timeout protection
    let inviteInfo = null;
    try {
      const trackerPromise = InviteTracker.trackJoin(member);
      const timeoutPromise = new Promise(res => setTimeout(() => res(null), 2500));
      inviteInfo = await Promise.race([trackerPromise, timeoutPromise]);
    } catch (err) {
      console.error('[INVITE TRACKER JOIN ERROR]', err);
    }

    const inviter = inviteInfo?.inviter || null;
    const inviterStats = inviteInfo?.inviterStats || null;
    const isFake = inviteInfo?.isFake || false;
    const isVanity = inviteInfo?.isVanity || false;
    const inviteCode = inviteInfo?.inviteCode || 'Unknown';

    const guildSettings = DatabaseManager.getGuild(guild.id);
    const welcome = { ...config.defaultSettings.welcome, ...(guildSettings.welcome || {}) };

    // 2. Robust Auto-Role Assignment
    const autorole = guildSettings.autorole || {};
    const humanRoleId = autorole.humanRoleId || welcome.roleId || null;
    const botRoleId = autorole.botRoleId || welcome.botRoleId || null;
    
    // Auto-role is active if explicitly enabled or if a role is configured and not explicitly toggled off
    const isAutoRoleActive = (autorole.enabled === true) || (autorole.enabled !== false && (!!humanRoleId || !!botRoleId));

    if (isAutoRoleActive) {
      try {
        const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
        const targetRoleId = member.user.bot ? (botRoleId || humanRoleId) : humanRoleId;

        if (targetRoleId && botMember) {
          const targetRole = guild.roles.cache.get(targetRoleId) || await guild.roles.fetch(targetRoleId).catch(() => null);
          if (targetRole) {
            const hasManageRoles = botMember.permissions.has('ManageRoles') || botMember.permissions.has('Administrator');
            const canManageRole = botMember.roles.highest.position > targetRole.position;

            if (!hasManageRoles) {
              console.warn(`[AUTOROLE PERMISSION ERROR] Bot lacks 'Manage Roles' / 'Administrator' permission in guild "${guild.name}" (${guild.id}).`);
            } else if (!canManageRole) {
              console.warn(`[AUTOROLE HIERARCHY ERROR] Target role "${targetRole.name}" is higher or equal to Hinata's highest role ("${botMember.roles.highest.name}") in "${guild.name}". Please move Hinata's role above "${targetRole.name}" in Server Settings > Roles.`);
            } else {
              await member.roles.add(targetRole, `Hinata Auto-Role: New ${member.user.bot ? 'bot' : 'member'} join`).catch(roleErr => {
                console.error(`[AUTOROLE ASSIGN ERROR in ${guild.name}]:`, roleErr.message);
              });
              
              // Audit log for role assignment
              await ModLogger.log(guild, {
                action: 'Auto-Role Assigned',
                target: member.user,
                color: config.embedColors.info,
                fields: [
                  { name: '🎭 Role Assigned', value: `${targetRole.name} (<@&${targetRole.id}>)`, inline: true },
                  { name: '👤 Type', value: member.user.bot ? '🤖 Bot Account' : '👤 Human Member', inline: true }
                ]
              }).catch(() => null);
            }
          } else {
            console.warn(`[AUTOROLE WARNING] Configured role ID ${targetRoleId} not found in guild "${guild.name}".`);
          }
        }
      } catch (err) {
        console.error('[AUTOROLE ERROR]', err);
      }
    }

    // 3. ModLogs Join Audit with Invite Details
    const inviteFields = [
      { name: '📅 Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
      { name: '👥 Member Count', value: `${guild.memberCount}`, inline: true }
    ];

    if (inviter) {
      inviteFields.push(
        { name: '🔗 Invited By', value: `<@${inviter.id}> (\`${inviter.tag}\`)`, inline: true },
        { 
          name: '📊 Inviter Stats', 
          value: `**${inviterStats ? inviterStats.total : 0}** net (✅ ${inviterStats ? inviterStats.regular : 0} | ❌ ${inviterStats ? inviterStats.leaves : 0} | ⚠️ ${inviterStats ? inviterStats.fake : 0} | 🎁 ${inviterStats ? inviterStats.bonus : 0})`, 
          inline: true 
        },
        { name: '🎟️ Code Used', value: `\`${inviteCode}\`${isFake ? ' • ⚠️ **Fake/Alt Flagged**' : ''}`, inline: true }
      );
    } else if (isVanity) {
      inviteFields.push({ name: '🔗 Invite Method', value: `Custom Vanity URL (\`discord.gg/${inviteCode}\`)`, inline: true });
    } else {
      inviteFields.push({ name: '🔗 Invite Method', value: 'Unknown / Direct Discovery', inline: true });
    }

    await ModLogger.log(guild, {
      action: 'Member Joined',
      target: member.user,
      color: isFake ? config.embedColors.warning : config.embedColors.success,
      fields: inviteFields
    }).catch(() => null);

    // 4. Welcome Message in Channel (STRICTLY in configured welcome channel - NEVER general chat)
    if (welcome.enabled) {
      let targetChannel = null;

      // 4a. Fetch configured channel with cache fallback
      if (welcome.channelId) {
        targetChannel = guild.channels.cache.get(welcome.channelId) || await guild.channels.fetch(welcome.channelId).catch(() => null);
      }

      // 4b. Strict Dedicated Channel Fallback (Only if explicitly named welcome/joins - NEVER general or system channel)
      if (!targetChannel || !targetChannel.isTextBased()) {
        targetChannel = guild.channels.cache.find(c => 
          c.isTextBased() && 
          /^(welcome|welcome-chat|welcome-lounge|joins|arrivals|member-log)$/i.test(c.name) &&
          c.permissionsFor(guild.members.me || guild.client.user)?.has(['ViewChannel', 'SendMessages', 'EmbedLinks'])
        );
      }

      // If no valid welcome channel found, skip cleanly rather than spamming general chat
      if (targetChannel && targetChannel.isTextBased()) {
        const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
        const perms = targetChannel.permissionsFor(botMember);

        if (perms && perms.has('ViewChannel') && perms.has('SendMessages') && perms.has('EmbedLinks')) {
          const inviterText = inviter ? `<@${inviter.id}>` : (isVanity ? 'Server Vanity URL' : 'Direct Link');
          const inviterTag = inviter ? inviter.tag : 'Vanity';
          const inviterInvites = inviterStats ? inviterStats.total.toString() : '0';

          const rawMsg = welcome.message || config.defaultSettings.welcome.message;
          const formattedMsg = rawMsg
            .replace(/{user}/g, `<@${member.user.id}>`)
            .replace(/{username}/g, member.user.username)
            .replace(/{tag}/g, member.user.tag)
            .replace(/{server}/g, guild.name)
            .replace(/{count}/g, guild.memberCount.toString())
            .replace(/{inviter}/g, inviterText)
            .replace(/{inviter_tag}/g, inviterTag)
            .replace(/{inviter_invites}/g, inviterInvites)
            .replace(/{invites}/g, inviterInvites);

          const rawTitle = welcome.title || `Welcome to ${guild.name}! 🎉`;
          const formattedTitle = rawTitle
            .replace(/{server}/g, guild.name)
            .replace(/{username}/g, member.user.username);

          const embed = new EmbedBuilder()
            .setColor(welcome.color || config.embedColors.primary)
            .setAuthor({ name: formattedTitle, iconURL: guild.iconURL() })
            .setDescription(formattedMsg)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields(
              { name: '👤 Account Age', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
              { name: '📊 Member Position', value: `**#${guild.memberCount}**`, inline: true }
            );

          if (inviter) {
            embed.addFields({
              name: '🔗 Invited By',
              value: `${inviterText} (${inviterInvites} invites)`,
              inline: true
            });
          }

          embed
            .setFooter({ text: `User ID: ${member.user.id}` })
            .setTimestamp();

          if (welcome.banner) {
            embed.setImage(welcome.banner);
          }

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('📜 Rules').setStyle(ButtonStyle.Primary).setCustomId('welcome_rules_btn'),
            new ButtonBuilder().setLabel('🎭 Self-Roles').setStyle(ButtonStyle.Secondary).setCustomId('welcome_roles_btn')
          );

          await targetChannel.send({
            content: `👋 Welcome <@${member.user.id}>!`,
            embeds: [embed],
            components: welcome.showButtons !== false ? [row] : []
          }).catch(sendErr => {
            console.error(`[WELCOME SEND ERROR in ${guild.name}]:`, sendErr.message);
          });
        } else {
          console.warn(`[WELCOME PERMISSION WARN] Bot lacks SendMessages/EmbedLinks in welcome channel #${targetChannel.name} (${guild.name}).`);
        }
      } else {
        console.warn(`[WELCOME CHANNEL WARN] No valid text channel found to send welcome message in ${guild.name} (${guild.id}).`);
      }
    }

    // 5. Welcome DM
    if (welcome.dmWelcome && !member.user.bot) {
      try {
        const dmMsg = (welcome.dmMessage || config.defaultSettings.welcome.dmMessage)
          .replace(/{username}/g, member.user.username)
          .replace(/{server}/g, guild.name);

        const dmEmbed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle(`Welcome to ${guild.name}! 👋`)
          .setDescription(dmMsg)
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .setTimestamp();

        await member.send({ embeds: [dmEmbed] }).catch(() => null);
      } catch {}
    }
  }
};
