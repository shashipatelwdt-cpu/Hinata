const { SlashCommandBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('⏭️ Skip the current song or skip to a specific song in queue')
    .addIntegerOption(opt =>
      opt
        .setName('to')
        .setDescription('Track index to skip to')
        .setRequired(false)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Voice Channel Required', 'You must be in a voice channel to use music commands!')],
        ephemeral: true
      });
    }

    const queue = MusicManager.getQueue(interaction.guild.id);
    if (!queue || (!queue.isPlaying && queue.songs.length === 0)) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Nothing Playing', 'There is no music in queue to skip!')],
        ephemeral: true
      });
    }

    const toIndex = interaction.options.getInteger('to');
    if (toIndex) {
      if (toIndex > queue.songs.length) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Invalid Track', `Queue only has ${queue.songs.length} song(s)!`)],
          ephemeral: true
        });
      }
      queue.songs.splice(0, toIndex - 1);
    }

    const skippedSong = queue.currentSong?.title || 'Current Song';
    queue.skip();

    return interaction.reply({
      embeds: [EmbedUtils.success('Song Skipped', `⏭️ Skipped **${skippedSong}**!`)]
    });
  }
};
