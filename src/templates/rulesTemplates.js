/**
 * Pre-Made High Quality Server Rules Templates Catalog for Hinata Discord Bot
 */

const rulesTemplates = [
  {
    id: 'gaming',
    name: '🎮 Gaming & Esports Arena',
    emoji: '🎮',
    category: 'Gaming',
    description: 'Fair play, anti-cheat, voice comms etiquette, and squad toxicity guidelines.',
    title: '🎮 {server} — Official Server Guidelines & Rules',
    color: '#5865F2',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Gaming Rules • Zero tolerance for toxicity & cheats',
    rules: [
      {
        number: '01',
        emoji: '🤝',
        title: 'Respect All Players & Good Sportsmanship',
        description: 'Treat every member with respect. Toxicity, harassment, hate speech, racism, and excessive trash talk will result in an immediate timeout or ban. Keep competitive banter friendly!'
      },
      {
        number: '02',
        emoji: '🚫',
        title: 'Zero Tolerance for Cheats, Hacks & Exploits',
        description: 'Discussion, promotion, distribution, or use of cheats, hacks, unauthorized scripts, or game-breaking exploits is strictly prohibited across all channels.'
      },
      {
        number: '03',
        emoji: '🔊',
        title: 'Voice Comms & Stream Etiquette',
        description: 'Keep voice channels clean of ear-rape, soundboard spam, mic echo, and screaming during active squad matches. Do NOT stream-snipe server members or content creators.'
      },
      {
        number: '04',
        emoji: '🎯',
        title: 'No Self-Promotion or Unsolicited DMs',
        description: 'Do not advertise your Twitch, YouTube, Discord servers, or coaching services without staff approval. DM advertising or scamming server members will lead to an instant permanent ban.'
      },
      {
        number: '05',
        emoji: '🛡️',
        title: 'Staff Discretion & Discord Terms of Service',
        description: 'Follow all instructions from Moderators and Admins. All members must strictly abide by [Discord Community Guidelines](https://discord.com/guidelines) and [Terms of Service](https://discord.com/terms).'
      }
    ],
    buttons: [
      { label: '✅ Accept Rules & Verify', style: 'Success', customId: 'rules_verify_btn', emoji: '✅' },
      { label: '🎫 Need Help / Staff', style: 'Secondary', customId: 'ticket_general_btn', emoji: '🎫' }
    ]
  },
  {
    id: 'anime',
    name: '🌸 Anime & Aesthetic Lounge',
    emoji: '🌸',
    category: 'Anime',
    description: 'Cozy, wholesome anime community rules with spoiler tags & aesthetic vibe.',
    title: '🌸 {server} — Community Guidelines & Etiquette',
    color: '#FF70A6',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Anime Rules • Be kind, cozy, and respectful (◕‿◕✿)',
    rules: [
      {
        number: '01',
        emoji: '🍵',
        title: 'Be Kind, Wholesome & Welcoming',
        description: 'Keep our community cozy and safe! No bullying, hate speech, drama, personal attacks, or gatekeeping. Treat everyone like a good friend.'
      },
      {
        number: '02',
        emoji: '🙈',
        title: 'Strict Spoiler Tag Enforcement',
        description: 'Always use spoiler tags `||like this||` when discussing newly released anime episodes, manga chapters, movies, or light novels. Keep major spoilers in the designated spoiler channels!'
      },
      {
        number: '03',
        emoji: '🔞',
        title: 'Keep It Safe For Work (SFW)',
        description: 'NSFW, gore, suggestive media, or overtly explicit conversations are strictly forbidden in public chats. Keep profile pictures, banners, and status messages PG-13.'
      },
      {
        number: '04',
        emoji: '🎨',
        title: 'Credit Artists & Respect Content',
        description: 'When sharing fan-art, cosplay, or edits, please credit the original creator whenever possible. No stealing artwork or impersonating community members.'
      },
      {
        number: '05',
        emoji: '🎀',
        title: 'No Advertising & Respect Privacy',
        description: 'Do not send unsolicited promotional links or DM members for invites/sales. If someone asks you to stop in chat or DM, respect their boundaries immediately.'
      }
    ],
    buttons: [
      { label: '🌸 I Agree to the Rules', style: 'Success', customId: 'rules_verify_btn', emoji: '🌸' },
      { label: '🎭 Grab Aesthetic Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🎭' }
    ]
  },
  {
    id: 'community',
    name: '🌟 Cozy Social Community Lounge',
    emoji: '🌟',
    category: 'Community',
    description: 'Warm, universal, clean server rules suitable for social hangouts & lounges.',
    title: '🌟 {server} — Server Code of Conduct',
    color: '#FEE75C',
    banner: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Community Rules • Enjoy your stay and have fun!',
    rules: [
      {
        number: '01',
        emoji: '💖',
        title: 'Mutual Respect & Friendly Vibes',
        description: 'Be respectful and considerate to all members. Discrimination, hate speech, slurs, excessive aggression, and personal harassment are strictly forbidden.'
      },
      {
        number: '02',
        emoji: '📂',
        title: 'Stay on Topic & Use Proper Channels',
        description: 'Please post media, memes, bot commands, and general chatter in their designated channels. Keep chat readability pleasant for everyone.'
      },
      {
        number: '03',
        emoji: '🚫',
        title: 'No Spamming, Flooding or Loud Noise',
        description: 'Avoid spamming emojis, repeating messages, wall of texts, mass mentions (`@everyone`/`@here`), or loud noise/soundboard abuse in voice lounges.'
      },
      {
        number: '04',
        emoji: '🔒',
        title: 'No Self-Promotion or Unsolicited DMs',
        description: 'Do not post external invites, social links, or advertise in member DMs. Any scam links or phishing attempts will result in an instant permanent ban and report.'
      },
      {
        number: '05',
        emoji: '📜',
        title: 'Discord Terms of Service & Staff Authority',
        description: 'You must be at least 13 years old and comply with Discord TOS. Server moderators reserve the right to take appropriate action to ensure server harmony.'
      }
    ],
    buttons: [
      { label: '✅ Accept Rules', style: 'Success', customId: 'rules_verify_btn', emoji: '✅' },
      { label: '📜 Server Information', style: 'Secondary', customId: 'welcome_rules_btn', emoji: '📜' }
    ]
  },
  {
    id: 'developer',
    name: '💻 Developer & Tech Hub',
    emoji: '💻',
    category: 'Developer',
    description: 'Code block formatting, open-source integrity, no DMing for help, and collaborative coding.',
    title: '💻 {server} — Developer Guidelines & Code of Conduct',
    color: '#00D26A',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Developer Rules • git commit -m "Friendly and helpful community"',
    rules: [
      {
        number: '01',
        emoji: '📋',
        title: 'Format Code Blocks with Syntax Highlighting',
        description: 'Never post screenshots of code or raw unformatted text. Always use Markdown code fences (e.g. \\`\\`\\`js ... \\`\\`\\`) or pastebins (GitHub Gist, Pastebin) for snippets longer than 15 lines.'
      },
      {
        number: '02',
        emoji: '❓',
        title: 'Ask Questions Properly & No "Help Vampiring"',
        description: 'Provide reproducible examples, clear error logs, and explain what you have already tried. Do NOT ask "Can anyone help me?" — just ask your specific question directly in the help channel!'
      },
      {
        number: '03',
        emoji: '🚫',
        title: 'No DMing for Free Tech Support',
        description: 'Do not DM other developers or staff asking for private code debugging. Keep all troubleshooting public so other community members can learn from solutions.'
      },
      {
        number: '04',
        emoji: '🛡️',
        title: 'No Malware, Piracy, Cracking or Token Grabbers',
        description: 'Sharing malicious scripts, viruses, token stealers, cracked software, unauthorized API scrapers, or DDoS tools is strictly forbidden and results in an instant ban and Discord Trust & Safety report.'
      },
      {
        number: '05',
        emoji: '🤝',
        title: 'Constructive Criticism & Open Source Respect',
        description: 'Review others’ code with empathy and constructive feedback. No elitism, gatekeeping, or condescending remarks toward beginners.'
      }
    ],
    buttons: [
      { label: '✅ Accept Developer Rules', style: 'Success', customId: 'rules_verify_btn', emoji: '✅' },
      { label: '⚙️ Pick Tech Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '⚙️' }
    ]
  },
  {
    id: 'cyberpunk',
    name: '⚡ Cyberpunk / Network Security Protocols',
    emoji: '⚡',
    category: 'Sci-Fi',
    description: 'Futuristic mainframe security protocols and operative operational directives.',
    title: '⚡ [SYSTEM DIRECTIVES] {server} Network Clearance Protocols',
    color: '#00F0FF',
    banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Cyberpunk Protocols • Authorized Personnel Only // Security Level 4',
    rules: [
      {
        number: '01',
        emoji: '🔮',
        title: 'Directive 101: Identity Verification & Comms Protocol',
        description: 'All operatives must maintain neural synchronization. Hostility, behavioral anomalies, discrimination, and neural payload disruptions are flagged for immediate termination.'
      },
      {
        number: '02',
        emoji: '📡',
        title: 'Directive 102: Frequency Signal Integrity',
        description: 'Keep transmission channels clear of packet flooding, unauthorized ping signals, sound frequency distortion, and encrypted sub-layer spam.'
      },
      {
        number: '03',
        emoji: '🛡️',
        title: 'Directive 103: Data Leak Prevention & Firewall Integrity',
        description: 'Unauthorized extraction of operative credentials, distribution of malicious subroutines, phishing vectors, or external server links will trigger automated purge protocols.'
      },
      {
        number: '04',
        emoji: '👁️',
        title: 'Directive 104: Mainframe Chain of Command',
        description: 'Observe all administrative protocols issued by High Command and NetWatch Operatives. Non-compliance results in immediate revocation of network access.'
      },
      {
        number: '05',
        emoji: '🌐',
        title: 'Directive 105: Global Discord Subnet Compliance',
        description: 'Operatives must adhere to all central Discord subnet regulations and global network laws. Violations are logged to central blacklists.'
      }
    ],
    buttons: [
      { label: '⚡ Authorize Biometrics & Enter', style: 'Success', customId: 'rules_verify_btn', emoji: '⚡' },
      { label: '🔮 System Diagnostics', style: 'Secondary', customId: 'welcome_rules_btn', emoji: '🔮' }
    ]
  },
  {
    id: 'minimal',
    name: '💎 Minimalist & Executive VIP Rules',
    emoji: '💎',
    category: 'Minimal',
    description: 'Ultra sleek, professional, clean bullet points with zero clutter.',
    title: '💎 {server} — Community Guidelines',
    color: '#2B2D31',
    banner: null,
    footer: 'Hinata Minimalist Rules • Simple, elegant, respectful',
    rules: [
      {
        number: '01',
        emoji: '•',
        title: 'Respect & Decorum',
        description: 'Maintain a courteous, welcoming tone. Harassment, bigotry, hate speech, and toxicity are strictly disallowed.'
      },
      {
        number: '02',
        emoji: '•',
        title: 'Content & Appropriateness',
        description: 'Keep all discussions and media Safe For Work (SFW). Use relevant channels for specific topics.'
      },
      {
        number: '03',
        emoji: '•',
        title: 'No Spam & Clean Messaging',
        description: 'No repetitive messages, mass mentions, or disruptive audio in voice lounges.'
      },
      {
        number: '04',
        emoji: '•',
        title: 'No Unsolicited Advertising',
        description: 'Self-promotion and DM advertising without prior administrative authorization are prohibited.'
      },
      {
        number: '05',
        emoji: '•',
        title: 'Compliance & Discord TOS',
        description: 'Adherence to [Discord Terms of Service](https://discord.com/terms) is mandatory for all members.'
      }
    ],
    buttons: [
      { label: '✅ I Accept the Rules', style: 'Success', customId: 'rules_verify_btn', emoji: '✅' }
    ]
  },
  {
    id: 'study',
    name: '📚 Study & Academic Campus Hub',
    emoji: '📚',
    category: 'Study',
    description: 'Academic integrity, homework discussion guidelines, and 24/7 quiet study rooms.',
    title: '📚 {server} — Academic Integrity & Campus Rules',
    color: '#4E9F3D',
    banner: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Academic Rules • Learn, grow, and achieve your study goals together',
    rules: [
      {
        number: '01',
        emoji: '🎓',
        title: 'Academic Integrity & No Direct Exam Cheating',
        description: 'We encourage homework help, explaining concepts, and study groups. However, asking for or providing answers for active exams, tests, or graded quizzes is strictly prohibited.'
      },
      {
        number: '02',
        emoji: '🤫',
        title: 'Respect Quiet & Pomodoro Study Lounges',
        description: 'In Quiet/Muted Study VC rooms, keep microphones muted at all times. Use text chat to share study goals, timers, and music recommendations.'
      },
      {
        number: '03',
        emoji: '💡',
        title: 'Supportive & Encouraging Environment',
        description: 'Everyone learns at their own pace. Never mock or demean someone for not knowing a topic. Be patient and constructive when providing explanations.'
      },
      {
        number: '04',
        emoji: '📖',
        title: 'Resource Sharing & SFW Academic Content',
        description: 'Share legal study materials, notes, summaries, and educational guides. Do not share copyrighted commercial test-banks or pirated paid courses.'
      },
      {
        number: '05',
        emoji: '🏛️',
        title: 'No Commercial Tutoring Spam & Discord TOS',
        description: 'Do not spam paid essay writing, assignment completion services, or unsolicited tutoring DMs. Comply with Discord Community Guidelines at all times.'
      }
    ],
    buttons: [
      { label: '📚 Agree & Enter Campus', style: 'Success', customId: 'rules_verify_btn', emoji: '📚' },
      { label: '✍️ Subject Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '✍️' }
    ]
  },
  {
    id: 'esports',
    name: '🏆 Esports Clan & Competitive Team',
    emoji: '🏆',
    category: 'Esports',
    description: 'Scrim etiquette, roster commitment, toxicity zero-tolerance, and clan directives.',
    title: '🏆 {server} — Clan Rules & Competitive Etiquette',
    color: '#E02401',
    banner: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Esports Rules • Play with honor, train hard, win as a team',
    rules: [
      {
        number: '01',
        emoji: '🛡️',
        title: 'Represent the Clan with Pride & Honor',
        description: 'Whether in server matches, public lobbies, or ranked tournaments, carry our clan tag respectfully. Toxic behavior or unsportsmanlike conduct reflects on the whole team and will lead to removal.'
      },
      {
        number: '02',
        emoji: '⚔️',
        title: 'Punctuality & Scrim Attendance',
        description: 'If you register for scrims, clan wars, or team practices, arrive at least 10 minutes early. Consistent unexcused absences will result in demotion from competitive rosters.'
      },
      {
        number: '03',
        emoji: '🚫',
        title: 'Strict Anti-Cheat & Fair Play',
        description: 'Any use of third-party modifications, aim assists, macros, wallhacks, or unapproved exploits will result in an immediate permanent ban and submission to league organizers.'
      },
      {
        number: '04',
        emoji: '🎙️',
        title: 'Clear & Focused Voice Comms',
        description: 'During scrims and official tournaments, prioritize game callouts and clear communication. Keep personal chit-chat to the casual voice lounges.'
      },
      {
        number: '05',
        emoji: '🎖️',
        title: 'Chain of Command & Dispute Resolution',
        description: 'Team Captains and Roster Managers make final calls during competitive matches. Address any internal grievances privately with Clan Leadership via tickets.'
      }
    ],
    buttons: [
      { label: '🏆 Agree & Enlist to Roster', style: 'Success', customId: 'rules_verify_btn', emoji: '🏆' },
      { label: '🛡️ Clan Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🛡️' }
    ]
  },
  {
    id: 'chill',
    name: '🎧 Chill Music, Lo-Fi & Hangout',
    emoji: '🎧',
    category: 'Music',
    description: 'Music bot queue etiquette, soundboard limits, and relaxed vibes.',
    title: '🎧 {server} — Lounge Guidelines & Vibe Check',
    color: '#8A2BE2',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Chill Rules • Good music, great friends, cozy energy',
    rules: [
      {
        number: '01',
        emoji: '🎶',
        title: 'Pass the Vibe Check & Keep It Chill',
        description: 'This is a laid-back space to listen to music, unwind, and chat. Avoid bringing outside drama, intense political arguments, or aggressive behavior into the lounge.'
      },
      {
        number: '02',
        emoji: '📻',
        title: 'Music Bot & DJ Etiquette',
        description: 'Do not skip songs that others are listening to without asking. Limit song queue duration to under 6 minutes during busy hours, and avoid trolling with ear-rape tracks.'
      },
      {
        number: '03',
        emoji: '🔇',
        title: 'Voice Chat Sensitivity & Background Noise',
        description: 'Use Push-to-Talk or enable Noise Suppression (Krisp) if you have loud background noise or keyboard typing. Mute when away from keyboard.'
      },
      {
        number: '04',
        emoji: '🎨',
        title: 'Share Art, Playlists & Creative Media',
        description: 'Feel free to share your Spotify playlists, SoundCloud links, beats, and photography in our media channels. No unsolicited self-promo in general chat.'
      },
      {
        number: '05',
        emoji: '✨',
        title: 'Safe Space & Discord Community Guidelines',
        description: 'Ensure everyone feels safe, respected, and included. Follow all Discord Terms of Service.'
      }
    ],
    buttons: [
      { label: '🎧 I Agree to the Vibes', style: 'Success', customId: 'rules_verify_btn', emoji: '🎧' },
      { label: '🎶 Music Roles', style: 'Secondary', customId: 'welcome_roles_btn', emoji: '🎶' }
    ]
  },
  {
    id: 'marketplace',
    name: '🛒 Marketplace, Trading & Commissions',
    emoji: '🛒',
    category: 'Marketplace',
    description: 'Vouch systems, verified middlemen, scam prevention, and trading disclaimer.',
    title: '🛒 {server} — Marketplace Trading & Commission Rules',
    color: '#FFA500',
    banner: 'https://images.unsplash.com/photo-1556742049-0a67e55722c3?w=1000&auto=format&fit=crop&q=80',
    footer: 'Hinata Market Rules • Trade safely, verify vouches, and use official middlemen',
    rules: [
      {
        number: '01',
        emoji: '⚠️',
        title: 'Server Disclaimer & Due Diligence',
        description: 'The server owners and staff are NOT responsible for lost funds, scam attempts, or chargebacks. Always do thorough background checks, check user vouches, and proceed at your own risk!'
      },
      {
        number: '02',
        emoji: '🛡️',
        title: 'Use Verified Middlemen for High-Value Trades',
        description: 'For large transactions or account/service trades, request an official Server Middleman via ticket. Never trust unofficial third-party middlemen claiming to represent this server.'
      },
      {
        number: '03',
        emoji: '🚫',
        title: 'No Illegal, Cracked, Carded or Stolen Goods',
        description: 'Selling stolen accounts, pirated software, leaked databases, carded gift cards, chargeback fraud services, or illegal goods will result in an instant permanent ban and law/Discord reporting.'
      },
      {
        number: '04',
        emoji: '📝',
        title: 'Proper Formatting, Proof & Vouch Etiquette',
        description: 'Include clear descriptions, accepted payment methods, and pricing in your listings. Fake vouches, vouch trading, or deleting scam evidence is strictly prohibited.'
      },
      {
        number: '05',
        emoji: '🚨',
        title: 'Reporting Scammers & Evidence Submission',
        description: 'If you encounter a suspicious trader or scammer, open a ticket immediately with uncensored screenshots, transaction IDs, and Discord User IDs.'
      }
    ],
    buttons: [
      { label: '🛒 Accept Trading Guidelines', style: 'Success', customId: 'rules_verify_btn', emoji: '🛒' },
      { label: '🎫 Request Middleman / Help', style: 'Secondary', customId: 'ticket_general_btn', emoji: '🎫' }
    ]
  }
];

function getAllRulesTemplates() {
  return rulesTemplates;
}

function getRulesTemplate(id) {
  if (!id) return null;
  return rulesTemplates.find(t => t.id.toLowerCase() === id.toLowerCase()) || null;
}

module.exports = {
  rulesTemplates,
  getAllRulesTemplates,
  getRulesTemplate
};
