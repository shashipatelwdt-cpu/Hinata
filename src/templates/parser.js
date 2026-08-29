const { ChannelType, PermissionFlagsBits } = require('discord.js');
const RoleParser = require('../utils/roleParser');

/**
 * Intelligent & Lenient Parser for Custom Server Templates & Role Lists
 * Supports:
 * - JSON format (raw or markdown codeblock ```json ... ```)
 * - Markdown structure (Category / # Channel / ! Voice / Role lists / Ranges)
 * - Pure copy-pasted role lists with category headers
 * - Natural language ChatGPT blueprints (e.g. "Here is the blueprint for Lordx Esports...")
 */
class TemplateParser {
  /**
   * Parse arbitrary text / JSON string into a normalized Template object
   * @param {string} rawInput 
   * @returns {{ success: boolean, template?: object, error?: string }}
   */
  static parse(rawInput) {
    if (!rawInput || typeof rawInput !== 'string' || rawInput.trim().length === 0) {
      return { success: false, error: 'Empty input provided.' };
    }

    const trimmed = rawInput.trim();

    // 1. Try parsing as JSON (or extracted JSON from codeblocks)
    const jsonResult = this.tryParseJson(trimmed);
    if (jsonResult) {
      return { success: true, template: this.normalizeTemplate(jsonResult) };
    }

    // 2. Try parsing as structured Markdown / Natural Text format
    const markdownResult = this.tryParseMarkdown(trimmed);
    if (markdownResult && (markdownResult.categories?.length > 0 || markdownResult.roles?.length > 0)) {
      return { success: true, template: this.normalizeTemplate(markdownResult) };
    }

    // 3. Try parsing as pure Role list via RoleParser
    const roleResult = RoleParser.parse(trimmed);
    if (roleResult && roleResult.success && roleResult.totalRoles > 0) {
      const allRoles = roleResult.groups.flatMap(g => g.roles);
      const fallbackTemplate = {
        name: 'Custom Community Blueprint',
        description: 'Server blueprint configured from custom roles list.',
        roles: allRoles,
        categories: [
          {
            name: '📢 ━━ INFORMATION ━━',
            channels: [
              { name: '📜・rules', type: ChannelType.GuildText, topic: 'Server guidelines' },
              { name: '📢・announcements', type: ChannelType.GuildAnnouncement, topic: 'Important updates' },
              { name: '🎭・get-roles', type: ChannelType.GuildText, topic: 'Self roles and pings' }
            ]
          },
          {
            name: '💬 ━━ GENERAL CHAT ━━',
            channels: [
              { name: '👋・welcome', type: ChannelType.GuildText, isWelcomeChannel: true },
              { name: '💬・general-chat', type: ChannelType.GuildText, topic: 'Main hangout chat' },
              { name: '🤖・bot-commands', type: ChannelType.GuildText, topic: 'Use bot commands here' },
              { name: '📷・media-clips', type: ChannelType.GuildText }
            ]
          },
          {
            name: '🔊 ━━ VOICE CHANNELS ━━',
            channels: [
              { name: '🔊・General Lounge', type: ChannelType.GuildVoice },
              { name: '🎮・Squad Duo (2)', type: ChannelType.GuildVoice, userLimit: 2 },
              { name: '🎮・Squad Room (5)', type: ChannelType.GuildVoice, userLimit: 5 },
              { name: '💤・AFK', type: ChannelType.GuildVoice }
            ]
          },
          {
            name: '🛡️ ━━ STAFF HQ ━━',
            channels: [
              { name: '🔒・staff-chat', type: ChannelType.GuildText },
              { name: '📜・mod-logs', type: ChannelType.GuildText, isModLogChannel: true }
            ]
          }
        ]
      };
      return { success: true, template: this.normalizeTemplate(fallbackTemplate) };
    }

    return {
      success: false,
      error: 'Could not understand the template format. Please ensure valid JSON, Markdown text, or a list of roles with categories.'
    };
  }

  /**
   * Attempt to parse JSON string, handling Markdown code blocks
   */
  static tryParseJson(text) {
    let clean = text;

    // Strip markdown code fences if present
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (codeBlockMatch) {
      clean = codeBlockMatch[1];
    }

    // Look for first '{' and last '}'
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      clean = clean.substring(firstBrace, lastBrace + 1);
    }

    try {
      const parsed = JSON.parse(clean);
      if (parsed && (parsed.categories || parsed.channels || parsed.roles)) {
        return parsed;
      }
    } catch (e) {
      // Not valid JSON, fallback to text parser
    }
    return null;
  }

  /**
   * Parse structured markdown, lists, and natural language ChatGPT output
   */
  static tryParseMarkdown(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    const template = {
      name: 'Custom Server Blueprint',
      description: 'Custom server layout parsed from user blueprint.',
      roles: [],
      categories: []
    };

    // Extract Title from text if present
    const titleMatch = text.match(/(?:blueprint\s+(?:to\s+build|for)\s+|server\s*name\s*:\s*|#\s+)([A-Za-z0-9\s_\-\🏆\🎮\🔥\💀\🎯]+?)(?:\s+into|\s+community|\r?\n|$)/i);
    if (titleMatch && titleMatch[1] && titleMatch[1].trim().length > 2) {
      const extractedTitle = titleMatch[1].trim();
      if (!extractedTitle.toLowerCase().includes('category') && !extractedTitle.toLowerCase().includes('features')) {
        template.name = extractedTitle.substring(0, 95);
      }
    }

    let currentSection = 'meta';
    let currentCategory = null;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Ignore user mentions and section intro headers
      if (line.match(/^<@!?\d+>$/)) continue;
      if (line.match(/^\d+\.\s+Enable/i) || line.match(/^\d+\.\s+The Channel Structure/i)) continue;
      if (line.startsWith('Go to Server Settings') || line.startsWith('Announcement Channels:') || line.startsWith('Welcome Screen:') || line.startsWith('Forum Channels:') || line.startsWith('Server Insights:') || line.startsWith('Keep it clean.')) continue;

      // Check for Server Name / Title
      if (line.match(/^(?:server\s*name|title|template\s*name)\s*:\s*(.+)$/i)) {
        template.name = line.replace(/^(?:server\s*name|title|template\s*name)\s*:\s*/i, '').trim();
        continue;
      }

      // Check for Description
      if (line.match(/^(?:description|desc|about)\s*:\s*(.+)$/i)) {
        template.description = line.replace(/^(?:description|desc|about)\s*:\s*/i, '').trim();
        continue;
      }

      // Check for Roles section header
      if (line.match(/^(?:roles|server\s*roles|custom\s*roles)\s*:/i) || (line.toUpperCase().includes('ROLES') && (line.startsWith('#') || line.startsWith('👑') || line.startsWith('**') || line.endsWith(':')))) {
        currentSection = 'roles';
        continue;
      }

      // Check for Category Header (e.g. "📁 WELCOME & INFO (Read-Only)", "Category: 💬 CHAT", "### ESPORTS ZONE", "[COMMUNITY]")
      const isCatLine = (
        line.startsWith('📁') ||
        line.startsWith('📂') ||
        line.toLowerCase().startsWith('category:') ||
        line.startsWith('### Category:') ||
        line.match(/^###\s+Category/i) ||
        (line.startsWith('### ') && !line.toUpperCase().includes('ROLES')) ||
        (line.startsWith('## ') && !line.toUpperCase().includes('ROLES') && !line.toUpperCase().includes('ENABLE')) ||
        line.match(/^\[(.+)\]$/)
      );

      if (isCatLine) {
        let catName = line
          .replace(/^###\s+Category\s*:\s*/i, '')
          .replace(/^Category\s*:\s*/i, '')
          .replace(/^[#\*\-=\[\]]+\s*/g, '')
          .trim();

        currentCategory = {
          name: catName,
          channels: []
        };
        template.categories.push(currentCategory);
        currentSection = 'channels';
        continue;
      }

      // Parsing ROLES
      if (currentSection === 'roles') {
        let roleLine = line.replace(/^[\*\-\•\d\.]+\s*/, '').trim();
        if (roleLine.length > 0) {
          const colorMatch = roleLine.match(/(#[0-9A-Fa-f]{6})/);
          const color = colorMatch ? colorMatch[1] : null;
          let cleanName = roleLine.replace(/\(#[0-9A-Fa-f]{6}\)/g, '').replace(/#?[0-9A-Fa-f]{6}/g, '').trim();

          if (cleanName.includes('( aese') || cleanName.includes('(aese')) {
            cleanName = cleanName.split(/\(\s*aese/i)[0].trim();
          }

          if (cleanName.length > 0) {
            const isOwner = /owner|founder|ceo|leader|master/i.test(cleanName);
            const isAdmin = /admin|management|mod|head/i.test(cleanName);
            const isBot = /bot|app|system/i.test(cleanName);
            const isPing = /ping|notify/i.test(cleanName);

            template.roles.push({
              name: cleanName,
              color: color || (isOwner ? '#FFD700' : isAdmin ? '#E74C3C' : isBot ? '#7289DA' : isPing ? '#7289DA' : '#99AAB5'),
              hoist: (isOwner || isAdmin || isBot) && !isPing,
              mentionable: isPing || isOwner || isAdmin,
              isOwnerRole: isOwner,
              isAdminRole: isAdmin && !isOwner,
              isBotRole: isBot
            });
          }
        }
        continue;
      }

      // Parsing CHANNELS
      if (currentSection === 'channels' || currentCategory) {
        if (!currentCategory) {
          currentCategory = { name: '💬 ━━ GENERAL CHAT ━━', channels: [] };
          template.categories.push(currentCategory);
        }

        const isVoiceCat = /voice|audio|vc|lounge|talk|comms/i.test(currentCategory.name);

        // Check for range expansion: e.g. "🔒・Squad 1 up to Squad 10 (Limit these to 4 users each)" or "Squad 1 to 5"
        const rangeMatch = line.match(/(?:(?:🔒|🔊|🎮|🎙️|!)\s*・?\s*)?Squad\s*(\d+)\s*(?:up to|to|-)\s*(?:Squad\s*)?(\d+)/i);
        if (rangeMatch) {
          const startNum = parseInt(rangeMatch[1], 10);
          const endNum = Math.min(parseInt(rangeMatch[2], 10), startNum + 20); // Cap at 20

          let userLimit = 4;
          const limitMatch = line.match(/limit(?:\s*these)?\s*to\s*(\d+)/i) || line.match(/\[(\d+)\]/) || line.match(/\((\d+)\)/);
          if (limitMatch) {
            userLimit = parseInt(limitMatch[1], 10);
          }

          const prefixEmoji = line.includes('🔒') ? '🔒・' : (line.includes('🎮') ? '🎮・' : '🔊・');

          for (let s = startNum; s <= endNum; s++) {
            currentCategory.channels.push({
              name: `${prefixEmoji}Squad ${s} (${userLimit})`,
              type: ChannelType.GuildVoice,
              userLimit: userLimit
            });
          }
          continue;
        }

        // Single channel line parsing
        let rawLine = line.replace(/^[\*\-\•\d\.]+\s*/, '').trim();

        // Detect type
        let isVoice = isVoiceCat || rawLine.startsWith('!') || rawLine.startsWith('🔊') || rawLine.startsWith('🎙️') || rawLine.startsWith('📻') || rawLine.startsWith('🔒') || rawLine.startsWith('🤫') || rawLine.startsWith('🎧') || rawLine.startsWith('💤') || /\(voice\)/i.test(rawLine);
        let isAnnouncement = rawLine.startsWith('📢') || /announcement/i.test(rawLine);

        // Extract topic in parentheses
        let topic = null;
        const topicMatch = rawLine.match(/\(([^()]+)\)/);
        if (topicMatch) {
          topic = topicMatch[1].trim();
          rawLine = rawLine.replace(/\([^()]+\)/, '').trim();
        }

        // Extract user limit: limit: 4 or [4]
        let userLimit = undefined;
        const limitMatch = (topic && topic.match(/limit(?:\s*these)?\s*to\s*(\d+)/i)) || rawLine.match(/limit\s*:\s*(\d+)/i) || rawLine.match(/\[(\d+)\]/);
        if (limitMatch) {
          userLimit = parseInt(limitMatch[1], 10);
          rawLine = rawLine.replace(/limit\s*:\s*\d+/i, '').replace(/\[\d+\]/, '').trim();
        }

        // Clean leading symbols but keep emojis
        let cleanName = rawLine.replace(/^[#!>\-]+\s*/, '').trim();

        if (cleanName.length > 0) {
          const isWelcome = /welcome|greet|join/i.test(cleanName);
          const isModLog = /mod-log|modlog|audit-log|staff-log/i.test(cleanName);

          let finalType = ChannelType.GuildText;
          if (isVoice) {
            finalType = ChannelType.GuildVoice;
          } else if (isAnnouncement) {
            finalType = ChannelType.GuildAnnouncement;
          }

          // Format text channel if plain words without emojis
          let formattedName = cleanName;
          if (finalType === ChannelType.GuildText && !formattedName.includes('・') && !formattedName.includes('-') && !formattedName.match(/[\u{1F300}-\u{1FAFF}]/u)) {
            formattedName = formattedName.toLowerCase().replace(/\s+/g, '-');
          }

          currentCategory.channels.push({
            name: formattedName.substring(0, 95),
            type: finalType,
            topic: topic || undefined,
            userLimit: (finalType === ChannelType.GuildVoice && typeof userLimit === 'number') ? userLimit : undefined,
            isWelcomeChannel: isWelcome,
            isModLogChannel: isModLog
          });
        }
      }
    }

    // If roles were not explicitly specified in the text, check for context clues (e.g. Esports, Gaming, Community)
    if (template.roles.length === 0) {
      const lowerText = text.toLowerCase();
      const isEsports = lowerText.includes('esports') || lowerText.includes('scrims') || lowerText.includes('bgmi') || lowerText.includes('tournament') || lowerText.includes('t1');
      const isDev = lowerText.includes('developer') || lowerText.includes('coding') || lowerText.includes('github');

      if (isEsports) {
        template.roles = [
          { name: '👑 Owner', color: '#FFD700', hoist: true, isOwnerRole: true },
          { name: '🛡️ Management', color: '#E74C3C', hoist: true, isAdminRole: true },
          { name: '⚔️ Esports Manager', color: '#3498DB', hoist: true, mentionable: true },
          { name: '🛡️ Scrims Mod', color: '#3498DB', hoist: true, mentionable: true },
          { name: '🎙️ Official Caster', color: '#F47FFF', hoist: true },
          { name: '🏆 T1 Team', color: '#FF4655', hoist: true, mentionable: true },
          { name: '🥇 T2 Team', color: '#F1C40F', hoist: true, mentionable: true },
          { name: '🥈 T3 Team', color: '#BDC3C7', hoist: true, mentionable: true },
          { name: '👑 IGL (In-Game Leader)', color: '#9B59B6', hoist: true, mentionable: true },
          { name: '🎟️ Registered', color: '#2ECC71', hoist: true, mentionable: true },
          { name: '🏆 Conqueror', color: '#FF4655', hoist: true },
          { name: '⚔️ Ace', color: '#E67E22', hoist: true },
          { name: '🛡️ Crown', color: '#9B59B6', hoist: true },
          { name: '🥇 Diamond', color: '#3498DB', hoist: true },
          { name: '📢 Announcement Ping', color: '#7289DA', hoist: false, mentionable: true },
          { name: '⚔️ Scrims Ping', color: '#7289DA', hoist: false, mentionable: true },
          { name: '🎁 Giveaway Ping', color: '#7289DA', hoist: false, mentionable: true },
          { name: '🤝 LFG Ping', color: '#7289DA', hoist: false, mentionable: true },
          { name: '👥 Member', color: '#99AAB5', hoist: false }
        ];
      } else if (isDev) {
        template.roles = [
          { name: '👑 Lead Architect', color: '#FFD700', hoist: true, isOwnerRole: true },
          { name: '🛡️ Maintainer / Admin', color: '#E74C3C', hoist: true, isAdminRole: true },
          { name: '🚀 Senior Engineer', color: '#3498DB', hoist: true },
          { name: '💻 Full-Stack Dev', color: '#2ECC71', hoist: false },
          { name: '🤖 System Bot', color: '#7289DA', hoist: true, isBotRole: true },
          { name: '👥 Member', color: '#99AAB5', hoist: false }
        ];
      } else {
        template.roles = [
          { name: '👑 Server Owner', color: '#FFD700', hoist: true, mentionable: false, isOwnerRole: true },
          { name: '🛡️ Admin', color: '#E74C3C', hoist: true, mentionable: false, isAdminRole: true },
          { name: '⚔️ Moderator', color: '#3498DB', hoist: true, mentionable: true },
          { name: '💎 VIP', color: '#F47FFF', hoist: true },
          { name: '🤖 Bot', color: '#7289DA', hoist: true, isBotRole: true },
          { name: '👥 Member', color: '#99AAB5', hoist: false }
        ];
      }
    }

    return template;
  }

  /**
   * Normalize and sanitize template structure to ensure Discord API safety
   */
  static normalizeTemplate(raw) {
    const template = {
      id: raw.id || `custom-${Date.now().toString(36)}`,
      name: (raw.name || 'Custom Server Blueprint').substring(0, 95),
      description: (raw.description || 'Custom Discord server structure.').substring(0, 250),
      category: raw.category || '✨ Custom / AI Generated',
      roles: [],
      categories: []
    };

    // Normalize Roles
    if (Array.isArray(raw.roles)) {
      for (const r of raw.roles) {
        if (!r || !r.name) continue;
        const roleName = String(r.name).trim().substring(0, 95);
        if (!roleName) continue;

        let color = '#99AAB5';
        if (r.color) {
          if (typeof r.color === 'string' && r.color.startsWith('#')) {
            color = r.color;
          } else if (typeof r.color === 'string' && /^[0-9A-Fa-f]{6}$/.test(r.color)) {
            color = `#${r.color}`;
          } else if (typeof r.color === 'number') {
            color = `#${r.color.toString(16).padStart(6, '0')}`;
          }
        }

        const isOwner = !!r.isOwnerRole || /owner|founder|ceo|leader|master/i.test(roleName);
        const isAdmin = !!r.isAdminRole || (/admin|management|mod|head/i.test(roleName) && !isOwner);
        const isBot = !!r.isBotRole || /bot|app|system/i.test(roleName);
        const isPing = /ping|notify/i.test(roleName);

        template.roles.push({
          name: roleName,
          color: color,
          hoist: r.hoist !== undefined ? Boolean(r.hoist) : ((isOwner || isAdmin || isBot) && !isPing),
          mentionable: r.mentionable !== undefined ? Boolean(r.mentionable) : (isPing || isOwner || isAdmin),
          isOwnerRole: isOwner,
          isAdminRole: isAdmin,
          isBotRole: isBot
        });
      }
    }

    // Default roles if none provided
    if (template.roles.length === 0) {
      template.roles = [
        { name: '👑 Server Owner', color: '#FFD700', hoist: true, mentionable: false, isOwnerRole: true },
        { name: '🛡️ Admin', color: '#E74C3C', hoist: true, mentionable: false, isAdminRole: true },
        { name: '⚔️ Moderator', color: '#3498DB', hoist: true, mentionable: true },
        { name: '🤖 Bot', color: '#7289DA', hoist: true, mentionable: false, isBotRole: true },
        { name: '👥 Member', color: '#99AAB5', hoist: false, mentionable: false }
      ];
    }

    // Normalize Categories & Channels
    if (Array.isArray(raw.categories)) {
      for (const cat of raw.categories) {
        if (!cat || !cat.name) continue;
        const catName = String(cat.name).trim().substring(0, 95);
        const normalizedCat = {
          name: catName,
          permissions: Array.isArray(cat.permissions) ? cat.permissions : undefined,
          channels: []
        };

        if (Array.isArray(cat.channels)) {
          for (const ch of cat.channels) {
            if (!ch || !ch.name) continue;
            let chName = String(ch.name).trim().substring(0, 95);
            let chType = ChannelType.GuildText;

            // Detect channel type
            if (ch.type === ChannelType.GuildVoice || ch.type === 2 || ch.type === 'voice' || ch.type === 'GuildVoice') {
              chType = ChannelType.GuildVoice;
            } else if (ch.type === ChannelType.GuildAnnouncement || ch.type === 5 || ch.type === 'announcement') {
              chType = ChannelType.GuildAnnouncement;
            } else if (ch.type === ChannelType.GuildStageVoice || ch.type === 13 || ch.type === 'stage') {
              chType = ChannelType.GuildStageVoice;
            } else {
              chType = ChannelType.GuildText;
              // format text channel name if plain words without emojis
              if (!chName.includes('・') && !chName.includes('-') && !chName.includes('_') && !chName.match(/[\u{1F300}-\u{1FAFF}]/u)) {
                chName = chName.toLowerCase().replace(/\s+/g, '-');
              }
            }

            const isWelcome = !!ch.isWelcomeChannel || /welcome|greetings|joins/i.test(chName);
            const isModLog = !!ch.isModLogChannel || /mod-log|modlog|audit-log|staff-log/i.test(chName);

            normalizedCat.channels.push({
              name: chName,
              type: chType,
              topic: ch.topic ? String(ch.topic).substring(0, 1024) : undefined,
              userLimit: (chType === ChannelType.GuildVoice && typeof ch.userLimit === 'number' && ch.userLimit >= 0 && ch.userLimit <= 99) ? ch.userLimit : undefined,
              isWelcomeChannel: isWelcome,
              isModLogChannel: isModLog
            });
          }
        }

        if (normalizedCat.channels.length > 0) {
          template.categories.push(normalizedCat);
        }
      }
    }

    return template;
  }
}

module.exports = TemplateParser;
