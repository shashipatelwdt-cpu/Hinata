const { PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');
const { DatabaseManager } = require('../../database/db');
const config = require('../../config.json');

const BUNDLE_TIERS = [
  {
    level: 5,
    name: '🥉 Level 5 | Active',
    color: '#CD7F32',
    hoist: false,
    permissions: [
      PermissionFlagsBits.EmbedLinks,
      PermissionFlagsBits.AttachFiles,
      PermissionFlagsBits.AddReactions,
      PermissionFlagsBits.UseExternalEmojis
    ],
    perks: 'Embed Links, File Attachments, Add Reactions & External Emojis'
  },
  {
    level: 10,
    name: '🥈 Level 10 | Regular',
    color: '#95A5A6',
    hoist: false,
    permissions: [
      PermissionFlagsBits.ChangeNickname,
      PermissionFlagsBits.UseExternalStickers,
      PermissionFlagsBits.UseVAD
    ],
    perks: 'Change Server Nickname, External Stickers & Voice Activity'
  },
  {
    level: 20,
    name: '🥇 Level 20 | Veteran',
    color: '#F1C40F',
    hoist: true,
    permissions: [
      PermissionFlagsBits.CreatePublicThreads,
      PermissionFlagsBits.SendMessagesInThreads,
      PermissionFlagsBits.PrioritySpeaker
    ],
    perks: 'Public Discussion Threads Creation & Priority Voice Speaker'
  },
  {
    level: 35,
    name: '💎 Level 35 | Elite',
    color: '#2ECC71',
    hoist: true,
    permissions: [
      PermissionFlagsBits.Stream,
      PermissionFlagsBits.UseSoundboard
    ],
    perks: 'Go Live / Screen Share (Stream in VC) & Voice Soundboard'
  },
  {
    level: 50,
    name: '👑 Level 50 | Champion',
    color: '#00D2FF',
    hoist: true,
    permissions: [
      PermissionFlagsBits.ManageThreads,
      PermissionFlagsBits.UseExternalSounds
    ],
    perks: 'Thread Management, External Sounds & Exclusive Hoist Ranking'
  }
];

async function applyLevelingBundle(guild) {
  // 1. Check or create dedicated #level-ups channel
  const channels = await guild.channels.fetch();
  let levelChannel = channels.find(c => c && c.name && (c.name.includes('level-up') || c.name === 'level-ups' || c.name === 'levels'));

  if (!levelChannel) {
    // Look for Welcome & Info category or Main Lounge
    const category = channels.find(c => c && c.type === ChannelType.GuildCategory && (c.name.includes('WELCOME') || c.name.includes('INFO') || c.name.includes('MAIN')));
    
    const botMember = guild.members.me || await guild.members.fetchMe();

    levelChannel = await guild.channels.create({
      name: '🏆・level-ups',
      type: ChannelType.GuildText,
      parent: category ? category.id : undefined,
      topic: 'Official server level up announcements and milestone unlocks! Chat actively to earn XP and rewards.',
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AddReactions],
          deny: [PermissionFlagsBits.SendMessages]
        },
        {
          id: botMember.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AttachFiles]
        }
      ],
      reason: 'Arcane Leveling Bundle Auto-Setup'
    });
  }

  // 2. Create or find roles with permissions
  const existingRoles = await guild.roles.fetch();
  const createdRoles = [];

  for (const tier of BUNDLE_TIERS) {
    let role = existingRoles.find(r => r.name === tier.name || r.name.toLowerCase() === tier.name.toLowerCase());
    if (!role) {
      role = await guild.roles.create({
        name: tier.name,
        color: tier.color,
        hoist: tier.hoist,
        permissions: tier.permissions,
        reason: `Leveling Reward Role for Level ${tier.level}`
      });
    }

    // Register role reward in database
    DatabaseManager.addLevelRoleReward(guild.id, tier.level, role.id);
    createdRoles.push({ tier, role });
  }

  // 3. Configure leveling engine to send announcements to this dedicated channel
  DatabaseManager.setLevelConfig(guild.id, {
    enabled: true,
    channelType: 'custom',
    channelId: levelChannel.id,
    stackRoles: true,
    message: 'GG {user}, you just leveled up to **level {level}**!'
  });

  // 4. Post Roadmap Embed in the dedicated channel
  const roadmapEmbed = new EmbedBuilder()
    .setAuthor({ name: `${guild.name} • Level Milestones & Perks`, iconURL: guild.iconURL() || undefined })
    .setTitle('🏆 Server Leveling Engine & Automatic Role Perks')
    .setDescription(
      `Welcome to <#${levelChannel.id}>! All level-up notifications will be announced here.\n\n` +
      `Chat actively in any text channel to earn **1 XP per word** and automatically unlock exclusive server roles and permissions!\n\n` +
      createdRoles.map(cr => `⭐ **Level ${cr.tier.level}** ➔ <@&${cr.role.id}>\n> 🔓 **Unlocked Perks:** *${cr.tier.perks}*`).join('\n\n') +
      `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `• Use \`/rank\` to view your level, XP progress bar, and server ranking.\n` +
      `• Use \`/leaderboard\` or \`/levels leaderboard\` to see the top active chatters in the server!`
    )
    .setColor('#FEE75C')
    .setFooter({ text: 'Leveling System • 1 XP Per Word • Role Rewards' })
    .setTimestamp();

  await levelChannel.send({ embeds: [roadmapEmbed] }).catch(() => null);

  return {
    channel: levelChannel,
    roles: createdRoles
  };
}

module.exports = {
  BUNDLE_TIERS,
  applyLevelingBundle
};
