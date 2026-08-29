const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const BadWordsEngine = require('../../utils/badWords');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('🛡️ Automated server protection & Hindi/Hinglish profanity defense')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('status')
        .setDescription('📊 View current AutoMod configuration and active filters')
    )
    .addSubcommand(sub =>
      sub
        .setName('anti-link')
        .setDescription('🔗 Toggle blocking external website links')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable anti-link').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('anti-invite')
        .setDescription('🚫 Toggle blocking Discord invite links')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable anti-invite').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('anti-spam')
        .setDescription('⚡ Toggle fast message spam and flooding protection')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable anti-spam').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('anti-mention')
        .setDescription('📢 Protect against mass mention attacks (@everyone, @here, mass pings)')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable').setRequired(true))
        .addIntegerOption(opt => opt.setName('max_mentions').setDescription('Max allowed mentions per message (default: 5)').setMinValue(2).setMaxValue(20).setRequired(false))
    )
    .addSubcommand(sub =>
      sub
        .setName('badwords')
        .setDescription('🤬 Manage Hindi, Hinglish & English bad words profanity filter')
        .addStringOption(opt =>
          opt.setName('action')
            .setDescription('Action to perform')
            .setRequired(true)
            .addChoices(
              { name: '🇮🇳 Load Full Hindi & Hinglish Preset (250+ Slurs)', value: 'preset' },
              { name: '➕ Add Custom Word', value: 'add' },
              { name: '➖ Remove Word', value: 'remove' },
              { name: '📋 List Words', value: 'list' },
              { name: '⚡ Toggle Profanity Filter', value: 'toggle' },
              { name: '🗑️ Reset to Default Master List', value: 'reset' }
            )
        )
        .addStringOption(opt => opt.setName('word').setDescription('Specific word to add or remove').setRequired(false))
    )
    .addSubcommand(sub =>
      sub
        .setName('filter-admins')
        .setDescription('🧪 Toggle filtering admins/owner (useful to test AutoMod on yourself)')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable to filter admins (disable to bypass admins)').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('test')
        .setDescription('🧪 Live Test a sentence or message against all AutoMod filters')
        .addStringOption(opt => opt.setName('message').setDescription('Text message to test').setRequired(true))
    )
    .addSubcommand(sub =>
      sub
        .setName('modlog')
        .setDescription('📜 Set the channel where moderation and automod logs will be sent')
        .addChannelOption(opt => opt.setName('channel').setDescription('The channel for audit logs').setRequired(true))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
    const automod = { ...config.defaultSettings.automod, ...(guildSettings.automod || {}) };

    // 1. STATUS
    if (subcommand === 'status') {
      const customCount = (automod.customBadWords || []).length;
      const totalWords = customCount > 0 ? customCount : BadWordsEngine.getTotalCount();
      const wordSource = customCount > 0 ? `Custom List (${customCount} words)` : `Master Preset (${totalWords} Hindi/Hinglish/English words)`;

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary || '#5865F2')
        .setTitle('🛡️ AutoMod Protection Status')
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription('Real-time automated defense & profanity filter settings:')
        .addFields(
          { name: '🤬 Anti-Profanity / Bad Words', value: automod.antiProfanity !== false ? `✅ Enabled (${wordSource})` : '❌ Disabled', inline: false },
          { name: '🚫 Anti-Discord-Invite', value: automod.antiInvite ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: '🔗 Anti-Link', value: automod.antiLink ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: '⚡ Anti-Spam Flooding', value: automod.antiSpam ? '✅ Enabled' : '❌ Disabled', inline: true },
          { name: '📢 Anti-Mass-Mention', value: automod.antiMassMention ? `✅ Enabled (Max: ${automod.maxMentions || 5})` : '❌ Disabled', inline: true },
          { name: '🧪 Filter Admins (Testing)', value: automod.filterAdmins ? '⚠️ Active (Admins Filtered)' : '✅ Bypassed (Normal)', inline: true },
          { name: '📜 ModLog Channel', value: guildSettings.modlog_channel ? `<#${guildSettings.modlog_channel}>` : '❌ Not Set (\`/automod modlog\`)', inline: true }
        )
        .setFooter({ text: 'Use /automod test <text> to simulate filter checks anytime.' });

      return interaction.reply({ embeds: [embed] });
    }

    // 2. MODLOG
    if (subcommand === 'modlog') {
      const channel = interaction.options.getChannel('channel');
      DatabaseManager.setModlogChannel(interaction.guild.id, channel.id);

      return interaction.reply({
        embeds: [EmbedUtils.success('ModLog Channel Configured', `Moderation and AutoMod logs will now be sent to <#${channel.id}>.`)]
      });
    }

    // 3. ANTI-LINK
    if (subcommand === 'anti-link') {
      const enabled = interaction.options.getBoolean('enabled');
      automod.antiLink = enabled;
      DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

      return interaction.reply({
        embeds: [EmbedUtils.success('Anti-Link Updated', `Anti-Link filter is now **${enabled ? 'ENABLED' : 'DISABLED'}**.`)]
      });
    }

    // 4. ANTI-INVITE
    if (subcommand === 'anti-invite') {
      const enabled = interaction.options.getBoolean('enabled');
      automod.antiInvite = enabled;
      DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

      return interaction.reply({
        embeds: [EmbedUtils.success('Anti-Invite Updated', `Anti-Discord-Invite filter is now **${enabled ? 'ENABLED' : 'DISABLED'}**.`)]
      });
    }

    // 5. ANTI-SPAM
    if (subcommand === 'anti-spam') {
      const enabled = interaction.options.getBoolean('enabled');
      automod.antiSpam = enabled;
      DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

      return interaction.reply({
        embeds: [EmbedUtils.success('Anti-Spam Updated', `Anti-Spam flooding detector is now **${enabled ? 'ENABLED' : 'DISABLED'}**.`)]
      });
    }

    // 6. ANTI-MENTION
    if (subcommand === 'anti-mention') {
      const enabled = interaction.options.getBoolean('enabled');
      const maxMentions = interaction.options.getInteger('max_mentions') || automod.maxMentions || 5;
      automod.antiMassMention = enabled;
      automod.maxMentions = maxMentions;
      DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

      return interaction.reply({
        embeds: [EmbedUtils.success('Anti-Mass-Mention Updated', `Anti-Mass-Mention is now **${enabled ? 'ENABLED' : 'DISABLED'}** (Threshold: ${maxMentions} mentions).`)]
      });
    }

    // 7. FILTER ADMINS
    if (subcommand === 'filter-admins') {
      const enabled = interaction.options.getBoolean('enabled');
      automod.filterAdmins = enabled;
      DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

      return interaction.reply({
        embeds: [
          EmbedUtils.info(
            'Admin Filter Testing Mode',
            `Admin/Owner filtering is now **${enabled ? 'ENABLED (Testing mode active - your messages will be filtered)' : 'DISABLED (Admins bypass AutoMod as normal)'}**.`
          )
        ]
      });
    }

    // 8. TEST SIMULATION
    if (subcommand === 'test') {
      const testMsg = interaction.options.getString('message');
      const activeBadWords = Array.isArray(automod.customBadWords) && automod.customBadWords.length > 0
        ? automod.customBadWords
        : BadWordsEngine.getDefaultBadWords();

      const profanityCheck = BadWordsEngine.checkMessage(testMsg, activeBadWords);
      const inviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/[a-zA-Z0-9]+/i;
      const linkRegex = /(https?:\/\/[^\s]+)/i;

      const isInvite = inviteRegex.test(testMsg);
      const isLink = linkRegex.test(testMsg);

      let statusEmoji = '✅';
      let verdict = 'Message PASSED all AutoMod checks!';
      let reasons = [];

      if (profanityCheck.isProfane && automod.antiProfanity !== false) {
        statusEmoji = '🚨';
        reasons.push(`🤬 **Profanity/Bad Word:** Flagged on \`${profanityCheck.matchedWord}\``);
      }
      if (isInvite && automod.antiInvite) {
        statusEmoji = '🚨';
        reasons.push('🚫 **Discord Invite Link:** Detected');
      }
      if (isLink && automod.antiLink) {
        statusEmoji = '🚨';
        reasons.push('🔗 **External Link:** Detected');
      }

      if (reasons.length > 0) {
        verdict = `Message would be **DELETED** by AutoMod!\n\n` + reasons.join('\n');
      }

      const embed = new EmbedBuilder()
        .setColor(reasons.length > 0 ? config.embedColors.danger : config.embedColors.success)
        .setTitle(`${statusEmoji} AutoMod Live Test Diagnostic`)
        .setDescription(
          `**Tested Text:** \`\`\`${testMsg.slice(0, 500)}\`\`\`\n` +
          `**Verdict:** ${verdict}`
        )
        .setFooter({ text: 'AutoMod Real-time Simulation Engine' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // 9. BAD WORDS MANAGEMENT
    if (subcommand === 'badwords') {
      const action = interaction.options.getString('action');
      const word = interaction.options.getString('word')?.toLowerCase()?.trim();
      let badWordsList = automod.customBadWords || [];

      if (action === 'preset') {
        const defaultList = BadWordsEngine.getDefaultBadWords();
        automod.customBadWords = defaultList;
        automod.antiProfanity = true;
        DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

        return interaction.reply({
          embeds: [
            EmbedUtils.success(
              '🇮🇳 Hindi & Hinglish Preset Loaded!',
              `Successfully loaded **${defaultList.length}** abusive terms & slurs into your server's AutoMod filter!\n\n` +
              `• **Included Categories:** Hinglish Slang, Devanagari Hindi, and English profanities.\n` +
              `• **Status:** Anti-Profanity is now **ACTIVE** ✅\n\n` +
              `*Try \`/automod test message:<text>\` to simulate checks!*`
            )
          ]
        });
      }

      if (action === 'reset') {
        automod.customBadWords = [];
        automod.antiProfanity = true;
        DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

        return interaction.reply({
          embeds: [
            EmbedUtils.success(
              'Reset to Master Bad Words List',
              `Custom list cleared. AutoMod will now use the global master catalog of **${BadWordsEngine.getTotalCount()}** Hindi, Hinglish & English bad words.`
            )
          ]
        });
      }

      if (action === 'toggle') {
        automod.antiProfanity = !automod.antiProfanity;
        DatabaseManager.setAutomodConfig(interaction.guild.id, automod);
        return interaction.reply({
          embeds: [EmbedUtils.success('Anti-Profanity Updated', `Anti-Profanity filter is now **${automod.antiProfanity ? 'ENABLED' : 'DISABLED'}**.`)]
        });
      }

      if (action === 'list') {
        const activeList = badWordsList.length > 0 ? badWordsList : BadWordsEngine.getDefaultBadWords();
        const displaySample = activeList.slice(0, 45).map(w => `\`${w}\``).join(', ');

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle(`🤬 Blocked Bad Words (${activeList.length} Total Words)`)
          .setDescription(
            `**Source:** ${badWordsList.length > 0 ? 'Custom Server List' : 'Master Hindi/Hinglish/English Preset'}\n\n` +
            `### 📝 Sample Blocked Words:\n${displaySample} ...and ${Math.max(0, activeList.length - 45)} more words.\n\n` +
            `*Use \`/automod badwords action:➕ Add Custom Word word:<word>\` to add custom terms.*`
          )
          .setFooter({ text: 'Hinata Anti-Profanity Defense' });

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      if (!word) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Missing Word', 'Please specify a word to add or remove in the `word` option.')],
          ephemeral: true
        });
      }

      if (action === 'add') {
        if (badWordsList.length === 0) {
          badWordsList = [...BadWordsEngine.getDefaultBadWords()];
        }
        if (badWordsList.includes(word)) {
          return interaction.reply({
            embeds: [EmbedUtils.warning('Already Exists', `\`${word}\` is already in the blocked list.`)],
            ephemeral: true
          });
        }
        badWordsList.push(word);
        automod.customBadWords = badWordsList;
        automod.antiProfanity = true;
        DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

        return interaction.reply({
          embeds: [EmbedUtils.success('Word Blocked', `Added \`${word}\` to the blocked words list (Anti-Profanity is ACTIVE).`)]
        });
      }

      if (action === 'remove') {
        if (badWordsList.length === 0) {
          badWordsList = [...BadWordsEngine.getDefaultBadWords()];
        }
        if (!badWordsList.includes(word)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Not Found', `\`${word}\` is not in the blocked list.`)],
            ephemeral: true
          });
        }
        badWordsList = badWordsList.filter(w => w !== word);
        automod.customBadWords = badWordsList;
        DatabaseManager.setAutomodConfig(interaction.guild.id, automod);

        return interaction.reply({
          embeds: [EmbedUtils.success('Word Removed', `Removed \`${word}\` from the blocked words list.`)]
        });
      }
    }
  }
};
