const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const { getAllRulesTemplates, getRulesTemplate } = require('../../templates/rulesTemplates');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

/**
 * Helper to build rich Discord Embed for a rules template
 */
function buildRulesEmbed(template, guild) {
  const title = template.title.replace(/{server}/g, guild.name);
  const footer = template.footer.replace(/{server}/g, guild.name);

  let descriptionText = `### 📜 ${title}\n` +
    `*Welcome to **${guild.name}**! To ensure a safe, fun, and respectful environment for all members, please review and adhere to our server rules below.*\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  for (const rule of template.rules) {
    descriptionText += `### ${rule.emoji} [${rule.number}] ${rule.title}\n${rule.description}\n\n`;
  }

  descriptionText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `⚖️ **Agreement:** By participating in this server, you acknowledge and agree to comply with these rules and Discord's Terms of Service.`;

  const embed = new EmbedBuilder()
    .setColor(template.color || config.embedColors.primary)
    .setAuthor({ name: `${guild.name} • Official Rules`, iconURL: guild.iconURL() })
    .setTitle(title)
    .setDescription(descriptionText)
    .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
    .setFooter({ text: footer, iconURL: guild.iconURL() })
    .setTimestamp();

  if (template.banner) {
    embed.setImage(template.banner);
  }

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rules')
    .setDescription('📜 Advanced Server Rules System, 10+ Pre-Made Templates & 1-Click Verification')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('templates')
        .setDescription('🎨 Interactive Gallery to browse, preview & deploy 10+ rich rules themes')
    )
    .addSubcommand(sub =>
      sub
        .setName('send')
        .setDescription('🚀 Send a pre-made rules layout with verification button to a channel')
        .addStringOption(opt =>
          opt
            .setName('preset')
            .setDescription('Select the rules preset theme')
            .setRequired(true)
            .addChoices(
              { name: '🎮 Gaming & Esports Arena (Anti-Cheat & Voice Comms)', value: 'gaming' },
              { name: '🌸 Anime & Aesthetic Lounge (Cozy Kaomoji & Spoilers)', value: 'anime' },
              { name: '🌟 Cozy Social Community (Universal Lounge Guidelines)', value: 'community' },
              { name: '💻 Developer & Tech Hub (Code Blocks & Help Etiquette)', value: 'developer' },
              { name: '⚡ Cyberpunk / Network Security Protocols (Directives)', value: 'cyberpunk' },
              { name: '💎 Minimalist & Executive VIP (Clean Luxury Bullet Points)', value: 'minimal' },
              { name: '📚 Study & Academic Campus (Academic Integrity & Focus)', value: 'study' },
              { name: '🏆 Esports Clan & Competitive (Scrims & Attendance)', value: 'esports' },
              { name: '🎧 Chill Music & Hangout (DJ Queue & Vibe Check)', value: 'chill' },
              { name: '🛒 Marketplace & Trading (Vouches, Middlemen & Safety)', value: 'marketplace' }
            )
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Channel where rules will be posted (e.g. #rules or #guidelines)')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
        .addRoleOption(opt =>
          opt
            .setName('verify_role')
            .setDescription('Role awarded when members click "Accept Rules & Verify"')
            .setRequired(false)
        )
        .addBooleanOption(opt =>
          opt
            .setName('include_verify_button')
            .setDescription('Add interactive "✅ Accept Rules & Verify" button? (Default: True)')
            .setRequired(false)
        )
        .addBooleanOption(opt =>
          opt
            .setName('include_ticket_button')
            .setDescription('Add interactive "🎫 Need Help / Support" button? (Default: True)')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('verify-role')
        .setDescription('🛡️ Configure or change the Member role given when clicking "Accept Rules"')
        .addRoleOption(opt =>
          opt
            .setName('role')
            .setDescription('Role to automatically give when a member verifies')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('preview')
        .setDescription('👀 Ephemeral preview of any rules preset or current server rules')
        .addStringOption(opt =>
          opt
            .setName('preset')
            .setDescription('Optional preset to preview')
            .setRequired(false)
            .addChoices(
              { name: '🎮 Gaming & Esports Arena', value: 'gaming' },
              { name: '🌸 Anime & Aesthetic Lounge', value: 'anime' },
              { name: '🌟 Cozy Social Community', value: 'community' },
              { name: '💻 Developer & Tech Hub', value: 'developer' },
              { name: '⚡ Cyberpunk Security Protocols', value: 'cyberpunk' },
              { name: '💎 Minimalist VIP', value: 'minimal' },
              { name: '📚 Study & Academic Hub', value: 'study' },
              { name: '🏆 Esports Clan Roster', value: 'esports' },
              { name: '🎧 Chill Music & Hangout', value: 'chill' },
              { name: '🛒 Marketplace & Trading', value: 'marketplace' }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('custom')
        .setDescription('✍️ Open interactive Modal Builder to create your own customized rules embed')
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Channel to post custom rules to')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('clear-verify')
        .setDescription('❌ Remove the verification role configuration')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
    const rulesConfig = guildSettings.rules || {};

    // 1. TEMPLATES GALLERY
    if (subcommand === 'templates') {
      const templates = getAllRulesTemplates();
      const initialTemplate = templates[0];

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('rules_tpl_select')
        .setPlaceholder('✨ Choose a rules theme from the catalog...')
        .addOptions(
          templates.map(t =>
            new StringSelectMenuOptionBuilder()
              .setLabel(t.name)
              .setValue(t.id)
              .setDescription(t.description.substring(0, 100))
              .setEmoji(t.emoji)
              .setDefault(t.id === initialTemplate.id)
          )
        );

      const menuRow = new ActionRowBuilder().addComponents(selectMenu);

      const btnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`rules_tpl_send_${initialTemplate.id}`)
          .setLabel(`Deploy to Channel`)
          .setStyle(ButtonStyle.Success)
          .setEmoji('🚀'),
        new ButtonBuilder()
          .setCustomId(`rules_tpl_apply_${initialTemplate.id}`)
          .setLabel(`Set Default Theme`)
          .setStyle(ButtonStyle.Primary)
          .setEmoji('💾')
      );

      const previewEmbed = buildRulesEmbed(initialTemplate, interaction.guild);

      return interaction.reply({
        content: `🎨 **Server Rules Catalog & Theme Browser**\n*Select any rules layout below to preview it live. Use **Deploy to Channel** or \`/rules send\` to post to your server!*`,
        embeds: [previewEmbed],
        components: [menuRow, btnRow]
      });
    }

    // 2. SEND PRESET TO CHANNEL
    if (subcommand === 'send') {
      const presetId = interaction.options.getString('preset');
      const targetChannel = interaction.options.getChannel('channel');
      const verifyRole = interaction.options.getRole('verify_role');
      const includeVerify = interaction.options.getBoolean('include_verify_button') ?? true;
      const includeTicket = interaction.options.getBoolean('include_ticket_button') ?? true;

      const template = getRulesTemplate(presetId);
      if (!template) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Preset Not Found', `Could not find preset \`${presetId}\`.`)],
          ephemeral: true
        });
      }

      // Check bot permissions in target channel
      const botMember = interaction.guild.members.me;
      const channelPerms = targetChannel.permissionsFor(botMember);
      if (!channelPerms.has(PermissionFlagsBits.SendMessages) || !channelPerms.has(PermissionFlagsBits.EmbedLinks)) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Missing Permissions', `Bot lacks **Send Messages** or **Embed Links** permission in <#${targetChannel.id}>.`)],
          ephemeral: true
        });
      }

      // Save role if provided
      if (verifyRole) {
        DatabaseManager.setRulesConfig(interaction.guild.id, {
          verifyRoleId: verifyRole.id
        });
      }

      const activeVerifyRoleId = verifyRole ? verifyRole.id : rulesConfig.verifyRoleId;

      // Build Action Buttons
      const buttons = [];
      if (includeVerify) {
        buttons.push(
          new ButtonBuilder()
            .setCustomId('rules_verify_btn')
            .setLabel('Accept Rules & Verify')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅')
        );
      }

      if (includeTicket) {
        buttons.push(
          new ButtonBuilder()
            .setCustomId('ticket_general_btn')
            .setLabel('Support / Staff')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🎫')
        );
      }

      const components = buttons.length > 0 ? [new ActionRowBuilder().addComponents(buttons)] : [];
      const embed = buildRulesEmbed(template, interaction.guild);

      try {
        const sentMessage = await targetChannel.send({
          embeds: [embed],
          components: components
        });

        DatabaseManager.setRulesConfig(interaction.guild.id, {
          enabled: true,
          channelId: targetChannel.id,
          templateId: template.id,
          messageId: sentMessage.id,
          verifyRoleId: activeVerifyRoleId || null
        });

        let verifyNote = '';
        if (includeVerify) {
          if (activeVerifyRoleId) {
            verifyNote = `\n• **Verification Role:** <@&${activeVerifyRoleId}> (Clicking the button will assign this role)`;
          } else {
            verifyNote = `\n• ⚠️ **Verification Role:** *No role configured! Set one with \`/rules verify-role\` so the verify button grants a role.*`;
          }
        }

        return interaction.reply({
          embeds: [
            EmbedUtils.success(
              'Server Rules Deployed! 📜🎉',
              `The **${template.name}** rules have been posted to <#${targetChannel.id}>!\n\n` +
              `• **Theme Palette:** \`${template.color}\`\n` +
              `• **Verify Button:** ${includeVerify ? '✅ Enabled' : '❌ Disabled'}` +
              verifyNote + '\n' +
              `• **Message Link:** [Jump to Rules](${sentMessage.url})`
            )
          ]
        });
      } catch (err) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Deployment Failed', `Failed to send rules embed:\n\`${err.message}\``)],
          ephemeral: true
        });
      }
    }

    // 3. SET VERIFY ROLE
    if (subcommand === 'verify-role') {
      const role = interaction.options.getRole('role');
      const botMember = interaction.guild.members.me;

      if (botMember.roles.highest.position <= role.position) {
        return interaction.reply({
          embeds: [
            EmbedUtils.warning(
              'Role Hierarchy Warning',
              `Bot's highest role (**${botMember.roles.highest.name}**) is lower than or equal to <@&${role.id}>.\n\n` +
              `👉 **Action:** Move the **${botMember.roles.highest.name}** role **above** <@&${role.id}> in **Server Settings > Roles** for automatic verification to work.`
            )
          ],
          ephemeral: true
        });
      }

      DatabaseManager.setRulesConfig(interaction.guild.id, {
        verifyRoleId: role.id
      });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Verification Role Configured! 🛡️',
            `Members who click the **"✅ Accept Rules & Verify"** button will now automatically be assigned <@&${role.id}>.\n\n` +
            `💡 *To post or update rules in your rules channel, use \`/rules send\` or \`/rules templates\`!*`
          )
        ]
      });
    }

    // 4. PREVIEW
    if (subcommand === 'preview') {
      const presetId = interaction.options.getString('preset') || rulesConfig.templateId || 'gaming';
      const template = getRulesTemplate(presetId) || getAllRulesTemplates()[0];
      const previewEmbed = buildRulesEmbed(template, interaction.guild);

      const btnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('rules_verify_btn')
          .setLabel('Accept Rules & Verify (Demo)')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
      );

      return interaction.reply({
        content: `👀 **Rules Preview: ${template.name}**`,
        embeds: [previewEmbed],
        components: [btnRow],
        ephemeral: true
      });
    }

    // 5. CUSTOM RULES MODAL BUILDER
    if (subcommand === 'custom') {
      const targetChannel = interaction.options.getChannel('channel');

      const modal = new ModalBuilder()
        .setCustomId(`rules_custom_modal_${targetChannel.id}`)
        .setTitle('✍️ Custom Server Rules Creator');

      const titleInput = new TextInputBuilder()
        .setCustomId('rules_title')
        .setLabel('Rules Header Title')
        .setPlaceholder('e.g. 📜 Official Server Guidelines & Rules')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);

      const rulesContentInput = new TextInputBuilder()
        .setCustomId('rules_content')
        .setLabel('Rules Body (Markdown Supported)')
        .setPlaceholder(
          '1. Respect everyone in chat\n' +
          '2. No spamming or advertising\n' +
          '3. Keep voice channels clean\n' +
          '4. Follow Discord Community Guidelines'
        )
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(3500);

      const colorInput = new TextInputBuilder()
        .setCustomId('rules_color')
        .setLabel('Embed Hex Color (e.g. #5865F2)')
        .setPlaceholder('#5865F2')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setMaxLength(7);

      const bannerInput = new TextInputBuilder()
        .setCustomId('rules_banner')
        .setLabel('Banner Image URL (Optional)')
        .setPlaceholder('https://images.unsplash.com/photo-...')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(rulesContentInput),
        new ActionRowBuilder().addComponents(colorInput),
        new ActionRowBuilder().addComponents(bannerInput)
      );

      return interaction.showModal(modal);
    }

    // 6. CLEAR VERIFY ROLE
    if (subcommand === 'clear-verify') {
      DatabaseManager.setRulesConfig(interaction.guild.id, {
        verifyRoleId: null
      });

      return interaction.reply({
        embeds: [EmbedUtils.success('Verification Role Cleared', 'Verification role has been removed.')]
      });
    }
  }
};

module.exports.buildRulesEmbed = buildRulesEmbed;
