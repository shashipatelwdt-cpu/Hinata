const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

/**
 * Visual Progress Bar generator
 */
function createProgressBar(value, max = 25, size = 12) {
  const percent = Math.min(Math.max(value / (max || 1), 0), 1);
  const filled = Math.round(percent * size);
  const empty = size - filled;
  return '🟩'.repeat(filled) + '⬛'.repeat(empty);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invites')
    .setDescription('📊 Check detailed invite stats, ranks, breakdown (Regular, Leaves, Fake) & leaderboards')
    .addSubcommand(sub =>
      sub
        .setName('check')
        .setDescription('🔍 View detailed invite card and stats breakdown for yourself or another member')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('Member to check invites for (defaults to you)')
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('leaderboard')
        .setDescription('🏆 Display the top inviters leaderboard in this server')
    )
    .addSubcommand(sub =>
      sub
        .setName('audit')
        .setDescription('🔎 Inspect who invited a specific member, code used & account status')
        .addUserOption(opt =>
          opt
            .setName('user')
            .setDescription('Member to audit')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    // 1. CHECK USER INVITES
    if (subcommand === 'check') {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      const targetMember = guild.members.cache.get(targetUser.id);
      const stats = DatabaseManager.getInvites(guild.id, targetUser.id);
      const rank = DatabaseManager.getUserInviteRank(guild.id, targetUser.id);

      const totalJoins = stats.regular + stats.leaves + stats.fake;
      const retentionRate = totalJoins > 0 ? Math.round((stats.regular / totalJoins) * 100) : 100;
      const progressBar = createProgressBar(stats.total, 20, 10);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.primary)
        .setAuthor({
          name: `${targetUser.username}'s Invite Profile`,
          iconURL: targetUser.displayAvatarURL({ dynamic: true })
        })
        .setTitle(`📊 Total Net Invites: ${stats.total.toLocaleString()}`)
        .setDescription(
          `**Progress:** \`${progressBar}\` **${stats.total}** / 20\n` +
          `**Server Rank:** ${rank ? `🏅 **#${rank}** on Leaderboard` : '*Unranked*'}\n` +
          `**Retention Rate:** **${retentionRate}%** active\n\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        )
        .addFields(
          {
            name: '✅ Regular Invites',
            value: `**${stats.regular}**\n*(Active real members)*`,
            inline: true
          },
          {
            name: '❌ Left Members',
            value: `**${stats.leaves}**\n*(Members who left)*`,
            inline: true
          },
          {
            name: '⚠️ Fake / Alt Accounts',
            value: `**${stats.fake}**\n*(Age < 3d or bots)*`,
            inline: true
          },
          {
            name: '🎁 Bonus Invites',
            value: `**${stats.bonus >= 0 ? '+' : ''}${stats.bonus}**\n*(Staff awarded)*`,
            inline: true
          },
          {
            name: '🧮 Calculation Formula',
            value: `\`Net = (Regular + Bonus) - (Leaves + Fake)\`\n\`${stats.total} = (${stats.regular} + ${stats.bonus}) - (${stats.leaves} + ${stats.fake})\``,
            inline: false
          }
        )
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .setFooter({ text: `Hinata Invite Tracker • Member ID: ${targetUser.id}` })
        .setTimestamp();

      const btnRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('btn_invites_top')
          .setLabel('View Server Leaderboard')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🏆')
      );

      return interaction.reply({
        embeds: [embed],
        components: [btnRow]
      });
    }

    // 2. LEADERBOARD
    if (subcommand === 'leaderboard') {
      const topInviters = DatabaseManager.getInviteLeaderboard(guild.id, 10);

      if (topInviters.length === 0) {
        return interaction.reply({
          embeds: [
            EmbedUtils.info(
              '🏆 Invite Leaderboard',
              'No invite activity recorded yet for this server!\nShare your server invite links to claim the top spot on the leaderboard.'
            )
          ]
        });
      }

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

      let leaderboardText = '';
      topInviters.forEach((entry, idx) => {
        const medal = medals[idx] || `\`#${idx + 1}\``;
        leaderboardText += `${medal} <@${entry.userId}> — **${entry.total}** invites\n` +
          `　└ *(✅ \`${entry.regular}\` regular | ❌ \`${entry.leaves}\` left | ⚠️ \`${entry.fake}\` fake | 🎁 \`${entry.bonus}\` bonus)*\n\n`;
      });

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.warning)
        .setAuthor({ name: `${guild.name} • Invite Leaderboard`, iconURL: guild.iconURL() })
        .setTitle('🏆 Top Server Inviters')
        .setDescription(leaderboardText)
        .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
        .setFooter({ text: `Hinata Invite Leaderboard • Top ${topInviters.length} Inviters` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 3. AUDIT / WHO INVITED
    if (subcommand === 'audit') {
      const targetUser = interaction.options.getUser('user');
      const targetMember = guild.members.cache.get(targetUser.id);
      const audit = DatabaseManager.getMemberInviter(guild.id, targetUser.id);

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.info)
        .setAuthor({ name: `Audit Profile: ${targetUser.username}`, iconURL: targetUser.displayAvatarURL({ dynamic: true }) })
        .setTitle(`🔎 Member Invite Investigation`)
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .setTimestamp();

      if (!audit) {
        embed.setDescription(
          `**Member:** <@${targetUser.id}> (\`${targetUser.tag}\`)\n\n` +
          `ℹ️ **No Invite Record Found.**\n` +
          `• Joined before the bot started tracking, OR\n` +
          `• Joined through Server Discovery / Widget / Integration.`
        );
      } else {
        const inviterText = audit.inviterId === 'VANITY_URL'
          ? '🌐 Server Vanity URL'
          : (audit.inviterId ? `<@${audit.inviterId}> (\`${audit.inviterId}\`)` : '❓ Unknown');

        const joinTime = audit.joinedAt ? `<t:${Math.floor(new Date(audit.joinedAt).getTime() / 1000)}:F> (<t:${Math.floor(new Date(audit.joinedAt).getTime() / 1000)}:R>)` : 'Unknown';

        embed.setDescription(
          `### 👤 Member Details\n` +
          `• **User:** <@${targetUser.id}> (\`${targetUser.tag}\`)\n` +
          `• **Account Created:** <t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>\n` +
          `• **Joined Server:** ${joinTime}\n\n` +
          `### 🔗 Invite Information\n` +
          `• **Invited By:** ${inviterText}\n` +
          `• **Invite Code:** \`${audit.code || 'None / Vanity'}\`\n` +
          `• **Account Status:** ${audit.isFake ? '⚠️ **Flagged as Fake / Alt Account (< 3 days old or Bot)**' : '✅ **Verified Real Member**'}`
        );
      }

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
