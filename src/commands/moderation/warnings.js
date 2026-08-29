const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const TimeUtils = require('../../utils/time');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('📋 View warning history of a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName('user').setDescription('The member to check').setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const warns = DatabaseManager.getWarns(interaction.guild.id, user.id);

    if (!warns || warns.length === 0) {
      return interaction.reply({
        embeds: [EmbedUtils.info('No Warnings', `**${user.tag}** has a completely clean record with **0** warnings.`)]
      });
    }

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.warning)
      .setTitle(`📋 Warning History: ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .setDescription(`Found **${warns.length}** warning(s) for ${user}.`)
      .setFooter({ text: `User ID: ${user.id}` })
      .setTimestamp();

    warns.slice(0, 15).forEach((w, index) => {
      const mod = interaction.guild.members.cache.get(w.moderator_id);
      const modName = mod ? mod.user.tag : `<@${w.moderator_id}>`;
      const formattedTime = TimeUtils.discordTimestamp(w.created_at, 'd');

      embed.addFields({
        name: `Warning #${w.id} (${formattedTime})`,
        value: `> **Reason:** ${w.reason}\n> **Moderator:** ${modName}`,
        inline: false
      });
    });

    if (warns.length > 15) {
      embed.setFooter({ text: `Showing first 15 of ${warns.length} warnings.` });
    }

    return interaction.reply({ embeds: [embed] });
  }
};
