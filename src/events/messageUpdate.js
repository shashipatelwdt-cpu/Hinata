const ModLogger = require('../utils/logger');
const SnipeManager = require('../utils/snipeManager');
const config = require('../../config.json');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!oldMessage?.guild || !oldMessage?.author || oldMessage.author.bot) return;
    if (!oldMessage.content || oldMessage.content === newMessage?.content) return;

    // 1. Record in SnipeManager for /editsnipe and /ghostping
    const editData = SnipeManager.addEditSnipe(oldMessage, newMessage);

    // 2. ModLog Audit (Ghost Ping or Standard Edit)
    if (editData?.ghostPing) {
      try {
        const pingedUsers = editData.ghostPing.users.map(u => `<@${u.id}>`).join(' ');
        const pingedRoles = editData.ghostPing.roles.map(r => `<@&${r.id}>`).join(' ');
        const everyoneTag = editData.ghostPing.hasEveryone ? '@everyone / @here' : null;
        const allTargets = [pingedUsers, pingedRoles, everyoneTag].filter(Boolean).join(', ');

        await ModLogger.log(oldMessage.guild, {
          action: 'Ghost Ping Detected (Message Edited)',
          target: oldMessage.author,
          reason: `Ghost ping edited out in #${oldMessage.channel.name}`,
          color: config.embedColors.warning,
          fields: [
            { name: '💬 Channel', value: `<#${oldMessage.channel.id}>`, inline: true },
            { name: '🎯 Mentioned Targets', value: allTargets || 'Unknown', inline: true },
            { name: '⬅️ Original Content', value: `\`\`\`${(oldMessage.content || '[No Text]').slice(0, 500)}\`\`\``, inline: false },
            { name: '➡️ Edited Content', value: `\`\`\`${(newMessage?.content || '[No Text]').slice(0, 500)}\`\`\``, inline: false },
            { name: '🔗 Jump to Message', value: `[Click Here](${newMessage?.url || oldMessage.url})`, inline: false }
          ]
        });
      } catch (err) {
        console.error('[EDIT GHOST PING ERROR]', err);
      }
    } else {
      await ModLogger.log(oldMessage.guild, {
        action: 'Message Edited',
        target: oldMessage.author,
        reason: `Message edited in #${oldMessage.channel.name}`,
        color: config.embedColors.warning,
        fields: [
          { name: '💬 Channel', value: `<#${oldMessage.channel.id}>`, inline: true },
          { name: '⬅️ Before', value: `\`\`\`${(oldMessage.content || '[No Text]').slice(0, 500)}\`\`\``, inline: false },
          { name: '➡️ After', value: `\`\`\`${(newMessage?.content || '[No Text]').slice(0, 500)}\`\`\``, inline: false },
          { name: '🔗 Jump to Message', value: `[Click Here](${newMessage?.url || oldMessage.url})`, inline: false }
        ]
      });
    }
  }
};
