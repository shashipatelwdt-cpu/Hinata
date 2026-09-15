/**
 * Compassionate Crisis & Mental Health Sentry
 * Detects severe suicidal ideation or self-harm distress keywords.
 * NEVER punishes the member. Instead, delivers compassionate, confidential
 * 24/7 helpline resources and discreetly alerts server staff to provide support.
 */

const { EmbedBuilder } = require('discord.js');

// Specific suicidal and self-harm phrases
const CRISIS_PATTERNS = [
  /\b(?:i\s*(?:just|really|honestly)?\s*(?:want\s*to|wanna|gonna|going\s*to))\s*(?:kill\s*myself|end\s*my\s*life|commit\s*suicide|hang\s*myself|die)\b/i,
  /\b(?:suicidal|suicide|commit\s*suicide|kill\s*myself|end\s*my\s*life|ending\s*it\s*all|want\s*to\s*die|don'?t\s*want\s*to\s*live\s*(?:anymore)?)\b/i,
  /\b(?:ready\s*to\s*die|goodbye\s*cruel\s*world|tired\s*of\s*living|slit\s*my\s*wrists)\b/i
];

// Context words that indicate casual gaming/slang context rather than genuine crisis
const CASUAL_EXCLUSIONS = [
  /\bkd\b/i, /\bk\/d\b/i, /\blmao\b/i, /\blol\b/i, /\brofl\b/i, /\bhahaha\b/i,
  /\bingame\b/i, /\brespawn\b/i, /\bclutch\b/i, /\branked\b/i, /\bboss\b/i,
  /\blvl\b/i, /\bquest\b/i, /\bnpc\b/i
];

// In-memory cooldown map to avoid repeated DM spamming (1 hour per user)
const crisisCooldown = new Map();

class CrisisSentry {
  /**
   * Check if a message exhibits signs of emotional crisis or self-harm
   * @param {string} text
   * @returns {boolean}
   */
  static isCrisisSignal(text) {
    if (!text || typeof text !== 'string') return false;

    // Check casual gaming exclusions first
    for (const exc of CASUAL_EXCLUSIONS) {
      if (exc.test(text)) return false;
    }

    for (const pattern of CRISIS_PATTERNS) {
      if (pattern.test(text)) return true;
    }

    return false;
  }

  /**
   * Check if member is on crisis notice cooldown
   * @param {string} userId
   * @returns {boolean}
   */
  static isOnCooldown(userId) {
    const last = crisisCooldown.get(userId);
    if (!last) return false;
    return (Date.now() - last) < (60 * 60 * 1000); // 1-hour cooldown
  }

  /**
   * Record that crisis message was sent to member
   * @param {string} userId
   */
  static markSent(userId) {
    crisisCooldown.set(userId, Date.now());
  }

  /**
   * Build compassionate support embed for direct message
   * @param {import('discord.js').User} user
   * @param {import('discord.js').Guild} guild
   * @returns {EmbedBuilder}
   */
  static buildCompassionEmbed(user, guild) {
    return new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('💙 You are not alone — We care about you')
      .setDescription(
        `Hello **${user.username}**,\n\n` +
        `We noticed a message in **${guild.name}** indicating that you may be going through a difficult or painful time. ` +
        `Whatever you are facing right now, please know that **your life has value** and there is compassionate, free, and confidential help available 24/7.\n\n` +
        `You do not have to carry this burden alone. Please reach out to someone who can help:`
      )
      .addFields(
        {
          name: '🇺🇸 United States & 🇨🇦 Canada',
          value: '📞 **Call or Text 988** (Suicide & Crisis Lifeline)\n💬 Text **HOME** to **741741** (Crisis Text Line)',
          inline: false
        },
        {
          name: '🇬🇧 United Kingdom',
          value: '📞 Call **111** (NHS Mental Health Services)\n💬 Text **SHOUT** to **85258** (24/7 Crisis Messenger)',
          inline: false
        },
        {
          name: '🇮🇳 India',
          value: '📞 Call **9152987821** or **9820466726** (AASRA 24/7 Helpline)\n📞 Call **9999 666 555** (Vandrevala Foundation)',
          inline: false
        },
        {
          name: '🌍 International & Other Countries',
          value: '🌐 Visit **[findahelpline.com](https://findahelpline.com/)** or **[befrienders.org](https://www.befrienders.org/)** for confidential support in your local region.',
          inline: false
        },
        {
          name: '🏳️‍🌈 LGBTQ+ Youth',
          value: '📞 Call **1-866-488-7386** or text **START to 678-678** (The Trevor Project)',
          inline: false
        }
      )
      .setFooter({ text: 'Hinata Welfare Sentry • Confidential & Caring Support' })
      .setTimestamp();
  }

  /**
   * Build staff discreet welfare alert embed
   * @param {import('discord.js').User} user
   * @param {import('discord.js').TextChannel} channel
   * @param {string} content
   * @returns {EmbedBuilder}
   */
  static buildStaffWelfareAlert(user, channel, content) {
    return new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('💙 Welfare Notice: Mental Health Support Triggered')
      .setDescription(
        `A member sent a message containing self-harm or crisis distress indicators. ` +
        `**Zero moderation action/penalties were issued.** A confidential support DM with 24/7 crisis resources was provided.\n\n` +
        `Please consider checking in on them with kindness and empathy.`
      )
      .addFields(
        { name: '👤 Member', value: `<@${user.id}> (\`${user.tag}\`)`, inline: true },
        { name: '💬 Channel', value: `<#${channel.id}>`, inline: true },
        { name: '📝 Message Excerpt', value: `\`\`\`${(content || '[No Text]').slice(0, 500)}\`\`\``, inline: false }
      )
      .setFooter({ text: 'Staff Welfare Notification' })
      .setTimestamp();
  }
}

module.exports = CrisisSentry;
