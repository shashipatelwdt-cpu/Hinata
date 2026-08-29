const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  AttachmentBuilder,
  ChannelType
} = require('discord.js');
const { 
  getAllTemplates, 
  getTemplate, 
  getCategories, 
  searchTemplates,
  TemplateParser,
  AIPromptGenerator,
  ServerExporter,
  TemplateBuilderEngine,
  TemplateSlider,
  OnlineTemplateImporter
} = require('../../templates');
const EmbedUtils = require('../../utils/embeds');
const ChannelWiper = require('../../utils/channelWiper');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('template')
    .setDescription('🏗️ 1-Click Server Templates, Xenon Importer, Carousel Slider & AI Builder')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    // 1. LIST / SLIDER
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('📋 Browse 37+ templates with interactive Carousel / Slider')
        .addStringOption(opt =>
          opt
            .setName('category')
            .setDescription('Filter by category (e.g. Gaming, Community, Tech, Anime, Study, Esports)')
            .setRequired(false)
            .addChoices(
              { name: '🌟 All Categories (37+ Templates)', value: 'all' },
              { name: '🎮 Gaming & RP', value: 'gaming' },
              { name: '🌐 Community & Giveaways', value: 'community' },
              { name: '🛡️ Esports & Clans', value: 'esports' },
              { name: '💼 Business & Support', value: 'business' },
              { name: '💻 Developer & Tech', value: 'developer' },
              { name: '📚 Study & Education', value: 'study' },
              { name: '🎨 Anime & Creative', value: 'anime' },
              { name: '📹 Creators & Memes', value: 'creator' }
            )
        )
    )
    // 2. PREVIEW
    .addSubcommand(sub =>
      sub
        .setName('preview')
        .setDescription('👀 Preview channels, categories & roles of a preset')
        .addStringOption(opt =>
          opt
            .setName('preset')
            .setDescription('Select or search a preset template to preview')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    // 3. APPLY PRESET OR XENON LINK
    .addSubcommand(sub =>
      sub
        .setName('apply')
        .setDescription('🚀 Build complete fresh server from preset, Xenon URL, or Discord link')
        .addStringOption(opt =>
          opt
            .setName('preset')
            .setDescription('Select preset or paste Xenon URL (e.g. xenon.bot/templates/EcR2tfPTc8x5)')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addBooleanOption(opt =>
          opt
            .setName('delete_old_channels')
            .setDescription('Delete all old channels and start 100% fresh? (Recommended: True)')
            .setRequired(false)
        )
    )
    // 4. IMPORT ANY XENON / DISCORD LINK (1000+ TEMPLATES)
    .addSubcommand(sub =>
      sub
        .setName('import')
        .setDescription('🌐 Import any template directly from Xenon Bot, Discord.new, or DiscordTemplates')
        .addStringOption(opt =>
          opt
            .setName('url')
            .setDescription('Paste Xenon URL, Discord.new link, or template ID (e.g. EcR2tfPTc8x5)')
            .setRequired(true)
        )
        .addBooleanOption(opt =>
          opt
            .setName('delete_old_channels')
            .setDescription('Delete all old channels and start fresh? (Recommended: True)')
            .setRequired(false)
        )
    )
    // 5. CUSTOM / AI BLUEPRINT
    .addSubcommand(sub =>
      sub
        .setName('custom')
        .setDescription('🤖 Build server from ChatGPT blueprint or Markdown / JSON text')
        .addStringOption(opt =>
          opt
            .setName('blueprint')
            .setDescription('Directly paste the JSON or Markdown blueprint text')
            .setRequired(false)
        )
        .addAttachmentOption(opt =>
          opt
            .setName('file')
            .setDescription('Upload a .txt, .json, or .md blueprint file')
            .setRequired(false)
        )
        .addBooleanOption(opt =>
          opt
            .setName('delete_old_channels')
            .setDescription('Delete existing channels before building? (Default: True)')
            .setRequired(false)
        )
    )
    // 6. AI PROMPT
    .addSubcommand(sub =>
      sub
        .setName('ai-prompt')
        .setDescription('💡 Get copy-paste prompt for ChatGPT to generate custom server layouts')
        .addStringOption(opt =>
          opt
            .setName('theme')
            .setDescription('Server theme (e.g. Cyberpunk Gaming, Anime Cafe, Coding Bootcamp)')
            .setRequired(false)
        )
    )
    // 7. EXPORT CURRENT SERVER
    .addSubcommand(sub =>
      sub
        .setName('export')
        .setDescription('📦 Export this Discord server layout as reusable JSON / Markdown blueprint')
        .addStringOption(opt =>
          opt
            .setName('format')
            .setDescription('Export format')
            .setRequired(false)
            .addChoices(
              { name: 'JSON (Full Structure & Channels)', value: 'json' },
              { name: 'Markdown (Readable Document)', value: 'markdown' }
            )
        )
    )
    // 8. WIPE ALL CHANNELS
    .addSubcommand(sub =>
      sub
        .setName('wipe')
        .setDescription('🗑️ Wipe all channels & categories cleanly from the server')
        .addBooleanOption(opt =>
          opt
            .setName('create_general')
            .setDescription('Create a fresh #general channel after wiping? (Default: True)')
            .setRequired(false)
        )
    ),

  /**
   * Autocomplete for presets
   */
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused() || '';
    const matches = searchTemplates(focusedValue).slice(0, 25);

    const choices = matches.map(t => ({
      name: `${t.name.substring(0, 65)} [${t.category.split(' ')[1] || t.category}]`,
      value: t.id
    }));

    // If user typed a URL or custom code, add a live import option choice
    if (focusedValue.includes('xenon.bot') || focusedValue.includes('discord.new') || focusedValue.length > 5) {
      choices.unshift({
        name: `🌐 Import Live Link: "${focusedValue.substring(0, 70)}"`,
        value: focusedValue
      });
    }

    try {
      await interaction.respond(choices.slice(0, 25));
    } catch (e) {
      // Ignored if interaction expired
    }
  },

  /**
   * Command execution
   */
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Permission Denied', 'You must have **Administrator** permissions to manage server templates.')],
        ephemeral: true
      });
    }

    const subcommand = interaction.options.getSubcommand();

    // ==========================================
    // 1. SUBCOMMAND: LIST (CAROUSEL SLIDER)
    // ==========================================
    if (subcommand === 'list') {
      const categoryChoice = interaction.options.getString('category') || 'all';
      const { list, categoryName, categorySlug } = TemplateSlider.getCategoryList(categoryChoice);

      const slideData = TemplateSlider.renderSlide({
        list,
        index: 0,
        categoryKey: categorySlug || categoryChoice,
        categoryName
      });

      return interaction.reply(slideData);
    }

    // ==========================================
    // 2. SUBCOMMAND: PREVIEW
    // ==========================================
    if (subcommand === 'preview') {
      const presetId = interaction.options.getString('preset');
      let template = getTemplate(presetId);

      if (!template) {
        await interaction.deferReply();
        const liveImport = await OnlineTemplateImporter.fetchTemplate(presetId);
        if (liveImport.success && liveImport.template) {
          template = liveImport.template;
        } else {
          return interaction.editReply({
            embeds: [EmbedUtils.error('Template Not Found', liveImport.error || `Template \`${presetId}\` does not exist.`)]
          });
        }
      }

      const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(`👀 Template Preview: ${template.name}`)
        .setDescription(
          `**📂 Category:** ${template.category}\n` +
          `**📝 Description:** ${template.description}\n\n` +
          `**To apply this template, run:** \`/template apply preset:${presetId}\``
        )
        .addFields(
          {
            name: '📊 Specifications',
            value: `🎭 **${template.roles.length} Roles** | 📁 **${template.categories.length} Categories** | 💬 **${totalChannels} Channels**`,
            inline: false
          }
        );

      const rolesSummary = template.roles.map(r => `• \`${r.name}\``).join('  ');
      embed.addFields({ name: `🎭 Custom Roles (${template.roles.length})`, value: rolesSummary.slice(0, 1024), inline: false });

      let structureText = '';
      for (const cat of template.categories) {
        structureText += `\n**📂 ${cat.name}**\n`;
        for (const ch of cat.channels) {
          const typeIcon = ch.type === ChannelType.GuildVoice ? '🔊' : (ch.type === ChannelType.GuildAnnouncement ? '📢' : '💬');
          structureText += `　└ ${typeIcon} \`${ch.name}\`${ch.topic ? ` - *${ch.topic}*` : ''}\n`;
        }
      }
      embed.addFields({ name: '📁 Channel Hierarchy', value: structureText.slice(0, 1024) || 'None', inline: false });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`template_apply_btn_${template.id}`)
          .setLabel(`Apply "${template.id}"`)
          .setStyle(ButtonStyle.Success)
          .setEmoji('🚀')
      );

      if (interaction.deferred || interaction.replied) {
        return interaction.editReply({ embeds: [embed], components: [row] });
      }
      return interaction.reply({ embeds: [embed], components: [row] });
    }

    // ==========================================
    // 3. SUBCOMMAND: APPLY (PRESET OR XENON LINK)
    // ==========================================
    if (subcommand === 'apply') {
      const presetId = interaction.options.getString('preset');
      const deleteOld = interaction.options.getBoolean('delete_old_channels') !== false;

      let template = getTemplate(presetId);

      // If not in local catalog, try online Xenon/Discord fetch!
      if (!template) {
        await interaction.deferReply();
        const liveImport = await OnlineTemplateImporter.fetchTemplate(presetId);
        if (liveImport.success && liveImport.template) {
          template = liveImport.template;
        } else {
          return interaction.editReply({
            embeds: [EmbedUtils.error('Template Not Found', liveImport.error || `Could not find preset \`${presetId}\`.`)]
          });
        }
      }

      const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);
      const estSeconds = Math.round((template.roles.length * 0.7) + (totalChannels * 0.8) + 4);

      const confirmBtn = new ButtonBuilder()
        .setCustomId('confirm_build')
        .setLabel('Yes, Transform My Server!')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🚀');

      const cancelBtn = new ButtonBuilder()
        .setCustomId('cancel_build')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('✖️');

      const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

      const confirmEmbed = new EmbedBuilder()
        .setColor(config.embedColors.warning)
        .setTitle(`⚠️ Confirm Server Build: ${template.name}`)
        .setDescription(
          `Are you sure you want to install this template onto **${interaction.guild.name}**?\n\n` +
          `• 📝 **Template:** ${template.name} (\`${template.id}\`)\n` +
          `• 🎭 **Roles to create:** \`${template.roles.length} Roles\`\n` +
          `• 📂 **Categories & Channels:** \`${template.categories.length} Categories\` & \`${totalChannels} Channels\`\n` +
          `• 🗑️ **Wipe Old Channels:** \`${deleteOld ? 'YES (100% Clean Start)' : 'NO (Keep Existing Channels)'}\`\n` +
          `• ⏱️ **Estimated Duration:** \`~${estSeconds} seconds\`\n\n` +
          `**Click "Yes, Transform My Server" below to proceed.**`
        )
        .setFooter({ text: 'Hinata Server Template Engine • Irreversible Action' })
        .setTimestamp();

      let promptMsg;
      if (interaction.deferred || interaction.replied) {
        promptMsg = await interaction.editReply({ embeds: [confirmEmbed], components: [row] });
      } else {
        try {
          promptMsg = await interaction.reply({ embeds: [confirmEmbed], components: [row], fetchReply: true });
        } catch {
          promptMsg = await interaction.editReply({ embeds: [confirmEmbed], components: [row] }).catch(() => null);
        }
      }

      if (!promptMsg) return;

      const collector = promptMsg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 45000,
        max: 1
      });

      collector.on('collect', async i => {
        if (i.customId === 'cancel_build') {
          return i.update({
            embeds: [EmbedUtils.info('Cancelled', 'Template installation was cancelled.')],
            components: []
          });
        }

        await i.deferUpdate();
        await TemplateBuilderEngine.executeBuild({
          interaction: i,
          template,
          deleteOld,
          currentChannelId: interaction.channelId
        });
      });

      collector.on('end', async (collected, reason) => {
        if (reason === 'time' && collected.size === 0) {
          await interaction.editReply({
            embeds: [EmbedUtils.warning('Timed Out', 'Template build request timed out.')],
            components: []
          }).catch(() => null);
        }
      });

      return;
    }

    // ==========================================
    // 4. SUBCOMMAND: IMPORT (1000+ XENON/DISCORD TEMPLATES)
    // ==========================================
    if (subcommand === 'import') {
      const urlOrCode = interaction.options.getString('url');
      const deleteOld = interaction.options.getBoolean('delete_old_channels') !== false;

      await interaction.deferReply();

      const fetchResult = await OnlineTemplateImporter.fetchTemplate(urlOrCode);
      if (!fetchResult.success) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Import Failed', fetchResult.error)]
        });
      }

      const template = fetchResult.template;
      const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);
      const estSeconds = Math.round((template.roles.length * 0.7) + (totalChannels * 0.8) + 4);

      const confirmBtn = new ButtonBuilder()
        .setCustomId('confirm_online_import')
        .setLabel('Yes, Build This Server!')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🚀');

      const cancelBtn = new ButtonBuilder()
        .setCustomId('cancel_online_import')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('✖️');

      const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

      const previewEmbed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(`🌐 Imported Template: ${template.name}`)
        .setDescription(
          `**Successfully retrieved live server layout from Xenon / Discord!**\n\n` +
          `• 📝 **Description:** ${template.description}\n` +
          `• 🎭 **Roles:** \`${template.roles.length} Roles\`\n` +
          `• 📂 **Categories & Channels:** \`${template.categories.length} Categories\` & \`${totalChannels} Channels\`\n` +
          `• 🗑️ **Delete Old Channels:** \`${deleteOld ? 'YES (Fresh Start)' : 'NO'}\`\n` +
          `• ⏱️ **Est. Time:** \`~${estSeconds} seconds\`\n\n` +
          `Click **Yes, Build This Server** below to start!`
        );

      let structureText = '';
      for (const cat of template.categories.slice(0, 4)) {
        structureText += `**📂 ${cat.name}**\n`;
        for (const ch of (cat.channels || []).slice(0, 4)) {
          const typeIcon = ch.type === ChannelType.GuildVoice ? '🔊' : '💬';
          structureText += `　└ ${typeIcon} \`${ch.name}\`\n`;
        }
      }
      if (template.categories.length > 4) structureText += `*...and ${template.categories.length - 4} more categories*`;

      previewEmbed.addFields({ name: '📁 Channel Preview', value: structureText || 'None', inline: false });

      const promptMsg = await interaction.editReply({
        embeds: [previewEmbed],
        components: [row]
      });

      const collector = promptMsg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 45000,
        max: 1
      });

      collector.on('collect', async i => {
        if (i.customId === 'cancel_online_import') {
          return i.update({
            embeds: [EmbedUtils.info('Cancelled', 'Template installation cancelled.')],
            components: []
          });
        }

        await i.deferUpdate();
        await TemplateBuilderEngine.executeBuild({
          interaction: i,
          template,
          deleteOld,
          currentChannelId: interaction.channelId
        });
      });
      return;
    }

    // ==========================================
    // 5. SUBCOMMAND: CUSTOM / AI BUILDER
    // ==========================================
    if (subcommand === 'custom') {
      const blueprintText = interaction.options.getString('blueprint');
      const attachment = interaction.options.getAttachment('file');
      const deleteOld = interaction.options.getBoolean('delete_old_channels') !== false;

      // Case A: If user provided no text and no file, show a rich Modal popup!
      if (!blueprintText && !attachment) {
        const modal = new ModalBuilder()
          .setCustomId(`template_custom_modal_${deleteOld ? '1' : '0'}`)
          .setTitle('🤖 Paste ChatGPT / Custom Template');

        const input = new TextInputBuilder()
          .setCustomId('template_input_text')
          .setLabel('Paste JSON / Structured Blueprint Here:')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Paste your ChatGPT generated JSON or Markdown template here...')
          .setRequired(true)
          .setMaxLength(4000);

        const modalRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(modalRow);

        return interaction.showModal(modal);
      }

      // Case B: User uploaded a file or provided direct text in option
      await interaction.deferReply();

      let rawContent = blueprintText || '';

      if (attachment) {
        try {
          const res = await fetch(attachment.url);
          rawContent = await res.text();
        } catch (e) {
          return interaction.editReply({
            embeds: [EmbedUtils.error('Download Failed', `Could not download attached file: \`${e.message}\``)]
          });
        }
      }

      // Check if rawContent is a Xenon / Discord URL
      const onlineCode = OnlineTemplateImporter.extractTemplateCode(rawContent);
      let template;

      if (onlineCode && !rawContent.includes('{') && !rawContent.includes('CATEGORIES')) {
        const liveImport = await OnlineTemplateImporter.fetchTemplate(onlineCode);
        if (liveImport.success) {
          template = liveImport.template;
        }
      }

      if (!template) {
        const parseResult = TemplateParser.parse(rawContent);
        if (!parseResult.success) {
          return interaction.editReply({
            embeds: [
              EmbedUtils.error(
                'Invalid Template Format',
                `Could not parse the blueprint:\n\`${parseResult.error}\`\n\n` +
                `💡 *Tip: Run \`/template ai-prompt\` to get the exact prompt format for ChatGPT!*`
              )
            ]
          });
        }
        template = parseResult.template;
      }

      const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);
      const estSeconds = Math.round((template.roles.length * 0.7) + (totalChannels * 0.8) + 4);

      const confirmBtn = new ButtonBuilder()
        .setCustomId('confirm_custom_build')
        .setLabel('Yes, Build My Custom Server!')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🚀');

      const cancelBtn = new ButtonBuilder()
        .setCustomId('cancel_custom_build')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('✖️');

      const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

      const previewEmbed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(`🤖 Custom Blueprint: ${template.name}`)
        .setDescription(
          `**Parsed Successfully!** Ready to build your customized layout.\n\n` +
          `• 📝 **Description:** ${template.description}\n` +
          `• 🎭 **Roles:** \`${template.roles.length} Roles\`\n` +
          `• 📂 **Categories & Channels:** \`${template.categories.length} Categories\` & \`${totalChannels} Channels\`\n` +
          `• 🗑️ **Delete Old Channels:** \`${deleteOld ? 'YES' : 'NO'}\`\n` +
          `• ⏱️ **Est. Time:** \`~${estSeconds} seconds\`\n\n` +
          `Click **Yes, Build My Custom Server** below to start!`
        );

      let structureText = '';
      for (const cat of template.categories.slice(0, 4)) {
        structureText += `**📂 ${cat.name}**\n`;
        for (const ch of (cat.channels || []).slice(0, 4)) {
          const typeIcon = ch.type === ChannelType.GuildVoice ? '🔊' : '💬';
          structureText += `　└ ${typeIcon} \`${ch.name}\`\n`;
        }
      }
      if (template.categories.length > 4) structureText += `*...and ${template.categories.length - 4} more categories*`;

      previewEmbed.addFields({ name: '📁 Structure Preview', value: structureText || 'None', inline: false });

      const promptMsg = await interaction.editReply({
        embeds: [previewEmbed],
        components: [row]
      });

      const collector = promptMsg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 45000,
        max: 1
      });

      collector.on('collect', async i => {
        if (i.customId === 'cancel_custom_build') {
          return i.update({
            embeds: [EmbedUtils.info('Cancelled', 'Custom template installation was cancelled.')],
            components: []
          });
        }

        await i.deferUpdate();
        await TemplateBuilderEngine.executeBuild({
          interaction: i,
          template,
          deleteOld,
          currentChannelId: interaction.channelId
        });
      });

      return;
    }

    // ==========================================
    // 6. SUBCOMMAND: AI PROMPT
    // ==========================================
    if (subcommand === 'ai-prompt') {
      const theme = interaction.options.getString('theme') || 'Gaming & Community';
      const promptText = AIPromptGenerator.generatePrompt(theme);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle('💡 ChatGPT Prompt for Custom Server Blueprints')
        .setDescription(
          `Copy the prompt below and paste it into **ChatGPT / Claude**.\n` +
          `Then copy the generated JSON or Markdown response and use \`/template custom\` to build your server instantly!`
        )
        .addFields({
          name: '📋 Copy-Paste Prompt for AI',
          value: `\`\`\`markdown\n${promptText.slice(0, 1000)}\n...\`\`\``,
          inline: false
        })
        .setFooter({ text: 'Hinata Server Blueprint Engine' })
        .setTimestamp();

      const copyBtn = new ButtonBuilder()
        .setCustomId('template_custom_btn')
        .setLabel('Paste ChatGPT Response Now')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🤖');

      const fileBuffer = Buffer.from(promptText, 'utf-8');
      const attachment = new AttachmentBuilder(fileBuffer, { name: 'chatgpt_server_prompt.txt' });

      const row = new ActionRowBuilder().addComponents(copyBtn);

      return interaction.reply({
        embeds: [embed],
        components: [row],
        files: [attachment]
      });
    }

    // ==========================================
    // 7. SUBCOMMAND: EXPORT CURRENT SERVER
    // ==========================================
    if (subcommand === 'export') {
      await interaction.deferReply();

      const format = interaction.options.getString('format') || 'json';
      const exportData = ServerExporter.exportGuild(interaction.guild, format);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.success)
        .setTitle(`📦 Server Exported: ${interaction.guild.name}`)
        .setDescription(
          `Successfully exported your server layout into a reusable blueprint!\n\n` +
          `• 🎭 **Roles:** \`${exportData.roleCount} Roles\`\n` +
          `• 📂 **Categories:** \`${exportData.categoryCount} Categories\`\n` +
          `• 💬 **Channels:** \`${exportData.channelCount} Channels\`\n` +
          `• 📄 **Format:** \`${format.toUpperCase()}\`\n\n` +
          `You can import this file anytime using \`/template custom file:<upload>\`!`
        )
        .setFooter({ text: 'Hinata Template Exporter' })
        .setTimestamp();

      const fileBuffer = Buffer.from(exportData.content, 'utf-8');
      const attachment = new AttachmentBuilder(fileBuffer, { name: exportData.filename });

      return interaction.editReply({
        embeds: [embed],
        files: [attachment]
      });
    }

    // ==========================================
    // 8. SUBCOMMAND: WIPE CHANNELS
    // ==========================================
    if (subcommand === 'wipe') {
      const createGeneral = interaction.options.getBoolean('create_general') !== false;
      const channels = await interaction.guild.channels.fetch().catch(() => interaction.guild.channels.cache);
      const categoryCount = channels.filter(c => c && c.type === ChannelType.GuildCategory).size;
      const channelCount = channels.size - categoryCount;

      const confirmBtn = new ButtonBuilder()
        .setCustomId('confirm_tpl_wipe')
        .setLabel('Yes, Wipe All Channels!')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🗑️');

      const cancelBtn = new ButtonBuilder()
        .setCustomId('cancel_tpl_wipe')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('✖️');

      const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

      const warnEmbed = new EmbedBuilder()
        .setColor(config.embedColors.danger || '#E74C3C')
        .setTitle('⚠️ Confirm Server Channel Wipe')
        .setDescription(
          `Are you sure you want to **wipe all channels and categories** in **${interaction.guild.name}**?\n\n` +
          `• 📁 **Categories to delete:** \`${categoryCount}\`\n` +
          `• 💬 **Channels to delete:** \`${channelCount}\`\n` +
          `• ➕ **Create Fresh #general:** \`${createGeneral ? 'YES' : 'NO'}\`\n\n` +
          `🚨 **WARNING:** This action is **irreversible**! All message history and channels will be permanently erased.`
        )
        .setFooter({ text: 'Hinata Server Template Engine • 45s Timeout' })
        .setTimestamp();

      const promptMsg = await interaction.reply({
        embeds: [warnEmbed],
        components: [row],
        fetchReply: true
      });

      const collector = promptMsg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 45000,
        max: 1
      });

      collector.on('collect', async i => {
        if (i.customId === 'cancel_tpl_wipe') {
          return i.update({
            embeds: [EmbedUtils.info('Cancelled', 'Channel wipe cancelled. No channels were deleted.')],
            components: []
          });
        }

        await i.deferUpdate();

        await ChannelWiper.wipeAllChannels({
          guild: interaction.guild,
          user: interaction.user,
          createGeneral,
          callerChannelId: interaction.channelId,
          interaction: i
        });
      });

      collector.on('end', async (collected, reason) => {
        if (reason === 'time' && collected.size === 0) {
          await interaction.editReply({
            embeds: [EmbedUtils.warning('Timed Out', 'Channel wipe confirmation timed out.')],
            components: []
          }).catch(() => null);
        }
      });
      return;
    }
  }
};
