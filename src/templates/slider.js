const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder,
  ChannelType 
} = require('discord.js');
const catalog = require('./catalog');
const config = require('../../config.json');

function getAllTemplates() {
  return Object.values(catalog);
}

function getCategories() {
  const cats = {};
  for (const t of Object.values(catalog)) {
    if (!cats[t.category]) cats[t.category] = [];
    cats[t.category].push(t);
  }
  return cats;
}

function getCategorySlug(name) {
  if (!name || name === 'all' || name.toLowerCase().includes('all')) return 'all';
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Interactive Template Carousel & Slider Helper
 */
class TemplateSlider {
  /**
   * Get filtered list of templates by category key or 'all'
   * @param {string} categoryKey 
   * @returns {{ list: Array, categoryName: string, categorySlug: string }}
   */
  static getCategoryList(categoryKey = 'all') {
    const categories = getCategories();
    const cleanKey = getCategorySlug(categoryKey);

    if (!cleanKey || cleanKey === 'all') {
      return {
        list: getAllTemplates(),
        categoryName: '🌟 All Templates',
        categorySlug: 'all'
      };
    }

    for (const [catName, list] of Object.entries(categories)) {
      const slug = getCategorySlug(catName);
      if (slug === cleanKey || catName.toLowerCase().includes(categoryKey.toLowerCase()) || slug.includes(cleanKey)) {
        return { list, categoryName: catName, categorySlug: slug };
      }
    }

    return {
      list: getAllTemplates(),
      categoryName: '🌟 All Templates',
      categorySlug: 'all'
    };
  }

  /**
   * Render the Slider Embed and Interactive Action Rows
   * @param {object} options
   * @param {Array} options.list - Array of template objects
   * @param {number} options.index - Current slide index (0-based)
   * @param {string} options.categoryKey - Category filter key
   * @param {string} options.categoryName - Display category name
   */
  static renderSlide({ list, index = 0, categoryKey = 'all', categoryName = '🌟 All Templates' }) {
    if (!list || list.length === 0) {
      list = getAllTemplates();
    }

    const safeSlug = getCategorySlug(categoryKey);
    const safeIndex = Math.max(0, Math.min(index, list.length - 1));
    const template = list[safeIndex];
    const totalSlides = list.length;
    const totalChannels = template.categories.reduce((acc, c) => acc + (c.channels?.length || 0), 0);

    // 1. Build Slide Embed
    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary)
      .setTitle(`🖼️ Template Slider: ${template.name}`)
      .setDescription(
        `**📂 Category:** ${template.category}\n` +
        `**📝 Description:** ${template.description}\n\n` +
        `**Quick Install:** \`/template apply preset:${template.id}\``
      )
      .addFields(
        { 
          name: `📊 Specifications`, 
          value: `🎭 **${template.roles.length} Roles** | 📁 **${template.categories.length} Categories** | 💬 **${totalChannels} Channels**`,
          inline: false
        }
      );

    // Format Roles summary
    const rolesSummary = template.roles.map(r => `• \`${r.name}\``).join('  ');
    embed.addFields({ 
      name: `🎭 Included Roles (${template.roles.length})`, 
      value: rolesSummary.slice(0, 1024), 
      inline: false 
    });

    // Format Channel Hierarchy summary
    let structureText = '';
    for (const cat of template.categories) {
      structureText += `\n**📂 ${cat.name}**\n`;
      for (const ch of cat.channels) {
        const typeIcon = ch.type === ChannelType.GuildVoice ? '🔊' : (ch.type === ChannelType.GuildAnnouncement ? '📢' : '💬');
        structureText += `　└ ${typeIcon} \`${ch.name}\`${ch.topic ? ` - *${ch.topic}*` : ''}\n`;
      }
    }
    embed.addFields({ 
      name: '📁 Channel Layout', 
      value: structureText.slice(0, 1024) || 'None', 
      inline: false 
    });

    embed.setFooter({ 
      text: `Slide ${safeIndex + 1} of ${totalSlides} • ${categoryName} • Use buttons below to slide ◀️ ▶️` 
    });

    // 2. Navigation Row (Pagination Buttons)
    const prevDisabled = safeIndex === 0;
    const nextDisabled = safeIndex === totalSlides - 1;

    const navRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`tplslide:first:${safeSlug}:0`)
        .setLabel('⏮️ First')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(prevDisabled),
      new ButtonBuilder()
        .setCustomId(`tplslide:prev:${safeSlug}:${safeIndex - 1}`)
        .setLabel('◀️ Previous')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(prevDisabled),
      new ButtonBuilder()
        .setCustomId(`tplslide:page:${safeIndex}`)
        .setLabel(`${safeIndex + 1} / ${totalSlides}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId(`tplslide:next:${safeSlug}:${safeIndex + 1}`)
        .setLabel('Next ▶️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(nextDisabled),
      new ButtonBuilder()
        .setCustomId(`tplslide:last:${safeSlug}:${totalSlides - 1}`)
        .setLabel('⏭️ Last')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(nextDisabled)
    );

    // 3. Action Row (Apply, Custom, Live Xenon/URL Import)
    const actionRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`template_apply_btn_${template.id}`)
        .setLabel(`🚀 Apply "${template.id}"`)
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('template_custom_btn')
        .setLabel('🤖 Paste ChatGPT Blueprint')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('template_import_modal_btn')
        .setLabel('🌐 Import Any Xenon / Discord Link')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('template_wipe_channels_btn')
        .setLabel('🗑️ Wipe Channels')
        .setStyle(ButtonStyle.Danger)
    );

    // 4. Category Selector Dropdown
    const categories = getCategories();
    const selectOptions = [
      new StringSelectMenuOptionBuilder()
        .setLabel(`🌟 All Templates (${getAllTemplates().length} Presets)`)
        .setValue('tplcat:all')
        .setDescription('Browse all templates across all categories')
        .setDefault(safeSlug === 'all')
    ];

    for (const [catName, cList] of Object.entries(categories)) {
      const slug = getCategorySlug(catName);
      selectOptions.push(
        new StringSelectMenuOptionBuilder()
          .setLabel(catName.replace(/^[^\w\s]+/, '').trim().substring(0, 50))
          .setValue(`tplcat:${slug}`)
          .setDescription(`${cList.length} presets in ${catName.substring(0, 30)}`)
          .setEmoji(catName.match(/^[^\w\s]+/)?.[0] || '📁')
          .setDefault(safeSlug !== 'all' && slug === safeSlug)
      );
    }

    const menuRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('tpl_slide_cat_select')
        .setPlaceholder(`📂 Current: ${categoryName.substring(0, 40)} (Click to switch)`)
        .addOptions(selectOptions.slice(0, 25))
    );

    return {
      embeds: [embed],
      components: [menuRow, navRow, actionRow]
    };
  }
}

module.exports = TemplateSlider;
