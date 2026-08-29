const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const EmbedUtils = require('./embeds');
const ModLogger = require('./logger');
const config = require('../../config.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Utility to safely wipe all channels and categories with rate-limit protection and confirmation
 */
class ChannelWiper {
  /**
   * Execute full channel wipe on a guild
   * @param {object} options
   * @param {import('discord.js').Guild} options.guild
   * @param {import('discord.js').User} options.user
   * @param {boolean} [options.createGeneral=true] - Whether to create a fresh #general channel
   * @param {string} [options.callerChannelId] - ID of the channel where command was executed
   * @param {import('discord.js').Interaction} [options.interaction] - Interaction for progress updates
   * @returns {Promise<{ success: boolean, deletedCount: number, newChannel: import('discord.js').TextChannel | null, error?: string }>}
   */
  static async wipeAllChannels({
    guild,
    user,
    createGeneral = true,
    callerChannelId = null,
    interaction = null
  }) {
    const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
    if (!botMember || (!botMember.permissions.has(PermissionFlagsBits.ManageChannels) && !botMember.permissions.has(PermissionFlagsBits.Administrator))) {
      return {
        success: false,
        deletedCount: 0,
        newChannel: null,
        error: 'The bot lacks **Manage Channels** or **Administrator** permissions to delete channels.'
      };
    }

    try {
      // 1. Create a brand new clean #general channel first (if requested)
      let newChannel = null;
      if (createGeneral) {
        newChannel = await guild.channels.create({
          name: 'general',
          type: ChannelType.GuildText,
          topic: '💬 General discussion channel • Clean server reset',
          reason: `Clean server channel wipe executed by ${user.tag}`
        }).catch(err => {
          console.warn('[CHANNEL WIPER] Could not create new general channel:', err.message);
          return null;
        });
      }

      // 2. Fetch all channels in guild
      const allChannels = await guild.channels.fetch().catch(() => guild.channels.cache);
      
      const nonCategories = [];
      const categories = [];

      for (const [, ch] of allChannels) {
        if (!ch) continue;
        // Don't delete the newly created general channel
        if (newChannel && ch.id === newChannel.id) continue;

        if (ch.type === ChannelType.GuildCategory) {
          categories.push(ch);
        } else {
          nonCategories.push(ch);
        }
      }

      const totalToDelete = nonCategories.length + categories.length;
      let deletedCount = 0;

      // Update status helper
      const updateStatus = async (currentStep) => {
        if (!interaction || !callerChannelId) return;
        try {
          const progressEmbed = new EmbedBuilder()
            .setColor(config.embedColors.danger || '#E74C3C')
            .setTitle('🗑️ Deleting All Channels...')
            .setDescription(
              `Deleting channels and categories in **${guild.name}**...\n\n` +
              `• **Deleted:** \`${deletedCount} / ${totalToDelete}\`\n` +
              `• **Current Action:** ${currentStep}\n` +
              `• **Fresh Channel:** ${newChannel ? `<#${newChannel.id}>` : 'None'}`
            )
            .setFooter({ text: 'Please wait, wiping channels cleanly...' })
            .setTimestamp();

          if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ embeds: [progressEmbed], components: [] }).catch(() => null);
          }
        } catch (e) {
          // Ignore if message or interaction expired
        }
      };

      await updateStatus('Deleting text, voice, and announcement channels...');

      // 3. Delete non-category channels first (skip callerChannelId for now if it is not newChannel)
      const deferredCallerChannel = nonCategories.find(ch => ch.id === callerChannelId && (!newChannel || ch.id !== newChannel.id));
      const channelsToDeleteFirst = nonCategories.filter(ch => ch.id !== callerChannelId);

      for (const ch of channelsToDeleteFirst) {
        try {
          await ch.delete(`Wipe all channels by ${user.tag}`);
          deletedCount++;
          await sleep(150);
        } catch (err) {
          console.warn(`[CHANNEL WIPER] Failed to delete channel ${ch.name}:`, err.message);
        }
      }

      // 4. Delete categories
      await updateStatus('Deleting categories...');
      for (const cat of categories) {
        try {
          await cat.delete(`Wipe all channels by ${user.tag}`);
          deletedCount++;
          await sleep(150);
        } catch (err) {
          console.warn(`[CHANNEL WIPER] Failed to delete category ${cat.name}:`, err.message);
        }
      }

      // 5. Send Success Embed in the newly created #general channel
      const successEmbed = new EmbedBuilder()
        .setColor(config.embedColors.success || '#2ECC71')
        .setTitle('🗑️ All Channels Deleted Successfully!')
        .setDescription(
          `**Clean Server Reset Complete!**\n\n` +
          `• 🧹 **Channels & Categories Deleted:** \`${deletedCount}\`\n` +
          `• 👤 **Executed By:** ${user}\n` +
          `• 💬 **Fresh Channel:** ${newChannel ? `<#${newChannel.id}>` : 'None'}\n\n` +
          `🚀 **What to do next?**\n` +
          `• Run \`/autoserver\` for a 1-click complete setup (Roles, Rules, Tickets, AutoMod, Stats).\n` +
          `• Run \`/template list\` to browse 37+ themed server templates.\n` +
          `• Run \`/setup\` to configure individual bot features.`
        )
        .setFooter({ text: `${config.botName || 'Hinata'} • Server Reset Engine` })
        .setTimestamp();

      if (newChannel) {
        await newChannel.send({ embeds: [successEmbed] }).catch(() => null);
      }

      // 6. Delete caller channel if it was separate from newChannel
      if (deferredCallerChannel) {
        try {
          await deferredCallerChannel.delete(`Wipe all channels by ${user.tag}`).catch(() => null);
          deletedCount++;
        } catch (err) {
          // Ignored
        }
      } else if (!newChannel && interaction) {
        // If no new channel was created and caller channel remains, edit reply
        await interaction.editReply({ embeds: [successEmbed], components: [] }).catch(() => null);
      }

      // 7. Log to modlogs if available
      await ModLogger.log(guild, {
        action: 'All Channels Wiped',
        moderator: user,
        reason: 'Server channel reset / wipe executed',
        color: config.embedColors.danger,
        fields: [
          { name: '🧹 Channels Deleted', value: `${deletedCount}`, inline: true },
          { name: '💬 Fresh General Channel', value: newChannel ? `<#${newChannel.id}>` : 'None', inline: true }
        ]
      });

      return {
        success: true,
        deletedCount,
        newChannel
      };
    } catch (err) {
      console.error('[CHANNEL WIPER ERROR]', err);
      return {
        success: false,
        deletedCount: 0,
        newChannel: null,
        error: err.message
      };
    }
  }
}

module.exports = ChannelWiper;
