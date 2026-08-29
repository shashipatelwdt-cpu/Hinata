const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
const config = require('../../../config.json');
const os = require('os');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('🤖 Show detailed bot system stats, uptime, and latency'),

  async execute(interaction) {
    const client = interaction.client;
    const uptime = Math.floor(process.uptime());
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = uptime % 60;
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ping = client.ws.ping;

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary)
      .setTitle(`🤖 ${config.botName} - System Statistics`)
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: '⚡ Latency / Ping', value: `\`${ping >= 0 ? ping : '0'}ms\``, inline: true },
        { name: '⏱️ Uptime', value: `\`${uptimeString}\``, inline: true },
        { name: '💾 Memory Used', value: `\`${memoryUsage} MB\``, inline: true },
        { name: '🌐 Servers', value: `\`${(config.fakeServerCount || client.guilds.cache.size).toLocaleString()}\``, inline: true },
        { name: '👥 Total Users', value: `\`${(config.fakeServerCount ? config.fakeServerCount * 45 : client.users.cache.size).toLocaleString()}+\``, inline: true },
        { name: '⚙️ Node.js', value: `\`${process.version}\``, inline: true },
        { name: '📦 Discord.js', value: `\`v${djsVersion}\``, inline: true },
        { name: '💻 Host Platform', value: `\`${os.type()} ${os.arch()}\``, inline: true }
      )
      .setFooter({ text: `${config.botName} All-In-One Bot • High Performance` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
