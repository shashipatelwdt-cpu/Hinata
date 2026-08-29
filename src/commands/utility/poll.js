const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('📊 Create a community poll with up to 5 custom options')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(opt => opt.setName('question').setDescription('The poll question').setRequired(true))
    .addStringOption(opt => opt.setName('option1').setDescription('Option 1').setRequired(true))
    .addStringOption(opt => opt.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption(opt => opt.setName('option3').setDescription('Option 3 (Optional)').setRequired(false))
    .addStringOption(opt => opt.setName('option4').setDescription('Option 4 (Optional)').setRequired(false))
    .addStringOption(opt => opt.setName('option5').setDescription('Option 5 (Optional)').setRequired(false))
    .addChannelOption(opt => opt.setName('channel').setDescription('Channel to post poll in').setRequired(false)),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
    const options = [];

    for (let i = 1; i <= 5; i++) {
      const opt = interaction.options.getString(`option${i}`);
      if (opt) options.push(opt);
    }

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.primary)
      .setTitle(`📊 Community Poll: ${question}`)
      .setDescription(options.map((opt, idx) => `${emojis[idx]} **${opt}**`).join('\n\n') + '\n\n*React with the corresponding number below to vote!*')
      .setFooter({ text: `Poll started by ${interaction.user.tag}` })
      .setTimestamp();

    const pollMsg = await channel.send({ embeds: [embed] });

    for (let i = 0; i < options.length; i++) {
      await pollMsg.react(emojis[i]).catch(() => null);
    }

    return interaction.reply({
      content: `✅ Poll created in <#${channel.id}>!`,
      ephemeral: true
    });
  }
};
