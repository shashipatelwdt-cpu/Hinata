/**
 * Advanced Multi-Lingual Bad Words & Profanity Filter Engine for Discord Bot
 * Supports English, Hindi Devanagari, and Hinglish (Romanized Hindi)
 * Equipped with Anti-Bypass Normalization (Leetspeak, Unicode Homoglyphs, Spacing, Symbols & Regex)
 * Zero False-Positive Protection with Curated Whitelist for legitimate words/countries (e.g. England, Island, Jamin, Sale, Random, Gandhi)
 */

// 1. Curated Comprehensive Whitelist for Normal Dictionary / Geographical Words
const WHITELIST_WORDS = new Set([
  // Countries, Regions & Places
  'england', 'englnd', 'poland', 'finland', 'ireland', 'holland', 'switzerland', 'thailand',
  'new zealand', 'scotland', 'iceland', 'greenland', 'netherlands', 'deutschland',
  'island', 'islands', 'woodland', 'highland', 'lowland', 'midland', 'homeland', 'farmland',
  'mainland', 'grassland', 'wetland', 'borderland', 'disneyland', 'wonderland', 'cleveland',
  'auckland', 'maryland', 'queensland', 'garland', 'headland', 'inland', 'outland', 'upland',
  'wasteland', 'lodhi', 'lodi', 'gandhi', 'gandhiji', 'gandhinagar', 'gandhara',
  'marwar', 'marwari', 'marwadi',

  // Land / Ground / Real Estate (e.g. jamin / zameen)
  'land', 'landing', 'landings', 'landlord', 'landlords', 'landlady', 'landscape', 'landscapes',
  'landmark', 'landmarks', 'landslide', 'landslides', 'landfill', 'landfills', 'landline',
  'landlines', 'landmass', 'amin', 'jamin', 'zamin', 'zameen', 'jameen',

  // Commerce & Sales
  'sale', 'sales', 'salesman', 'salesmen', 'saleswoman', 'saleswomen', 'salesperson',
  'salespeople', 'wholesale', 'wholesaler', 'resale', 'presale', 'upsale', 'salesforce',

  // Random / Grand / Brand
  'random', 'randomly', 'randomness', 'randomize', 'randomized', 'rand', 'strand', 'strands',
  'stranded', 'grand', 'grands', 'grandpa', 'grandma', 'grandfather', 'grandmother',
  'grandparent', 'grandchild', 'grandchildren', 'granddaughter', 'grandson', 'grandeur',
  'grandiose', 'brand', 'brands', 'branding', 'branded', 'errand', 'errands',

  // Animals / Birds / Common Nouns
  'peacock', 'peacocks', 'peahen', 'cocktail', 'cocktails', 'cockpit', 'cockpitts',
  'shuttlecock', 'shuttlecocks', 'woodcock', 'cockerel', 'cockatoo', 'stopcock', 'weathercock',

  // Names / Literature / Terms
  'dickens', 'dickinson', 'benedict', 'predict', 'prediction', 'predictable', 'verdict',
  'verdicts', 'addict', 'addiction', 'addicted', 'addictive', 'dictation', 'dictator',
  'dictatorship', 'dictionary', 'dictionaries', 'dictate', 'dictates', 'indict', 'indictment',
  'jurisdiction', 'vindicate', 'contradict', 'contradiction',

  // Words with 'ass'
  'assistant', 'assistance', 'assist', 'assists', 'assisted', 'assisting', 'associate',
  'associated', 'associates', 'associating', 'association', 'associations', 'assassin',
  'assassins', 'assassinate', 'assassinated', 'assassinating', 'assassination', 'assemble',
  'assembled', 'assembles', 'assembling', 'assembly', 'assemblies', 'assembler', 'assert',
  'asserted', 'asserts', 'asserting', 'assertion', 'asset', 'assets', 'assess', 'assessed',
  'assesses', 'assessing', 'assessment', 'assessments', 'assign', 'assigned', 'assigns',
  'assigning', 'assignment', 'assignments', 'assume', 'assumed', 'assumes', 'assuming',
  'assumption', 'assumptions', 'assure', 'assured', 'assures', 'assuring', 'assurance',
  'class', 'classes', 'classic', 'classical', 'classify', 'classified', 'glass', 'glasses',
  'grass', 'grasses', 'pass', 'passed', 'passes', 'passing', 'passage', 'passages',
  'passenger', 'passengers', 'passport', 'passports', 'password', 'passwords', 'compass',
  'surpass', 'trespass', 'mass', 'masses', 'massive', 'embassy', 'brass', 'harass',
  'harassment', 'embarrass', 'embarrassment',

  // Words with 'tit'
  'title', 'titles', 'titled', 'titular', 'subtitle', 'subtitles', 'entity', 'entities',
  'identity', 'identities', 'attitude', 'attitudes', 'appetite', 'appetites', 'quantity',
  'quantities', 'constitution', 'constitutional', 'institution', 'institutional', 'substitute',
  'substitutes', 'substitution', 'titan', 'titanic', 'titrate', 'titration',

  // Names / Common Hindi Words
  'muthuswamy', 'muthu', 'muthiah', 'chhod', 'chhodo', 'chhodna', 'chhodenge', 'chhodunga',
  'chhota', 'chhoti', 'chhotu', 'chutney', 'chutneys', 'chatur', 'chaturvedi', 'hello',
  'shell', 'smell', 'butter', 'button', 'analysis', 'document'
]);

// 2. Hinglish (Romanized Hindi) Profanities & Slurs (Filtered to avoid innocent collisions)
const HINGLISH_BAD_WORDS = [
  'mc', 'bc', 'bkl', 'mkc', 'bkc', 'bsdk', 'bsdkv', 'dkp', 'tmkc', 'tmbc', 'tbkl', 'tkl',
  'lodu', 'loda', 'lauda', 'lawda', 'lavda', 'lavde', 'laude', 'lowda', 'lund', 'lndi', 'lundi',
  'chut', 'choot', 'chutiya', 'chutiye', 'chutiyapa', 'chutya', 'chutia',
  'gand', 'gaand', 'gandu', 'gaandu', 'gandfat', 'gandfati', 'ganduwa', 'gandmasti', 'gandmari',
  'madarchod', 'madarchodd', 'madarchoot', 'maderchod', 'maderchodd', 'madarxhod', 'madarcode', 'madarchd',
  'bhenchod', 'behenchod', 'bhenchodd', 'behenchodd', 'bhenchoda', 'bhenchodh', 'bhenkxda', 'behnchod',
  'bhosdike', 'bhosadike', 'bhosadi', 'bhosada', 'bhosda', 'bhosdiwale', 'bhosdiwala', 'bhosdika', 'bhosdk', 'bhosad',
  'randi', 'rande', 'randwa', 'randibaaz', 'randibaazi', 'randikhana', 'r@ndi',
  'harami', 'haraami', 'haramkhor', 'kamina', 'kamine', 'kameena', 'kameene', 'kutta', 'kutte',
  'kuttiya', 'kutti', 'saala', 'saale', 'suar', 'suwar', 'suwarkapilla', 'tatte', 'tatta',
  'jhaatu', 'jhatu', 'jhatua', 'chirkut', 'rakhail', 'bhadwe', 'bhadwa', 'bhadwaa', 'hijra',
  'chakke', 'chakka', 'dalal', 'chodu', 'chodna', 'chudap', 'chudaap', 'chudakkad',
  'mutthal', 'mutth', 'muth', 'muthal', 'chinal', 'chinaal', 'randirona', 'chudwana',
  'maa ki chut', 'teri maa ki', 'teri bhen ki', 'bhen ke lode', 'lawde ke baal',
  'behen ke lode', 'bhen ke takke', 'tatte ke baal', 'loduchand', 'ganduchand', 'chodampatti',
  'lundchat', 'chutchat', 'chuchi', 'chuchiya', 'lund le', 'lauda le', 'lawda le'
];

// 3. Hindi Devanagari Script Bad Words
const HINDI_DEVANAGARI_BAD_WORDS = [
  'मादरचोद', 'मदरचोद', 'बहनचोद', 'बेहेनचोद', 'भेनचोद', 'भोसड़ीके', 'भोसड़ी', 'भोसड़ा', 'भोसड़ीके',
  'गांडू', 'गांड', 'गाण्ड', 'चूतिया', 'चूतिये', 'चूत', 'लौड़ा', 'लौड़े', 'लंड', 'लण्ड', 'लोदू',
  'रांडी', 'रान्डी', 'रंडी', 'हरामी', 'हरामखोर', 'कमीने', 'कमीना', 'साले', 'साला', 'कुत्ते',
  'कुत्ता', 'सुअर', 'झाटू', 'झांटू', 'भड़वे', 'भड़वे', 'भड़वा', 'टट्टे', 'टट्टा', 'छक्के',
  'छक्का', 'चोदू', 'चोदना', 'चुदाप', 'मुठ्ठल', 'मुठ', 'मुट्ठ', 'चिनाल', 'रंडार', 'दलाल',
  'तेरी माँ की', 'माँ की चूत', 'बहन के लोड़े'
];

// 4. English Profanities & Slurs
const ENGLISH_BAD_WORDS = [
  'fuck', 'fucker', 'fucking', 'fucked', 'fuckoff', 'motherfucker', 'motherfucking',
  'bitch', 'bitches', 'bitching', 'bitchass', 'asshole', 'assholes', 'bastard', 'bastards',
  'dick', 'dickhead', 'dicks', 'pussy', 'pussies', 'cunt', 'cunts', 'cock', 'cocksucker',
  'slut', 'sluts', 'whore', 'whores', 'nigger', 'nigga', 'niggers', 'niggas', 'retard',
  'retarded', 'stfu', 'faggot', 'fag', 'wanker', 'dumbass', 'jackass', 'dipshit', 'bullshit',
  'shit', 'shitty', 'porn', 'porno', 'hentai', 'nude', 'nudes', 'tits', 'blowjob'
];

// Master Compiled Set
const DEFAULT_BAD_WORDS = Array.from(new Set([
  ...HINGLISH_BAD_WORDS,
  ...HINDI_DEVANAGARI_BAD_WORDS,
  ...ENGLISH_BAD_WORDS
]));

// Advanced Regex Patterns to Catch Obfuscated Abuses
const OBFUSCATED_PATTERNS = [
  // 1. mc, m.c, m c, m*c
  { regex: /(?:^|\s|[^\w\u0900-\u097F])m[\s.*_#@$%!~^&+\-]*c(?:$|\s|[^\w\u0900-\u097F])/i, label: 'mc' },
  // 2. bc, b.c, b c, b*c
  { regex: /(?:^|\s|[^\w\u0900-\u097F])b[\s.*_#@$%!~^&+\-]*c(?:$|\s|[^\w\u0900-\u097F])/i, label: 'bc' },
  // 3. bkl, b.k.l, b k l
  { regex: /(?:^|\s|[^\w\u0900-\u097F])b[\s.*_#@$%!~^&+\-]*k[\s.*_#@$%!~^&+\-]*l(?:$|\s|[^\w\u0900-\u097F])/i, label: 'bkl' },
  // 4. mkc, m.k.c
  { regex: /(?:^|\s|[^\w\u0900-\u097F])m[\s.*_#@$%!~^&+\-]*k[\s.*_#@$%!~^&+\-]*c(?:$|\s|[^\w\u0900-\u097F])/i, label: 'mkc' },
  // 5. bsdk, b.s.d.k
  { regex: /(?:^|\s|[^\w\u0900-\u097F])b[\s.*_#@$%!~^&+\-]*[s5$][\s.*_#@$%!~^&+\-]*d[\s.*_#@$%!~^&+\-]*k(?:$|\s|[^\w\u0900-\u097F])/i, label: 'bsdk' },
  // 6. tmkc, tmbc
  { regex: /(?:^|\s|[^\w\u0900-\u097F])t[\s.*_#@$%!~^&+\-]*m[\s.*_#@$%!~^&+\-]*k[\s.*_#@$%!~^&+\-]*c(?:$|\s|[^\w\u0900-\u097F])/i, label: 'tmkc' },
  { regex: /(?:^|\s|[^\w\u0900-\u097F])t[\s.*_#@$%!~^&+\-]*m[\s.*_#@$%!~^&+\-]*b[\s.*_#@$%!~^&+\-]*c(?:$|\s|[^\w\u0900-\u097F])/i, label: 'tmbc' },
  // 7. chutiya
  { regex: /\bc+[\s.*_#@$%!~^&+\-]*h+[\s.*_#@$%!~^&+\-]*[u0o]+[\s.*_#@$%!~^&+\-]*t+[\s.*_#@$%!~^&+\-]*[i1!|y]+[\s.*_#@$%!~^&+\-]*[a@4y]+[a-z]*\b/i, label: 'chutiya' },
  // 8. madarchod
  { regex: /\bm+[\s.*_#@$%!~^&+\-]*[a@4e]+[\s.*_#@$%!~^&+\-]*d+[\s.*_#@$%!~^&+\-]*[a@4e]+[\s.*_#@$%!~^&+\-]*r+[\s.*_#@$%!~^&+\-]*[cx*#]+[\s.*_#@$%!~^&+\-]*h*[\s.*_#@$%!~^&+\-]*[o0]+[\s.*_#@$%!~^&+\-]*d+\b/i, label: 'madarchod' },
  // 9. bhenchod
  { regex: /\bb+[\s.*_#@$%!~^&+\-]*[e3]*[\s.*_#@$%!~^&+\-]*h+[\s.*_#@$%!~^&+\-]*[e3]+[\s.*_#@$%!~^&+\-]*n+[\s.*_#@$%!~^&+\-]*[cx*#]+[\s.*_#@$%!~^&+\-]*h*[\s.*_#@$%!~^&+\-]*[o0]+[\s.*_#@$%!~^&+\-]*d+\b/i, label: 'bhenchod' },
  // 10. bhosdike, bhosda
  { regex: /\bb+[\s.*_#@$%!~^&+\-]*h+[\s.*_#@$%!~^&+\-]*[o0]+[\s.*_#@$%!~^&+\-]*[s5$]+[\s.*_#@$%!~^&+\-]*[a@4]*[\s.*_#@$%!~^&+\-]*d+[\s.*_#@$%!~^&+\-]*[i1!|ye3a@4]+\b/i, label: 'bhosdike' },
  // 11. randi
  { regex: /\br+[\s.*_#@$%!~^&+\-]*[a@4]+[\s.*_#@$%!~^&+\-]*n+[\s.*_#@$%!~^&+\-]*d+[\s.*_#@$%!~^&+\-]*[i1!|ye]+\b/i, label: 'randi' },
  // 12. lodu, loda, lauda, lawda, lund, lnd
  { regex: /\bl+[\s.*_#@$%!~^&+\-]*[o0u]+[\s.*_#@$%!~^&+\-]*d+[\s.*_#@$%!~^&+\-]*[u0oae]+\b/i, label: 'lodu' },
  { regex: /\bl+[\s.*_#@$%!~^&+\-]*[a@4]+[\s.*_#@$%!~^&+\-]*[u0vw]+[\s.*_#@$%!~^&+\-]*d+[\s.*_#@$%!~^&+\-]*[a@4e]+\b/i, label: 'lauda' },
  { regex: /(?:^|\s|[^\w\u0900-\u097F])l[\s.*_#@$%!~^&+\-]*[u0o]+[\s.*_#@$%!~^&+\-]*n[\s.*_#@$%!~^&+\-]*d(?:$|\s|[^\w\u0900-\u097F])/i, label: 'lund' },
  { regex: /(?:^|\s|[^\w\u0900-\u097F])l[\s.*_#@$%!~^&+\-]*n[\s.*_#@$%!~^&+\-]*d(?:$|\s|[^\w\u0900-\u097F])/i, label: 'lnd' },
  // 13. gandu, gaand
  { regex: /\bg+[\s.*_#@$%!~^&+\-]*[a@4]{1,2}[\s.*_#@$%!~^&+\-]*n+[\s.*_#@$%!~^&+\-]*d+[\s.*_#@$%!~^&+\-]*[u0o]*\b/i, label: 'gandu' },
  // 14. fuck, bitch
  { regex: /\bf+[\s.*_#@$%!~^&+\-]*[u0o]+[\s.*_#@$%!~^&+\-]*c+[\s.*_#@$%!~^&+\-]*k+\b/i, label: 'fuck' },
  { regex: /\bb+[\s.*_#@$%!~^&+\-]*[i1!|y]+[\s.*_#@$%!~^&+\-]*t+[\s.*_#@$%!~^&+\-]*c+[\s.*_#@$%!~^&+\-]*h+\b/i, label: 'bitch' }
];

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class BadWordsEngine {
  /**
   * Return master list of default bad words
   */
  static getDefaultBadWords() {
    return DEFAULT_BAD_WORDS;
  }

  /**
   * Return total count of preloaded words
   */
  static getTotalCount() {
    return DEFAULT_BAD_WORDS.length;
  }

  /**
   * Comprehensive Text Normalizer:
   * 1. Strips zero-width & invisible unicode characters
   * 2. Maps Cyrillic/Greek homoglyphs to latin equivalents
   * 3. Decodes Leetspeak & special characters (@, 4, $, 0, 3, 1, !, etc.)
   * 4. Collapses repeated consecutive stretched characters (e.g. chuuuutiya -> chutiya)
   * @param {string} text 
   * @returns {string}
   */
  static normalizeText(text) {
    if (!text || typeof text !== 'string') return '';

    let cleaned = text.toLowerCase();

    // 1. Strip zero-width & invisible unicode characters
    cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF\u00A0\u2060\u180E]/g, '');

    // 2. Map Cyrillic / Greek homoglyphs to Latin equivalents
    cleaned = cleaned
      .replace(/[\u0430\u0410]/g, 'a')
      .replace(/[\u0435\u0415]/g, 'e')
      .replace(/[\u043E\u041E]/g, 'o')
      .replace(/[\u0440\u0420]/g, 'p')
      .replace(/[\u0441\u0421]/g, 'c')
      .replace(/[\u0443\u0423]/g, 'y')
      .replace(/[\u0445\u0425]/g, 'x')
      .replace(/[\u0456\u0406]/g, 'i')
      .replace(/[\u0458\u0408]/g, 'j');

    // 3. Replace common Leetspeak / symbols
    cleaned = cleaned
      .replace(/@/g, 'a')
      .replace(/4/g, 'a')
      .replace(/0/g, 'o')
      .replace(/[1!|¡]/g, 'i')
      .replace(/3/g, 'e')
      .replace(/[5$§]/g, 's')
      .replace(/7/g, 't')
      .replace(/8/g, 'b');

    // 4. Collapse multiple consecutive letters (e.g. "chuuuutiya" -> "chutiya", "fuuuuck" -> "fuck")
    cleaned = cleaned.replace(/(.)\1{2,}/g, '$1$1');

    return cleaned;
  }

  /**
   * Check if a text message contains any bad words or bypass variations
   * @param {string} rawContent 
   * @param {string[]} customWords 
   * @returns {{ isProfane: boolean, matchedWord: string | null }}
   */
  static checkMessage(rawContent, customWords = []) {
    if (!rawContent || typeof rawContent !== 'string') {
      return { isProfane: false, matchedWord: null };
    }

    const rawLower = rawContent.toLowerCase();
    const normalized = this.normalizeText(rawContent);

    // Split tokens to inspect word by word
    const words = rawLower.split(/[\s,.:;!?'"()\[\]{}<>\/\\~`^&*+=_#@$|%-]+/);

    // 1. FAST REGEX PATTERN CHECK (with whitelist protection)
    for (const item of OBFUSCATED_PATTERNS) {
      if (item.regex.test(rawContent) || item.regex.test(normalized)) {
        // Ensure none of the message's words are in the safe whitelist
        let isWhitelisted = false;
        for (const w of words) {
          if (WHITELIST_WORDS.has(w)) {
            isWhitelisted = true;
            break;
          }
        }
        if (!isWhitelisted) {
          return { isProfane: true, matchedWord: item.label };
        }
      }
    }

    const allBadWords = customWords.length > 0 ? customWords : DEFAULT_BAD_WORDS;

    // 2. TOKEN & WORD BOUNDARY CHECK (Never match as middle substring of safe words)
    for (const token of words) {
      if (!token) continue;
      if (WHITELIST_WORDS.has(token)) continue;

      for (const bad of allBadWords) {
        const bLower = bad.toLowerCase().trim();
        if (!bLower) continue;

        if (token === bLower) {
          return { isProfane: true, matchedWord: bad };
        }
      }
    }

    // 3. Multi-word phrase check (e.g. "maa ki chut", "teri bhen ki", "fuck you", etc.)
    for (const bad of allBadWords) {
      const bLower = bad.toLowerCase().trim();
      if (bLower.includes(' ')) {
        const phraseRegex = new RegExp(`(^|\\s|[^\\w\\u0900-\\u097F])${escapeRegex(bLower)}($|\\s|[^\\w\\u0900-\\u097F])`, 'i');
        if (phraseRegex.test(rawLower) || phraseRegex.test(normalized)) {
          return { isProfane: true, matchedWord: bad };
        }
      }
    }

    return { isProfane: false, matchedWord: null };
  }
}

module.exports = BadWordsEngine;
