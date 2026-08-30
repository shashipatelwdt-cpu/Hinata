const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

const ROLE_PRESETS = {
  platforms: {
    title: '🎮 Gaming Platforms & Devices',
    description: 'Select the platforms you play on to find squadmates and teammates!',
    roles: [
      { name: 'PC Gamer', emoji: '💻', color: '#3498DB' },
      { name: 'PlayStation', emoji: '🎮', color: '#003791' },
      { name: 'Xbox', emoji: '🕹️', color: '#107C10' },
      { name: 'Nintendo Switch', emoji: '🔴', color: '#E60012' },
      { name: 'Mobile Gamer', emoji: '📱', color: '#F1C40F' }
    ]
  },
  notifications: {
    title: '🔔 Notification Preferences',
    description: 'Choose which server notifications and pings you want to receive:',
    roles: [
      { name: 'Announcement Ping', emoji: '📢', color: '#3498DB' },
      { name: 'Giveaway Ping', emoji: '🎁', color: '#E91E63' },
      { name: 'Event Ping', emoji: '🎉', color: '#9B59B6' },
      { name: 'Updates Ping', emoji: '⚡', color: '#2ECC71' }
    ]
  },
  colors: {
    title: '🎨 Pick Your Name Color',
    description: 'Customize your profile and username color in chat!',
    roles: [
      { name: 'Crimson Red', emoji: '🔴', color: '#E74C3C' },
      { name: 'Ocean Blue', emoji: '🔵', color: '#3498DB' },
      { name: 'Emerald Green', emoji: '🟢', color: '#2ECC71' },
      { name: 'Royal Purple', emoji: '🟣', color: '#9B59B6' },
      { name: 'Golden Yellow', emoji: '🟡', color: '#F1C40F' },
      { name: 'Rose Pink', emoji: '🌸', color: '#FD79A8' }
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('selfroles')
    .setDescription('🎭 Interactive Self-Roles and Dropdown Menu Roles')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('preset')
        .setDescription('🚀 Send a pre-configured self-role selection panel with auto-created roles')
        .addStringOption(opt =>
          opt.setName('type')
            .setDescription('Select the preset category')
            .setRequired(true)
            .addChoices(
              { name: '🎮 Gaming Platforms (PC, PS, Xbox, Switch, Mobile)', value: 'platforms' },
              { name: '🔔 Notification Pings (Announcements, Giveaways, Events)', value: 'notifications' },
              { name: '🎨 Name Colors (Red, Blue, Green, Purple, Gold, Pink)', value: 'colors' }
            )
        )
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send the panel in (defaults to current)').setRequired(false))
    )
    .addSubcommand(sub =>
      sub
        .setName('custom')
        .setDescription('🛠️ Create a custom dropdown self-role menu with your existing server roles')
        .addStringOption(opt => opt.setName('title').setDescription('Embed title (e.g., Select Your Roles)').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Embed description text').setRequired(true))
        .addRoleOption(opt => opt.setName('role1').setDescription('Role option 1').setRequired(true))
        .addRoleOption(opt => opt.setName('role2').setDescription('Role option 2').setRequired(false))
        .addRoleOption(opt => opt.setName('role3').setDescription('Role option 3').setRequired(false))
        .addRoleOption(opt => opt.setName('role4').setDescription('Role option 4').setRequired(false))
        .addRoleOption(opt => opt.setName('role5').setDescription('Role option 5').setRequired(false))
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel to post the menu in').setRequired(false))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (subcommand === 'preset') {
      const type = interaction.options.getString('type');
      const channel = interaction.options.getChannel('channel') || interaction.channel;
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true }).catch(() => null);
      }

      const preset = ROLE_PRESETS[type];
      if (!preset) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Invalid Preset', 'The requested self-roles preset does not exist.')]
        });
      }

      const resolvedRoles = [];

      for (const rDef of preset.roles) {
        let role = guild.roles.cache.find(r => r.name.toLowerCase() === rDef.name.toLowerCase());
        if (!role) {
          try {
            role = await guild.roles.create({
              name: rDef.name,
              color: rDef.color,
              reason: `Hinata Self-Roles Preset: ${type}`
            });
          } catch (e) {
            console.error(`Failed to auto-create role ${rDef.name}:`, e);
          }
        }
        if (role) {
          resolvedRoles.push({ roleId: role.id, name: rDef.name, emoji: rDef.emoji });
        }
      }

      if (resolvedRoles.length === 0) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Role Setup Failed', 'Could not create or find the preset roles. Please check bot permissions and role hierarchy position.')]
        });
      }

      // Save to database mapping
      const guildSettings = DatabaseManager.getGuild(guild.id);
      const selfroles = guildSettings.selfroles || {};
      const menuCustomId = `selfrole_menu_${type}_${Date.now()}`;
      selfroles[menuCustomId] = {
        type: type,
        roles: resolvedRoles.map(r => ({ id: r.roleId, name: r.name }))
      };
      DatabaseManager.setSelfRolesConfig(guild.id, selfroles);

      const menu = new StringSelectMenuBuilder()
        .setCustomId(menuCustomId)
        .setPlaceholder(`👉 Select your ${type} roles...`)
        .setMinValues(0)
        .setMaxValues(resolvedRoles.length);

      resolvedRoles.forEach(r => {
        menu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(r.name)
            .setValue(r.roleId)
            .setEmoji(r.emoji)
            .setDescription(`Click to toggle the ${r.name} role`)
        );
      });

      const row = new ActionRowBuilder().addComponents(menu);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(preset.title)
        .setDescription(`${preset.description}\n\n${resolvedRoles.map(r => `${r.emoji} **${r.name}** - <@&${r.roleId}>`).join('\n')}\n\n*Select or unselect roles from the dropdown below.*`)
        .setFooter({ text: 'Self-Roles • Instant toggle' })
        .setTimestamp();

      await channel.send({ embeds: [embed], components: [row] });

      return interaction.editReply({
        embeds: [EmbedUtils.success('Self-Roles Panel Created', `Successfully sent the **${preset.title}** panel to <#${channel.id}>.`)]
      });
    }

    if (subcommand === 'custom') {
      const title = interaction.options.getString('title');
      const description = interaction.options.getString('description');
      const channel = interaction.options.getChannel('channel') || interaction.channel;

      const roles = [];
      for (let i = 1; i <= 5; i++) {
        const r = interaction.options.getRole(`role${i}`);
        if (r) roles.push(r);
      }

      if (roles.length === 0) {
        return interaction.reply({
          embeds: [EmbedUtils.error('No Roles Provided', 'Please provide at least 1 role.')],
          ephemeral: true
        });
      }

      const menuCustomId = `selfrole_menu_custom_${Date.now()}`;
      const guildSettings = DatabaseManager.getGuild(guild.id);
      const selfroles = guildSettings.selfroles || {};
      selfroles[menuCustomId] = {
        type: 'custom',
        roles: roles.map(r => ({ id: r.id, name: r.name }))
      };
      DatabaseManager.setSelfRolesConfig(guild.id, selfroles);

      const menu = new StringSelectMenuBuilder()
        .setCustomId(menuCustomId)
        .setPlaceholder('👉 Choose your roles...')
        .setMinValues(0)
        .setMaxValues(roles.length);

      roles.forEach(r => {
        menu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(r.name)
            .setValue(r.id)
            .setDescription(`Toggle @${r.name}`)
        );
      });

      const row = new ActionRowBuilder().addComponents(menu);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setTitle(title)
        .setDescription(`${description}\n\n${roles.map(r => `• <@&${r.id}>`).join('\n')}\n\n*Choose your roles from the dropdown below.*`)
        .setFooter({ text: 'Self-Roles Menu' })
        .setTimestamp();

      await channel.send({ embeds: [embed], components: [row] });

      return interaction.reply({
        embeds: [EmbedUtils.success('Custom Menu Created', `Sent custom self-roles menu to <#${channel.id}>.`)],
        ephemeral: true
      });
    }
  }
};
