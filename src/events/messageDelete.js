const ModLogger = require('../utils/logger');
const SnipeManager = require('../utils/snipeManager');
const config = require('../../config.json');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (!message?.guild || !message?.author || message.author.bot) return;

    // 1. Save to Snipe Manager cache (retrievable via /snipe command on-demand)
    const snipe = SnipeManager.addSnipe(message);

    // 2. Ghost-Ping Detection - Log to ModLogs only (no automatic chat spam)
    if (snipe?.ghostPing) {
      try {
        const pingedUsers = snipe.ghostPing.users.map(u => `<@${u.id}>`).join(' ');
        const pingedRoles = snipe.ghostPing.roles.map(r => `<@&${r.id}>`).join(' ');
        const everyoneTag = snipe.ghostPing.hasEveryone ? '@everyone / @here' : null;
        const allTargets = [pingedUsers, pingedRoles, everyoneTag].filter(Boolean).join(', ');

        // Log ghost-ping to ModLogs audit channel
        await ModLogger.log(message.guild, {
          action: 'Ghost Ping Detected',
          target: message.author,
          reason: `Ghost pinged in #${message.channel.name}`,
          color: config.embedColors.warning,
          fields: [
            { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
            { name: '🎯 Mentioned Targets', value: allTargets || 'Unknown', inline: true },
            { name: '🗑️ Deleted Content', value: `\`\`\`${(message.content || '[No Text]').slice(0, 1000)}\`\`\``, inline: false }
          ]
        });
      } catch (err) {
        console.error('[GHOST PING ERROR]', err);
      }
    } else {
      // 3. Standard ModLogs Message Deletion Audit
      await ModLogger.log(message.guild, {
        action: 'Message Deleted',
        target: message.author,
        reason: `Message deleted in #${message.channel.name}`,
        color: config.embedColors.danger,
        fields: [
          { name: '💬 Channel', value: `<#${message.channel.id}>`, inline: true },
          { name: '🗑️ Deleted Content', value: `\`\`\`${(message.content || '[No Text / Embed]').slice(0, 1000)}\`\`\``, inline: false }
        ]
      });
    }
  }
};
