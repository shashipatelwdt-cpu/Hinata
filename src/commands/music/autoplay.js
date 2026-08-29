const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('📻 Toggle Smart Autoplay mode (continuous Spotify/YouTube taste-matching playback)')
    .addStringOption(opt =>
      opt
        .setName('mode')
        .setDescription('Turn autoplay on, off, or toggle')
        .setRequired(false)
        .addChoices(
          { name: 'Enable (ON)', value: 'on' },
          { name: 'Disable (OFF)', value: 'off' },
          { name: 'Toggle', value: 'toggle' }
        )
    ),

  async execute(interaction) {
    const queue = MusicManager.getQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Nothing Playing', 'No active music queue in this server! Use `/play` or `/radio` first.')],
        ephemeral: true
      });
    }

    const mode = interaction.options.getString('mode') || 'toggle';

    if (mode === 'on') {
      queue.autoplay = true;
    } else if (mode === 'off') {
      queue.autoplay = false;
    } else {
      queue.toggleAutoplay();
    }

    const isEnabled = queue.autoplay;
    const embed = new EmbedBuilder()
      .setTitle(isEnabled ? '📻 Smart Autoplay Enabled' : '📻 Smart Autoplay Disabled')
      .setDescription(
        isEnabled
          ? '✨ **Smart Autoplay is now ON!**\nWhen the queue ends, the bot will automatically detect your musical taste and queue similar songs non-stop (like Spotify Radio / YouTube Mix).'
          : '❌ **Smart Autoplay is now OFF.**\nThe bot will stop and leave the voice channel when the queue finishes.'
      )
      .setColor(isEnabled ? (config.embedColors?.success || '#57F287') : (config.embedColors?.danger || '#ED4245'))
      .setFooter({ text: 'Hinata Music Engine • AI Recommendations' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    if (queue.nowPlayingMessage) {
      queue.sendNowPlaying().catch(() => null);
    }
  }
};
