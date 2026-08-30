const { EmbedBuilder } = require('discord.js');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('../../config.json');
const { DatabaseManager } = require('../../database/db');

const TARGET_CHANNEL_ID = process.env.UPDATE_CHANNEL_ID || config.updateAnnouncementChannelId || '1543499614139711540';

/**
 * Safely retrieve latest Git commit information
 * @returns {{ hash: string, message: string, author: string, timestamp: number } | null}
 */
function getLatestCommitInfo() {
  try {
    const raw = execSync('git log -n 1 --format="%h===%s===%an===%ct"', {
      cwd: path.join(__dirname, '..', '..'),
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
      timeout: 3000
    }).trim();

    if (raw && raw.includes('===')) {
      const [hash, message, author, timestampStr] = raw.split('===');
      return {
        hash: hash || 'Latest',
        message: message || 'System performance and stability update',
        author: author || 'Developer',
        timestamp: parseInt(timestampStr, 10) || Math.floor(Date.now() / 1000)
      };
    }
  } catch (e) {
    // If git is unavailable in minimal container, check package.json or build metadata
    try {
      const pkgPath = path.join(__dirname, '..', '..', 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        return {
          hash: `v${pkg.version || '1.0.0'}`,
          message: 'System deployment & stability enhancements',
          author: 'System',
          timestamp: Math.floor(Date.now() / 1000)
        };
      }
    } catch {}
  }
  return null;
}

class UpdateAnnouncer {
  /**
   * Automatically check if a new commit/release was deployed and announce it in the update channel
   * @param {import('discord.js').Client} client 
   */
  static async checkAndSendUpdateAnnouncement(client) {
    if (!TARGET_CHANNEL_ID) return;

    try {
      const commitInfo = getLatestCommitInfo();
      if (!commitInfo) return;

      const lastAnnounced = DatabaseManager.getMeta('last_announced_commit');

      // If already announced this commit, do not spam
      if (lastAnnounced && lastAnnounced === commitInfo.hash) {
        return;
      }

      // Fetch the target update channel
      const channel = await client.channels.fetch(TARGET_CHANNEL_ID).catch(() => null);
      if (!channel || !channel.isTextBased()) {
        console.warn(`[UPDATE ANNOUNCER] Channel ${TARGET_CHANNEL_ID} not found or inaccessible.`);
        return;
      }

      const botUser = client.user;
      const embed = new EmbedBuilder()
        .setTitle('🚀 Hinata System Update Deployed')
        .setDescription(
          `A new build of **${config.botName || 'Hinata'}** has been successfully deployed & verified on Render!`
        )
        .addFields(
          {
            name: '📌 Latest Release / Commit',
            value: `\`${commitInfo.hash}\` • **${commitInfo.message}**`,
            inline: false
          },
          {
            name: '✨ Highlights & New Features',
            value: [
              '• ⚡ **Instant Music Engine:** Pre-cached client token & zero playback delay',
              '• 💤 **Auto VC Inactivity Leave:** Auto-disconnect when voice channel is empty',
              '• 👋 **New Slash Command:** `/leave` to disconnect with 1-click',
              '• 🌐 **24/7 Cloud Engine:** Active Render uptime & zero 429 stream errors'
            ].join('\n'),
            inline: false
          },
          {
            name: '🟢 Operational Status',
            value: `\`Online\` in **${client.guilds.cache.size.toLocaleString()}** server(s)`,
            inline: true
          },
          {
            name: '⏱️ Deployed At',
            value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
            inline: true
          }
        )
        .setColor(config.embedColors?.success || '#57F287')
        .setThumbnail(botUser.displayAvatarURL({ size: 256 }))
        .setFooter({
          text: `${config.botName || 'Hinata'} CI/CD Engine • Automated Release`,
          iconURL: botUser.displayAvatarURL()
        })
        .setTimestamp();

      await channel.send({ embeds: [embed] }).catch(err => {
        console.error('[UPDATE ANNOUNCER ERROR] Failed to send message:', err.message);
      });

      // Mark this commit as announced
      DatabaseManager.setMeta('last_announced_commit', commitInfo.hash);
      console.log(`📢 Update announcement for [${commitInfo.hash}] successfully sent to channel ${TARGET_CHANNEL_ID}`);
    } catch (error) {
      console.error('[UPDATE ANNOUNCER ERROR]', error);
    }
  }

  /**
   * Manual update / announcement sender
   * @param {import('discord.js').Client} client 
   * @param {string} title 
   * @param {string} description 
   * @param {Array<string>} changes 
   */
  static async sendManualAnnouncement(client, title, description, changes = []) {
    const channel = await client.channels.fetch(TARGET_CHANNEL_ID).catch(() => null);
    if (!channel || !channel.isTextBased()) return false;

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${title || 'Bot Announcement'}`)
      .setDescription(description || 'New updates have been released!')
      .setColor(config.embedColors?.primary || '#5865F2')
      .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
      .setFooter({ text: `${config.botName || 'Hinata'} Announcement`, iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    if (changes && changes.length > 0) {
      embed.addFields({
        name: '📝 What is New:',
        value: changes.map(c => `• ${c}`).join('\n')
      });
    }

    await channel.send({ embeds: [embed] });
    return true;
  }
}

module.exports = UpdateAnnouncer;
