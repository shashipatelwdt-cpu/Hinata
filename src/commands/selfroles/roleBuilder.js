const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const RoleParser = require('../../utils/roleParser');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('role-builder')
    .setDescription('👑 Automatic Bulk Role Creator - Paste any role list from ChatGPT with emojis & categories!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(sub =>
      sub
        .setName('create')
        .setDescription('🚀 Paste role list or upload file to auto-create all roles in seconds')
        .addStringOption(opt =>
          opt
            .setName('roles_text')
            .setDescription('Paste your role list here (Leave empty for popup text box modal)')
            .setRequired(false)
        )
        .addAttachmentOption(opt =>
          opt
            .setName('file')
            .setDescription('Upload a .txt or .json file with role names')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('help')
        .setDescription('💡 View example role formats and copyable templates')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'help') {
      const sampleFormat = 
`👑 STAFF ROLES
👑 Owner
🛡️ Management
⚔️ Esports Manager
💬 Chat Mod

🏆 ESPORTS ROLES
🏆 T1 Team
🥇 T2 Team
🥈 T3 Team
👑 IGL (In-Game Leader)

🎖️ RANKS & VIP
💎 VIP
🏆 Conqueror
⚔️ Ace

🔔 PING ROLES
📢 Announcement Ping
⚔️ Scrims Ping
🎁 Giveaway Ping`;

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle('👑 Automatic Role Builder Format Guide')
        .setDescription(
          `You can copy-paste any role list with category titles and emojis, and Hinata will automatically:\n` +
          `• Detect category groups\n` +
          `• Assign matching HEX colors automatically (or custom \`#HEX\` in brackets)\n` +
          `• Enable Hoisting for staff/ranks and Ping permissions for notification roles!\n\n` +
          `**Example Format (Copy & Customize):**\n\`\`\`text\n${sampleFormat}\n\`\`\``
        )
        .addFields({
          name: '🚀 How to use:',
          value: 'Run `/role-builder create` to open a popup paste box or pass `roles_text` directly!'
        })
        .setFooter({ text: 'Hinata Automatic Role Builder' });

      return interaction.reply({ embeds: [embed] });
    }

    if (subcommand === 'create') {
      const textInput = interaction.options.getString('roles_text');
      const attachment = interaction.options.getAttachment('file');

      // Case A: Open Modal popup if no arguments passed
      if (!textInput && !attachment) {
        const modal = new ModalBuilder()
          .setCustomId('role_builder_modal')
          .setTitle('👑 Paste Your Role List');

        const input = new TextInputBuilder()
          .setCustomId('role_builder_input')
          .setLabel('Paste Categories & Role Names:')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('👑 STAFF ROLES\n👑 Owner\n🛡️ Admin\n\n🔔 PING ROLES\n📢 Announcement Ping\n🎁 Giveaway Ping')
          .setRequired(true)
          .setMaxLength(4000);

        const row = new ActionRowBuilder().addComponents(input);
        modal.addComponents(row);

        return interaction.showModal(modal);
      }

      // Case B: Direct input or attachment
      await interaction.deferReply();

      let rawContent = textInput || '';
      if (attachment) {
        try {
          const res = await fetch(attachment.url);
          rawContent = await res.text();
        } catch (e) {
          return interaction.editReply({
            embeds: [EmbedUtils.error('Download Failed', `Could not download file: \`${e.message}\``)]
          });
        }
      }

      const parseResult = RoleParser.parse(rawContent);
      if (!parseResult.success) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Invalid Role List', parseResult.error || 'Could not parse roles.')]
        });
      }

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(`👑 Role Builder Preview (${parseResult.totalRoles} Roles Found)`)
        .setDescription('Review the role structure below. Click **Yes, Create All Roles** to begin!');

      for (const group of parseResult.groups.slice(0, 5)) {
        const rolesText = group.roles.map(r => `• \`${r.name}\` (${r.color}${r.hoist ? ', Hoisted' : ''})`).join('\n');
        embed.addFields({
          name: `${group.category} (${group.roles.length})`,
          value: rolesText.slice(0, 1024),
          inline: false
        });
      }

      if (parseResult.groups.length > 5) {
        embed.setFooter({ text: `...and ${parseResult.groups.length - 5} more categories` });
      }

      const confirmBtn = new ButtonBuilder()
        .setCustomId('confirm_role_builder')
        .setLabel(`Yes, Create ${parseResult.totalRoles} Roles!`)
        .setStyle(ButtonStyle.Success)
        .setEmoji('🚀');

      const cancelBtn = new ButtonBuilder()
        .setCustomId('cancel_role_builder')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('✖️');

      const row = new ActionRowBuilder().addComponents(confirmBtn, cancelBtn);

      const promptMsg = await interaction.editReply({
        embeds: [embed],
        components: [row]
      });

      const collector = promptMsg.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 60000,
        max: 1
      });

      collector.on('collect', async i => {
        if (i.customId === 'cancel_role_builder') {
          return i.update({
            embeds: [EmbedUtils.info('Cancelled', 'Role creation cancelled.')],
            components: []
          });
        }

        await i.deferUpdate();

        const guild = interaction.guild;
        const createdRoles = [];
        const existingRoles = [];
        const failedRoles = [];

        let currentIdx = 0;
        const allRolesFlat = parseResult.groups.flatMap(g => g.roles);

        for (const rDef of allRolesFlat) {
          currentIdx++;
          let existing = guild.roles.cache.find(r => r.name.toLowerCase() === rDef.name.toLowerCase());
          if (existing) {
            existingRoles.push(existing);
          } else {
            try {
              const newRole = await guild.roles.create({
                name: rDef.name,
                color: rDef.color,
                hoist: rDef.hoist,
                mentionable: rDef.mentionable,
                reason: `Hinata Bulk Role Builder by ${interaction.user.tag}`
              });
              createdRoles.push(newRole);
            } catch (e) {
              console.error(`Failed to create role ${rDef.name}:`, e);
              failedRoles.push(rDef.name);
            }
          }

          if (currentIdx % 5 === 0 || currentIdx === allRolesFlat.length) {
            const percent = Math.round((currentIdx / allRolesFlat.length) * 100);
            const progressEmbed = new EmbedBuilder()
              .setColor(config.embedColors.primary)
              .setTitle('👑 Creating Roles...')
              .setDescription(`Progress: **${currentIdx} / ${allRolesFlat.length}** (\`${percent}%\`)\nCreating: \`${rDef.name}\``);
            await i.editReply({ embeds: [progressEmbed], components: [] }).catch(() => null);
          }

          await sleep(350);
        }

        const successEmbed = new EmbedBuilder()
          .setColor(config.embedColors.success)
          .setTitle('🎉 Bulk Roles Creation Complete!')
          .setDescription(
            `Successfully processed **${allRolesFlat.length}** roles!\n\n` +
            `• ✅ **Created Fresh:** \`${createdRoles.length} Roles\`\n` +
            `• ℹ️ **Already Existed:** \`${existingRoles.length} Roles\`\n` +
            (failedRoles.length > 0 ? `• ⚠️ **Failed (Check Permissions):** \`${failedRoles.length}\`\n` : '') +
            `\n*All roles are now ready in your server settings!*`
          )
          .setFooter({ text: 'Hinata Role Builder • Server Ready' })
          .setTimestamp();

        return i.editReply({ embeds: [successEmbed], components: [] });
      });
    }
  }
};
