const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const { getAllWelcomeTemplates, getWelcomeTemplate } = require('../../templates/welcomeTemplates');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('👋 Advanced Welcome messages, pre-made themes & auto-roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('templates')
        .setDescription('🎨 Browse & 1-click install beautiful pre-made welcome message templates')
    )
    .addSubcommand(sub =>
      sub
        .setName('apply')
        .setDescription('🚀 Apply a pre-made welcome theme directly to your server')
        .addStringOption(opt =>
          opt
            .setName('preset')
            .setDescription('Select the welcome theme to apply')
            .setRequired(true)
            .addChoices(
              { name: '🎮 Gaming & Esports (Level Up Squad)', value: 'gaming' },
              { name: '🌸 Anime & Aesthetic (Cozy Kaomoji)', value: 'anime' },
              { name: '🌟 Cozy Community Lounge (Warm Coffee)', value: 'community' },
              { name: '💻 Developer Terminal (Code Blocks)', value: 'developer' },
              { name: '⚡ Cyberpunk & Neon (Sci-Fi Link)', value: 'cyberpunk' },
              { name: '💎 Minimalist & Modern VIP (Clean Luxury)', value: 'minimal' },
              { name: '📚 Study & Academic Lounge (Pomodoro & Goals)', value: 'study' },
              { name: '🏆 Clan & Esports Roster (Competitive Team)', value: 'esports' }
            )
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Optional: Welcome channel to post in (if not already set)')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('setup')
        .setDescription('⚙️ Custom setup welcome channel, custom text, auto-roles and banner')
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel where welcome messages will be posted').setRequired(true))
        .addRoleOption(opt => opt.setName('autorole_human').setDescription('Role automatically given to new human members').setRequired(false))
        .addRoleOption(opt => opt.setName('autorole_bot').setDescription('Role automatically given to new bot invites').setRequired(false))
        .addStringOption(opt => 
          opt.setName('custom_message')
            .setDescription('Custom text. Variables: {user}, {username}, {tag}, {server}, {count}')
            .setRequired(false)
        )
        .addBooleanOption(opt => opt.setName('dm_welcome').setDescription('Also send a welcome DM to new members?').setRequired(false))
        .addStringOption(opt => opt.setName('banner_image').setDescription('Direct image URL for banner').setRequired(false))
    )
    .addSubcommand(sub =>
      sub
        .setName('preview')
        .setDescription('👀 Preview what your current welcome message and embed looks like')
    )
    .addSubcommand(sub =>
      sub
        .setName('test')
        .setDescription('🧪 Send a live test welcome message to the welcome channel')
    )
    .addSubcommand(sub =>
      sub
        .setName('disable')
        .setDescription('❌ Turn off welcome messages')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
    const welcome = { ...config.defaultSettings.welcome, ...(guildSettings.welcome || {}) };

    // 1. TEMPLATES GALLERY BROWSER
    if (subcommand === 'templates') {
      const templates = getAllWelcomeTemplates();
      const currentTplId = welcome.templateId || 'gaming';
      const initialTemplate = getWelcomeTemplate(currentTplId) || templates[0];

      // Build Select Menu Options
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('welcome_tpl_select')
        .setPlaceholder('✨ Click here to browse & preview welcome styles...')
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
          .setCustomId(`welcome_tpl_apply_${initialTemplate.id}`)
          .setLabel(`Apply "${initialTemplate.name.split(' ')[1] || initialTemplate.name}"`)
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅'),
        new ButtonBuilder()
          .setCustomId(`welcome_tpl_test_${initialTemplate.id}`)
          .setLabel('Test in Channel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🧪')
      );

      // Render Preview Embed for Initial Template
      const previewMsg = initialTemplate.message
        .replace(/{user}/g, `<@${interaction.user.id}>`)
        .replace(/{username}/g, interaction.user.username)
        .replace(/{tag}/g, interaction.user.tag)
        .replace(/{server}/g, interaction.guild.name)
        .replace(/{count}/g, interaction.guild.memberCount.toString());

      const previewTitle = initialTemplate.title
        .replace(/{server}/g, interaction.guild.name)
        .replace(/{username}/g, interaction.user.username);

      const previewEmbed = new EmbedBuilder()
        .setColor(initialTemplate.color)
        .setAuthor({ name: previewTitle, iconURL: interaction.guild.iconURL() })
        .setDescription(previewMsg)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: '👤 Account Age', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: '📊 Member Position', value: `**#${interaction.guild.memberCount}**`, inline: true },
          { name: '🎨 Selected Theme', value: `\`${initialTemplate.name}\``, inline: true }
        )
        .setFooter({ text: `Hinata Welcome Catalog • Theme: ${initialTemplate.name}` })
        .setTimestamp();

      if (initialTemplate.banner) {
        previewEmbed.setImage(initialTemplate.banner);
      }

      return interaction.reply({
        content: `🎨 **Welcome Template Gallery**\n*Select any style from the dropdown menu below to see a live preview and click **Apply** to install it!*`,
        embeds: [previewEmbed],
        components: [menuRow, btnRow]
      });
    }

    // 2. APPLY PRESET DIRECTLY
    if (subcommand === 'apply') {
      const presetId = interaction.options.getString('preset');
      const channel = interaction.options.getChannel('channel');
      const template = getWelcomeTemplate(presetId);

      if (!template) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Template Not Found', `Could not find preset \`${presetId}\`.`)],
          ephemeral: true
        });
      }

      const targetChannelId = channel ? channel.id : welcome.channelId;

      const updated = {
        enabled: true,
        templateId: template.id,
        channelId: targetChannelId || null,
        title: template.title,
        message: template.message,
        color: template.color,
        banner: template.banner,
        dmWelcome: welcome.dmWelcome ?? false,
        dmMessage: template.dmMessage || welcome.dmMessage
      };

      DatabaseManager.setWelcomeConfig(interaction.guild.id, updated);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            `Welcome Theme Applied: ${template.name} 🎉`,
            `The **${template.name}** welcome design has been configured for your server!\n\n` +
            `• **Channel:** ${targetChannelId ? `<#${targetChannelId}>` : '⚠️ *No channel set yet. Use `/welcome setup channel:#channel`*'}\n` +
            `• **Theme Palette:** \`${template.color}\`\n` +
            `• **Banner:** ${template.banner ? '🖼️ Enabled' : '*None*'}\n\n` +
            `Use \`/welcome preview\` or \`/welcome test\` to see it live!`
          )
        ]
      });
    }

    // 3. MANUAL SETUP
    if (subcommand === 'setup') {
      const channel = interaction.options.getChannel('channel');
      const humanRole = interaction.options.getRole('autorole_human');
      const botRole = interaction.options.getRole('autorole_bot');
      const customMessage = interaction.options.getString('custom_message');
      const dmWelcome = interaction.options.getBoolean('dm_welcome');
      const bannerImage = interaction.options.getString('banner_image');

      const updated = {
        enabled: true,
        channelId: channel.id,
        roleId: humanRole ? humanRole.id : welcome.roleId,
        botRoleId: botRole ? botRole.id : welcome.botRoleId,
        message: customMessage || welcome.message,
        dmWelcome: dmWelcome !== null ? dmWelcome : welcome.dmWelcome,
        banner: bannerImage || welcome.banner || null
      };

      DatabaseManager.setWelcomeConfig(interaction.guild.id, updated);
      if (humanRole || botRole) {
        DatabaseManager.setAutoroleConfig(interaction.guild.id, {
          enabled: true,
          humanRoleId: updated.roleId,
          botRoleId: updated.botRoleId
        });
      }

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Welcome System Configured! 🎉',
            `Welcome messages are now **ENABLED**.\n\n• **Channel:** <#${channel.id}>\n• **Member Role:** ${updated.roleId ? `<@&${updated.roleId}>` : '*None*'}\n• **Bot Role:** ${updated.botRoleId ? `<@&${updated.botRoleId}>` : '*None*'}\n• **DM Welcome:** ${updated.dmWelcome ? '✅ Enabled' : '❌ Disabled'}\n\n💡 *Tip: Check out 8+ pre-made themes using \`/welcome templates\`!*`
          )
        ]
      });
    }

    // 4. PREVIEW / TEST
    if (subcommand === 'preview' || subcommand === 'test') {
      if (!welcome.enabled && subcommand === 'test') {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Welcome Not Configured', 'Please configure welcome first using `/welcome setup` or `/welcome templates`.')],
          ephemeral: true
        });
      }

      const rawMsg = welcome.message || config.defaultSettings.welcome.message;
      const formattedMsg = rawMsg
        .replace(/{user}/g, `<@${interaction.user.id}>`)
        .replace(/{username}/g, interaction.user.username)
        .replace(/{tag}/g, interaction.user.tag)
        .replace(/{server}/g, interaction.guild.name)
        .replace(/{count}/g, interaction.guild.memberCount.toString());

      const rawTitle = welcome.title || `Welcome to ${interaction.guild.name}! 👋`;
      const formattedTitle = rawTitle
        .replace(/{server}/g, interaction.guild.name)
        .replace(/{username}/g, interaction.user.username);

      const welcomeEmbed = new EmbedBuilder()
        .setColor(welcome.color || config.embedColors.primary)
        .setAuthor({ name: formattedTitle, iconURL: interaction.guild.iconURL() })
        .setDescription(formattedMsg)
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: '👤 Account Created', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: '📊 Member Count', value: `**#${interaction.guild.memberCount}**`, inline: true }
        )
        .setFooter({ text: `User ID: ${interaction.user.id}` })
        .setTimestamp();

      if (welcome.banner) {
        welcomeEmbed.setImage(welcome.banner);
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel('📜 Read Rules')
          .setStyle(ButtonStyle.Primary)
          .setCustomId('welcome_rules_btn'),
        new ButtonBuilder()
          .setLabel('🎭 Get Roles')
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('welcome_roles_btn')
      );

      if (subcommand === 'preview') {
        return interaction.reply({
          content: '👀 **Preview of Welcome Message:**',
          embeds: [welcomeEmbed],
          components: [row],
          ephemeral: true
        });
      }

      if (subcommand === 'test') {
        const targetChannel = interaction.guild.channels.cache.get(welcome.channelId);
        if (!targetChannel) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Channel Error', 'The configured welcome channel could not be found. Set one with `/welcome setup channel:#channel`.')],
            ephemeral: true
          });
        }

        await targetChannel.send({
          content: `👋 Welcome <@${interaction.user.id}>!`,
          embeds: [welcomeEmbed],
          components: [row]
        });

        return interaction.reply({
          embeds: [EmbedUtils.success('Test Message Sent', `Sent a test welcome message to <#${welcome.channelId}>.`)],
          ephemeral: true
        });
      }
    }

    // 5. DISABLE
    if (subcommand === 'disable') {
      welcome.enabled = false;
      DatabaseManager.setWelcomeConfig(interaction.guild.id, welcome);

      return interaction.reply({
        embeds: [EmbedUtils.success('Welcome Disabled', 'Welcome messages have been disabled.')]
      });
    }
  }
};
