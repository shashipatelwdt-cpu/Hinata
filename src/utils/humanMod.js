/**
 * Human-Like Progressive Moderation Engine
 * Enforces a natural, fair 5-stage discipline ladder with strike decay,
 * friendly conversational reminders, case logging, and interactive appeal support.
 * All messages, DMs, and notices are formatted in 100% clean English.
 */

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const ModLogger = require('./logger');
const config = require('../../config.json');

class HumanMod {
  /**
   * Process a detected infraction through the progressive discipline ladder
   * @param {import('discord.js').Message} message
   * @param {{
   *   rule: string,
   *   detail: string,
   *   evidence?: string,
   *   isDangerous?: boolean
   * }} infraction
   */
  static async processInfraction(message, infraction) {
    const guild = message.guild;
    const member = message.member;
    const user = message.author;
    if (!guild || !member) return;

    const modConfig = DatabaseManager.getHumanModConfig(guild.id);
    const decayDays = modConfig.strikeDecayDays || 7;

    // Fetch active non-expired strikes
    const activeStrikes = DatabaseManager.getActiveStrikes(guild.id, user.id);
    const strikeCount = activeStrikes.length;

    // Determine progressive stage
    // Strike 0 active -> Stage 1 (Verbal Reminder)
    // Strike 1 active -> Stage 2 (10-min Cool-Off)
    // Strike 2 active -> Stage 3 (1-hour Timeout + Recorded Strike)
    // Strike 3 active -> Stage 4 (24-hour Timeout + Severe Warning)
    // Strike 4+ active -> Stage 5 (Kick / Ban)
    let stage = strikeCount + 1;

    // If marked dangerous (e.g. malicious token logger, severe raid), fast-track to at least Stage 3
    if (infraction.isDangerous && stage < 3) {
      stage = 3;
    }

    const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
    const canModerate = botMember && member.moderatable && botMember.roles.highest.position > member.roles.highest.position;

    let actionApplied = 'Verbal Warning';
    let durationMs = 0;
    let newCase = null;
    let strikeAdded = false;

    if (stage === 1) {
      // ----------------------------------------------------
      // STAGE 1: Friendly Verbal Reminder in Channel
      // ----------------------------------------------------
      actionApplied = 'Verbal Reminder';

      const reminderEmbed = new EmbedBuilder()
        .setColor(config.embedColors?.warning || '#FEE75C')
        .setAuthor({ name: 'Friendly Moderator Reminder', iconURL: guild.iconURL() || undefined })
        .setDescription(
          `Hey ${user}, we noticed your message conflicted with our rules (*${infraction.rule}*).\n\n` +
          `Please remember to keep our chat friendly and respectful. No penalties have been applied — just a polite heads-up!`
        )
        .setFooter({ text: 'RAW HumanMod • Stage 1 Friendly Reminder' });

      const noticeMsg = await message.channel.send({ embeds: [reminderEmbed] }).catch(() => null);
      if (noticeMsg) {
        setTimeout(() => noticeMsg.delete().catch(() => null), 9000);
      }

      // Log discreetly to ModLog
      await ModLogger.log(guild, {
        action: 'AutoMod: Friendly Verbal Reminder',
        target: user,
        reason: infraction.detail || infraction.rule,
        color: config.embedColors.warning,
        fields: [
          { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: '📊 Member Discipline Stage', value: 'Stage 1 (0 Strikes)', inline: true },
          { name: '📝 Message Excerpt', value: `\`\`\`${(infraction.evidence || message.content || '[No text]').slice(0, 500)}\`\`\``, inline: false }
        ]
      }).catch(() => null);

      return { stage: 1, action: actionApplied, caseId: null };

    } else if (stage === 2) {
      // ----------------------------------------------------
      // STAGE 2: 10-Minute Cool-Off Timeout
      // ----------------------------------------------------
      durationMs = 10 * 60 * 1000;
      actionApplied = '10-Minute Cool-Off Timeout';

      if (canModerate && botMember.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        await member.timeout(durationMs, `RAW HumanMod Stage 2: ${infraction.rule}`).catch(() => null);
      }

      // Record Strike
      const strikeRes = DatabaseManager.addStrike(guild.id, user.id, infraction.rule, decayDays);
      strikeAdded = true;

      // Create Official Case
      newCase = DatabaseManager.addCase(guild.id, {
        userId: user.id,
        userTag: user.tag,
        modId: botMember?.id || 'AUTOMOD',
        modTag: 'RAW HumanMod',
        action: '10m Timeout',
        reason: infraction.rule,
        detail: infraction.detail,
        channelId: message.channel.id,
        duration: '10 Minutes',
        strikeNumber: strikeRes.totalActive
      });

      // Send Friendly Public Channel Notice
      const stage2Embed = new EmbedBuilder()
        .setColor(config.embedColors?.warning || '#FEE75C')
        .setDescription(
          `⏱️ ${user} has been given a **10-minute cool-off period** to help keep conversations civil.\n` +
          `*Reason: ${infraction.rule}*`
        )
        .setFooter({ text: 'Notice self-deletes in 8s' });

      const notice = await message.channel.send({ embeds: [stage2Embed] }).catch(() => null);
      if (notice) setTimeout(() => notice.delete().catch(() => null), 8000);

      // Send Informative DM with Appeal Button
      await this.sendDisciplineDM(user, guild, {
        stage: 2,
        action: '10-Minute Cool-Off Timeout',
        reason: infraction.rule,
        detail: infraction.detail,
        caseId: newCase.caseId,
        decayDays,
        totalStrikes: strikeRes.totalActive
      });

    } else if (stage === 3) {
      // ----------------------------------------------------
      // STAGE 3: Formal Strike + 1-Hour Timeout
      // ----------------------------------------------------
      durationMs = 60 * 60 * 1000;
      actionApplied = '1-Hour Timeout & Strike';

      if (canModerate && botMember.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        await member.timeout(durationMs, `RAW HumanMod Stage 3: ${infraction.rule}`).catch(() => null);
      }

      const strikeRes = DatabaseManager.addStrike(guild.id, user.id, infraction.rule, decayDays);
      strikeAdded = true;

      newCase = DatabaseManager.addCase(guild.id, {
        userId: user.id,
        userTag: user.tag,
        modId: botMember?.id || 'AUTOMOD',
        modTag: 'RAW HumanMod',
        action: '1h Timeout + Strike',
        reason: infraction.rule,
        detail: infraction.detail,
        channelId: message.channel.id,
        duration: '1 Hour',
        strikeNumber: strikeRes.totalActive
      });

      const stage3Embed = new EmbedBuilder()
        .setColor(config.embedColors?.danger || '#ED4245')
        .setDescription(
          `⚠️ ${user} received a formal disciplinary strike and a **1-hour timeout**.\n` +
          `**Case ID:** \`${newCase.caseId}\` • **Reason:** ${infraction.rule}`
        );

      const notice = await message.channel.send({ embeds: [stage3Embed] }).catch(() => null);
      if (notice) setTimeout(() => notice.delete().catch(() => null), 8000);

      await this.sendDisciplineDM(user, guild, {
        stage: 3,
        action: '1-Hour Disciplinary Timeout',
        reason: infraction.rule,
        detail: infraction.detail,
        caseId: newCase.caseId,
        decayDays,
        totalStrikes: strikeRes.totalActive
      });

    } else if (stage === 4) {
      // ----------------------------------------------------
      // STAGE 4: Severe Warning + 24-Hour Timeout
      // ----------------------------------------------------
      durationMs = 24 * 60 * 60 * 1000;
      actionApplied = '24-Hour Timeout & Final Strike';

      if (canModerate && botMember.permissions.has(PermissionFlagsBits.ModerateMembers)) {
        await member.timeout(durationMs, `RAW HumanMod Stage 4: ${infraction.rule}`).catch(() => null);
      }

      const strikeRes = DatabaseManager.addStrike(guild.id, user.id, infraction.rule, decayDays);
      strikeAdded = true;

      newCase = DatabaseManager.addCase(guild.id, {
        userId: user.id,
        userTag: user.tag,
        modId: botMember?.id || 'AUTOMOD',
        modTag: 'RAW HumanMod',
        action: '24h Timeout + Final Warning',
        reason: infraction.rule,
        detail: infraction.detail,
        channelId: message.channel.id,
        duration: '24 Hours',
        strikeNumber: strikeRes.totalActive
      });

      const stage4Embed = new EmbedBuilder()
        .setColor(config.embedColors?.danger || '#ED4245')
        .setDescription(
          `🚨 ${user} has reached **Stage 4** of disciplinary escalation. Placed on **24-hour timeout**.\n` +
          `**Notice:** Any further infractions will lead to immediate removal from the server.\n` +
          `**Case ID:** \`${newCase.caseId}\``
        );

      const notice = await message.channel.send({ embeds: [stage4Embed] }).catch(() => null);
      if (notice) setTimeout(() => notice.delete().catch(() => null), 8000);

      await this.sendDisciplineDM(user, guild, {
        stage: 4,
        action: '24-Hour Timeout (Final Warning)',
        reason: infraction.rule,
        detail: infraction.detail,
        caseId: newCase.caseId,
        decayDays,
        totalStrikes: strikeRes.totalActive
      });

    } else {
      // ----------------------------------------------------
      // STAGE 5: Removal (Kick / Ban)
      // ----------------------------------------------------
      actionApplied = 'Removal from Server (Kick/Ban)';

      const isBan = modConfig.finalStageAction === 'ban';
      let removed = false;

      if (canModerate) {
        if (isBan && botMember.permissions.has(PermissionFlagsBits.BanMembers)) {
          await member.ban({ reason: `RAW HumanMod Stage 5: Repeat infractions (${infraction.rule})` }).catch(() => null);
          removed = true;
          actionApplied = 'Server Ban';
        } else if (botMember.permissions.has(PermissionFlagsBits.KickMembers)) {
          await member.kick(`RAW HumanMod Stage 5: Repeat infractions (${infraction.rule})`).catch(() => null);
          removed = true;
          actionApplied = 'Server Kick';
        }
      }

      newCase = DatabaseManager.addCase(guild.id, {
        userId: user.id,
        userTag: user.tag,
        modId: botMember?.id || 'AUTOMOD',
        modTag: 'RAW HumanMod',
        action: actionApplied,
        reason: `Maximum disciplinary strikes reached (${infraction.rule})`,
        detail: infraction.detail,
        channelId: message.channel.id,
        strikeNumber: strikeCount + 1
      });

      await this.sendDisciplineDM(user, guild, {
        stage: 5,
        action: actionApplied,
        reason: `Maximum strikes reached: ${infraction.rule}`,
        detail: infraction.detail,
        caseId: newCase.caseId,
        decayDays,
        totalStrikes: strikeCount + 1
      });
    }

    // Comprehensive ModLog Audit
    await ModLogger.log(guild, {
      action: `AutoMod: ${actionApplied}`,
      target: user,
      reason: infraction.detail || infraction.rule,
      color: stage >= 3 ? config.embedColors.danger : config.embedColors.warning,
      fields: [
        { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
        { name: '📈 Escalation Stage', value: `Stage ${stage} (${DatabaseManager.getActiveStrikes(guild.id, user.id).length} Active Strikes)`, inline: true },
        ...(newCase ? [{ name: '🆔 Case File', value: `\`${newCase.caseId}\``, inline: true }] : []),
        { name: '📝 Message Excerpt', value: `\`\`\`${(infraction.evidence || message.content || '[No text]').slice(0, 500)}\`\`\``, inline: false }
      ]
    }).catch(() => null);

    return { stage, action: actionApplied, caseId: newCase?.caseId || null };
  }

  /**
   * Send courteous, clear discipline direct message with interactive Appeal button
   */
  static async sendDisciplineDM(user, guild, info) {
    try {
      const appealBtn = new ButtonBuilder()
        .setCustomId(`mod_appeal_btn:${guild.id}:${info.caseId}`)
        .setLabel('📩 Submit Staff Appeal')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(appealBtn);

      const dmEmbed = new EmbedBuilder()
        .setColor(info.stage >= 4 ? '#ED4245' : '#FEE75C')
        .setTitle(`🛡️ Disciplinary Notice from ${guild.name}`)
        .setDescription(
          `Hello **${user.username}**,\n\n` +
          `An automated action was taken on your account due to an infraction of our server guidelines.\n\n` +
          `### 📋 Incident Details:\n` +
          `• **Action Taken:** ${info.action}\n` +
          `• **Reason:** ${info.reason}\n` +
          `• **Case ID:** \`${info.caseId}\`\n` +
          `• **Active Strikes:** ${info.totalStrikes} (Strikes automatically expire after **${info.decayDays} days** of good standing)\n\n` +
          `### ⚖️ Fair Moderation & Appeals:\n` +
          `We believe in fair, transparent moderation. If you feel this was a misunderstanding or an automated error, ` +
          `click the **Submit Staff Appeal** button below to have our moderator team review your case.`
        )
        .setFooter({ text: `${guild.name} Staff Moderation` })
        .setTimestamp();

      await user.send({ embeds: [dmEmbed], components: [row] }).catch(() => null);
    } catch (err) {
      // DM closed by user
    }
  }
}

module.exports = HumanMod;
