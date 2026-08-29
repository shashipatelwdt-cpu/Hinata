const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  ActionRowBuilder 
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed-builder')
    .setDescription('🎨 Create custom rich embeds using an interactive popup modal')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to post the embed to (defaults to current)').setRequired(false)),

  async execute(interaction) {
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;

    const modal = new ModalBuilder()
      .setCustomId(`embed_modal_${targetChannel.id}`)
      .setTitle('🎨 Rich Embed Creator');

    const titleInput = new TextInputBuilder()
      .setCustomId('embed_title')
      .setLabel('Embed Title')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Enter the title of your embed...')
      .setMaxLength(256)
      .setRequired(true);

    const descInput = new TextInputBuilder()
      .setCustomId('embed_description')
      .setLabel('Description (Markdown supported)')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Enter the main body text. You can use **bold**, *italics*, [links](url)...')
      .setMaxLength(4000)
      .setRequired(true);

    const colorInput = new TextInputBuilder()
      .setCustomId('embed_color')
      .setLabel('Hex Color (e.g., #5865F2, #FF0000, #00FF00)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('#5865F2')
      .setMaxLength(7)
      .setRequired(false);

    const imageInput = new TextInputBuilder()
      .setCustomId('embed_image')
      .setLabel('Image / Banner URL (Optional)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('https://example.com/banner.png')
      .setRequired(false);

    const footerInput = new TextInputBuilder()
      .setCustomId('embed_footer')
      .setLabel('Footer Text (Optional)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Server guidelines • Announcement')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(descInput),
      new ActionRowBuilder().addComponents(colorInput),
      new ActionRowBuilder().addComponents(imageInput),
      new ActionRowBuilder().addComponents(footerInput)
    );

    await interaction.showModal(modal);
  }
};
