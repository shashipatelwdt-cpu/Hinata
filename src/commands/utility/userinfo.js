const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('👤 Display detailed profile information about a user')
    .addUserOption(opt => opt.setName('user').setDescription('The user to check (defaults to you)').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(member?.displayHexColor !== '#000000' ? member?.displayHexColor : config.embedColors.primary)
      .setTitle(`👤 User Info: ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '🆔 User ID', value: `\`${user.id}\``, inline: true },
        { name: '🤖 Bot Account?', value: user.bot ? 'Yes' : 'No', inline: true },
        { name: '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      );

    if (member) {
      const roles = member.roles.cache
        .filter(r => r.id !== interaction.guild.id)
        .sort((a, b) => b.position - a.position)
        .map(r => `<@&${r.id}>`);

      embed.addFields(
        { name: '📥 Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: '⭐ Highest Role', value: `${member.roles.highest}`, inline: true },
        { name: `🎭 Roles (${roles.length})`, value: roles.length > 0 ? roles.slice(0, 10).join(' ') + (roles.length > 10 ? ` *(+${roles.length - 10} more)*` : '') : '*No custom roles*', inline: false }
      );
    }

    embed.setFooter({ text: `Requested by ${interaction.user.tag}` }).setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
