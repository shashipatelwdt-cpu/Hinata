const catalog = require('./catalog');
const vxEsports = require('./vxEsports');
const owoArcade = require('./owoArcade');
const lordxEsports = require('./lordxEsports');
const nomiRpg = require('./nomiRpg');
const stylishAesthetic = require('./stylishAesthetic');
const tactical5v5Game = require('./tactical5v5Game');

catalog['tactical-5v5'] = tactical5v5Game;
catalog['5v5'] = tactical5v5Game;
catalog['game-5v5'] = tactical5v5Game;
catalog['tactical-game'] = tactical5v5Game;
catalog['5v5-game'] = tactical5v5Game;
catalog['project-5v5'] = tactical5v5Game;

catalog['good-looking'] = stylishAesthetic;
catalog['goodlooking'] = stylishAesthetic;
catalog['good-looking-aesthetic'] = stylishAesthetic;
catalog['stylish-aesthetic'] = stylishAesthetic;
catalog['stylish'] = stylishAesthetic;
catalog['aesthetic'] = stylishAesthetic;
catalog['aesthetic-lounge'] = stylishAesthetic;

catalog['nomi-rpg'] = nomiRpg;
catalog['nomi'] = nomiRpg;
catalog['nomibot'] = nomiRpg;
catalog['nomi-bot'] = nomiRpg;
catalog['nomi_bot'] = nomiRpg;

catalog['lordx-esports'] = lordxEsports;
catalog['lordx'] = lordxEsports;
catalog['lordxesport'] = lordxEsports;
catalog['lordx_esports'] = lordxEsports;

catalog['vx-esports'] = vxEsports;
catalog['esports-vx'] = vxEsports;
catalog['esports-clan'] = vxEsports;
catalog['esports'] = vxEsports;

catalog['owo-arcade'] = owoArcade;
catalog['owo-game'] = owoArcade;
catalog['owo-bot'] = owoArcade;
catalog['bot-arcade'] = owoArcade;

const TemplateParser = require('./parser');
const AIPromptGenerator = require('./aiPrompt');
const ServerExporter = require('./exporter');
const TemplateBuilderEngine = require('./builderEngine');
const TemplateSlider = require('./slider');
const OnlineTemplateImporter = require('./onlineImporter');

const THEME_ALIASES = {
  'good-looking': 'good-looking',
  'goodlooking': 'good-looking',
  'good looking': 'good-looking',
  'good_looking': 'good-looking',
  'good': 'good-looking',
  'good-look': 'good-looking',
  'stylish': 'good-looking',
  'stylish-aesthetic': 'good-looking',
  'stylish_aesthetic': 'good-looking',
  'stylish aesthetic': 'good-looking',
  'stylish aesthic': 'good-looking',
  'aesthic': 'good-looking',
  'aesthetic': 'good-looking',
  'aesthetic-lounge': 'good-looking',
  'aesthetic_lounge': 'good-looking',
  'aesthetic lounge': 'good-looking',
  'vortex': 'good-looking',
  'velvet': 'good-looking',
  'vortex-velvet': 'good-looking',
  'vortex_velvet': 'good-looking',

  'nomi': 'nomi-rpg',
  'nomi-rpg': 'nomi-rpg',
  'nomi_rpg': 'nomi-rpg',
  'nomirpg': 'nomi-rpg',
  'nomibot': 'nomi-rpg',
  'nomi-bot': 'nomi-rpg',
  'nomi_bot': 'nomi-rpg',
  'culinary': 'nomi-rpg',

  'lordx': 'lordx-esports',
  'lordx-esports': 'lordx-esports',
  'lordxesport': 'lordx-esports',
  'lordx_esports': 'lordx-esports',
  'lord_x': 'lordx-esports',

  'owo': 'owo-arcade',
  'owo-arcade': 'owo-arcade',
  'owo_arcade': 'owo-arcade',
  'owo-game': 'owo-arcade',
  'owo_game': 'owo-arcade',
  'owo-bot': 'owo-arcade',
  'bot-arcade': 'owo-arcade',

  'vx': 'vx-esports',
  'vx-esports': 'vx-esports',
  'vx_esports': 'vx-esports',
  'esports-vx': 'vx-esports',
  'esports_vx': 'vx-esports',
  'esports': 'vx-esports',
  'esports_clan': 'vx-esports',
  'esports-clan': 'vx-esports',

  'community': 'community-social',
  'community_social': 'community-social',
  'gaming': 'gaming-all',
  'gaming_all': 'gaming-all',
  'anime': 'anime-art',
  'anime_art': 'anime-art',
  'developer': 'developer-code',
  'developer_code': 'developer-code',
  'study': 'study-exam',
  'study_exam': 'study-exam',
  'cyberpunk': 'developer-cyber',
  'cyberpunk_net': 'developer-cyber',
  'minimal': 'community-dark',
  'minimal_vip': 'community-dark',
  'business': 'business-shop',
  'crypto': 'business-crypto',
  'rp': 'rp-fantasy',
  'fitness': 'lifestyle-fitness',
  'twitch': 'creator-twitch',
  'youtube': 'community-creator',
  'creator': 'community-creator',
  'fps': 'gaming-fps',
  'minecraft': 'gaming-minecraft',
  'roblox': 'gaming-roblox',
  'gta': 'gaming-gtarp',
  'genshin': 'gaming-genshin',
  'japanese': 'nomi-japanese',
  'nomi-japanese': 'nomi-japanese',
  'tokyo': 'nomi-japanese',
  'sakura': 'nomi-japanese',
  '5v5': 'tactical-5v5',
  'tactical-5v5': 'tactical-5v5',
  'tactical': 'tactical-5v5',
  '5v5-game': 'tactical-5v5',
  'game-5v5': 'tactical-5v5'
};

module.exports = {
  templates: catalog,
  getTemplate: (id) => {
    if (!id || typeof id !== 'string') {
      return catalog['stylish-aesthetic'] || catalog['community-social'] || Object.values(catalog)[0];
    }
    const raw = id.toLowerCase().trim();
    const cleanKey = raw.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const compactKey = raw.replace(/[^a-z0-9]/g, '');

    // 1. Direct key match
    if (catalog[raw]) return catalog[raw];
    if (catalog[cleanKey]) return catalog[cleanKey];

    // 2. Alias match
    if (THEME_ALIASES[raw] && catalog[THEME_ALIASES[raw]]) return catalog[THEME_ALIASES[raw]];
    if (THEME_ALIASES[cleanKey] && catalog[THEME_ALIASES[cleanKey]]) return catalog[THEME_ALIASES[cleanKey]];

    // 3. Keyword / Fuzzy matches
    if (raw.includes('5v5') || raw.includes('tactical')) {
      return catalog['tactical-5v5'];
    }
    if (raw.includes('good') || raw.includes('look') || raw.includes('stylish') || raw.includes('aesth') || raw.includes('vortex') || raw.includes('velvet')) {
      return catalog['good-looking'] || catalog['stylish-aesthetic'];
    }
    if (raw.includes('nomi') || raw.includes('culinary') || raw.includes('chef') || raw.includes('cook')) {
      return catalog['nomi-rpg'] || catalog['nomi-japanese'];
    }
    if (raw.includes('lordx')) return catalog['lordx-esports'];
    if (raw.includes('vx')) return catalog['vx-esports'];
    if (raw.includes('owo')) return catalog['owo-arcade'];

    // 4. Prefix & Contains match
    const prefixMatch = Object.keys(catalog).find(k => k.startsWith(cleanKey) || k.endsWith(cleanKey) || cleanKey.startsWith(k));
    if (prefixMatch) return catalog[prefixMatch];

    const containsMatch = Object.keys(catalog).find(k => k.includes(cleanKey) || cleanKey.includes(k) || k.replace(/[^a-z0-9]/g, '').includes(compactKey));
    if (containsMatch) return catalog[containsMatch];

    // 5. Search in template names
    const nameMatch = Object.values(catalog).find(t => t.name.toLowerCase().includes(raw) || t.id.toLowerCase().includes(raw));
    if (nameMatch) return nameMatch;

    return catalog['good-looking'] || catalog['stylish-aesthetic'] || catalog['community-social'] || Object.values(catalog)[0];
  },
  getAllTemplates: () => Object.values(catalog),
  getCategories: () => {
    const cats = {};
    for (const t of Object.values(catalog)) {
      if (!cats[t.category]) cats[t.category] = [];
      cats[t.category].push(t);
    }
    return cats;
  },
  searchTemplates: (query) => {
    if (!query) return Object.values(catalog);
    const q = query.toLowerCase().trim();
    return Object.values(catalog).filter(
      t => t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (q.includes('aesth') && t.id.includes('aesthetic')) ||
        (q.includes('style') && t.id.includes('stylish')) ||
        (q.includes('nomi') && t.id.includes('nomi'))
    );
  },
  TemplateParser,
  AIPromptGenerator,
  ServerExporter,
  TemplateBuilderEngine,
  TemplateSlider,
  OnlineTemplateImporter
};
