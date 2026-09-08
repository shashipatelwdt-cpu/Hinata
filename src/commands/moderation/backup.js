const { 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  EmbedBuilder, 
  AttachmentBuilder 
} = require('discord.js');
const { DatabaseManager } = require('../../../database/db');
const EmbedUtils = require('../../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('💾 Server & Bot Database Backup, Export, Restore & Cloud Status')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('export')
        .setDescription('📥 Download a complete snapshot of the database (JSON file)')
    )
    .addSubcommand(sub =>
      sub
        .setName('status')
        .setDescription('🌐 Check database persistence, Render safety & MongoDB Atlas connection')
    )
    .addSubcommand(sub =>
      sub
        .setName('restore')
        .setDescription('📤 Restore database from a previously exported backup file')
        .addAttachmentOption(opt =>
          opt
            .setName('file')
            .setDescription('Attach the database-backup.json file')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    // Only administrators can manage database backups
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        embeds: [EmbedUtils.error('Access Denied', 'You need **Administrator** permission to manage database backups.')],
        ephemeral: true
      });
    }

    const subcommand = interaction.options.getSubcommand();

    // 1. STATUS
    if (subcommand === 'status') {
      const status = DatabaseManager.getCloudStatus();
      const levelData = DatabaseManager.getLevelGuildData(interaction.guild.id);
      const totalRanked = Object.keys(levelData.users || {}).length;

      const embed = new EmbedBuilder()
        .setTitle('🌐 Database & Persistence Health')
        .setDescription(
          `**Storage Engine:** \`${status.provider}\`\n` +
          `**Cloud Connected:** ${status.connected ? '✅ Yes (MongoDB Atlas - 100% Safe on Render)' : '⚠️ No (Local File - Ephemeral on Render)'}\n` +
          (status.lastSync ? `**Last Cloud Sync:** <t:${Math.floor(new Date(status.lastSync).getTime() / 1000)}:R>\n` : '') +
          `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📊 **Current Server Stats:**\n` +
          `• Ranked Members: \`${totalRanked.toLocaleString()}\`\n` +
          `• Rate: \`1 XP Per Word\`\n\n` +
          (status.connected 
            ? '✨ **Good News:** Your user levels, XP, and settings are backed up in MongoDB Atlas and will NEVER be lost when deploying or restarting on Render!'
            : '⚠️ **Render Warning:** You are running on local disk. When Render redeploys or restarts, local files reset. To make data permanent, add `MONGODB_URI` to your Render Environment Variables!')
        )
        .setColor(status.connected ? '#57F287' : '#FEE75C')
        .setFooter({ text: 'Database Resilience System' })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // 2. EXPORT
    if (subcommand === 'export') {
      await interaction.deferReply({ ephemeral: true });

      try {
        const jsonString = DatabaseManager.exportDatabaseJSON();
        const buffer = Buffer.from(jsonString, 'utf-8');
        const filename = `database-backup-${interaction.guild.name.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.json`;
        const attachment = new AttachmentBuilder(buffer, { name: filename });

        const embed = new EmbedBuilder()
          .setTitle('💾 Database Backup Snapshot Created')
          .setDescription(
            `Here is your full database backup file.\n\n` +
            `• **File:** \`${filename}\`\n` +
            `• **Size:** \`${(buffer.length / 1024).toFixed(1)} KB\`\n\n` +
            `Keep this file safe! You can restore all user levels, XP, tickets, and settings anytime using \`/backup restore\`.`
          )
          .setColor('#57F287')
          .setTimestamp();

        return interaction.editReply({
          embeds: [embed],
          files: [attachment]
        });
      } catch (err) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Export Failed', `Could not export database: \`${err.message}\``)]
        });
      }
    }

    // 3. RESTORE
    if (subcommand === 'restore') {
      await interaction.deferReply({ ephemeral: true });
      const file = interaction.options.getAttachment('file');

      if (!file.name.endsWith('.json')) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Invalid File', 'Please upload a valid `.json` database backup file!')]
        });
      }

      try {
        const response = await fetch(file.url);
        if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
        const text = await response.text();
        const parsed = JSON.parse(text);

        DatabaseManager.importDatabaseJSON(parsed);

        const embed = new EmbedBuilder()
          .setTitle('✅ Database Restored Successfully!')
          .setDescription(
            `All user data, XP, levels, settings, and records have been restored from **${file.name}**.\n\n` +
            `Changes have been saved to disk and synced to cloud storage.`
          )
          .setColor('#57F287')
          .setTimestamp();

        return interaction.editReply({ embeds: [embed] });
      } catch (err) {
        return interaction.editReply({
          embeds: [EmbedUtils.error('Restore Failed', `Failed to restore database from file: \`${err.message}\``)]
        });
      }
    }
  }
};
