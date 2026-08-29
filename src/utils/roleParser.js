/**
 * Intelligent Bulk Role Parser
 * Parses raw copy-pasted role lists with category headers, emojis, and colors.
 */
class RoleParser {
  /**
   * Parse arbitrary text with category headers and role lists into structured role objects
   * @param {string} rawText 
   * @returns {{ success: boolean, groups: Array<{ category: string, roles: Array<{ name: string, color: string, hoist: boolean, mentionable: boolean }> }>, totalRoles: number, error?: string }}
   */
  static parse(rawText) {
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return { success: false, error: 'Input text is empty.', groups: [], totalRoles: 0 };
    }

    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const groups = [];
    let currentCategory = '📌 General Roles';
    let currentRoles = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Ignore user mentions like <@123456789>
      if (line.match(/^<@!?\d+>$/)) continue;

      // Check if line is a Category Header:
      // e.g. "👑 STAFF ROLES", "🏆 ESPORTS ROLES", "### PING ROLES", "ROLES:", "**VIP ROLES**"
      const isHeader = (
        line.toUpperCase().includes('ROLES') ||
        line.toUpperCase().includes('RANKS') ||
        line.toUpperCase().includes('CATEGORY') ||
        line.startsWith('##') ||
        line.startsWith('===') ||
        (line.startsWith('**') && line.endsWith('**')) ||
        (line.length <= 35 && line === line.toUpperCase() && !line.startsWith('-') && !line.startsWith('•'))
      );

      if (isHeader) {
        if (currentRoles.length > 0) {
          groups.push({ category: currentCategory, roles: currentRoles });
          currentRoles = [];
        }
        currentCategory = line.replace(/[#\*=:\-]+/g, '').trim() || '📌 Custom Roles';
        continue;
      }

      // It's a role line!
      // Remove leading bullets if any
      let roleName = line.replace(/^[\*\-\•\d\.]+\s*/, '').trim();

      // Check for custom hex color: e.g. "Owner (#FF0000)" or "Owner #FF0000"
      let customColor = null;
      const colorMatch = roleName.match(/#([0-9A-Fa-f]{6})/);
      if (colorMatch) {
        customColor = `#${colorMatch[1]}`;
        roleName = roleName.replace(/\(#?[0-9A-Fa-f]{6}\)/g, '').replace(/#?[0-9A-Fa-f]{6}/g, '').trim();
      }

      // Strip extra instructions in brackets like (aese users denge...)
      if (roleName.includes('( aese') || roleName.includes('(aese')) {
        roleName = roleName.split(/\(\s*aese/i)[0].trim();
      }

      if (roleName.length === 0) continue;

      // Determine smart attributes based on name and category
      const lowerName = roleName.toLowerCase();
      const lowerCat = currentCategory.toLowerCase();

      const isPing = lowerName.includes('ping') || lowerName.includes('notify') || lowerCat.includes('ping');
      const isOwner = lowerName.includes('owner') || lowerName.includes('founder') || lowerName.includes('ceo');
      const isAdmin = lowerName.includes('admin') || lowerName.includes('management') || lowerName.includes('head');
      const isMod = lowerName.includes('mod') || lowerName.includes('manager') || lowerName.includes('staff');
      const isVip = lowerName.includes('vip') || lowerName.includes('booster') || lowerName.includes('creator') || lowerName.includes('caster');
      const isRank = lowerCat.includes('rank') || lowerName.includes('conqueror') || lowerName.includes('ace') || lowerName.includes('crown') || lowerName.includes('diamond');
      const isEsports = lowerCat.includes('esports') || lowerName.includes('t1') || lowerName.includes('t2') || lowerName.includes('t3') || lowerName.includes('igl');

      let defaultColor = '#99AAB5';
      if (customColor) {
        defaultColor = customColor;
      } else if (isOwner) {
        defaultColor = '#FFD700'; // Gold
      } else if (isAdmin) {
        defaultColor = '#E74C3C'; // Red
      } else if (isMod) {
        defaultColor = '#3498DB'; // Blue
      } else if (isVip) {
        defaultColor = '#F47FFF'; // Neon Pink / Purple
      } else if (isEsports) {
        if (lowerName.includes('t1')) defaultColor = '#FF4655'; // Crimson
        else if (lowerName.includes('t2')) defaultColor = '#F1C40F'; // Gold
        else if (lowerName.includes('t3')) defaultColor = '#BDC3C7'; // Silver
        else if (lowerName.includes('igl')) defaultColor = '#9B59B6'; // Purple
        else defaultColor = '#2ECC71'; // Green
      } else if (isRank) {
        if (lowerName.includes('conqueror')) defaultColor = '#FF4655';
        else if (lowerName.includes('ace')) defaultColor = '#E67E22';
        else if (lowerName.includes('crown')) defaultColor = '#9B59B6';
        else if (lowerName.includes('diamond')) defaultColor = '#3498DB';
        else defaultColor = '#1ABC9C';
      } else if (isPing) {
        defaultColor = '#7289DA'; // Discord Blurple
      }

      currentRoles.push({
        name: roleName.substring(0, 95),
        color: defaultColor,
        hoist: !isPing, // Display separately in member list (hoist true for all except ping roles)
        mentionable: isPing || isMod || isEsports
      });
    }

    if (currentRoles.length > 0) {
      groups.push({ category: currentCategory, roles: currentRoles });
    }

    const totalRoles = groups.reduce((acc, g) => acc + g.roles.length, 0);

    if (totalRoles === 0) {
      return { success: false, error: 'No valid role names were found in the text.', groups: [], totalRoles: 0 };
    }

    return {
      success: true,
      groups,
      totalRoles
    };
  }
}

module.exports = RoleParser;
