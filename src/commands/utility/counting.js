const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  ChannelType 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counting')
    .setDescription('🔢 Next-Gen Server Counting Game with Streaks & Leaderboards')
    .addSubcommand(sub =>
      sub
        .setName('setup')
        .setDescription('⚙️ Setup the dedicated counting channel for your server')
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Select the channel for the counting game')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('stats')
        .setDescription('📊 View current count, high-score streak, and server counting stats')
    )
    .addSubcommand(sub =>
      sub
        .setName('leaderboard')
        .setDescription('🏆 Show the top 10 best counters in this server')
    )
    .addSubcommand(sub =>
      sub
        .setName('reset')
        .setDescription('🔄 Reset the current count back to 0 or a custom number (Admin Only)')
        .addIntegerOption(opt =>
          opt
            .setName('number')
            .setDescription('Number to reset the count to (default: 0)')
            .setRequired(false)
            .setMinValue(0)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('disable')
        .setDescription('❌ Disable the counting game in this server (Admin Only)')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const counting = DatabaseManager.getCounting(guild.id);

    // 1. SETUP COUNTING CHANNEL
    if (subcommand === 'setup') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Permission Denied', 'You need **Manage Server** or **Administrator** permissions to set up the counting game.')],
          ephemeral: true
        });
      }

      const channel = interaction.options.getChannel('channel');
      const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
      const perms = channel.permissionsFor(botMember);

      if (!perms || !perms.has(['ViewChannel', 'SendMessages', 'AddReactions', 'ReadMessageHistory'])) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Missing Permissions', `The bot needs **View Channel**, **Send Messages**, **Add Reactions**, and **Read Message History** in <#${channel.id}>.`)],
          ephemeral: true
        });
      }

      DatabaseManager.setCounting(guild.id, { channelId: channel.id });

      const embed = new EmbedBuilder()
        .setTitle('🔢 Counting Game Initialized!')
        .setDescription(
          `The counting game is now active in <#${channel.id}>!\n\n` +
          `**📜 How to Play:**\n` +
          `• Start by typing **1** (or continue from current count **${counting.currentCount}**).\n` +
          `• Each message must be exactly the next number.\n` +
          `• **Anti-Double Count:** The same player cannot count two numbers in a row!\n` +
          `• Math expressions like \`2+2\` or \`5*10\` are supported!\n` +
          `• If someone enters the wrong number, the streak resets to **0**!\n\n` +
          `🏆 **All-Time Record:** **${counting.highScore || 0}**`
        )
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: 'Hinata Next-Gen Counting Engine' })
        .setTimestamp();

      await channel.send({ embeds: [embed] }).catch(() => null);

      return interaction.reply({
        embeds: [EmbedUtils.success('Counting Channel Set', `✅ Successfully configured <#${channel.id}> as the counting game channel!`)]
      });
    }

    // 2. VIEW STATS
    if (subcommand === 'stats') {
      if (!counting.channelId) {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Counting Not Configured', 'The counting game has not been set up yet! Use `/counting setup <channel>` to start.')],
          ephemeral: true
        });
      }

      const nextNumber = (counting.currentCount || 0) + 1;
      const lastCounterText = counting.lastUserId ? `<@${counting.lastUserId}>` : '*None yet*';
      const recordDate = counting.highScoreDate ? `<t:${Math.floor(new Date(counting.highScoreDate).getTime() / 1000)}:R>` : '*N/A*';

      // User's own stats
      const userStat = counting.userStats?.[interaction.user.id] || { counts: 0, fails: 0 };
      const accuracy = (userStat.counts + userStat.fails) > 0 
        ? Math.round((userStat.counts / (userStat.counts + userStat.fails)) * 100) 
        : 100;

      const embed = new EmbedBuilder()
        .setTitle(`🔢 ${guild.name} • Counting Game Stats`)
        .setColor(config.embedColors?.info || '#00D26A')
        .addFields(
          { name: '📍 Game Channel', value: `<#${counting.channelId}>`, inline: true },
          { name: '🎯 Current Count', value: `\`${counting.currentCount || 0}\``, inline: true },
          { name: '⏭️ Next Number', value: `\`${nextNumber}\``, inline: true },
          { name: '👑 All-Time Record', value: `**${counting.highScore || 0}** (${recordDate})`, inline: true },
          { name: '👤 Last Counter', value: lastCounterText, inline: true },
          { name: '📈 Total Valid Counts', value: `\`${counting.totalCounts || 0}\``, inline: true },
          { 
            name: `👤 Your Contribution (${interaction.user.username})`, 
            value: `• **Valid Counts:** ${userStat.counts || 0}\n• **Ruined Streaks:** ${userStat.fails || 0}\n• **Accuracy:** ${accuracy}%`, 
            inline: false 
          }
        )
        .setFooter({ text: 'Hinata Counting Engine' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 3. LEADERBOARD
    if (subcommand === 'leaderboard') {
      const topCounters = DatabaseManager.getCountingLeaderboard(guild.id, 10);

      if (!topCounters || topCounters.length === 0) {
        return interaction.reply({
          embeds: [EmbedUtils.info('Leaderboard Empty', 'No one has counted yet in this server! Be the first in the counting channel.')],
          ephemeral: true
        });
      }

      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
      const lines = topCounters.map((entry, index) => {
        const medal = medals[index] || `\`#${index + 1}\``;
        const total = (entry.counts || 0) + (entry.fails || 0);
        const acc = total > 0 ? Math.round((entry.counts / total) * 100) : 100;
        return `${medal} <@${entry.userId}> — **${entry.counts}** counts (${acc}% accuracy${entry.fails > 0 ? ` • ${entry.fails} ruins` : ''})`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`🏆 ${guild.name} • Top Counters Leaderboard`)
        .setDescription(lines.join('\n\n'))
        .setColor(config.embedColors?.primary || '#5865F2')
        .setFooter({ text: `Current Streak: ${counting.currentCount || 0} • All-Time High: ${counting.highScore || 0}` })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 4. RESET COUNT (ADMIN ONLY)
    if (subcommand === 'reset') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Permission Denied', 'You need **Manage Server** or **Administrator** permissions to reset the counter.')],
          ephemeral: true
        });
      }

      const targetNum = interaction.options.getInteger('number') || 0;
      DatabaseManager.setCounting(guild.id, {
        currentCount: targetNum,
        lastUserId: null
      });

      if (counting.channelId) {
        const ch = guild.channels.cache.get(counting.channelId);
        if (ch) {
          ch.send({
            embeds: [
              new EmbedBuilder()
                .setTitle('🔄 Counter Reset by Administrator')
                .setDescription(`The count has been reset by <@${interaction.user.id}> to **${targetNum}**.\nThe next number is **${targetNum + 1}**!`)
                .setColor(config.embedColors?.warning || '#FEE75C')
            ]
          }).catch(() => null);
        }
      }

      return interaction.reply({
        embeds: [EmbedUtils.success('Counter Reset', `Counter has been manually reset to **${targetNum}**. Next number is **${targetNum + 1}**.`)]
      });
    }

    // 5. DISABLE COUNTING
    if (subcommand === 'disable') {
      if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
          embeds: [EmbedUtils.error('Permission Denied', 'You need **Manage Server** or **Administrator** permissions to disable the counting game.')],
          ephemeral: true
        });
      }

      DatabaseManager.setCounting(guild.id, { channelId: null });

      return interaction.reply({
        embeds: [EmbedUtils.success('Counting Game Disabled', 'The counting game has been disabled for this server.')]
      });
    }
  }
};
