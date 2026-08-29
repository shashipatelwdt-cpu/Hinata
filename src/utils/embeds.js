const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');

class EmbedUtils {
  static createBase(guild = null) {
    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary)
      .setTimestamp();
    
    if (guild && guild.iconURL()) {
      embed.setFooter({ text: guild.name, iconURL: guild.iconURL() });
    } else {
      embed.setFooter({ text: config.botName });
    }
    return embed;
  }

  static success(title, description, guild = null) {
    return this.createBase(guild)
      .setColor(config.embedColors.success)
      .setTitle(`✅ ${title}`)
      .setDescription(description || '');
  }

  static error(title, description, guild = null) {
    return this.createBase(guild)
      .setColor(config.embedColors.danger)
      .setTitle(`❌ ${title}`)
      .setDescription(description || '');
  }

  static warning(title, description, guild = null) {
    return this.createBase(guild)
      .setColor(config.embedColors.warning)
      .setTitle(`⚠️ ${title}`)
      .setDescription(description || '');
  }

  static info(title, description, guild = null) {
    return this.createBase(guild)
      .setColor(config.embedColors.info)
      .setTitle(`ℹ️ ${title}`)
      .setDescription(description || '');
  }
}

module.exports = EmbedUtils;
