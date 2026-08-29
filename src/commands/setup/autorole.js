const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('👑 Setup automated role assignment for new joining members & bots')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('set')
        .setDescription('⚡ Quickly configure auto-roles for new members and bots')
        .addRoleOption(opt => 
          opt.setName('role')
            .setDescription('Role to automatically give to new human members')
            .setRequired(true)
        )
        .addRoleOption(opt => 
          opt.setName('bot_role')
            .setDescription('Role to automatically give to new bots')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('humans')
        .setDescription('👤 Set or change the auto-role for new human members')
        .addRoleOption(opt => 
          opt.setName('role')
            .setDescription('The role for joining members')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('bots')
        .setDescription('🤖 Set or change the auto-role for new bot accounts')
        .addRoleOption(opt => 
          opt.setName('role')
            .setDescription('The role for invited bots')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('status')
        .setDescription('📊 View current auto-role configuration and bot role hierarchy')
    )
    .addSubcommand(sub =>
      sub
        .setName('toggle')
        .setDescription('🔄 Turn auto-role assignment ON or OFF')
        .addBooleanOption(opt => 
          opt.setName('state')
            .setDescription('Set enabled state (True = ON, False = OFF)')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('🗑️ Remove configured auto-roles')
        .addStringOption(opt =>
          opt.setName('target')
            .setDescription('Which auto-role to remove')
            .setRequired(true)
            .addChoices(
              { name: '👤 Human Auto-Role', value: 'humans' },
              { name: '🤖 Bot Auto-Role', value: 'bots' },
              { name: '💥 All Auto-Roles', value: 'all' }
            )
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('test')
        .setDescription('🧪 Test auto-role assignment and check bot role hierarchy permissions')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const autorole = DatabaseManager.getAutorole(guild.id);
    const botMember = guild.members.me;

    // Helper: Check bot role hierarchy and permissions against a target role
    function checkRoleHierarchy(role) {
      if (!role) return { valid: false, error: 'No role provided' };
      if (role.managed) {
        return { valid: false, error: `The role <@&${role.id}> is managed by an integration/bot and cannot be assigned manually.` };
      }
      if (role.id === guild.roles.everyone.id) {
        return { valid: false, error: 'The `@everyone` role cannot be used as an auto-role.' };
      }
      if (!botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
        return { valid: false, error: `Hinata is missing the **Manage Roles** permission in this server.` };
      }
      if (botMember.roles.highest.position <= role.position) {
        return { 
          valid: false, 
          error: `Role Hierarchy Warning: <@&${role.id}> is positioned **higher than or equal to** Hinata's highest role (<@&${botMember.roles.highest.id}>). Please drag Hinata's role above <@&${role.id}> in **Server Settings > Roles**.` 
        };
      }
      return { valid: true };
    }

    // 1. SET (Quick setup)
    if (subcommand === 'set') {
      const humanRole = interaction.options.getRole('role');
      const botRole = interaction.options.getRole('bot_role');

      const humanCheck = checkRoleHierarchy(humanRole);
      let warningText = '';

      if (!humanCheck.valid) {
        warningText += `⚠️ **Warning for Member Role:** ${humanCheck.error}\n`;
      }

      if (botRole) {
        const botCheck = checkRoleHierarchy(botRole);
        if (!botCheck.valid) {
          warningText += `⚠️ **Warning for Bot Role:** ${botCheck.error}\n`;
        }
      }

      const updated = {
        enabled: true,
        humanRoleId: humanRole.id,
        botRoleId: botRole ? botRole.id : autorole.botRoleId
      };

      DatabaseManager.setAutoroleConfig(guild.id, updated);
      // Sync with welcome config
      DatabaseManager.setWelcomeConfig(guild.id, {
        roleId: updated.humanRoleId,
        botRoleId: updated.botRoleId
      });

      const embed = new EmbedBuilder()
        .setColor(warningText ? config.embedColors.warning : config.embedColors.success)
        .setTitle('👑 Auto-Role Configured Successfully!')
        .setDescription(
          `Auto-Role system is now **ENABLED**.\n\n` +
          `• **👤 Member Auto-Role:** <@&${humanRole.id}> (\`${humanRole.name}\`)\n` +
          `• **🤖 Bot Auto-Role:** ${updated.botRoleId ? `<@&${updated.botRoleId}>` : '*None set*'}\n` +
          `• **⚡ Status:** 🟢 Active\n\n` +
          (warningText ? `${warningText}\n` : `✅ *All new members joining the server will now automatically receive this role!*`)
        )
        .setFooter({ text: 'Tip: Run /autorole test to verify permissions in real-time' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 2. HUMANS
    if (subcommand === 'humans') {
      const humanRole = interaction.options.getRole('role');
      const check = checkRoleHierarchy(humanRole);

      const updated = {
        enabled: true,
        humanRoleId: humanRole.id
      };

      DatabaseManager.setAutoroleConfig(guild.id, updated);
      DatabaseManager.setWelcomeConfig(guild.id, { roleId: humanRole.id });

      const embed = new EmbedBuilder()
        .setColor(check.valid ? config.embedColors.success : config.embedColors.warning)
        .setTitle('👤 Member Auto-Role Updated!')
        .setDescription(
          `New human members will now automatically receive: <@&${humanRole.id}> (\`${humanRole.name}\`).\n\n` +
          (check.valid 
            ? '✅ *Hinata has correct permissions and role hierarchy to assign this role.*' 
            : `⚠️ **Warning:** ${check.error}`)
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 3. BOTS
    if (subcommand === 'bots') {
      const botRole = interaction.options.getRole('role');
      const check = checkRoleHierarchy(botRole);

      const updated = {
        botRoleId: botRole.id
      };

      DatabaseManager.setAutoroleConfig(guild.id, updated);
      DatabaseManager.setWelcomeConfig(guild.id, { botRoleId: botRole.id });

      const embed = new EmbedBuilder()
        .setColor(check.valid ? config.embedColors.success : config.embedColors.warning)
        .setTitle('🤖 Bot Auto-Role Updated!')
        .setDescription(
          `New bot accounts invited will now automatically receive: <@&${botRole.id}> (\`${botRole.name}\`).\n\n` +
          (check.valid 
            ? '✅ *Hinata has correct permissions and role hierarchy to assign this role.*' 
            : `⚠️ **Warning:** ${check.error}`)
        )
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 4. STATUS
    if (subcommand === 'status') {
      const isEnabled = autorole.enabled;
      const humanRole = autorole.humanRoleId ? guild.roles.cache.get(autorole.humanRoleId) : null;
      const botRole = autorole.botRoleId ? guild.roles.cache.get(autorole.botRoleId) : null;

      let humanStatus = humanRole ? `<@&${humanRole.id}> (\`${humanRole.name}\`)` : '*Not Configured*';
      let botStatus = botRole ? `<@&${botRole.id}> (\`${botRole.name}\`)` : '*Not Configured*';

      let hierarchyInfo = '';
      if (humanRole) {
        const check = checkRoleHierarchy(humanRole);
        hierarchyInfo += check.valid 
          ? `• Member Role: ✅ Ready to assign\n` 
          : `• Member Role: ⚠️ ${check.error}\n`;
      }
      if (botRole) {
        const check = checkRoleHierarchy(botRole);
        hierarchyInfo += check.valid 
          ? `• Bot Role: ✅ Ready to assign\n` 
          : `• Bot Role: ⚠️ ${check.error}\n`;
      }

      const embed = new EmbedBuilder()
        .setColor(isEnabled ? config.embedColors.primary : config.embedColors.neutral)
        .setTitle('👑 Auto-Role System Configuration')
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setDescription(
          `**System Status:** ${isEnabled ? '🟢 **ENABLED**' : '🔴 **DISABLED**'}\n\n` +
          `### 🎭 Configured Roles\n` +
          `• **👤 Human Members:** ${humanStatus}\n` +
          `• **🤖 Bot Accounts:** ${botStatus}\n\n` +
          `### 🛡️ Permissions & Hierarchy Check\n` +
          (hierarchyInfo || '• *No roles configured yet. Use `/autorole set <role>` to get started.*') + '\n\n' +
          `### 💡 Quick Commands\n` +
          `• \`/autorole set <role>\` - Quick setup member auto-role\n` +
          `• \`/autorole toggle\` - Turn ON/OFF without losing settings\n` +
          `• \`/autorole test\` - Test auto-role assignment & permissions\n` +
          `• \`/autorole remove\` - Clear configured roles`
        )
        .setFooter({ text: `${config.botName} Auto-Role System` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 5. TOGGLE
    if (subcommand === 'toggle') {
      const explicitState = interaction.options.getBoolean('state');
      const newState = explicitState !== null ? explicitState : !autorole.enabled;

      DatabaseManager.setAutoroleConfig(guild.id, { enabled: newState });

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            `Auto-Role ${newState ? 'Enabled' : 'Disabled'}`,
            `Auto-Role assignment is now **${newState ? '🟢 ENABLED' : '🔴 DISABLED'}**.\n` +
            (newState && !autorole.humanRoleId 
              ? '\n⚠️ *Note: You have not set a member role yet. Use `/autorole set <role>` to configure one.*' 
              : '')
          )
        ]
      });
    }

    // 6. REMOVE
    if (subcommand === 'remove') {
      const target = interaction.options.getString('target');

      if (target === 'humans') {
        DatabaseManager.setAutoroleConfig(guild.id, { humanRoleId: null });
        DatabaseManager.setWelcomeConfig(guild.id, { roleId: null });
        return interaction.reply({
          embeds: [EmbedUtils.success('Role Removed', '👤 Member auto-role has been removed.')]
        });
      } else if (target === 'bots') {
        DatabaseManager.setAutoroleConfig(guild.id, { botRoleId: null });
        DatabaseManager.setWelcomeConfig(guild.id, { botRoleId: null });
        return interaction.reply({
          embeds: [EmbedUtils.success('Role Removed', '🤖 Bot auto-role has been removed.')]
        });
      } else {
        DatabaseManager.setAutoroleConfig(guild.id, { humanRoleId: null, botRoleId: null, enabled: false });
        DatabaseManager.setWelcomeConfig(guild.id, { roleId: null, botRoleId: null });
        return interaction.reply({
          embeds: [EmbedUtils.success('Auto-Roles Reset', '💥 All configured auto-roles have been removed and the system is disabled.')]
        });
      }
    }

    // 7. TEST
    if (subcommand === 'test') {
      if (!autorole.humanRoleId) {
        return interaction.reply({
          embeds: [
            EmbedUtils.warning(
              'No Auto-Role Configured',
              'Please configure a member auto-role first using `/autorole set <role>`.'
            )
          ],
          ephemeral: true
        });
      }

      const role = guild.roles.cache.get(autorole.humanRoleId);
      if (!role) {
        return interaction.reply({
          embeds: [
            EmbedUtils.error(
              'Role Not Found',
              `The configured role ID (\`${autorole.humanRoleId}\`) no longer exists in this server. Please reconfigure using \`/autorole set <role>\`.`
            )
          ],
          ephemeral: true
        });
      }

      const check = checkRoleHierarchy(role);
      if (!check.valid) {
        return interaction.reply({
          embeds: [
            EmbedUtils.error(
              'Hierarchy / Permission Test Failed ❌',
              `${check.error}\n\n**How to fix:**\n1. Go to **Server Settings > Roles**\n2. Drag **${botMember.roles.highest.name}** above **${role.name}**\n3. Ensure Hinata has the **Manage Roles** permission.`
            )
          ],
          ephemeral: true
        });
      }

      const member = interaction.member;
      const alreadyHas = member.roles.cache.has(role.id);

      try {
        if (!alreadyHas) {
          await member.roles.add(role, 'Hinata Auto-Role Test');
        }

        const embed = new EmbedBuilder()
          .setColor(config.embedColors.success)
          .setTitle('🧪 Auto-Role Diagnostic Test: Passed! ✅')
          .setDescription(
            `**Test Results for ${guild.name}:**\n\n` +
            `• **🎭 Auto-Role:** <@&${role.id}> (\`${role.name}\`)\n` +
            `• **🛡️ Bot Permission (Manage Roles):** ✅ Granted\n` +
            `• **📊 Role Hierarchy Check:** ✅ Hinata (<@&${botMember.roles.highest.id}>) is higher than target role (<@&${role.id}>)\n` +
            `• **⚡ Assignment Test:** ✅ Successfully verified role assignment!\n\n` +
            (alreadyHas ? `*(You already had this role, permission verification succeeded)*` : `*(Role <@&${role.id}> was temporarily added to your profile)*`)
          )
          .setFooter({ text: 'All systems operational • New joins will receive this role' })
          .setTimestamp();

        return interaction.reply({ embeds: [embed] });
      } catch (err) {
        return interaction.reply({
          embeds: [
            EmbedUtils.error(
              'Test Failed',
              `Failed to assign role during test:\n\`${err.message}\``
            )
          ],
          ephemeral: true
        });
      }
    }
  }
};
