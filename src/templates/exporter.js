const { ChannelType } = require('discord.js');

/**
 * Server Exporter
 * Extracts the current Discord server structure (Roles, Categories, Channels, Topics, Voice Limits)
 * and formats it into clean Hinata JSON or Markdown format.
 */
class ServerExporter {
  /**
   * Export guild layout to a normalized Template object
   * @param {import('discord.js').Guild} guild 
   */
  static exportGuild(guild) {
    const roles = [];
    const categories = [];

    // 1. Export Roles (excluding @everyone and bot-managed roles)
    const sortedRoles = Array.from(guild.roles.cache.values())
      .filter(r => r.id !== guild.roles.everyone.id && !r.managed)
      .sort((a, b) => b.position - a.position);

    for (const r of sortedRoles) {
      roles.push({
        name: r.name,
        color: r.hexColor !== '#000000' ? r.hexColor : '#99AAB5',
        hoist: r.hoist,
        mentionable: r.mentionable,
        isOwnerRole: r.name.toLowerCase().includes('owner') || r.name.toLowerCase().includes('founder'),
        isAdminRole: r.name.toLowerCase().includes('admin') || r.name.toLowerCase().includes('manager')
      });
    }

    // 2. Export Categories and Channels
    const allChannels = Array.from(guild.channels.cache.values());
    const guildCategories = allChannels
      .filter(c => c.type === ChannelType.GuildCategory)
      .sort((a, b) => a.position - b.position);

    for (const cat of guildCategories) {
      const catChannels = allChannels
        .filter(c => c.parentId === cat.id)
        .sort((a, b) => a.position - b.position)
        .map(c => {
          let typeStr = 'text';
          if (c.type === ChannelType.GuildVoice) typeStr = 'voice';
          else if (c.type === ChannelType.GuildAnnouncement) typeStr = 'announcement';
          else if (c.type === ChannelType.GuildStageVoice) typeStr = 'stage';

          return {
            name: c.name,
            type: typeStr,
            topic: c.topic || undefined,
            userLimit: c.type === ChannelType.GuildVoice && c.userLimit > 0 ? c.userLimit : undefined,
            isWelcomeChannel: /welcome/i.test(c.name),
            isModLogChannel: /mod-log|audit-log/i.test(c.name)
          };
        });

      categories.push({
        name: cat.name,
        channels: catChannels
      });
    }

    // Channels without category (Orphan channels)
    const orphanChannels = allChannels
      .filter(c => !c.parentId && c.type !== ChannelType.GuildCategory)
      .sort((a, b) => a.position - b.position)
      .map(c => ({
        name: c.name,
        type: c.type === ChannelType.GuildVoice ? 'voice' : 'text',
        topic: c.topic || undefined,
        userLimit: c.type === ChannelType.GuildVoice && c.userLimit > 0 ? c.userLimit : undefined
      }));

    if (orphanChannels.length > 0) {
      categories.unshift({
        name: '📌 ━━ UNCATEGORIZED ━━',
        channels: orphanChannels
      });
    }

    return {
      name: `${guild.name} Layout`,
      description: `Exported server structure from ${guild.name}`,
      roles,
      categories
    };
  }

  /**
   * Convert exported structure to JSON string
   */
  static toJson(guild) {
    const data = this.exportGuild(guild);
    return JSON.stringify(data, null, 2);
  }

  /**
   * Convert exported structure to readable Markdown
   */
  static toMarkdown(guild) {
    const data = this.exportGuild(guild);
    let md = `# Server Blueprint: ${data.name}\n\n`;
    md += `Description: ${data.description}\n\n`;

    md += `### Roles (${data.roles.length}):\n`;
    for (const r of data.roles) {
      md += `- ${r.name} (${r.color})\n`;
    }

    md += `\n### Channel Structure:\n`;
    for (const cat of data.categories) {
      md += `\n**Category: ${cat.name}**\n`;
      for (const ch of cat.channels) {
        if (ch.type === 'voice') {
          md += `! ${ch.name}${ch.userLimit ? ` (limit: ${ch.userLimit})` : ''}\n`;
        } else {
          md += `# ${ch.name}${ch.topic ? ` (${ch.topic})` : ''}\n`;
        }
      }
    }

    return md;
  }
}

module.exports = ServerExporter;
