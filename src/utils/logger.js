const { EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const config = require('../../config.json');

class ModLogger {
  static async log(guild, { action, target, moderator, reason, color, fields = [], extra = null }) {
    try {
      const guildSettings = DatabaseManager.getGuild(guild.id);
      if (!guildSettings || !guildSettings.modlog_channel) return;

      const channel = guild.channels.cache.get(guildSettings.modlog_channel);
      if (!channel || !channel.isTextBased()) return;

      const embed = new EmbedBuilder()
        .setColor(color || config.embedColors.primary)
        .setTitle(`🛡️ Audit Log: ${action}`)
        .setTimestamp()
        .setFooter({ text: `Target ID: ${target?.id || 'N/A'}` });

      if (target?.displayAvatarURL) {
        embed.setThumbnail(target.displayAvatarURL());
      }

      const defaultFields = [];
      if (target) {
        defaultFields.push({ name: '👤 Target', value: `${target} (\`${target.tag || target.name || target.id}\`)`, inline: true });
      }
      if (moderator) {
        defaultFields.push({ name: '🛡️ Moderator', value: `${moderator} (\`${moderator.tag || moderator.name || moderator.id}\`)`, inline: true });
      }
      if (reason) {
        defaultFields.push({ name: '📝 Reason', value: reason, inline: false });
      }

      embed.addFields([...defaultFields, ...fields]);

      if (extra) {
        embed.setDescription(extra);
      }

      await channel.send({ embeds: [embed] }).catch(() => null);
    } catch (err) {
      console.error('[MODLOGGER] Error sending mod log:', err);
    }
  }
}

module.exports = ModLogger;
