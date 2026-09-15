const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const ModLogger = require('../../utils/logger');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modcase')
    .setDescription('📋 View and manage moderation cases and member disciplinary history')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(sub =>
      sub
        .setName('view')
        .setDescription('🔍 View detailed information about a specific moderation case')
        .addStringOption(opt =>
          opt
            .setName('case_id')
            .setDescription('The Case ID to view (e.g. CASE-1001 or 1001)')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('history')
        .setDescription('📜 View the disciplinary incident history of a member')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('The member whose history you want to inspect')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('strikes')
        .setDescription('⚡ Inspect active strikes and expiration timers for a member')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('The member whose strikes you want to view')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('pardon')
        .setDescription('🕊️ Pardon a moderation case and restore member standing')
        .addStringOption(opt =>
          opt
            .setName('case_id')
            .setDescription('The Case ID to pardon (e.g. CASE-1001)')
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName('reason')
            .setDescription('Reason for the pardon / dismissal')
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    // ----------------------------------------------------
    // 1. VIEW CASE
    // ----------------------------------------------------
    if (subcommand === 'view') {
      const caseIdInput = interaction.options.getString('case_id');
      const modCase = DatabaseManager.getCase(guildId, caseIdInput);

      if (!modCase) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Case Not Found', `No moderation case found matching \`${caseIdInput}\` in this server.`)],
          ephemeral: true
        });
      }

      const statusColor = modCase.status === 'pardoned' ? config.embedColors?.success || '#57F287' : config.embedColors?.danger || '#ED4245';
      const statusEmoji = modCase.status === 'pardoned' ? '🕊️ Pardoned' : '⚡ Active Infraction';

      const embed = new EmbedBuilder()
        .setColor(statusColor)
        .setTitle(`📋 Case File: ${modCase.caseId}`)
        .addFields(
          { name: '👤 Target Member', value: `<@${modCase.userId}> (\`${modCase.userTag}\`)`, inline: true },
          { name: '🛡️ Enforcing Staff', value: modCase.modId === 'AUTOMOD' ? '🤖 Hinata HumanMod' : `<@${modCase.modId}> (\`${modCase.modTag}\`)`, inline: true },
          { name: '⚖️ Action Taken', value: `\`${modCase.action}\`${modCase.duration ? ` (${modCase.duration})` : ''}`, inline: true },
          { name: '📌 Status', value: statusEmoji, inline: true },
          { name: '📅 Date & Time', value: `<t:${Math.floor(new Date(modCase.timestamp).getTime() / 1000)}:F>`, inline: true },
          { name: '⚡ Strike Number', value: modCase.strikeNumber ? `Strike #${modCase.strikeNumber}` : 'None', inline: true },
          { name: '📋 Primary Reason', value: modCase.reason || 'No reason provided', inline: false }
        );

      if (modCase.detail) {
        embed.addFields({ name: '📝 Incident Detail', value: `\`\`\`${modCase.detail.slice(0, 500)}\`\`\``, inline: false });
      }

      if (modCase.status === 'pardoned') {
        embed.addFields({
          name: '🕊️ Pardon Details',
          value: `Pardoned by **${modCase.pardonedBy}**\n**Reason:** ${modCase.pardonReason || 'Discretionary staff pardon'}`,
          inline: false
        });
      }

      if (modCase.appeal) {
        embed.addFields({
          name: '📩 Member Appeal',
          value: `**Status:** \`${modCase.appeal.status.toUpperCase()}\`\n**Statement:** "${modCase.appeal.reason || 'No statement provided'}"`,
          inline: false
        });
      }

      embed.setFooter({ text: `Hinata Case System • Guild ID: ${guildId}` });
      return interaction.reply({ embeds: [embed] });
    }

    // ----------------------------------------------------
    // 2. MEMBER HISTORY
    // ----------------------------------------------------
    if (subcommand === 'history') {
      const targetUser = interaction.options.getUser('user');
      const cases = DatabaseManager.getCases(guildId, targetUser.id, 10);
      const activeStrikes = DatabaseManager.getActiveStrikes(guildId, targetUser.id);
      const threatWatch = DatabaseManager.getThreatWatch(guildId, targetUser.id);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors?.primary || '#5865F2')
        .setTitle(`📜 Disciplinary History: ${targetUser.tag}`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(
          `**User ID:** \`${targetUser.id}\` • **Account Created:** <t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>\n` +
          `**Active Strikes:** **${activeStrikes.length}** • **Total Cases Logged:** **${cases.length}**` +
          (threatWatch ? `\n🛡️ **Threat Assessment:** \`${threatWatch.riskLevel || 'LOW'}\` (${threatWatch.score || 0}% Risk Score)` : '')
        );

      if (cases.length === 0) {
        embed.addFields({ name: '🌟 Clean Record', value: 'This member has no recorded moderation cases on this server.' });
      } else {
        const caseLines = cases.map(c => {
          const time = `<t:${Math.floor(new Date(c.timestamp).getTime() / 1000)}:R>`;
          const statusIcon = c.status === 'pardoned' ? '🕊️ [Pardoned]' : '⚡';
          return `**${statusIcon} ${c.caseId}** (${c.action}) — *${c.reason}* (${time})`;
        }).join('\n');

        embed.addFields({ name: '📋 Recent Cases (Last 10)', value: caseLines });
      }

      embed.setFooter({ text: 'Hinata Disciplinary Record' }).setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    // ----------------------------------------------------
    // 3. MEMBER STRIKES
    // ----------------------------------------------------
    if (subcommand === 'strikes') {
      const targetUser = interaction.options.getUser('user');
      const activeStrikes = DatabaseManager.getActiveStrikes(guildId, targetUser.id);

      const embed = new EmbedBuilder()
        .setColor(activeStrikes.length > 0 ? (config.embedColors?.danger || '#ED4245') : (config.embedColors?.success || '#57F287'))
        .setTitle(`⚡ Active Strikes: ${targetUser.tag}`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(
          `**Active Strikes:** **${activeStrikes.length}**\n` +
          `*Note: Each strike decays automatically after 7 days of good behavior.*`
        );

      if (activeStrikes.length === 0) {
        embed.addFields({ name: '✨ Standing', value: 'Member currently has 0 active strikes and is in full good standing.' });
      } else {
        const strikeLines = activeStrikes.map((s, idx) => {
          const expiresAt = `<t:${Math.floor(s.expiresAt / 1000)}:R>`;
          return `**Strike #${idx + 1}:** *${s.reason}* • Decays ${expiresAt}`;
        }).join('\n');

        embed.addFields({ name: '⏳ Expiration Timers', value: strikeLines });
      }

      embed.setFooter({ text: 'Hinata Strike Engine' });
      return interaction.reply({ embeds: [embed] });
    }

    // ----------------------------------------------------
    // 4. PARDON CASE
    // ----------------------------------------------------
    if (subcommand === 'pardon') {
      const caseIdInput = interaction.options.getString('case_id');
      const reason = interaction.options.getString('reason') || 'Staff discretionary pardon';

      const modCase = DatabaseManager.getCase(guildId, caseIdInput);
      if (!modCase) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Case Not Found', `No case found matching \`${caseIdInput}\`.`)],
          ephemeral: true
        });
      }

      if (modCase.status === 'pardoned') {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Already Pardoned', `Case \`${modCase.caseId}\` was already pardoned on <t:${Math.floor(new Date(modCase.pardonedAt).getTime() / 1000)}:f> by **${modCase.pardonedBy}**.`)],
          ephemeral: true
        });
      }

      const updatedCase = DatabaseManager.pardonCase(guildId, caseIdInput, interaction.user.id, interaction.user.tag, reason);

      // Attempt to lift timeout if target is still in server
      try {
        const member = await interaction.guild.members.fetch(modCase.userId).catch(() => null);
        if (member && member.isCommunicationDisabled()) {
          await member.timeout(null, `Case ${modCase.caseId} pardoned by ${interaction.user.tag}`);
        }
      } catch {}

      // Log pardon in ModLogs
      await ModLogger.log(interaction.guild, {
        action: 'Case Pardoned',
        target: { id: modCase.userId, tag: modCase.userTag },
        moderator: interaction.user,
        reason: reason,
        color: config.embedColors?.success || '#57F287',
        fields: [
          { name: '🆔 Case File', value: `\`${modCase.caseId}\``, inline: true },
          { name: '⚖️ Original Action', value: modCase.action, inline: true },
          { name: '📋 Original Reason', value: modCase.reason, inline: false }
        ]
      }).catch(() => null);

      // Notify target member via DM in clean English
      try {
        const targetUser = await interaction.client.users.fetch(modCase.userId).catch(() => null);
        if (targetUser) {
          const pardonDm = new EmbedBuilder()
            .setColor('#57F287')
            .setTitle(`🕊️ Case Pardoned in ${interaction.guild.name}`)
            .setDescription(
              `Hello **${targetUser.username}**,\n\n` +
              `Your disciplinary case **\`${modCase.caseId}\`** in **${interaction.guild.name}** has been formally **pardoned** by our staff team.\n\n` +
              `• **Pardoned By:** ${interaction.user.tag}\n` +
              `• **Reason:** ${reason}\n\n` +
              `Associated strikes and penalties have been removed from your account. Thank you for your patience!`
            )
            .setFooter({ text: `${interaction.guild.name} Staff Team` })
            .setTimestamp();

          await targetUser.send({ embeds: [pardonDm] }).catch(() => null);
        }
      } catch {}

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Case Pardoned',
            `Successfully pardoned **\`${modCase.caseId}\`** for <@${modCase.userId}>.\n` +
            `**Pardon Reason:** ${reason}\n` +
            `Associated strikes have been deactivated.`
          )
        ]
      });
    }
  }
};
