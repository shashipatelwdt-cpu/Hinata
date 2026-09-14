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
const TimeUtils = require('../../utils/time');
const config = require('../../../config.json');

// Category metadata: names, emojis, and descriptions
const HONOR_CATEGORIES = {
  friendly: {
    name: 'Friendly & Tilt-Proof',
    emoji: '🤝',
    description: 'Great sportsmanship, positive attitude, and enjoyable teammate.'
  },
  shotcaller: {
    name: 'Shotcaller & Leader',
    emoji: '🎯',
    description: 'Excellent communication, smart strategic calls, and game coordination.'
  },
  helpful: {
    name: 'Helpful & Mentor',
    emoji: '💡',
    description: 'Patient teacher, guided new players, and assisted community members.'
  },
  mvp: {
    name: 'Clutch & MVP Player',
    emoji: '⚡',
    description: 'Exceptional skill, tournament heroics, and clutch round performances.'
  }
};

const HONOR_TITLES = {
  1: { title: 'Recruit', badge: '⚪', color: '#95A5A6', roleDefaultName: 'Recruit Member' },
  2: { title: 'Respected', badge: '🎖️', color: '#2ECC71', roleDefaultName: 'Respected Member' },
  3: { title: 'Honorable', badge: '🌟', color: '#3498DB', roleDefaultName: 'Honorable Member' },
  4: { title: 'Distinguished', badge: '💎', color: '#9B59B6', roleDefaultName: 'Distinguished Pillar' },
  5: { title: 'Radiant Paragon', badge: '👑', color: '#F1C40F', roleDefaultName: 'Radiant Community Paragon' }
};

function generateProgressBar(current, target, length = 10) {
  if (target <= 0) return '`[██████████] 100%`';
  const ratio = Math.min(Math.max(current / target, 0), 1);
  const filled = Math.round(ratio * length);
  const bar = '█'.repeat(filled) + '░'.repeat(length - filled);
  const percent = Math.round(ratio * 100);
  return `\`[${bar}] ${percent}%\``;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('honor')
    .setDescription('🎖️ Commend honorable teammates, level up reputation & unlock exclusive roles')
    // 1. GIVE HONOR
    .addSubcommand(sub =>
      sub
        .setName('give')
        .setDescription('Commend and give Honor to a teammate or community member')
        .addUserOption(opt => opt.setName('user').setDescription('The member you want to honor').setRequired(true))
        .addStringOption(opt =>
          opt
            .setName('category')
            .setDescription('Reason/category of honor')
            .setRequired(true)
            .addChoices(
              { name: '🤝 Friendly / Sportsmanship', value: 'friendly' },
              { name: '🎯 Shotcaller / Leadership', value: 'shotcaller' },
              { name: '💡 Helpful / Community Guide', value: 'helpful' },
              { name: '⚡ Clutch / MVP Performer', value: 'mvp' }
            )
        )
        .addStringOption(opt => opt.setName('reason').setDescription('Optional commendation message').setRequired(false))
    )
    // 2. PROFILE
    .addSubcommand(sub =>
      sub
        .setName('profile')
        .setDescription('View your or another member\'s Honor level, progress, and badges')
        .addUserOption(opt => opt.setName('user').setDescription('Member to inspect (defaults to you)').setRequired(false))
    )
    // 3. LEADERBOARD
    .addSubcommand(sub =>
      sub
        .setName('leaderboard')
        .setDescription('Display the Top 10 most respected and honorable members')
    )
    // 4. SETUP (ADMIN)
    .addSubcommand(sub =>
      sub
        .setName('setup')
        .setDescription('⚙️ Configure Honor role rewards and announcement channel')
        .addBooleanOption(opt => opt.setName('enabled').setDescription('Enable or disable the Honor system').setRequired(false))
        .addChannelOption(opt => opt.setName('channel').setDescription('Channel where level up promotions will be announced').setRequired(false))
        .addBooleanOption(opt => opt.setName('auto_create_roles').setDescription('Automatically create and bind official Honor 2, 3, 4, 5 roles?').setRequired(false))
        .addRoleOption(opt => opt.setName('level_2_role').setDescription('Role for Honor Level 2 (10 points)').setRequired(false))
        .addRoleOption(opt => opt.setName('level_3_role').setDescription('Role for Honor Level 3 (25 points)').setRequired(false))
        .addRoleOption(opt => opt.setName('level_4_role').setDescription('Role for Honor Level 4 (50 points)').setRequired(false))
        .addRoleOption(opt => opt.setName('level_5_role').setDescription('Role for Honor Level 5 (100 points)').setRequired(false))
        .addBooleanOption(opt => opt.setName('stack_roles').setDescription('Stack roles as members level up? (Default: True)').setRequired(false))
    )
    // 5. RESET (ADMIN)
    .addSubcommand(sub =>
      sub
        .setName('reset')
        .setDescription('Reset a member\'s Honor points and level')
        .addUserOption(opt => opt.setName('user').setDescription('The member to reset').setRequired(true))
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const honorConfig = DatabaseManager.getHonorConfig(guild.id);

    // ==========================================
    // 1. GIVE HONOR
    // ==========================================
    if (subcommand === 'give') {
      if (honorConfig.enabled === false) {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Honor System Disabled', 'The Honor and Reputation system is currently disabled on this server.')],
          ephemeral: true
        });
      }

      const targetUser = interaction.options.getUser('user');
      const category = interaction.options.getString('category');
      const reason = interaction.options.getString('reason') || null;

      if (targetUser.id === interaction.user.id) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Action Not Allowed', 'You cannot give Honor to yourself! Earn Honor from your teammates.')],
          ephemeral: true
        });
      }

      if (targetUser.bot) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Action Not Allowed', 'Bots cannot receive Honor.')],
          ephemeral: true
        });
      }

      const targetMember = guild.members.cache.get(targetUser.id) || await guild.members.fetch(targetUser.id).catch(() => null);
      if (!targetMember) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Member Not Found', 'The specified user is not in this server.')],
          ephemeral: true
        });
      }

      const result = DatabaseManager.addHonor(guild.id, targetUser.id, interaction.user.id, category, reason);

      if (!result.success) {
        if (result.error === 'NO_TOKENS') {
          const resetTimeStr = `<t:${Math.floor((Date.now() + result.resetInMs) / 1000)}:R>`;
          return interaction.reply({
            embeds: [
              EmbedUtils.warning(
                'No Honor Tokens Remaining',
                `You have already used all **3 daily Honor tokens** today!\nYour tokens will replenish ${resetTimeStr}.`
              )
            ],
            ephemeral: true
          });
        }

        if (result.error === 'USER_COOLDOWN') {
          const cooldownTimeStr = `<t:${Math.floor((Date.now() + result.resetInMs) / 1000)}:R>`;
          return interaction.reply({
            embeds: [
              EmbedUtils.warning(
                'Cooldown Active',
                `You have already honored **${targetUser.username}** recently!\nYou can honor them again ${cooldownTimeStr}.`
              )
            ],
            ephemeral: true
          });
        }

        return interaction.reply({
          embeds: [EmbedUtils.error('Honor Failed', 'Could not record honor commendation.')],
          ephemeral: true
        });
      }

      const catInfo = HONOR_CATEGORIES[category] || HONOR_CATEGORIES.friendly;
      const targetMeta = HONOR_TITLES[result.level] || HONOR_TITLES[1];

      // Build Commendation Confirmation Embed
      const successEmbed = new EmbedBuilder()
        .setColor(targetMeta.color)
        .setTitle(`${catInfo.emoji} Honor Commendation Sent!`)
        .setDescription(
          `**${interaction.user.username}** commended **${targetUser}** for **${catInfo.name}**!\n` +
          (reason ? `> *"${reason}"*\n\n` : '\n') +
          `• **Category:** ${catInfo.emoji} \`${catInfo.name}\`\n` +
          `• **Total Honor:** \`${result.points}\` Points (${targetMeta.badge} Level ${result.level} - **${targetMeta.title}**)\n` +
          `• **Tokens Left Today:** \`${result.tokensLeft}/3\``
        )
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: 'Play with honor • Earn community respect' })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

      // Handle Level Up & Automated Role Granting
      if (result.leveledUp) {
        const newLevel = result.level;
        const rewardRoleId = honorConfig.roles?.[String(newLevel)];
        let unlockedRole = null;

        if (rewardRoleId) {
          const rewardRole = guild.roles.cache.get(rewardRoleId) || await guild.roles.fetch(rewardRoleId).catch(() => null);
          if (rewardRole) {
            const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
            if (botMember && botMember.permissions.has(PermissionFlagsBits.ManageRoles) && botMember.roles.highest.position > rewardRole.position) {
              await targetMember.roles.add(rewardRole, `Honor Level Up to Level ${newLevel}`).catch(() => null);
              unlockedRole = rewardRole;

              // If unstacking roles: remove lower honor tier roles
              if (honorConfig.stackRoles === false) {
                for (const [lvlStr, prevRoleId] of Object.entries(honorConfig.roles)) {
                  const prevLvl = parseInt(lvlStr, 10);
                  if (prevLvl < newLevel && prevRoleId !== rewardRoleId && targetMember.roles.cache.has(prevRoleId)) {
                    await targetMember.roles.remove(prevRoleId, 'Honor unstacking role progression').catch(() => null);
                  }
                }
              }
            }
          }
        }

        const promoMeta = HONOR_TITLES[newLevel] || HONOR_TITLES[5];
        const roleText = unlockedRole ? `\n🎉 **Unlocked Role:** <@&${unlockedRole.id}>!` : '';

        const promoEmbed = new EmbedBuilder()
          .setColor(promoMeta.color)
          .setTitle(`👑 HONOR PROMOTION: LEVEL ${newLevel}!`)
          .setDescription(
            `🌟 Outstanding sportsmanship! ${targetUser} has ascended to **Honor Level ${newLevel} (${promoMeta.title})**!${roleText}\n\n` +
            `Thank you for being a pillar of respect and positive gameplay in **${guild.name}**!`
          )
          .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
          .setFooter({ text: `${guild.name} • Honor System`, iconURL: guild.iconURL() || undefined })
          .setTimestamp();

        // Dispatch promotion announcement
        const promoChannel = honorConfig.channelId
          ? guild.channels.cache.get(honorConfig.channelId) || await guild.channels.fetch(honorConfig.channelId).catch(() => null)
          : interaction.channel;

        if (promoChannel && promoChannel.isTextBased()) {
          await promoChannel.send({ content: `${targetUser}`, embeds: [promoEmbed] }).catch(() => null);
        }
      }
      return;
    }

    // ==========================================
    // 2. HONOR PROFILE
    // ==========================================
    if (subcommand === 'profile') {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const targetMember = guild.members.cache.get(targetUser.id) || await guild.members.fetch(targetUser.id).catch(() => null);
      const userData = DatabaseManager.getHonorUser(guild.id, targetUser.id);
      const level = userData.level || 1;
      const points = userData.points || 0;
      const levelMeta = HONOR_TITLES[level] || HONOR_TITLES[1];
      const nextTier = DatabaseManager.getHonorPointsForNextLevel(level);

      const neededPoints = nextTier.nextTierReq - points;
      const currentTierPoints = points - nextTier.currentTierBase;
      const tierTarget = nextTier.nextTierReq - nextTier.currentTierBase;
      const progressBar = level < 5
        ? `${generateProgressBar(currentTierPoints, tierTarget)}\n\`${points}/${nextTier.nextTierReq} Points\` (*${neededPoints} points to Level ${nextTier.nextLevel}*)`
        : '`[██████████] 100%`\n👑 **Maximum Honor Tier Achieved!**';

      const rank = DatabaseManager.getUserHonorRank(guild.id, targetUser.id);
      const rankStr = rank ? `#${rank}` : 'Unranked';

      const cats = userData.categories || { friendly: 0, shotcaller: 0, helpful: 0, mvp: 0 };
      const tokensLeft = userData.tokensRemaining ?? 3;
      const roleAssignedId = honorConfig.roles?.[String(level)];
      const roleDisplay = roleAssignedId ? `<@&${roleAssignedId}>` : `\`${levelMeta.roleDefaultName}\``;

      const profileEmbed = new EmbedBuilder()
        .setColor(levelMeta.color)
        .setTitle(`${levelMeta.badge} Honor Profile • ${targetUser.username}`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .setDescription(
          `**Honor Status:** ${levelMeta.badge} **Level ${level} — ${levelMeta.title}**\n` +
          `**Current Role:** ${roleDisplay}\n` +
          `**Server Honor Rank:** \`${rankStr}\`\n\n` +
          `### 📈 Progress to Next Honor Tier\n${progressBar}`
        )
        .addFields(
          {
            name: '🤝 Friendly / Sportsmanship',
            value: `\`${cats.friendly || 0}\` Commendations`,
            inline: true
          },
          {
            name: '🎯 Shotcaller / Leadership',
            value: `\`${cats.shotcaller || 0}\` Commendations`,
            inline: true
          },
          {
            name: '💡 Helpful / Mentor',
            value: `\`${cats.helpful || 0}\` Commendations`,
            inline: true
          },
          {
            name: '⚡ Clutch / MVP',
            value: `\`${cats.mvp || 0}\` Commendations`,
            inline: true
          },
          {
            name: '🪙 Daily Tokens Left',
            value: `\`${tokensLeft}/3 Tokens\``,
            inline: true
          },
          {
            name: '🏆 Total Honor Points',
            value: `\`${points}\` Points`,
            inline: true
          }
        )
        .setFooter({ text: 'Earn commendations by playing clean, communicating, and helping teammates' })
        .setTimestamp();

      return interaction.reply({ embeds: [profileEmbed] });
    }

    // ==========================================
    // 3. HONOR LEADERBOARD
    // ==========================================
    if (subcommand === 'leaderboard') {
      const topList = DatabaseManager.getHonorLeaderboard(guild.id, 10);

      if (topList.length === 0) {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              'Honor Leaderboard Empty',
              'No members have received Honor commendations yet!\nUse `/honor give @member category:...` after your matches to commend teammates.'
            )
          ]
        });
      }

      const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

      const lines = topList.map((entry, idx) => {
        const medal = rankEmojis[idx] || `\`#${idx + 1}\``;
        const meta = HONOR_TITLES[entry.level] || HONOR_TITLES[1];
        const cats = entry.categories || {};
        const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'friendly';
        const topCatEmoji = HONOR_CATEGORIES[topCat]?.emoji || '🤝';

        return `${medal} <@${entry.userId}> • **Level ${entry.level}** (${meta.badge} ${meta.title})\n` +
               `> **${entry.points}** Total Honor Points • Top Trait: ${topCatEmoji} \`${HONOR_CATEGORIES[topCat]?.name || 'Friendly'}\``;
      });

      const lbEmbed = new EmbedBuilder()
        .setColor(config.embedColors.primary || '#5865F2')
        .setTitle(`👑 ${guild.name} • Top 10 Honorable Players`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setDescription(
          `The most respected, tilt-proof, and collaborative pillars of our community:\n\n` +
          lines.join('\n\n')
        )
        .setFooter({ text: 'Honor your teammates daily with /honor give' })
        .setTimestamp();

      return interaction.reply({ embeds: [lbEmbed] });
    }

    // ==========================================
    // 4. SETUP (ADMINISTRATOR ONLY)
    // ==========================================
    if (subcommand === 'setup') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Permission Denied', 'You must have **Administrator** permissions to configure the Honor system.')],
          ephemeral: true
        });
      }

      await interaction.deferReply();

      const enabledOption = interaction.options.getBoolean('enabled');
      const channelOption = interaction.options.getChannel('channel');
      const autoCreateRoles = interaction.options.getBoolean('auto_create_roles');
      const l2Role = interaction.options.getRole('level_2_role');
      const l3Role = interaction.options.getRole('level_3_role');
      const l4Role = interaction.options.getRole('level_4_role');
      const l5Role = interaction.options.getRole('level_5_role');
      const stackRoles = interaction.options.getBoolean('stack_roles');

      const updated = { ...honorConfig };

      if (typeof enabledOption === 'boolean') updated.enabled = enabledOption;
      if (channelOption) updated.channelId = channelOption.id;
      if (typeof stackRoles === 'boolean') updated.stackRoles = stackRoles;

      if (!updated.roles) updated.roles = {};

      if (l2Role) updated.roles['2'] = l2Role.id;
      if (l3Role) updated.roles['3'] = l3Role.id;
      if (l4Role) updated.roles['4'] = l4Role.id;
      if (l5Role) updated.roles['5'] = l5Role.id;

      // Auto-create official Honor roles if requested
      const createdNames = [];
      if (autoCreateRoles) {
        const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
        if (botMember && botMember.permissions.has(PermissionFlagsBits.ManageRoles)) {
          const rolesToCreate = [
            { level: '2', name: '🎖️ Respected Member', color: '#2ECC71' },
            { level: '3', name: '🌟 Honorable Member', color: '#3498DB' },
            { level: '4', name: '💎 Distinguished Pillar', color: '#9B59B6' },
            { level: '5', name: '👑 Radiant Paragon', color: '#F1C40F' }
          ];

          for (const def of rolesToCreate) {
            // Check if role already exists in server
            let existingRole = guild.roles.cache.find(r => r.name === def.name);
            if (!existingRole) {
              existingRole = await guild.roles.create({
                name: def.name,
                color: def.color,
                hoist: true,
                mentionable: false,
                reason: 'Hinata Honor System Auto-Role Creation'
              }).catch(() => null);
            }
            if (existingRole) {
              updated.roles[def.level] = existingRole.id;
              createdNames.push(`<@&${existingRole.id}>`);
            }
          }
        }
      }

      DatabaseManager.setHonorConfig(guild.id, updated);

      const r2Text = updated.roles?.['2'] ? `<@&${updated.roles['2']}>` : '❌ Not Set';
      const r3Text = updated.roles?.['3'] ? `<@&${updated.roles['3']}>` : '❌ Not Set';
      const r4Text = updated.roles?.['4'] ? `<@&${updated.roles['4']}>` : '❌ Not Set';
      const r5Text = updated.roles?.['5'] ? `<@&${updated.roles['5']}>` : '❌ Not Set';
      const chText = updated.channelId ? `<#${updated.channelId}>` : 'Current Channel (Default)';

      const setupEmbed = new EmbedBuilder()
        .setColor(config.embedColors.success || '#57F287')
        .setTitle('⚙️ Honor & Reputation System Configured')
        .setDescription(
          `The Honor progression engine is now **${updated.enabled ? 'ACTIVE ✅' : 'DISABLED ❌'}**.\n\n` +
          `### 🎭 Active Level Reward Roles:\n` +
          `• **Honor Level 2 (10 pts):** ${r2Text}\n` +
          `• **Honor Level 3 (25 pts):** ${r3Text}\n` +
          `• **Honor Level 4 (50 pts):** ${r4Text}\n` +
          `• **Honor Level 5 (100 pts):** ${r5Text}\n\n` +
          `### 📢 Announcement Channel:\n${chText}\n\n` +
          (createdNames.length > 0 ? `✨ **Auto-Created Roles:** ${createdNames.join(', ')}\n` : '') +
          `*Members can now earn commendations and automatically unlock these roles!*`
        )
        .setFooter({ text: 'Hinata Honor Engine' })
        .setTimestamp();

      return interaction.editReply({ embeds: [setupEmbed] });
    }

    // ==========================================
    // 5. RESET USER (ADMINISTRATOR ONLY)
    // ==========================================
    if (subcommand === 'reset') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Permission Denied', 'You must have **Administrator** permissions to reset Honor.')],
          ephemeral: true
        });
      }

      const targetUser = interaction.options.getUser('user');
      DatabaseManager.resetHonorUser(guild.id, targetUser.id);

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'Honor Points Reset',
            `Successfully reset all Honor points, commendations, and levels for **${targetUser.tag}**.`
          )
        ]
      });
    }
  }
};
