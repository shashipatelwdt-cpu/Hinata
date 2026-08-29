const ModLogger = require('../utils/logger');
const SnipeManager = require('../utils/snipeManager');
const config = require('../../config.json');

module.exports = {
  name: 'messageUpdate',
  async execute(oldMessage, newMessage) {
    if (!oldMessage?.guild || !oldMessage?.author || oldMessage.author.bot) return;
    if (!oldMessage.content || oldMessage.content === newMessage?.content) return;

    // 1. Record in SnipeManager for /editsnipe
    SnipeManager.addEditSnipe(oldMessage, newMessage);

    // 2. ModLog Audit
    await ModLogger.log(oldMessage.guild, {
      action: 'Message Edited',
      target: oldMessage.author,
      reason: `Message edited in #${oldMessage.channel.name}`,
      color: config.embedColors.warning,
      fields: [
        { name: '💬 Channel', value: `<#${oldMessage.channel.id}>`, inline: true },
        { name: '⬅️ Before', value: `\`\`\`${(oldMessage.content || '[No Text]').slice(0, 500)}\`\`\``, inline: false },
        { name: '➡️ After', value: `\`\`\`${(newMessage.content || '[No Text]').slice(0, 500)}\`\`\``, inline: false },
        { name: '🔗 Jump to Message', value: `[Click Here](${newMessage.url})`, inline: false }
      ]
    });
  }
};
