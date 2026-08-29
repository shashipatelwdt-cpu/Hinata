const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const MusicManager = require('../../music/MusicManager');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('musicpanel')
    .setDescription('🎛️ Deploy a permanent interactive Music Controller in this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎧 Hinata Music Control Center')
      .setDescription(
        'Welcome to the **Music Controller**!\n\n' +
        '**How to Play Music:**\n' +
        '• Use `/play <song name or link>` to stream tracks.\n' +
        '• Use the interactive buttons below to control active playback anytime.\n\n' +
        '**Features Supported:**\n' +
        '✨ YouTube, Spotify & SoundCloud playback\n' +
        '🔀 Shuffle & Queue management\n' +
        '🔁 Loop Single Track or Entire Queue\n' +
        '🔊 Instant Volume Adjustment'
      )
      .setColor(config.embedColors?.primary || '#5865F2')
      .setImage('https://i.imgur.com/8Q7kYdY.png') // aesthetic visual banner or fallback
      .setFooter({
        text: 'Hinata Music • Interactive Studio',
        iconURL: interaction.guild.iconURL()
      });

    const playPauseBtn = new ButtonBuilder()
      .setCustomId('music_play_pause')
      .setEmoji('⏯️')
      .setLabel('Play / Pause')
      .setStyle(ButtonStyle.Primary);

    const skipBtn = new ButtonBuilder()
      .setCustomId('music_skip')
      .setEmoji('⏭️')
      .setLabel('Skip')
      .setStyle(ButtonStyle.Secondary);

    const stopBtn = new ButtonBuilder()
      .setCustomId('music_stop')
      .setEmoji('⏹️')
      .setLabel('Stop')
      .setStyle(ButtonStyle.Danger);

    const loopBtn = new ButtonBuilder()
      .setCustomId('music_loop')
      .setEmoji('🔁')
      .setLabel('Loop')
      .setStyle(ButtonStyle.Secondary);

    const shuffleBtn = new ButtonBuilder()
      .setCustomId('music_shuffle')
      .setEmoji('🔀')
      .setLabel('Shuffle')
      .setStyle(ButtonStyle.Secondary);

    const row1 = new ActionRowBuilder().addComponents(playPauseBtn, skipBtn, stopBtn, loopBtn, shuffleBtn);

    const volDownBtn = new ButtonBuilder()
      .setCustomId('music_vol_down')
      .setEmoji('🔉')
      .setLabel('Vol -10%')
      .setStyle(ButtonStyle.Secondary);

    const volUpBtn = new ButtonBuilder()
      .setCustomId('music_vol_up')
      .setEmoji('🔊')
      .setLabel('Vol +10%')
      .setStyle(ButtonStyle.Secondary);

    const autoplayBtn = new ButtonBuilder()
      .setCustomId('music_autoplay')
      .setEmoji('📻')
      .setLabel('Autoplay')
      .setStyle(ButtonStyle.Secondary);

    const queueBtn = new ButtonBuilder()
      .setCustomId('music_queue')
      .setEmoji('📜')
      .setLabel('Queue')
      .setStyle(ButtonStyle.Primary);

    const npBtn = new ButtonBuilder()
      .setCustomId('music_np_refresh')
      .setEmoji('🎶')
      .setLabel('Now Playing')
      .setStyle(ButtonStyle.Secondary);

    const row2 = new ActionRowBuilder().addComponents(volDownBtn, volUpBtn, autoplayBtn, queueBtn, npBtn);

    await interaction.reply({
      embeds: [embed],
      components: [row1, row2]
    });
  }
};
