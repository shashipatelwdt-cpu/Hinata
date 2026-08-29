const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('🖼️ View and download high-resolution user avatar')
    .addUserOption(opt => opt.setName('user').setDescription('The user').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const avatarPng = user.displayAvatarURL({ dynamic: true, size: 4096, extension: 'png' });
    const avatarJpg = user.displayAvatarURL({ dynamic: true, size: 4096, extension: 'jpg' });
    const avatarWebp = user.displayAvatarURL({ dynamic: true, size: 4096, extension: 'webp' });

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary)
      .setTitle(`🖼️ Avatar of ${user.tag}`)
      .setImage(avatarPng)
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('PNG').setStyle(ButtonStyle.Link).setURL(avatarPng),
      new ButtonBuilder().setLabel('JPG').setStyle(ButtonStyle.Link).setURL(avatarJpg),
      new ButtonBuilder().setLabel('WEBP').setStyle(ButtonStyle.Link).setURL(avatarWebp)
    );

    return interaction.reply({ embeds: [embed], components: [row] });
  }
};
