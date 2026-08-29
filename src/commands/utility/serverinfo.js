const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('📊 Display comprehensive statistics and information about this server'),

  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();
    const channels = guild.channels.cache;
    const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
    const categories = channels.filter(c => c.type === ChannelType.GuildCategory).size;
    const rolesCount = guild.roles.cache.size - 1; // exclude @everyone

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary)
      .setTitle(`📊 Server Info: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .setImage(guild.bannerURL({ size: 1024 }) || null)
      .addFields(
        { name: '👑 Server Owner', value: `${owner} (\`${owner.user.tag}\`)`, inline: true },
        { name: '🆔 Server ID', value: `\`${guild.id}\``, inline: true },
        { name: '📅 Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D> (<t:${Math.floor(guild.createdTimestamp / 1000)}:R>)`, inline: false },
        { name: '👥 Members', value: `**Total:** ${guild.memberCount}\n**Boost Level:** Tier ${guild.premiumTier} (${guild.premiumSubscriptionCount || 0} boosts)`, inline: true },
        { name: '💬 Channels', value: `📁 **${categories}** Categories\n💬 **${textChannels}** Text\n🔊 **${voiceChannels}** Voice`, inline: true },
        { name: '🎭 Roles & Emojis', value: `🎭 **${rolesCount}** Roles\n😀 **${guild.emojis.cache.size}** Emojis`, inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
