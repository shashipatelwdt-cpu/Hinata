const { EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const ModLogger = require('../utils/logger');
const ServerStats = require('../utils/serverStats');
const InviteTracker = require('../utils/inviteTracker');
const config = require('../../config.json');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const guild = member.guild;

    // 0. Update Live Server Stats Counters
    ServerStats.updateGuildStats(guild).catch(() => null);

    // 1. Process Invite Tracker for Member Leave
    let leaveResult = null;
    try {
      leaveResult = await InviteTracker.trackLeave(member);
    } catch (err) {
      console.error('[INVITE TRACKER LEAVE ERROR]', err);
    }

    const inviterId = leaveResult?.inviterId || null;
    const inviterStats = leaveResult?.stats || null;

    const guildSettings = DatabaseManager.getGuild(guild.id);
    const leave = { ...config.defaultSettings.leave, ...(guildSettings.leave || {}) };

    // 2. ModLogs Leave Audit with Inviter Data
    const leaveFields = [
      { name: '👥 Remaining Members', value: `${guild.memberCount}`, inline: true }
    ];

    if (inviterId && inviterId !== 'VANITY_URL') {
      leaveFields.push(
        { name: '🔗 Originally Invited By', value: `<@${inviterId}>`, inline: true },
        { 
          name: '📊 Inviter Updated Stats', 
          value: `**${inviterStats ? inviterStats.total : 0}** net (✅ ${inviterStats ? inviterStats.regular : 0} | ❌ ${inviterStats ? inviterStats.leaves : 0} | ⚠️ ${inviterStats ? inviterStats.fake : 0})`, 
          inline: true 
        }
      );
    }

    await ModLogger.log(guild, {
      action: 'Member Left',
      target: member.user,
      color: config.embedColors.danger,
      fields: leaveFields
    });

    // 3. Leave Message in Channel
    if (leave.enabled && leave.channelId) {
      const channel = guild.channels.cache.get(leave.channelId);
      if (channel && channel.isTextBased()) {
        const rawMsg = leave.message || config.defaultSettings.leave.message;
        const formattedMsg = rawMsg
          .replace(/{username}/g, member.user.username)
          .replace(/{tag}/g, member.user.tag)
          .replace(/{server}/g, guild.name)
          .replace(/{count}/g, guild.memberCount.toString());

        const embed = new EmbedBuilder()
          .setColor(leave.color || config.embedColors.danger)
          .setAuthor({ name: `Member Left 👋`, iconURL: guild.iconURL() })
          .setDescription(formattedMsg)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
          .setFooter({ text: `User ID: ${member.user.id}` })
          .setTimestamp();

        await channel.send({ embeds: [embed] }).catch(() => null);
      }
    }
  }
};
