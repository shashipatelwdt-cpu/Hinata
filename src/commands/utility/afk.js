const { 
  SlashCommandBuilder, 
  EmbedBuilder, 
  PermissionFlagsBits 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('💤 Professional AFK System with Nickname Tags & Missed Mentions')
    .addSubcommand(sub =>
      sub
        .setName('set')
        .setDescription('💤 Set yourself as AFK with an optional reason')
        .addStringOption(opt =>
          opt
            .setName('reason')
            .setDescription('Reason for going AFK (e.g., studying, eating, sleeping, gym)')
            .setRequired(false)
            .setMaxLength(150)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('clear')
        .setDescription('👋 Manually remove your AFK status and restore your nickname')
    )
    .addSubcommand(sub =>
      sub
        .setName('list')
        .setDescription('📋 List all members currently marked as AFK in this server')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;
    const member = interaction.member;

    // 1. SET AFK
    if (subcommand === 'set') {
      const reason = interaction.options.getString('reason') || 'AFK (Away From Keyboard)';
      const oldNick = member.nickname || member.user.displayName || member.user.username;

      // Check if already AFK
      const existing = DatabaseManager.getAfk(guild.id, interaction.user.id);
      if (existing) {
        return interaction.reply({
          embeds: [EmbedUtils.warning('Already AFK', `You are already marked as AFK: **"${existing.reason}"**.\nSend a message in any channel or use \`/afk clear\` to remove it.`)],
          ephemeral: true
        });
      }

      // Try setting nickname to [AFK] Name if bot has permissions
      let nickChanged = false;
      const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
      if (botMember && botMember.permissions.has(PermissionFlagsBits.ManageNicknames)) {
        if (member.id !== guild.ownerId && botMember.roles.highest.position > member.roles.highest.position) {
          try {
            const cleanNick = oldNick.replace(/^\[AFK\]\s*/i, '');
            const newNick = `[AFK] ${cleanNick}`.slice(0, 32);
            await member.setNickname(newNick, 'User marked as AFK');
            nickChanged = true;
          } catch (e) {
            // Ignore permission / hierarchy errors
          }
        }
      }

      DatabaseManager.setAfk(guild.id, interaction.user.id, {
        reason,
        timestamp: Date.now(),
        oldNick: member.nickname || null // preserve null if they had no custom nickname
      });

      const embed = new EmbedBuilder()
        .setTitle('💤 You are now AFK')
        .setDescription(
          `**Status:** AFK\n` +
          `**Reason:** ${reason}\n\n` +
          `• I will automatically notify anyone who pings you in this server.\n` +
          `• I will track all your missed mentions while you are gone.\n` +
          `• Your AFK status will be automatically removed when you send a message.`
        )
        .setColor(config.embedColors?.info || '#5865F2')
        .setFooter({ text: nickChanged ? 'Nickname updated with [AFK] prefix' : 'Hinata AFK Engine' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    // 2. CLEAR AFK MANUALLY
    if (subcommand === 'clear') {
      const removed = DatabaseManager.removeAfk(guild.id, interaction.user.id);
      if (!removed) {
        return interaction.reply({
          embeds: [EmbedUtils.info('Not AFK', 'You are not currently marked as AFK.')],
          ephemeral: true
        });
      }

      // Restore nickname
      const botMember = guild.members.me || await guild.members.fetchMe().catch(() => null);
      if (botMember && botMember.permissions.has(PermissionFlagsBits.ManageNicknames)) {
        if (member.id !== guild.ownerId && botMember.roles.highest.position > member.roles.highest.position) {
          try {
            const restoredNick = removed.oldNick || null;
            await member.setNickname(restoredNick, 'AFK status cleared');
          } catch (e) {}
        }
      }

      const durationMs = Date.now() - (removed.timestamp || Date.now());
      const mins = Math.floor(durationMs / 60000);
      const timeStr = mins < 1 ? 'less than a minute' : `${mins} minute${mins === 1 ? '' : 's'}`;

      return interaction.reply({
        embeds: [
          EmbedUtils.success(
            'AFK Status Cleared',
            `Welcome back <@${interaction.user.id}>! Your AFK status has been removed.\nYou were away for **${timeStr}**.`
          )
        ]
      });
    }

    // 3. LIST ALL CURRENTLY AFK MEMBERS
    if (subcommand === 'list') {
      const afkList = DatabaseManager.getGuildAfks(guild.id);
      if (!afkList || afkList.length === 0) {
        return interaction.reply({
          embeds: [EmbedUtils.info('No AFK Members', 'There are currently no members marked as AFK in this server.')],
          ephemeral: true
        });
      }

      const lines = afkList.slice(0, 20).map(item => {
        const timeAgo = `<t:${Math.floor(item.timestamp / 1000)}:R>`;
        return `• <@${item.userId}> — **${item.reason}** (${timeAgo})`;
      });

      const embed = new EmbedBuilder()
        .setTitle(`💤 AFK Members in ${guild.name} (${afkList.length})`)
        .setDescription(lines.join('\n'))
        .setColor(config.embedColors?.neutral || '#2B2D31')
        .setFooter({ text: 'Hinata AFK Engine' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }
  }
};
