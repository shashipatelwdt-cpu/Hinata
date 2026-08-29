const { 
  PermissionFlagsBits, 
  ChannelType, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const { getAllWelcomeTemplates, getWelcomeTemplate } = require('../templates/welcomeTemplates');
const { getAllRulesTemplates, getRulesTemplate } = require('../templates/rulesTemplates');
const { buildRulesEmbed } = require('../commands/setup/rules');
const { 
  getAllTemplates, 
  getTemplate, 
  getCategories, 
  TemplateParser, 
  AIPromptGenerator, 
  TemplateBuilderEngine,
  TemplateSlider,
  OnlineTemplateImporter 
} = require('../templates');
const RoleParser = require('../utils/roleParser');
const EmbedUtils = require('../utils/embeds');
const ChannelWiper = require('../utils/channelWiper');
const MusicManager = require('../music/MusicManager');
const config = require('../../config.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// In-memory giveaway participants set
const giveawayEntries = new Map();

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // 1. AUTOCOMPLETE
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (command && command.autocomplete) {
        try {
          await command.autocomplete(interaction, client);
        } catch (error) {
          console.error(`[AUTOCOMPLETE ERROR: /${interaction.commandName}]`, error);
        }
      }
      return;
    }

    // 2. SLASH COMMANDS
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`[COMMAND ERROR: /${interaction.commandName}]`, error);
        const replyPayload = {
          embeds: [EmbedUtils.error('Command Error', `An unexpected error occurred while executing this command:\n\`${error.message}\``)],
          ephemeral: true
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyPayload).catch(() => null);
        } else {
          await interaction.reply(replyPayload).catch(() => null);
        }
      }
      return;
    }

    // 3. MODAL SUBMISSIONS
    if (interaction.isModalSubmit()) {
      // Embed Builder Modal
      if (interaction.customId.startsWith('embed_modal_')) {
        const channelId = interaction.customId.replace('embed_modal_', '');
        const targetChannel = interaction.guild.channels.cache.get(channelId) || interaction.channel;

        const title = interaction.fields.getTextInputValue('embed_title');
        const description = interaction.fields.getTextInputValue('embed_description');
        const color = interaction.fields.getTextInputValue('embed_color') || config.embedColors.primary;
        const image = interaction.fields.getTextInputValue('embed_image') || null;
        const footer = interaction.fields.getTextInputValue('embed_footer') || null;

        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(description)
          .setColor(color.startsWith('#') ? color : `#${color}`)
          .setTimestamp();

        if (image) embed.setImage(image);
        if (footer) embed.setFooter({ text: footer, iconURL: interaction.guild.iconURL() });

        try {
          await targetChannel.send({ embeds: [embed] });
          return interaction.reply({
            embeds: [EmbedUtils.success('Embed Sent', `Your rich embed was posted to <#${targetChannel.id}>.`)],
            ephemeral: true
          });
        } catch (e) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Embed Failed', `Could not send embed: \`${e.message}\``)],
            ephemeral: true
          });
        }
      }

      // Rules Custom Modal Submission
      if (interaction.customId.startsWith('rules_custom_modal_')) {
        const channelId = interaction.customId.replace('rules_custom_modal_', '');
        const targetChannel = interaction.guild.channels.cache.get(channelId) || interaction.channel;

        const title = interaction.fields.getTextInputValue('rules_title');
        const content = interaction.fields.getTextInputValue('rules_content');
        const color = interaction.fields.getTextInputValue('rules_color') || config.embedColors.primary;
        const banner = interaction.fields.getTextInputValue('rules_banner') || null;

        const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
        const rulesConfig = guildSettings.rules || {};

        const embed = new EmbedBuilder()
          .setColor(color.startsWith('#') ? color : `#${color}`)
          .setAuthor({ name: `${interaction.guild.name} • Official Rules`, iconURL: interaction.guild.iconURL() })
          .setTitle(title)
          .setDescription(
            `### 📜 ${title}\n\n` +
            content + '\n\n' +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `⚖️ **Agreement:** By participating in this server, you acknowledge and agree to comply with these rules and Discord\'s Terms of Service.`
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 256 }))
          .setFooter({ text: `${interaction.guild.name} Rules • Click below to verify`, iconURL: interaction.guild.iconURL() })
          .setTimestamp();

        if (banner) embed.setImage(banner);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('rules_verify_btn')
            .setLabel('Accept Rules & Verify')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅'),
          new ButtonBuilder()
            .setCustomId('ticket_general_btn')
            .setLabel('Support / Staff')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🎫')
        );

        try {
          const sent = await targetChannel.send({
            embeds: [embed],
            components: [row]
          });

          DatabaseManager.setRulesConfig(interaction.guild.id, {
            enabled: true,
            channelId: targetChannel.id,
            messageId: sent.id
          });

          return interaction.reply({
            embeds: [EmbedUtils.success('Custom Rules Posted! 📜', `Your custom rules were successfully posted to <#${targetChannel.id}>!`)],
            ephemeral: true
          });
        } catch (e) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Posting Failed', `Could not post rules embed: \`${e.message}\``)],
            ephemeral: true
          });
        }
      }

      // Role Builder Modal Submission
      if (interaction.customId === 'role_builder_modal') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Manage Roles permissions to create server roles.')],
            ephemeral: true
          });
        }

        const rawInput = interaction.fields.getTextInputValue('role_builder_input');
        await interaction.deferReply();

        const parseResult = RoleParser.parse(rawInput);
        if (!parseResult.success) {
          return interaction.editReply({
            embeds: [EmbedUtils.error('Invalid Role List', parseResult.error || 'Could not parse roles.')]
          });
        }

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle(`👑 Role Builder Preview (${parseResult.totalRoles} Roles Found)`)
          .setDescription('Review the role structure below. Click **Yes, Create All Roles** to begin!');

        for (const group of parseResult.groups.slice(0, 5)) {
          const rolesText = group.roles.map(r => `• \`${r.name}\` (${r.color}${r.hoist ? ', Hoisted' : ''})`).join('\n');
          embed.addFields({
            name: `${group.category} (${group.roles.length})`,
            value: rolesText.slice(0, 1024),
            inline: false
          });
        }

        if (parseResult.groups.length > 5) {
          embed.setFooter({ text: `...and ${parseResult.groups.length - 5} more categories` });
        }

        const confirmBtn = new ButtonBuilder()
          .setCustomId('confirm_role_builder')
          .setLabel(`Yes, Create ${parseResult.totalRoles} Roles!`)
          .setStyle(ButtonStyle.Success)
          .setEmoji('🚀');

        const cancelBtn = new ButtonBuilder()
          .setCustomId('cancel_role_builder')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('✖️');

        const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

        const promptMsg = await interaction.editReply({
          embeds: [embed],
          components: [row]
        });

        const collector = promptMsg.createMessageComponentCollector({
          filter: i => i.user.id === interaction.user.id,
          time: 60000,
          max: 1
        });

        collector.on('collect', async i => {
          if (i.customId === 'cancel_role_builder') {
            return i.update({
              embeds: [EmbedUtils.info('Cancelled', 'Role creation cancelled.')],
              components: []
            });
          }

          await i.deferUpdate();

          const guild = interaction.guild;
          const createdRoles = [];
          const existingRoles = [];
          const failedRoles = [];

          let currentIdx = 0;
          const allRolesFlat = parseResult.groups.flatMap(g => g.roles);

          for (const rDef of allRolesFlat) {
            currentIdx++;
            let existing = guild.roles.cache.find(r => r.name.toLowerCase() === rDef.name.toLowerCase());
            if (existing) {
              existingRoles.push(existing);
            } else {
              try {
                const newRole = await guild.roles.create({
                  name: rDef.name,
                  color: rDef.color,
                  hoist: rDef.hoist,
                  mentionable: rDef.mentionable,
                  reason: `Hinata Bulk Role Builder by ${interaction.user.tag}`
                });
                createdRoles.push(newRole);
              } catch (e) {
                console.error(`Failed to create role ${rDef.name}:`, e);
                failedRoles.push(rDef.name);
              }
            }

            if (currentIdx % 5 === 0 || currentIdx === allRolesFlat.length) {
              const percent = Math.round((currentIdx / allRolesFlat.length) * 100);
              const progressEmbed = new EmbedBuilder()
                .setColor(config.embedColors.primary)
                .setTitle('👑 Creating Roles...')
                .setDescription(`Progress: **${currentIdx} / ${allRolesFlat.length}** (\`${percent}%\`)\nCreating: \`${rDef.name}\``);
              await i.editReply({ embeds: [progressEmbed], components: [] }).catch(() => null);
            }

            await sleep(350);
          }

          const successEmbed = new EmbedBuilder()
            .setColor(config.embedColors.success)
            .setTitle('🎉 Bulk Roles Creation Complete!')
            .setDescription(
              `Successfully processed **${allRolesFlat.length}** roles!\n\n` +
              `• ✅ **Created Fresh:** \`${createdRoles.length} Roles\`\n` +
              `• ℹ️ **Already Existed:** \`${existingRoles.length} Roles\`\n` +
              (failedRoles.length > 0 ? `• ⚠️ **Failed:** \`${failedRoles.length}\`\n` : '') +
              `\n*All roles are now ready in your server settings!*`
            )
            .setFooter({ text: 'Hinata Role Builder • Server Ready' })
            .setTimestamp();

          return i.editReply({ embeds: [successEmbed], components: [] });
        });
        return;
      }

      // Template Custom ChatGPT Modal
      if (interaction.customId.startsWith('template_custom_modal_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to install server templates.')],
            ephemeral: true
          });
        }

        const deleteOld = interaction.customId.endsWith('_1');
        const rawInput = interaction.fields.getTextInputValue('template_input_text');

        if (!interaction.deferred && !interaction.replied) {
          await interaction.deferReply().catch(() => null);
        }

        const parseResult = TemplateParser.parse(rawInput);
        if (!parseResult.success) {
          return interaction.editReply({
            embeds: [
              EmbedUtils.error(
                'Invalid Template Format',
                `Could not understand the blueprint:\n\`${parseResult.error}\`\n\n` +
                `💡 *Tip: Run \`/template ai-prompt\` to get the exact prompt format for ChatGPT!*`
              )
            ]
          });
        }

        const template = parseResult.template;
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
            `• 🗑️ **Delete Old Channels:** \`${deleteOld ? 'YES (Clean Start)' : 'NO'}\`\n` +
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

      // Template Live Xenon / Discord URL Importer Modal
      if (interaction.customId.startsWith('template_import_modal')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to install server templates.')],
            ephemeral: true
          });
        }

        const deleteOld = !interaction.customId.endsWith('_0');
        const urlInput = interaction.fields.getTextInputValue('template_import_url');

        if (!interaction.deferred && !interaction.replied) {
          await interaction.deferReply().catch(() => null);
        }

        const fetchResult = await OnlineTemplateImporter.fetchTemplate(urlInput);
        if (!fetchResult.success) {
          return interaction.editReply({
            embeds: [EmbedUtils.error('Import Failed', fetchResult.error)]
          });
        }

        const template = fetchResult.template;
        const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);
        const estSeconds = Math.round((template.roles.length * 0.7) + (totalChannels * 0.8) + 4);

        const confirmBtn = new ButtonBuilder()
          .setCustomId('confirm_online_import_modal')
          .setLabel('Yes, Build This Server!')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🚀');

        const cancelBtn = new ButtonBuilder()
          .setCustomId('cancel_online_import_modal')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('✖️');

        const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

        const previewEmbed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle(`🌐 Imported Template: ${template.name}`)
          .setDescription(
            `**Retrieved live layout from Xenon / Discord!**\n\n` +
            `• 📝 **Description:** ${template.description}\n` +
            `• 🎭 **Roles:** \`${template.roles.length} Roles\`\n` +
            `• 📂 **Categories & Channels:** \`${template.categories.length} Categories\` & \`${totalChannels} Channels\`\n` +
            `• 🗑️ **Delete Old Channels:** \`${deleteOld ? 'YES (Clean Start)' : 'NO'}\`\n` +
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
          if (i.customId === 'cancel_online_import_modal') {
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

        return;
      }
    }

    // 4. SELECT MENUS
    if (interaction.isStringSelectMenu()) {
      // Self-Roles Select Menu
      if (interaction.customId.startsWith('selfrole_menu_')) {
        await interaction.deferReply({ ephemeral: true });

        const selectedValues = interaction.values;
        const allOptionValues = interaction.component.options.map(o => o.value);
        const member = interaction.member;

        const addedRoles = [];
        const removedRoles = [];

        for (const roleId of allOptionValues) {
          const isSelected = selectedValues.includes(roleId);
          const hasRole = member.roles.cache.has(roleId);

          if (isSelected && !hasRole) {
            try {
              await member.roles.add(roleId, 'Self-Role Select Menu');
              addedRoles.push(`<@&${roleId}>`);
            } catch (e) {
              console.error(`Failed to add role ${roleId}:`, e);
            }
          } else if (!isSelected && hasRole) {
            try {
              await member.roles.remove(roleId, 'Self-Role Deselected');
              removedRoles.push(`<@&${roleId}>`);
            } catch (e) {
              console.error(`Failed to remove role ${roleId}:`, e);
            }
          }
        }

        let replyText = '';
        if (addedRoles.length > 0) replyText += `✅ **Added:** ${addedRoles.join(' ')}\n`;
        if (removedRoles.length > 0) replyText += `➖ **Removed:** ${removedRoles.join(' ')}\n`;
        if (addedRoles.length === 0 && removedRoles.length === 0) replyText = 'ℹ️ No role changes were made.';

        return interaction.editReply({
          embeds: [EmbedUtils.info('Roles Updated', replyText)]
        });
      }

      // 1-Click AutoServer Theme Select Menu
      if (interaction.customId === 'autoserver_theme_select') {
        const themeKey = interaction.values[0];
        const template = getTemplate(themeKey) || getTemplate('good-looking');
        if (!template) {
          return interaction.reply({ content: 'Theme template not found.', ephemeral: true });
        }

        const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary || '#5865F2')
          .setTitle(`⚡ 1-Click Auto Setup: ${template.name}`)
          .setDescription(
            `Selected Theme: **${template.name}**\n` +
            `*${template.description}*\n\n` +
            `### 🛠️ What will be automatically configured in 1 click:\n` +
            `• 🗑️ **Wipe & Rebuild:** Clean fresh start with modern categories\n` +
            `• 🎭 **Roles & Hierarchy:** \`${template.roles.length} Roles\` (Owner, Admin, Mod, Verified Member, Bot)\n` +
            `• 📂 **Categories & Channels:** \`${template.categories.length} Categories\` & \`${totalChannels} Channels\`\n` +
            `• 📜 **Automatic Rules Writing:** Rules posted in \`#rules\` with \`[ ✅ Accept Rules & Verify ]\` button\n` +
            `• 👋 **Welcome System:** Welcome embed + Auto-Role linked in database\n` +
            `• 🎭 **Self-Roles Menus:** Dropdowns for Notifications & Colors\n` +
            `• 🎫 **Support Tickets Desk:** Multi-department ticket panel\n` +
            `• 📊 **Live Stats Voice Counters:** 5 real-time voice stats counters\n` +
            `• 🛡️ **AutoMod & ModLogs:** Armed with Anti-Spam & Anti-Invite\n\n` +
            `Click **🚀 Launch 1-Click Server Setup** below to begin!`
          )
          .setFooter({ text: `${config.botName || 'Hinata'} • 1-Click Server Builder` })
          .setTimestamp();

        const btnRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`confirm_autoserver_${template.id}`)
            .setLabel(`Launch "${template.id}" Setup!`)
            .setStyle(ButtonStyle.Success)
            .setEmoji('🚀'),
          new ButtonBuilder()
            .setCustomId('cancel_autoserver')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('✖️')
        );

        return interaction.update({
          embeds: [embed],
          components: [btnRow]
        });
      }

      // Template Carousel Slider Category Selector
      if (interaction.customId === 'tpl_slide_cat_select') {
        const rawVal = interaction.values[0] || 'all';
        const selectedSlug = rawVal.replace('tplcat:', '').replace('tpl_cat_', '');
        const { list, categoryName, categorySlug } = TemplateSlider.getCategoryList(selectedSlug);
        const slideData = TemplateSlider.renderSlide({
          list,
          index: 0,
          categoryKey: categorySlug || selectedSlug,
          categoryName
        });
        return interaction.update(slideData).catch(() => null);
      }

      // Template Category Select Menu Filter (Legacy fallback)
      if (interaction.customId === 'template_cat_select') {
        const rawVal = interaction.values[0];
        const categories = getCategories();
        
        let matchedCatName = null;
        let matchedList = [];
        for (const [catName, list] of Object.entries(categories)) {
          if (`tpl_cat_${catName.toLowerCase().replace(/[^a-z0-9]/g, '_')}` === rawVal) {
            matchedCatName = catName;
            matchedList = list;
            break;
          }
        }

        if (!matchedCatName || matchedList.length === 0) {
          return interaction.reply({ content: 'Category not found.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle(`📂 Category: ${matchedCatName}`)
          .setDescription(
            `Here are all templates in **${matchedCatName}**.\n` +
            `Pick a template from the dropdown below or run \`/template apply preset:<id>\` to install!`
          );

        for (const t of matchedList) {
          const totalChannels = t.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);
          embed.addFields({
            name: `${t.name} (\`${t.id}\`)`,
            value: `*${t.description}*\n🎭 **Roles:** \`${t.roles.length}\` | 📂 **Channels:** \`${totalChannels}\``,
            inline: false
          });
        }

        const presetOptions = matchedList.map(t =>
          new StringSelectMenuOptionBuilder()
            .setLabel(t.name.substring(0, 50))
            .setValue(`tpl_preset_${t.id}`)
            .setDescription(t.description.substring(0, 95))
            .setEmoji('✨')
        );

        const presetMenuRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('template_preset_select')
            .setPlaceholder('👀 Select a template to preview / apply...')
            .addOptions(presetOptions)
        );

        return interaction.update({
          embeds: [embed],
          components: [presetMenuRow]
        });
      }

      // Template Preset Select Menu
      if (interaction.customId === 'template_preset_select') {
        const selectedVal = interaction.values[0];
        const presetId = selectedVal.replace('tpl_preset_', '');
        const template = getTemplate(presetId);

        if (!template) {
          return interaction.reply({ content: 'Template not found.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle(`👀 Preview: ${template.name}`)
          .setDescription(
            `**Category:** ${template.category}\n` +
            `**Description:** ${template.description}\n\n` +
            `**To apply this template, run:** \`/template apply preset:${presetId}\``
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

        return interaction.update({
          embeds: [embed],
          components: [row]
        });
      }

      // Welcome Template Gallery Select Menu
      if (interaction.customId === 'welcome_tpl_select') {
        const selectedId = interaction.values[0];
        const template = getWelcomeTemplate(selectedId);
        if (!template) {
          return interaction.reply({ content: 'Template not found.', ephemeral: true });
        }

        const templates = getAllWelcomeTemplates();

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
                .setDefault(t.id === template.id)
            )
          );

        const menuRow = new ActionRowBuilder().addComponents(selectMenu);

        const btnRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`welcome_tpl_apply_${template.id}`)
            .setLabel(`Apply "${template.name.split(' ')[1] || template.name}"`)
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅'),
          new ButtonBuilder()
            .setCustomId(`welcome_tpl_test_${template.id}`)
            .setLabel('Test in Channel')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🧪')
        );

        const previewMsg = template.message
          .replace(/{user}/g, `<@${interaction.user.id}>`)
          .replace(/{username}/g, interaction.user.username)
          .replace(/{tag}/g, interaction.user.tag)
          .replace(/{server}/g, interaction.guild.name)
          .replace(/{count}/g, interaction.guild.memberCount.toString());

        const previewTitle = template.title
          .replace(/{server}/g, interaction.guild.name)
          .replace(/{username}/g, interaction.user.username);

        const previewEmbed = new EmbedBuilder()
          .setColor(template.color)
          .setAuthor({ name: previewTitle, iconURL: interaction.guild.iconURL() })
          .setDescription(previewMsg)
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }))
          .addFields(
            { name: '👤 Account Age', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: '📊 Member Position', value: `**#${interaction.guild.memberCount}**`, inline: true },
            { name: '🎨 Selected Theme', value: `\`${template.name}\``, inline: true }
          )
          .setFooter({ text: `Hinata Welcome Catalog • Theme: ${template.name}` })
          .setTimestamp();

        if (template.banner) {
          previewEmbed.setImage(template.banner);
        }

        return interaction.update({
          embeds: [previewEmbed],
          components: [menuRow, btnRow]
        });
      }

      // Rules Template Gallery Select Menu
      if (interaction.customId === 'rules_tpl_select') {
        const selectedId = interaction.values[0];
        const template = getRulesTemplate(selectedId);
        if (!template) {
          return interaction.reply({ content: 'Template not found.', ephemeral: true });
        }

        const templates = getAllRulesTemplates();

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
                .setDefault(t.id === template.id)
            )
          );

        const menuRow = new ActionRowBuilder().addComponents(selectMenu);

        const btnRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`rules_tpl_send_${template.id}`)
            .setLabel(`Deploy to Channel`)
            .setStyle(ButtonStyle.Success)
            .setEmoji('🚀'),
          new ButtonBuilder()
            .setCustomId(`rules_tpl_apply_${template.id}`)
            .setLabel(`Set Default Theme`)
            .setStyle(ButtonStyle.Primary)
            .setEmoji('💾')
        );

        const previewEmbed = buildRulesEmbed(template, interaction.guild);

        return interaction.update({
          embeds: [previewEmbed],
          components: [menuRow, btnRow]
        });
      }
    }

    // 5. BUTTON CLICKS
    if (interaction.isButton()) {
      const customId = interaction.customId;

      // ─── MUSIC CONTROLLER BUTTONS ──────────────────────────────
      if (customId.startsWith('music_')) {
        const member = interaction.member;
        const voiceChannel = member?.voice?.channel;

        if (!voiceChannel) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to use music controls!')],
            ephemeral: true
          });
        }

        const queue = MusicManager.getQueue(interaction.guild.id);
        if (!queue) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Nothing Playing', 'No active music queue in this server! Use `/play` to start playing.')],
            ephemeral: true
          });
        }

        if (customId === 'music_play_pause') {
          if (queue.isPaused) {
            queue.resume();
            await interaction.reply({
              embeds: [EmbedUtils.success('Music Resumed', `▶️ Resumed **${queue.currentSong?.title || 'current song'}**!`)],
              ephemeral: true
            });
          } else {
            queue.pause();
            await interaction.reply({
              embeds: [EmbedUtils.success('Music Paused', `⏸️ Paused **${queue.currentSong?.title || 'current song'}**!`)],
              ephemeral: true
            });
          }
          if (queue.nowPlayingMessage) {
            queue.sendNowPlaying().catch(() => null);
          }
          return;
        }

        if (customId === 'music_skip') {
          const songName = queue.currentSong?.title || 'Current Song';
          queue.skip();
          return interaction.reply({
            embeds: [EmbedUtils.success('Skipped', `⏭️ Skipped **${songName}**!`)],
            ephemeral: true
          });
        }

        if (customId === 'music_stop') {
          queue.stop();
          return interaction.reply({
            embeds: [EmbedUtils.success('Stopped', '⏹️ Cleared queue and left the voice channel.')],
            ephemeral: true
          });
        }

        if (customId === 'music_loop') {
          const mode = queue.toggleLoop();
          const loopLabels = {
            'off': '❌ Loop Disabled',
            'track': '🔂 Looping Current Song',
            'queue': '🔁 Looping Entire Queue'
          };
          await interaction.reply({
            embeds: [EmbedUtils.success('Loop Mode', loopLabels[mode] || `Loop is ${mode}`)],
            ephemeral: true
          });
          if (queue.nowPlayingMessage) {
            queue.sendNowPlaying().catch(() => null);
          }
          return;
        }

        if (customId === 'music_autoplay') {
          const isEnabled = queue.toggleAutoplay();
          await interaction.reply({
            embeds: [
              EmbedUtils.success(
                'Autoplay Mode',
                isEnabled
                  ? '📻 **Smart Autoplay Enabled!** Continuous songs matching your taste will play automatically.'
                  : '❌ **Smart Autoplay Disabled.** Playback will stop when queue finishes.'
              )
            ],
            ephemeral: true
          });
          if (queue.nowPlayingMessage) {
            queue.sendNowPlaying().catch(() => null);
          }
          return;
        }

        if (customId === 'music_shuffle') {
          if (queue.songs.length < 2) {
            return interaction.reply({
              embeds: [EmbedUtils.error('Cannot Shuffle', 'Need at least 2 songs in queue to shuffle!')],
              ephemeral: true
            });
          }
          queue.shuffle();
          return interaction.reply({
            embeds: [EmbedUtils.success('Queue Shuffled', `🔀 Shuffled **${queue.songs.length}** waiting songs!`)],
            ephemeral: true
          });
        }

        if (customId === 'music_vol_up') {
          const newVol = queue.setVolume(queue.volume + 10);
          return interaction.reply({
            embeds: [EmbedUtils.success('Volume Up', `🔊 Volume increased to **${newVol}%**`)],
            ephemeral: true
          });
        }

        if (customId === 'music_vol_down') {
          const newVol = queue.setVolume(queue.volume - 10);
          return interaction.reply({
            embeds: [EmbedUtils.success('Volume Down', `🔉 Volume decreased to **${newVol}%**`)],
            ephemeral: true
          });
        }

        if (customId === 'music_queue') {
          let desc = '';
          if (queue.currentSong) {
            desc += `**💿 Now Playing:** [${queue.currentSong.title}](${queue.currentSong.url}) | \`${queue.currentSong.duration || 'Live'}\`\n\n`;
          }
          const upNext = queue.songs.slice(0, 8);
          if (upNext.length > 0) {
            desc += `**📑 Up Next (${queue.songs.length} total):**\n` +
              upNext.map((s, i) => `\`${i + 1}.\` [${s.title.substring(0, 45)}](${s.url}) | \`${s.duration || '?'}\``).join('\n');
            if (queue.songs.length > 8) desc += `\n*...and ${queue.songs.length - 8} more songs*`;
          } else {
            desc += '*No additional songs waiting in queue.*';
          }
          const qEmbed = new EmbedBuilder()
            .setTitle(`🎵 ${interaction.guild.name} • Music Queue`)
            .setDescription(desc)
            .setColor(config.embedColors?.primary || '#5865F2')
            .setFooter({ text: `Volume: ${queue.volume}% • Loop: ${queue.loopMode.toUpperCase()}` });

          return interaction.reply({ embeds: [qEmbed], ephemeral: true });
        }

        if (customId === 'music_np_refresh') {
          if (!queue.currentSong) {
            return interaction.reply({
              embeds: [EmbedUtils.error('Nothing Playing', 'No song is currently playing!')],
              ephemeral: true
            });
          }
          const npEmbed = queue.buildNowPlayingEmbed();
          const rows = queue.buildControlsRow();
          return interaction.reply({
            embeds: [npEmbed],
            components: rows,
            ephemeral: true
          });
        }
      }

      // TEMPLATE SLIDER CAROUSEL BUTTONS (Next, Prev, First, Last)
      if (customId.startsWith('tplslide:') || customId.startsWith('tpl_slide_')) {
        let action = '';
        let catKey = 'all';
        let targetIdx = 0;

        if (customId.startsWith('tplslide:')) {
          const parts = customId.split(':');
          action = parts[1] || 'next';
          catKey = parts[2] || 'all';
          targetIdx = parseInt(parts[3], 10) || 0;
        } else {
          // Legacy format fallback
          const raw = customId.replace('tpl_slide_', '');
          const parts = raw.split('_');
          action = parts[0];
          parts.shift();
          targetIdx = parseInt(parts.pop(), 10) || 0;
          catKey = parts.join('_') || 'all';
        }

        const { list, categoryName, categorySlug } = TemplateSlider.getCategoryList(catKey);
        const slideData = TemplateSlider.renderSlide({
          list,
          index: targetIdx,
          categoryKey: categorySlug || catKey,
          categoryName
        });
        return interaction.update(slideData).catch(() => null);
      }

      // ChatGPT Custom Blueprint Modal Opener Button
      if (customId === 'template_custom_btn') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to install server templates.')],
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId('template_custom_modal_1')
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

      // Live Xenon / Discord Importer Modal Opener Button
      if (customId === 'template_import_modal_btn') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to install server templates.')],
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId('template_import_modal_1')
          .setTitle('🌐 Import Xenon / Discord Template');

        const input = new TextInputBuilder()
          .setCustomId('template_import_url')
          .setLabel('Xenon URL / Discord Link / Template ID:')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('e.g. xenon.bot/templates/EcR2tfPTc8x5 or EcR2tfPTc8x5')
          .setRequired(true)
          .setMaxLength(300);

        const modalRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(modalRow);

        return interaction.showModal(modal);
      }

      // 1-Click Apply Button from Preset Preview
      if (customId.startsWith('template_apply_btn_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to install server templates.')],
            ephemeral: true
          });
        }

        const presetId = customId.replace('template_apply_btn_', '');
        const template = getTemplate(presetId);
        if (!template) {
          return interaction.reply({ embeds: [EmbedUtils.error('Not Found', 'Template not found.')], ephemeral: true });
        }

        const confirmBtn = new ButtonBuilder()
          .setCustomId(`confirm_apply_${presetId}`)
          .setLabel('Yes, Build My Server!')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🚀');

        const cancelBtn = new ButtonBuilder()
          .setCustomId('cancel_apply')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('✖️');

        const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

        return interaction.reply({
          embeds: [
            EmbedUtils.warning(
              'Confirm Server Transformation',
              `Are you sure you want to transform your server with **${template.name}**?\n\n` +
              `• 🗑️ **All old channels will be wiped cleanly.**\n` +
              `• 🎭 **${template.roles.length} Roles** will be created.\n` +
              `• 📂 **${template.categories.length} Categories** will be organized.\n\n` +
              `Click **Yes, Build My Server** below to start!`
            )
          ],
          components: [row]
        });
      }

      // Confirm Apply Button from Button Preview
      if (customId.startsWith('confirm_apply_')) {
        const presetId = customId.replace('confirm_apply_', '');
        const template = getTemplate(presetId);
        if (!template) {
          return interaction.reply({ embeds: [EmbedUtils.error('Not Found', 'Template not found.')], ephemeral: true });
        }

        await interaction.deferUpdate();
        return TemplateBuilderEngine.executeBuild({
          interaction,
          template,
          deleteOld: true,
          currentChannelId: interaction.channelId
        });
      }

      if (customId === 'cancel_apply') {
        return interaction.update({
          embeds: [EmbedUtils.info('Cancelled', 'Template installation cancelled.')],
          components: []
        });
      }

      // Button: Wipe Channels from Slider
      if (customId === 'template_wipe_channels_btn') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to wipe channels.')],
            ephemeral: true
          });
        }

        const channels = await interaction.guild.channels.fetch().catch(() => interaction.guild.channels.cache);
        const categoryCount = channels.filter(c => c && c.type === ChannelType.GuildCategory).size;
        const channelCount = channels.size - categoryCount;

        const confirmBtn = new ButtonBuilder()
          .setCustomId('confirm_slider_wipe_channels')
          .setLabel('Yes, Wipe All Channels!')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🗑️');

        const cancelBtn = new ButtonBuilder()
          .setCustomId('cancel_slider_wipe_channels')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('✖️');

        const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

        return interaction.reply({
          embeds: [
            EmbedUtils.warning(
              'Confirm Server Channel Wipe',
              `⚠️ Are you sure you want to **wipe all channels and categories** in **${interaction.guild.name}**?\n\n` +
              `• 📁 **Categories to delete:** \`${categoryCount}\`\n` +
              `• 💬 **Channels to delete:** \`${channelCount}\`\n` +
              `• ➕ **A fresh #general channel will be created.**\n\n` +
              `🚨 **WARNING:** This action is **irreversible**! All message history and channels will be permanently erased.`
            )
          ],
          components: [row]
        });
      }

      if (customId === 'confirm_slider_wipe_channels') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions.')],
            ephemeral: true
          });
        }

        await interaction.deferUpdate();
        return ChannelWiper.wipeAllChannels({
          guild: interaction.guild,
          user: interaction.user,
          createGeneral: true,
          callerChannelId: interaction.channelId,
          interaction
        });
      }

      if (customId === 'cancel_slider_wipe_channels') {
        return interaction.update({
          embeds: [EmbedUtils.info('Cancelled', 'Channel wipe cancelled. No changes were made.')],
          components: []
        });
      }

      // Button: Open Custom Template Modal
      if (customId === 'template_custom_btn') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to build server templates.')],
            ephemeral: true
          });
        }

        const modal = new ModalBuilder()
          .setCustomId('template_custom_modal_1')
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

      // Button: Get AI Prompt
      if (customId === 'template_prompt_btn') {
        const promptText = AIPromptGenerator.generatePrompt('Gaming & Community');
        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary)
          .setTitle('🤖 Ready-to-Copy ChatGPT Server Blueprint Prompt')
          .setDescription(
            `Copy this prompt into **ChatGPT**, **Claude**, or **Gemini** to generate custom layouts in seconds:\n\n` +
            `\`\`\`text\n${promptText.substring(0, 1800)}\n\`\`\``
          )
          .addFields({
            name: '🚀 Next Step:',
            value: 'Paste the output using `/template custom` or click **Build Custom (ChatGPT)**!'
          });

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Welcome Template 1-Click Apply Button
      if (customId.startsWith('welcome_tpl_apply_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to configure server welcome themes.')],
            ephemeral: true
          });
        }

        const templateId = customId.replace('welcome_tpl_apply_', '');
        const template = getWelcomeTemplate(templateId);
        if (!template) {
          return interaction.reply({ embeds: [EmbedUtils.error('Not Found', 'Template not found.')], ephemeral: true });
        }

        const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
        const welcome = guildSettings.welcome || {};

        DatabaseManager.setWelcomeConfig(interaction.guild.id, {
          enabled: true,
          templateId: template.id,
          title: template.title,
          message: template.message,
          color: template.color,
          banner: template.banner,
          dmMessage: template.dmMessage || welcome.dmMessage
        });

        return interaction.reply({
          embeds: [
            EmbedUtils.success(
              `Theme Installed: ${template.name} 🎉`,
              `The **${template.name}** style has been applied as your active server welcome design!\n\n` +
              `• **Channel:** ${welcome.channelId ? `<#${welcome.channelId}>` : '⚠️ *No welcome channel set. Run `/welcome setup channel:#channel`*'}\n` +
              `• **Color Palette:** \`${template.color}\`\n` +
              `• **Auto-Banner:** ${template.banner ? '🖼️ Enabled' : '*None*'}\n\n` +
              `Click **Test in Channel** or use \`/welcome test\` to verify!`
            )
          ],
          ephemeral: true
        });
      }

      // Welcome Template Test Button
      if (customId.startsWith('welcome_tpl_test_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to run test messages.')],
            ephemeral: true
          });
        }

        const templateId = customId.replace('welcome_tpl_test_', '');
        const template = getWelcomeTemplate(templateId);
        if (!template) {
          return interaction.reply({ embeds: [EmbedUtils.error('Not Found', 'Template not found.')], ephemeral: true });
        }

        const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
        const welcome = guildSettings.welcome || {};

        if (!welcome.channelId) {
          return interaction.reply({
            embeds: [
              EmbedUtils.warning(
                'No Welcome Channel Configured',
                'Please set a welcome channel first using `/welcome setup channel:#welcome` before sending live tests.'
              )
            ],
            ephemeral: true
          });
        }

        const targetChannel = interaction.guild.channels.cache.get(welcome.channelId);
        if (!targetChannel) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Channel Error', 'The configured welcome channel could not be found.')],
            ephemeral: true
          });
        }

        const testMsg = template.message
          .replace(/{user}/g, `<@${interaction.user.id}>`)
          .replace(/{username}/g, interaction.user.username)
          .replace(/{tag}/g, interaction.user.tag)
          .replace(/{server}/g, interaction.guild.name)
          .replace(/{count}/g, interaction.guild.memberCount.toString());

        const testTitle = template.title
          .replace(/{server}/g, interaction.guild.name)
          .replace(/{username}/g, interaction.user.username);

        const testEmbed = new EmbedBuilder()
          .setColor(template.color)
          .setAuthor({ name: testTitle, iconURL: interaction.guild.iconURL() })
          .setDescription(testMsg)
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, size: 256 }))
          .addFields(
            { name: '👤 Account Age', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: '📊 Member Position', value: `**#${interaction.guild.memberCount}**`, inline: true }
          )
          .setFooter({ text: `Hinata Test Welcome • User ID: ${interaction.user.id}` })
          .setTimestamp();

        if (template.banner) {
          testEmbed.setImage(template.banner);
        }

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel('📜 Read Rules').setStyle(ButtonStyle.Primary).setCustomId('welcome_rules_btn'),
          new ButtonBuilder().setLabel('🎭 Get Roles').setStyle(ButtonStyle.Secondary).setCustomId('welcome_roles_btn')
        );

        await targetChannel.send({
          content: `👋 Welcome <@${interaction.user.id}>!`,
          embeds: [testEmbed],
          components: [row]
        }).catch(() => null);

        return interaction.reply({
          embeds: [EmbedUtils.success('Test Message Dispatched', `Sent a live preview of **${template.name}** to <#${welcome.channelId}>.`)],
          ephemeral: true
        });
      }

      // Giveaway Enter Button
      if (customId === 'giveaway_enter') {
        const msgId = interaction.message.id;
        if (!giveawayEntries.has(msgId)) {
          giveawayEntries.set(msgId, new Set());
        }
        const entries = giveawayEntries.get(msgId);

        if (entries.has(interaction.user.id)) {
          entries.delete(interaction.user.id);
          const updatedRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('giveaway_enter')
              .setLabel(`Enter Giveaway (${entries.size})`)
              .setStyle(ButtonStyle.Success)
              .setEmoji('🎉')
          );
          await interaction.message.edit({ components: [updatedRow] }).catch(() => null);

          return interaction.reply({
            embeds: [EmbedUtils.info('Giveaway Entry Removed', 'You have left the giveaway.')],
            ephemeral: true
          });
        } else {
          entries.add(interaction.user.id);
          const updatedRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('giveaway_enter')
              .setLabel(`Enter Giveaway (${entries.size})`)
              .setStyle(ButtonStyle.Success)
              .setEmoji('🎉')
          );
          await interaction.message.edit({ components: [updatedRow] }).catch(() => null);

          return interaction.reply({
            embeds: [EmbedUtils.success('Giveaway Entry Confirmed', '🎉 You are now entered into the giveaway! Good luck!')],
            ephemeral: true
          });
        }
      }

      // Ticket Creation Buttons
      if (customId.startsWith('ticket_create_')) {
        const type = customId.replace('ticket_create_', '');
        const guild = interaction.guild;
        const user = interaction.user;

        const existingTickets = DatabaseManager.getUserOpenTickets(guild.id, user.id);
        if (existingTickets.length >= 3) {
          return interaction.reply({
            embeds: [EmbedUtils.warning('Ticket Limit Reached', 'You already have 3 open tickets. Please close existing tickets first.')],
            ephemeral: true
          });
        }

        await interaction.deferReply({ ephemeral: true });

        const guildSettings = DatabaseManager.getGuild(guild.id);
        const ticketConfig = guildSettings.ticket || {};

        const channelName = `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

        const permissionOverwrites = [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks
            ]
          },
          {
            id: client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.ManageMessages
            ]
          }
        ];

        if (ticketConfig.supportRoleId) {
          permissionOverwrites.push({
            id: ticketConfig.supportRoleId,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory
            ]
          });
        }

        try {
          const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: ticketConfig.categoryId || undefined,
            permissionOverwrites: permissionOverwrites,
            topic: `Support ticket for ${user.tag} (${user.id}) | Category: ${type}`
          });

          DatabaseManager.createTicket(ticketChannel.id, guild.id, ticketChannel.id, user.id, type);

          const ticketEmbed = new EmbedBuilder()
            .setColor(config.embedColors.primary)
            .setTitle(`🎫 Support Ticket: ${type.toUpperCase()}`)
            .setDescription(`Hello ${user}, thank you for reaching out!\n\nPlease describe your issue or question in detail. A staff member will be with you shortly.\n\nClick **🔒 Close Ticket** below when your issue has been resolved.`)
            .addFields(
              { name: '👤 Opened By', value: `${user} (\`${user.tag}\`)`, inline: true },
              { name: '📂 Category', value: `\`${type}\``, inline: true }
            )
            .setFooter({ text: 'Apex Ticket System' })
            .setTimestamp();

          const ticketRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('ticket_close_btn')
              .setLabel('Close Ticket')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🔒')
          );

          const pingContent = ticketConfig.supportRoleId
            ? `<@${user.id}> <@&${ticketConfig.supportRoleId}>`
            : `<@${user.id}>`;

          await ticketChannel.send({ content: pingContent, embeds: [ticketEmbed], components: [ticketRow] });

          return interaction.editReply({
            embeds: [EmbedUtils.success('Ticket Created', `Your ticket has been created at <#${ticketChannel.id}>.`)]
          });
        } catch (e) {
          console.error('[TICKET CREATION ERROR]', e);
          return interaction.editReply({
            embeds: [EmbedUtils.error('Ticket Error', `Could not create ticket: \`${e.message}\``)]
          });
        }
      }

      // Close Ticket Button
      if (customId === 'ticket_close_btn') {
        const ticket = DatabaseManager.getTicketByChannel(interaction.channelId);
        if (!ticket) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Not a Ticket', 'This channel is not tracked as an active ticket.')],
            ephemeral: true
          });
        }

        await interaction.reply({
          embeds: [
            EmbedUtils.warning(
              'Ticket Closing 🔒',
              `Ticket closed by ${interaction.user}.\n*Channel will be deleted in 5 seconds...*`
            )
          ]
        });

        DatabaseManager.closeTicket(interaction.channelId);

        setTimeout(async () => {
          try {
            await interaction.channel.delete(`Ticket closed by ${interaction.user.tag}`);
          } catch (e) {
            console.error('[TICKET DELETE ERROR]', e);
          }
        }, 5000);
        return;
      }

      // Setup Dashboard Info Buttons
      if (customId === 'btn_setup_autorole') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '👑 Auto-Role System Guide',
              'Automatically assign roles to new members and bots when they join:\n\n' +
              '• `/autorole set <role> [bot_role]` - Quick 1-step auto-role setup\n' +
              '• `/autorole humans <role>` - Set role specifically for joining humans\n' +
              '• `/autorole bots <role>` - Set role specifically for invited bots\n' +
              '• `/autorole status` - View settings and verify bot role hierarchy\n' +
              '• `/autorole toggle` - Enable or disable auto-role\n' +
              '• `/autorole test` - Test role assignment and permissions\n' +
              '• `/autorole remove <target>` - Clear configured roles\n\n' +
              '💡 *Make sure Hinata\'s bot role is placed **above** the auto-role in Server Settings > Roles!*'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_templates') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '🏗️ Server Templates & AI Custom Builder Guide',
              'Hinata Bot comes with **27+ built-in presets** & **Interactive Slider Carousel**:\n\n' +
              '• `/template list [category]` - Interactive visual Slider Carousel to slide through presets\n' +
              '• `/template preview <preset>` - Live preview with Autocomplete search\n' +
              '• `/template apply <preset>` - 1-Click install any preset\n' +
              '• `/template custom` - Build server from ChatGPT JSON or Markdown text\n' +
              '• `/role-builder create` - Paste any role list with emojis & categories to auto-create all roles!\n' +
              '• `/template ai-prompt` - Get ready-to-copy ChatGPT prompt for your theme\n' +
              '• `/template export` - Backup & export server structure to JSON / Markdown'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_automod') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '🛡️ AutoMod Guide',
              'Hinata features real-time automated server defense:\n\n' +
              '• `/automod anti-link` - Block all external links\n' +
              '• `/automod anti-invite` - Block Discord invite links\n' +
              '• `/automod anti-spam` - Stop fast message flooding\n' +
              '• `/automod anti-mention` - Stop mass-mention attacks\n' +
              '• `/automod badwords` - Profanity and blacklisted words filter\n' +
              '• `/automod modlog` - Set audit log channel'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_welcome') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '👋 Welcome System Guide',
              'Configure beautiful automated greetings:\n\n' +
              '• `/welcome setup` - Set channel, auto-roles (human/bot), banner, DM welcome\n' +
              '• `/welcome preview` - Live test preview\n' +
              '• `/welcome test` - Send test message to welcome channel\n' +
              '• `/leave setup` - Configure goodbye messages'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_tickets') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '🎫 Ticket System Guide',
              'Setup multi-department button tickets:\n\n' +
              '• `/ticket panel` - Deploy interactive ticket creation panel\n' +
              '• `/ticket close` - Close ticket with reason\n' +
              '• `/ticket add <user>` - Add user to private ticket\n' +
              '• `/ticket remove <user>` - Remove user from private ticket'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'welcome_rules_btn') {
        const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
        const rules = guildSettings.rules || {};
        const channelMention = rules.channelId ? `<#${rules.channelId}>` : 'the rules channel';
        return interaction.reply({
          content: `📜 Please check ${channelMention} to review our community guidelines!`,
          ephemeral: true
        });
      }

      if (customId === 'welcome_roles_btn') {
        return interaction.reply({
          content: '🎭 Head over to the roles channel or use `/selfroles preset` to pick your reaction roles and colors!',
          ephemeral: true
        });
      }

      // Rules Verification Button Handler (Click to Verify / Accept Rules)
      if (customId === 'rules_verify_btn') {
        const guild = interaction.guild;
        const member = interaction.member;
        const guildSettings = DatabaseManager.getGuild(guild.id);
        const rules = guildSettings.rules || {};
        const autorole = guildSettings.autorole || {};

        const targetRoleId = rules.verifyRoleId || autorole.humanRoleId || guildSettings.welcome?.roleId;

        if (!targetRoleId) {
          return interaction.reply({
            embeds: [
              EmbedUtils.success(
                'Rules Acknowledged! 📜✨',
                `Thank you, ${member}! You have acknowledged and agreed to the **${guild.name}** server rules.\n\n` +
                `*(Administrators can link a verified member role to this button using \`/rules verify-role\`)*`
              )
            ],
            ephemeral: true
          });
        }

        const role = guild.roles.cache.get(targetRoleId);
        if (!role) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Role Error', 'The configured verification role no longer exists on this server. Please contact an administrator.')],
            ephemeral: true
          });
        }

        if (member.roles.cache.has(role.id)) {
          return interaction.reply({
            embeds: [EmbedUtils.info('Already Verified! ✅', `You already have the <@&${role.id}> role and full access to **${guild.name}**! Enjoy your stay!`)],
            ephemeral: true
          });
        }

        const botMember = guild.members.me;
        if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles) || botMember.roles.highest.position <= role.position) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Role Hierarchy Error', `Bot cannot grant <@&${role.id}> due to missing permissions or role hierarchy position. Please notify server staff.`)],
            ephemeral: true
          });
        }

        try {
          await member.roles.add(role, 'Hinata Verification: Accepted server rules');
          return interaction.reply({
            embeds: [
              EmbedUtils.success(
                'Verification Complete! 🎉🛡️',
                `Welcome to **${guild.name}**, ${member}!\n\n` +
                `• **Assigned Role:** <@&${role.id}>\n` +
                `• **Status:** Verified Member ✅\n\n` +
                `You now have full access to chat, voice channels, and server events. Have fun!`
              )
            ],
            ephemeral: true
          });
        } catch (err) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Verification Failed', `Could not assign role: \`${err.message}\``)],
            ephemeral: true
          });
        }
      }

      // Rules Preset Deploy Button
      if (customId.startsWith('rules_tpl_send_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to deploy server rules.')],
            ephemeral: true
          });
        }

        const presetId = customId.replace('rules_tpl_send_', '');
        const template = getRulesTemplate(presetId);
        if (!template) {
          return interaction.reply({ content: 'Template not found.', ephemeral: true });
        }

        const guildSettings = DatabaseManager.getGuild(interaction.guild.id);
        const targetChannelId = guildSettings.rules?.channelId || interaction.channelId;
        const targetChannel = interaction.guild.channels.cache.get(targetChannelId) || interaction.channel;

        const embed = buildRulesEmbed(template, interaction.guild);
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('rules_verify_btn')
            .setLabel('Accept Rules & Verify')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅'),
          new ButtonBuilder()
            .setCustomId('ticket_general_btn')
            .setLabel('Support / Staff')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🎫')
        );

        try {
          const sent = await targetChannel.send({ embeds: [embed], components: [row] });
          DatabaseManager.setRulesConfig(interaction.guild.id, {
            enabled: true,
            channelId: targetChannel.id,
            templateId: template.id,
            messageId: sent.id
          });

          return interaction.reply({
            embeds: [EmbedUtils.success('Rules Deployed! 📜', `The **${template.name}** rules have been sent to <#${targetChannel.id}>.`)],
            ephemeral: true
          });
        } catch (e) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Deployment Failed', `Could not send rules: \`${e.message}\``)],
            ephemeral: true
          });
        }
      }

      // Rules Preset Apply Button
      if (customId.startsWith('rules_tpl_apply_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions.')],
            ephemeral: true
          });
        }

        const presetId = customId.replace('rules_tpl_apply_', '');
        const template = getRulesTemplate(presetId);
        if (!template) {
          return interaction.reply({ content: 'Template not found.', ephemeral: true });
        }

        DatabaseManager.setRulesConfig(interaction.guild.id, {
          templateId: template.id
        });

        return interaction.reply({
          embeds: [EmbedUtils.success('Default Rules Theme Set 💾', `Default server rules theme set to **${template.name}**.\nUse \`/rules send\` to post it to your rules channel.`)],
          ephemeral: true
        });
      }

      // Invite Leaderboard Button from /invites check
      if (customId === 'btn_invites_top') {
        const topInviters = DatabaseManager.getInviteLeaderboard(interaction.guild.id, 10);
        if (topInviters.length === 0) {
          return interaction.reply({ content: 'No invite records found yet for this server.', ephemeral: true });
        }

        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let text = '';
        topInviters.forEach((entry, idx) => {
          const medal = medals[idx] || `\`#${idx + 1}\``;
          text += `${medal} <@${entry.userId}> — **${entry.total}** net invites *(✅ \`${entry.regular}\` | ❌ \`${entry.leaves}\` | ⚠️ \`${entry.fake}\`)*\n`;
        });

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.warning)
          .setTitle('🏆 Top Server Inviters')
          .setDescription(text)
          .setFooter({ text: `${interaction.guild.name} Invite Leaderboard` })
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Setup Dashboard Info Buttons for Rules & Invites
      if (customId === 'btn_setup_rules') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '📜 Server Rules & Verification Guide',
              'Deploy beautiful rules templates and automated verification:\n\n' +
              '• `/rules templates` - Interactive gallery with 10+ pre-made themes\n' +
              '• `/rules send <preset> <#channel>` - 1-Click post formatted rules to channel\n' +
              '• `/rules verify-role <role>` - Assign role when members click "Accept Rules"\n' +
              '• `/rules custom <#channel>` - Craft custom rules with Modal Builder\n' +
              '• `/rules preview` - Live preview current server rules'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_invites') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '📊 Invite Tracker & Leaderboard Guide',
              'Track regular, left, fake accounts and bonus invites:\n\n' +
              '• `/invites check [user]` - View user invite card with progress bar & rank\n' +
              '• `/invites leaderboard` - Server-wide top inviters leaderboard\n' +
              '• `/invites audit <user>` - Check who invited a member & account status\n' +
              '• `/invites-manage add/remove/reset` - Admin bonus invites management\n\n' +
              '💡 *Formula: `Net Invites = (Regular + Bonus) - (Leaves + Fake)`*'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_automod') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '🛡️ AutoMod & Security Controls',
              'Configure automated server shields and profanity filters:\n\n' +
              '• `/automod status` - View current security shields & active filters\n' +
              '• `/automod badwords action:preset` - Load 250+ Hindi & Hinglish abusive terms preset\n' +
              '• `/automod anti-invite enabled:true` - Block Discord invite links\n' +
              '• `/automod anti-spam enabled:true` - Fast message spam flooding filter\n' +
              '• `/automod anti-mention enabled:true` - Mass mention & ping protection\n' +
              '• `/automod modlog channel:<#channel>` - Audit log stream channel\n' +
              '• `/automod test message:<text>` - Live simulation filter check'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_autorole') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '👑 Auto-Role System Guide',
              'Automatically grant roles when members or bots join your server:\n\n' +
              '• `/autorole set humans:<@role> bots:<@role>` - Configure join roles\n' +
              '• `/autorole status` - View current auto-role configuration\n' +
              '• `/autorole toggle` - Enable or pause auto-role without losing settings\n' +
              '• `/autorole clear` - Remove auto-role configurations'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_templates') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '🏗️ Server Templates & Blueprint Engine',
              'Transform your server with pre-built layouts or AI blueprints:\n\n' +
              '• `/template list` - Interactive Carousel Slider with 37+ templates\n' +
              '• `/template apply preset:<id>` - 1-Click apply preset layout\n' +
              '• `/template import url:<xenon_url>` - Import any Xenon or Discord template\n' +
              '• `/template custom` - Build custom layout from ChatGPT prompt\n' +
              '• `/template export` - Export current server layout to JSON/Markdown'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_welcome') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '👋 Welcome & Leave Greetings Guide',
              'Customize new member greetings and leave announcements:\n\n' +
              '• `/welcome setup channel:<#channel>` - Set welcome channel & message\n' +
              '• `/welcome templates` - Browse beautiful welcome theme styles\n' +
              '• `/welcome test` - Test welcome message in channel\n' +
              '• `/leave setup channel:<#channel>` - Configure member leave alerts\n' +
              '• `/leave test` - Test leave message in channel'
            )
          ],
          ephemeral: true
        });
      }

      if (customId === 'btn_setup_tickets') {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '🎫 Support Tickets System Guide',
              'Deploy interactive multi-department support ticket panel:\n\n' +
              '• `/ticket setup category:<category> role:<staff_role>` - Configure tickets\n' +
              '• `/ticket panel channel:<#channel>` - Post 3-department ticket panel\n' +
              '• `/ticket close [reason]` - Close active support ticket\n' +
              '• `/ticket add <user>` & `/ticket remove <user>` - Manage ticket access'
            )
          ],
          ephemeral: true
        });
      }

      // 1-Click AutoServer Open from /setup Dashboard or /help
      if (customId === 'btn_setup_autoserver_open') {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to build server layouts.')],
            ephemeral: true
          });
        }

        const themeOptions = [
          new StringSelectMenuOptionBuilder()
            .setLabel('✨ Good Looking (Ultra-Stylish Aesthetic Lounge)')
            .setValue('good-looking')
            .setDescription('Minimalist borders, pastel hierarchy, cozy hangout channels & auto systems')
            .setEmoji('✨'),
          new StringSelectMenuOptionBuilder()
            .setLabel('🍜 NOMI Bot Official RPG & Arcade')
            .setValue('nomi-rpg')
            .setDescription('Cooking, Quests, Nomi Spam & Founder Lounge')
            .setEmoji('🍜'),
          new StringSelectMenuOptionBuilder()
            .setLabel('👑 LordX Esports Official HQ')
            .setValue('lordx-esports')
            .setDescription('Lineups, Scrims, VIP Rooms, Music & Fun')
            .setEmoji('👑'),
          new StringSelectMenuOptionBuilder()
            .setLabel('🐾 OwO & Bot Gaming Arcade')
            .setValue('owo-arcade')
            .setDescription('Grind zones, high-roller casino & safe trades')
            .setEmoji('🐾'),
          new StringSelectMenuOptionBuilder()
            .setLabel('⚡ VX Esports & Gaming Empire')
            .setValue('vx-esports')
            .setDescription('VX Rooms, teams, scrims, music & tournaments')
            .setEmoji('⚡'),
          new StringSelectMenuOptionBuilder()
            .setLabel('🌐 Universal Community & Hangout')
            .setValue('community')
            .setDescription('Best for all communities, YouTubers, friends & clubs')
            .setEmoji('🌐'),
          new StringSelectMenuOptionBuilder()
            .setLabel('🎮 Gaming & Esports Arena')
            .setValue('gaming')
            .setDescription('Gaming squads, voice comms, clips & tournament hubs')
            .setEmoji('🎮'),
          new StringSelectMenuOptionBuilder()
            .setLabel('🌸 Anime & Aesthetic Lounge')
            .setValue('anime')
            .setDescription('Cozy kaomoji aesthetic, spoiler tags & manga lounge')
            .setEmoji('🌸'),
          new StringSelectMenuOptionBuilder()
            .setLabel('💻 Developer & Tech Hub')
            .setValue('developer')
            .setDescription('Code help, project showcases, GitHub feeds & tech chat')
            .setEmoji('💻')
        ];

        const selectMenuRow = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('autoserver_theme_select')
            .setPlaceholder('👉 Choose a Server Theme to setup in 1-Click...')
            .addOptions(themeOptions)
        );

        const quickBtnRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('confirm_autoserver_good-looking')
            .setLabel('⚡ Quick Setup: Good Looking')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✨'),
          new ButtonBuilder()
            .setCustomId('confirm_autoserver_nomi-rpg')
            .setLabel('⚡ Quick Setup: NOMI RPG')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🍜')
        );

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.primary || '#5865F2')
          .setTitle('⚡ 1-Click Automatic Server Setup')
          .setDescription(
            `Welcome to **${config.botName || 'Hinata'} 1-Click Server Automation**!\n\n` +
            `With **1-Click**, the bot will automatically:\n` +
            `• 🏗️ Build complete Categories, Voice rooms & Channels\n` +
            `• 🎭 Create & assign all Server Roles with permissions\n` +
            `• 📜 **Write Server Rules** & deploy \`[ ✅ Accept Rules & Verify ]\` button\n` +
            `• 👋 Set up **Welcome Greetings** & Auto-Role assignment\n` +
            `• 🎭 Deploy interactive **Self-Roles Dropdown** for colors & pings\n` +
            `• 🎫 Deploy interactive **Support Ticket Help Desk**\n` +
            `• 📊 Initialize **5 Live Server Stats** voice counters\n` +
            `• 🛡️ Arm **AutoMod & ModLogs** protection\n\n` +
            `👉 **Select your server theme below or click a Quick Setup button:**`
          )
          .setFooter({ text: 'Warning: Existing channels will be replaced with clean layout.' })
          .setTimestamp();

        return interaction.reply({
          embeds: [embed],
          components: [selectMenuRow, quickBtnRow],
          ephemeral: true
        });
      }

      // Confirm AutoServer Button Handler
      if (customId.startsWith('confirm_autoserver_')) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
          return interaction.reply({
            embeds: [EmbedUtils.error('Permission Denied', 'You need Administrator permissions to build server layouts.')],
            ephemeral: true
          });
        }

        const themeKey = customId.replace('confirm_autoserver_', '');
        const template = getTemplate(themeKey) || getTemplate('good-looking');
        if (!template) {
          return interaction.reply({ embeds: [EmbedUtils.error('Theme Error', 'Template not found.')], ephemeral: true });
        }

        await interaction.deferUpdate();
        return TemplateBuilderEngine.executeBuild({
          interaction,
          template,
          deleteOld: true,
          includeStats: true,
          includeRules: true,
          includeWelcome: true,
          includeSelfRoles: true,
          includeTickets: true,
          includeAutoMod: true,
          currentChannelId: interaction.channelId
        });
      }

      if (customId === 'cancel_autoserver') {
        return interaction.update({
          embeds: [EmbedUtils.info('Setup Cancelled', '1-Click Server Setup was cancelled.')],
          components: []
        });
      }
    }
  }
};
