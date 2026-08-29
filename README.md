# 🤖 Apex - All-In-One Advanced Discord Bot

A state-of-the-art, feature-complete Discord Bot powered by **Discord.js v14**, featuring 1-Click Server Templates, 10+ Rules Presets & 1-Click Verification, Advanced Real-Time Invite Tracker (Regular, Left, Fake, Bonus), Moderation & AutoMod, Interactive Welcome & Leave Cards, Self-Roles & Reaction Menus, Multi-Department Ticket Support, Giveaways, and Interactive Embed Builders.

---

## ✨ Features Summary

| Module | Features & Capabilities |
| :--- | :--- |
| 📜 **Rules & Verification** | **10+ Curated Rules Presets** (Gaming, Anime, Cozy Community, Developer, Cyberpunk, Minimalist, Study, Esports, Chill, Marketplace) + **1-Click Interactive Verification Button** + Modal Custom Rules Builder. |
| 📊 **Advanced Invite Tracker** | Real-time tracking of **✅ Regular**, **❌ Leaves**, **⚠️ Fake/Alt Accounts (< 3 days old)**, **🎁 Bonus Invites**, and **Total Net Invites** with server rank, leaderboards, and user audit (`/inviter`). |
| 🏗️ **AI & Server Templates** | **27+ Curated Presets** (Gaming, Community, Tech/AI, Crypto, Store, Study, Clan, Fitness) + **🤖 Automated ChatGPT / Custom Builder** (Paste any AI JSON or Markdown blueprint to build in 1-click!). |
| 👑 **Auto-Role System** | Automated role assignment for new joining members & bots (`/autorole set`, `/autorole status`, `/autorole test`, `/autorole toggle`, `/autorole remove`). |
| 🛡️ **Advanced Moderation** | `/ban`, `/kick`, `/timeout`, `/untimeout`, `/warn`, `/warnings`, `/delwarn`, `/clearwarns`, `/purge` (with 4 smart filters), `/lock`, `/unlock`, `/slowmode`, `/nuke`, `/nick`, `/role`. |
| ⚡ **AutoMod Defense** | Anti-Link, Anti-Discord-Invite, Anti-Spam Flooding, Anti-Mass-Mention, Custom Blacklisted Bad-Words & Profanity Filter, Real-time ModLogs. |
| 👋 **Welcome & Leave** | Dynamic Placeholders (`{user}`, `{server}`, `{count}`, `{inviter}`, `{invites}`), Auto-Roles (separate for Humans & Bots), DM Onboarding, Interactive buttons, `/welcome preview` & `/welcome test`. |
| 🎭 **Self-Roles & Menus** | Interactive Dropdown Select Menus & Button Roles (Platform roles, Notification pings, Name colors, Custom role menus). |
| 🎫 **Support Tickets** | Button-based ticket creator (General Support, Report Player, Staff/Partnership), auto-private channel, ticket management & auto-close. |
| 🎁 **Giveaways** | Interactive `/giveaway start` (duration, winners count, prize), active entry counter button, `/giveaway reroll` & `/giveaway end`. |
| 🎨 **Rich Embed Builder** | `/embed-builder` with an interactive Discord popup modal (Title, Description with markdown, Custom Hex Color, Banner Image, Footer). |
| ⚙️ **Setup Dashboard** | `/setup` interactive server overview dashboard with live status cards and quick navigation buttons. |

---

## 🚀 Quick Setup & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher installed ([Download Node.js](https://nodejs.org/))

### 2. Configure Your Discord Bot Token
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application**, give it a name (e.g., `Apex Bot`), and create it.
3. In the left sidebar, click **Bot**:
   - Click **Reset Token** and copy your bot token.
   - Scroll down to **Privileged Gateway Intents** and enable ALL three:
     - ✅ **PRESENCE INTENT**
     - ✅ **SERVER MEMBERS INTENT**
     - ✅ **MESSAGE CONTENT INTENT**
   - Click **Save Changes**.
4. In the left sidebar, click **General Information** and copy your **Application ID (Client ID)**.
5. In the left sidebar, click **OAuth2** ➔ **URL Generator**:
   - Scopes: check `bot` and `applications.commands`.
   - Bot Permissions: check `Administrator`.
   - Copy the generated URL and open it in your browser to invite the bot to your Discord server!

### 3. Add Token to `.env`
Open the `.env` file in the project folder and paste your credentials:
```env
DISCORD_TOKEN=your_copied_bot_token_here
CLIENT_ID=your_copied_client_id_here
```

### 4. Deploy Slash Commands & Start
Open your terminal in the project directory:
```bash
npm run deploy
npm start
```
*Or for automatic restart during development:*
```bash
npm run dev
```

---

## 📋 Complete Commands List

### 📜 1. Server Rules & Verification (`/rules`)
- `/rules templates` - Interactive gallery to browse, preview & deploy 10+ styled rules presets (Gaming, Anime, Community, Dev, Cyberpunk, Minimalist, Study, Clan, Music, Marketplace).
- `/rules send preset:<name> channel:<#channel> [verify_role:<@role>] [include_verify_button: true/false]` - Deploy formatted rules with interactive "✅ Accept Rules & Verify" button to any channel.
- `/rules verify-role role:<@role>` - Configure the Member role automatically granted when clicking the verification button.
- `/rules custom channel:<#channel>` - Interactive popup modal builder to craft completely personalized server rules with custom title, color, markdown body, and banner.
- `/rules preview [preset:<name>]` - Ephemeral preview of any rules preset or current server rules.
- `/rules clear-verify` - Remove the configured verification role.

### 📊 2. Invite Tracker & Stats (`/invites`, `/invites-manage`)
- `/invites check [user:<@user>]` - View user invite card with Net Total, progress bar, retention rate, server rank, and breakdown:
  - ✅ **Regular Invites:** Active real members in the server
  - ❌ **Left Members:** Members who joined and subsequently left
  - ⚠️ **Fake / Alt Accounts:** Accounts < 3 days old or bots
  - 🎁 **Bonus Invites:** Admin-awarded bonus invites
- `/invites leaderboard` - Server-wide top inviters leaderboard with ranks (🥇, 🥈, 🥉).
- `/invites audit user:<@user>` - Inspect who invited a specific member, invite code used, join timestamp, and fake/alt status flag.
- `/invites-manage add user:<@user> amount:<number>` - Add bonus invites to a user.
- `/invites-manage remove user:<@user> amount:<number>` - Deduct bonus invites from a user.
- `/invites-manage reset-user user:<@user>` - Reset single user's invite statistics to 0.
- `/invites-manage reset-all confirm:true` - Wipe and reset all server invite records.

### 🏗️ 3. AI Server Templates (`/template`)
- `/template list` - Browse all 27+ built-in presets by category with interactive Slider Carousel.
- `/template preview preset:<theme>` - Live preview of channels, voice limits & roles with instant Autocomplete search.
- `/template apply preset:<theme> [delete_old_channels: true/false]` - Install any preset in 1-click.
- `/template custom [blueprint] [file] [delete_old_channels]` - **🤖 Automated ChatGPT Builder!** Paste any JSON or Markdown blueprint (or upload `.json` / `.txt` file) to build your customized server automatically!
- `/template ai-prompt [theme]` - **✨ Get Copy-Ready ChatGPT Prompt** to generate custom server blueprints for any niche in seconds!
- `/template export [format: json/markdown]` - **📦 Backup & Export** your current server structure to JSON / Markdown.
- `/role-builder create` - Paste bulk formatted role lists to auto-create all roles in seconds.

### 👑 4. Auto-Role System (`/autorole`)
- `/autorole set role:<@role> [bot_role:<@role>]` - Quick 1-step auto-role setup for joining members and bots.
- `/autorole humans role:<@role>` - Set or update the auto-role specifically for human members.
- `/autorole bots role:<@role>` - Set or update the auto-role specifically for bot accounts.
- `/autorole status` - View current settings, role status, and check bot hierarchy permissions.
- `/autorole toggle [state: true/false]` - Turn auto-role on or off without losing configuration.
- `/autorole test` - Test auto-role assignment and verify bot role hierarchy in real-time.
- `/autorole remove target:<humans/bots/all>` - Clear configured auto-roles.

### 🛡️ 5. Moderation (`/mod`)
- `/ban user:<@user> [reason] [delete_days]` - Ban a member with role hierarchy safety.
- `/kick user:<@user> [reason]` - Kick a member from the server.
- `/timeout user:<@user> duration:<10m/1h/1d> [reason]` - Timeout/Mute a member.
- `/untimeout user:<@user> [reason]` - Remove timeout from a member.
- `/warn user:<@user> reason:<reason>` - Issue an official warning (persisted to database).
- `/warnings user:<@user>` - View member warning history.
- `/delwarn id:<warn_id>` - Remove a specific warning by its ID.
- `/clearwarns user:<@user>` - Clear all warnings for a member.
- `/purge amount:<1-100> [filter] [target_user]` - Delete messages with filters (Bots only, Humans only, Links, Attachments).
- `/lock [channel] [reason]` - Lock down a channel.
- `/unlock [channel] [reason]` - Unlock a channel.
- `/slowmode seconds:<0-21600> [channel]` - Set channel message cooldown.
- `/nuke` - Clone and wipe all message history from the channel with confirmation safeguards.
- `/nick user:<@user> [nickname]` - Change or reset a member's nickname.
- `/role user:<@user> role:<@role>` - Toggle or assign a role.

### ⚡ 6. AutoMod Protection (`/automod`)
- `/automod status` - View all active automod filters and status.
- `/automod anti-link enabled:<true/false>` - Block external website links.
- `/automod anti-invite enabled:<true/false>` - Block Discord invite links.
- `/automod anti-spam enabled:<true/false>` - Block fast message flooding.
- `/automod anti-mention enabled:<true/false> [max_mentions]` - Protect against mass-mention raids.
- `/automod badwords action:<add/remove/list/toggle> [word]` - Custom profanity and blocked words filter.
- `/automod modlog channel:<#channel>` - Configure the audit log channel.

### 👋 7. Welcome & Leave (`/welcome`, `/leave`)
- `/welcome templates` - Interactive gallery to preview & 1-click install 8+ pre-made welcome styles.
- `/welcome apply preset:<theme> [channel]` - Apply a pre-made welcome theme (Gaming, Anime, Community, Developer, Cyberpunk, Minimal, Study, Esports).
- `/welcome setup channel:<#channel> [autorole_human] [autorole_bot] [custom_message] [dm_welcome] [banner_image]` - Custom welcome message setup.
- `/welcome preview` - Live visual preview of the welcome embed.
- `/welcome test` - Send a live test message to your welcome channel.
- `/welcome disable` - Turn off welcome messages.
- `/leave setup channel:<#channel> [custom_message]` - Configure goodbye messages.
- `/leave disable` - Turn off goodbye messages.
- **Invite Placeholders:** `{inviter}`, `{inviter_tag}`, `{inviter_invites}`, `{invites}`, `{user}`, `{server}`, `{count}`.

### 🎭 8. Self-Roles & Menu Roles (`/selfroles`)
- `/selfroles preset type:<platforms/notifications/colors> [channel]` - Deploy ready-to-use dropdown menus with auto-created roles.
- `/selfroles custom title:<Title> description:<Text> role1:<@role> ...` - Create custom multi-role dropdown selection menus.

### 🎫 9. Support Tickets (`/ticket`)
- `/ticket panel [channel] [category] [support_role]` - Send interactive ticket creation panel with category buttons.
- `/ticket close [reason]` - Close and delete the ticket channel.
- `/ticket add user:<@user>` - Add a user to a private ticket.
- `/ticket remove user:<@user>` - Remove a user from a ticket.

### 🎁 10. Giveaways (`/giveaway`)
- `/giveaway start duration:<10m/1h/1d> winners:<number> prize:<Text> [channel]` - Launch giveaway with clickable entry button.
- `/giveaway reroll message_id:<id>` - Pick a new winner.
- `/giveaway end message_id:<id>` - End an active giveaway early.

### 🎯 11. Snipe & Ghost-Ping System (`/snipe`, `/editsnipe`, `/clearsnipe`)
- `/snipe [index] [channel]` - View recently deleted messages with original sender, content, attachment image previews, and timestamps (stores up to 10 snipes per channel).
- `/editsnipe [index] [channel]` - View original message before it was edited alongside the new version.
- `/clearsnipe [channel]` - Clear snipe and editsnipe history for the channel (Moderator only).
- **👻 Ghost-Ping Detection:** Automatically detects when a user mentions someone and deletes the message, alerting in-channel and logging into ModLogs.

### 📊 12. Live Server Stats Counters (`/serverstats`)
- `/serverstats setup` - 1-click automatic creation of the top `SERVER STATS` category with 5 real-time locked voice counters:
  - 👥・All Members: 1,450
  - 👤・Humans: 1,420
  - 🤖・Bots: 30
  - 🚀・Boosts: Level 2 (8)
  - 🎯・Goal: 1,500
- `/serverstats update` - Force an instant manual sync of all counter channels.
- `/serverstats status` - View live counter health and channel IDs.
- `/serverstats remove` - Clean up and delete all stat counter channels.

### 🛠️ 13. Utility & Embed Builder
- `/embed-builder [channel]` - Open the interactive modal embed designer.
- `/serverinfo` - Display comprehensive server statistics, boosts, channels, and owner info.
- `/userinfo [user]` - View account creation date, join date, and roles.
- `/botinfo` - Check bot latency, uptime, RAM usage, and system details.
- `/avatar [user]` - View and download high-resolution user avatars (PNG, JPG, WEBP).
- `/poll question:<question> option1:<opt1> option2:<opt2> ...` - Create an interactive community poll.
- `/setup` - Central interactive server configuration control panel.

---

## 🗄️ Database
- Built-in zero-dependency persistent JSON/SQLite storage (`./data/database.json`).
- Automatically creates and manages server configurations, warnings, tickets, invites, and giveaways without requiring external database servers.

---

## 🛡️ License
MIT License. Built for high performance, reliability, and modern Discord standards.
