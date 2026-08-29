const { ChannelType } = require('discord.js');

/**
 * Online Template Importer
 * Fetches and converts live templates from:
 * - Xenon Bot (https://xenon.bot/templates/[id])
 * - Discord Official (https://discord.new/[id] or https://discord.com/template/[id])
 * - DiscordTemplates.me (https://discordtemplates.me/t/[id])
 * - Discord.style
 * - Direct Template Code
 */
class OnlineTemplateImporter {
  /**
   * Extract clean template code from URL or raw string
   * @param {string} input 
   * @returns {string|null}
   */
  static extractTemplateCode(input) {
    if (!input || typeof input !== 'string') return null;
    const trimmed = input.trim();

    // Match URLs:
    // https://xenon.bot/templates/CODE
    // https://discord.new/CODE
    // https://discord.com/template/CODE
    // https://discordtemplates.me/t/CODE
    // https://discord.style/template/CODE
    const urlMatch = trimmed.match(/(?:xenon\.bot\/templates\/|discord\.new\/|discord\.com\/template\/|discordtemplates\.me\/t\/|discord\.style\/template\/|discord\.com\/api\/v\d+\/guilds\/templates\/)([A-Za-z0-9_\-]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }

    // Direct alphanumeric code (between 5 and 30 characters)
    if (/^[A-Za-z0-9_\-]{6,25}$/.test(trimmed)) {
      return trimmed;
    }

    return null;
  }

  /**
   * Fetch live template structure from Discord API
   * @param {string} codeOrUrl 
   * @returns {Promise<{ success: boolean, template?: object, error?: string }>}
   */
  static async fetchTemplate(codeOrUrl) {
    const code = this.extractTemplateCode(codeOrUrl);
    if (!code) {
      return {
        success: false,
        error: 'Invalid template code or URL. Please provide a valid Xenon, Discord.new, or Discord template link/ID.'
      };
    }

    try {
      const apiUrl = `https://discord.com/api/v10/guilds/templates/${encodeURIComponent(code)}`;
      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'DiscordBot (https://github.com/discordjs/discord.js, 14.16.3)'
        }
      });

      if (!res.ok) {
        if (res.status === 404) {
          return {
            success: false,
            error: `Template \`${code}\` was not found on Discord / Xenon. It may have expired or been deleted.`
          };
        }
        return {
          success: false,
          error: `Discord API returned status ${res.status}: ${res.statusText}`
        };
      }

      const data = await res.json();
      const guildData = data.serialized_source_guild;

      if (!guildData) {
        return {
          success: false,
          error: 'Template data returned empty server structure.'
        };
      }

      // Convert Roles
      const roles = (guildData.roles || [])
        .filter(r => r.name !== '@everyone')
        .map(r => {
          const isOwner = /owner|founder|ceo|leader|master/i.test(r.name);
          const isAdmin = /admin|management|mod|head/i.test(r.name) && !isOwner;
          const isBot = /bot|app|system/i.test(r.name);

          return {
            name: r.name,
            color: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#99AAB5',
            hoist: Boolean(r.hoist),
            mentionable: Boolean(r.mentionable),
            isOwnerRole: isOwner,
            isAdminRole: isAdmin,
            isBotRole: isBot
          };
        });

      // Categories and Channels
      const categoriesMap = new Map();
      const unparentedChannels = [];

      const categoryChannels = (guildData.channels || []).filter(c => c.type === 4);
      categoryChannels.sort((a, b) => (a.position || 0) - (b.position || 0));

      for (const cat of categoryChannels) {
        categoriesMap.set(cat.id, {
          name: cat.name,
          channels: []
        });
      }

      const nonCatChannels = (guildData.channels || []).filter(c => c.type !== 4);
      nonCatChannels.sort((a, b) => (a.position || 0) - (b.position || 0));

      for (const ch of nonCatChannels) {
        const parent = categoriesMap.get(ch.parent_id);
        const mappedChan = {
          name: ch.name,
          type: ch.type === 2 ? ChannelType.GuildVoice : (ch.type === 5 ? ChannelType.GuildAnnouncement : (ch.type === 13 ? ChannelType.GuildStageVoice : ChannelType.GuildText)),
          topic: ch.topic || undefined,
          userLimit: (ch.type === 2 && ch.user_limit) ? ch.user_limit : undefined,
          isWelcomeChannel: /welcome|join|greet/i.test(ch.name),
          isModLogChannel: /mod-log|audit-log|staff-log/i.test(ch.name)
        };

        if (parent) {
          parent.channels.push(mappedChan);
        } else {
          unparentedChannels.push(mappedChan);
        }
      }

      const finalCategories = Array.from(categoriesMap.values()).filter(c => c.channels.length > 0);
      if (unparentedChannels.length > 0) {
        finalCategories.unshift({
          name: '💬 ━━ GENERAL ━━',
          channels: unparentedChannels
        });
      }

      const template = {
        id: `online-${code}`,
        name: (data.name || 'Imported Server Template').substring(0, 95),
        description: (data.description || `Imported live from Discord/Xenon template (${code}).`).substring(0, 250),
        category: '🌐 Imported from Xenon / Discord',
        roles,
        categories: finalCategories
      };

      return {
        success: true,
        template,
        rawDiscordData: data
      };
    } catch (error) {
      console.error('[ONLINE TEMPLATE FETCH ERROR]', error);
      return {
        success: false,
        error: `Network error while fetching template: ${error.message}`
      };
    }
  }
}

module.exports = OnlineTemplateImporter;
