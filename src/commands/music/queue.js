const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('📜 View upcoming songs in the server queue')
    .addIntegerOption(opt =>
      opt
        .setName('page')
        .setDescription('Queue page number (Default: 1)')
        .setRequired(false)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const queue = MusicManager.getQueue(interaction.guild.id);
    if (!queue || (!queue.currentSong && queue.songs.length === 0)) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Empty Queue', 'There are no songs in the queue right now! Use `/play` to add songs.')],
        ephemeral: true
      });
    }

    const page = interaction.options.getInteger('page') || 1;
    const itemsPerPage = 10;
    const totalPages = Math.max(1, Math.ceil(queue.songs.length / itemsPerPage));

    if (page > totalPages) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Invalid Page', `Queue only has **${totalPages}** page(s)!`)],
        ephemeral: true
      });
    }

    const startIdx = (page - 1) * itemsPerPage;
    const currentList = queue.songs.slice(startIdx, startIdx + itemsPerPage);

    let desc = '';
    if (queue.currentSong) {
      desc += `**💿 Currently Playing:**\n` +
              `[${queue.currentSong.title}](${queue.currentSong.url}) | \`${queue.currentSong.duration || 'Unknown'}\` | <@${queue.currentSong.requester?.id}>\n\n` +
              `**📑 Up Next (${queue.songs.length} total tracks):**\n`;
    }

    if (currentList.length === 0) {
      desc += '*No additional songs waiting in queue.*';
    } else {
      desc += currentList.map((song, i) => {
        const num = startIdx + i + 1;
        return `\`${num}.\` **[${song.title.substring(0, 50)}](${song.url})** | \`${song.duration || '?'}\` (by <@${song.requester?.id}>)`;
      }).join('\n');
    }

    const loopStatus = queue.loopMode === 'track' ? '🔂 Track' : queue.loopMode === 'queue' ? '🔁 Queue' : '❌ Off';

    const embed = new EmbedBuilder()
      .setTitle(`🎵 ${interaction.guild.name} • Music Queue`)
      .setDescription(desc)
      .addFields(
        { name: '🔊 Volume', value: `\`${queue.volume}%\``, inline: true },
        { name: '🔁 Loop Mode', value: `\`${loopStatus}\``, inline: true },
        { name: '📄 Page', value: `\`${page} / ${totalPages}\``, inline: true }
      )
      .setColor(config.embedColors?.primary || '#5865F2')
      .setFooter({
        text: `Hinata Music System • ${queue.songs.length} song(s) in queue`,
        iconURL: interaction.guild.iconURL()
      })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};
