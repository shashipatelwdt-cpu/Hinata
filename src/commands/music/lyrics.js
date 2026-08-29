const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('🎤 Search lyrics for the current song or a specific title')
    .addStringOption(opt =>
      opt
        .setName('song')
        .setDescription('Song title to find lyrics for (leave empty for current playing song)')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    let songQuery = interaction.options.getString('song');
    if (!songQuery) {
      const queue = MusicManager.getQueue(interaction.guild.id);
      if (queue && queue.currentSong) {
        songQuery = queue.currentSong.title;
      }
    }

    if (!songQuery) {
      return interaction.editReply({
        embeds: [EmbedUtils.error('No Song Specified', 'Please provide a song title or play music first to search lyrics!')]
      });
    }

    // Clean search term
    const cleanTitle = songQuery
      .replace(/\(Official.*?\)/gi, '')
      .replace(/\[Official.*?\]/gi, '')
      .replace(/\(Music Video.*?\)/gi, '')
      .replace(/\[Music Video.*?\]/gi, '')
      .replace(/\(Audio.*?\)/gi, '')
      .replace(/\(Lyric.*?\)/gi, '')
      .replace(/\[Lyric.*?\]/gi, '')
      .replace(/\b(HD|4K|1080p)\b/gi, '')
      .trim();

    try {
      const apiUrl = `https://some-random-api.com/lyrics?title=${encodeURIComponent(cleanTitle)}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Not found');

      const data = await res.json();
      if (!data || !data.lyrics) throw new Error('No lyrics');

      const lyricsText = data.lyrics.length > 3900 
        ? data.lyrics.substring(0, 3900) + '...\n\n*(Lyrics truncated due to length)*'
        : data.lyrics;

      const embed = new EmbedBuilder()
        .setTitle(`🎤 ${data.title} — ${data.author}`)
        .setDescription(lyricsText)
        .setThumbnail(data.thumbnail?.genius || null)
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: 'Lyrics powered by Genius / SomeRandomAPI' })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch {
      return interaction.editReply({
        embeds: [
          EmbedUtils.error(
            'Lyrics Not Found',
            `Could not find lyrics for **${cleanTitle}**. Try searching with \`/lyrics song: Artist - Track Name\`.`
          )
        ]
      });
    }
  }
};
