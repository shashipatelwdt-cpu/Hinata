/**
 * Threat Risk Scorer & Anti-Raid Account Sentry
 * Evaluates account attributes upon guild join to detect burner accounts,
 * raid bots, and phishing impersonators before they can harm the server.
 */

const SUSPICIOUS_USERNAME_PATTERNS = [
  /nitro/i,
  /gift/i,
  /steam/i,
  /airdrop/i,
  /free-?\w+/i,
  /claim/i,
  /official-?\w+/i,
  /announcement/i,
  /moderator-?\d+/i,
  /admin-?\d+/i,
  /support-?\d+/i,
  /verify-?\d+/i,
  /promo/i,
  /roblox.*free/i,
  /v-?bucks/i,
  /^[a-z0-9]{18,}$/i // extremely long random alphanumeric generator pattern
];

class ThreatScorer {
  /**
   * Calculate account threat score (0 - 100)
   * @param {import('discord.js').GuildMember} member
   * @returns {{
   *   score: number,
   *   riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL',
   *   flags: string[],
   *   isCritical: boolean,
   *   accountAgeMs: number,
   *   accountAgeHuman: string
   * }}
   */
  static assessMember(member) {
    const user = member.user;
    const now = Date.now();
    const createdTimestamp = user.createdTimestamp;
    const accountAgeMs = Math.max(0, now - createdTimestamp);

    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;

    let score = 0;
    const flags = [];

    // 1. Account Age Risk
    if (accountAgeMs < 1 * hourMs) {
      score += 50;
      flags.push('Brand new account (Created < 1 hour ago)');
    } else if (accountAgeMs < 6 * hourMs) {
      score += 40;
      flags.push('Extremely fresh account (Created < 6 hours ago)');
    } else if (accountAgeMs < 24 * hourMs) {
      score += 30;
      flags.push('New account (Created < 24 hours ago)');
    } else if (accountAgeMs < 3 * dayMs) {
      score += 20;
      flags.push('Recent account (Created < 3 days ago)');
    } else if (accountAgeMs < 7 * dayMs) {
      score += 10;
      flags.push('Young account (Created < 7 days ago)');
    }

    // 2. Default Avatar Check
    const hasDefaultAvatar = !user.avatar;
    if (hasDefaultAvatar) {
      score += 20;
      flags.push('Using default Discord avatar (No custom profile picture)');
    }

    // 3. Username Heuristics
    const username = (user.username || '').toLowerCase();
    const displayName = (member.displayName || '').toLowerCase();

    for (const pattern of SUSPICIOUS_USERNAME_PATTERNS) {
      if (pattern.test(username) || pattern.test(displayName)) {
        score += 25;
        flags.push(`Suspicious name pattern matched (${pattern.toString()})`);
        break;
      }
    }

    // 4. Discord Bot Account Check
    if (user.bot) {
      // Bots without verification or unapproved can have elevated oversight
      flags.push('Automated Bot User');
    }

    // Clamp score 0 - 100
    score = Math.min(100, Math.max(0, score));

    // Determine Risk Level
    let riskLevel = 'LOW';
    if (score >= 75) {
      riskLevel = 'CRITICAL';
    } else if (score >= 50) {
      riskLevel = 'ELEVATED';
    } else if (score >= 25) {
      riskLevel = 'MODERATE';
    }

    // Format human readable age
    const totalHours = Math.floor(accountAgeMs / hourMs);
    const days = Math.floor(totalHours / 24);
    const remHours = totalHours % 24;
    const accountAgeHuman = days > 0 ? `${days}d ${remHours}h` : `${totalHours}h`;

    return {
      score,
      riskLevel,
      flags,
      isCritical: score >= 75,
      accountAgeMs,
      accountAgeHuman
    };
  }
}

module.exports = ThreatScorer;
