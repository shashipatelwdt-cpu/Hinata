/**
 * Advanced Text Normalizer & Anti-Bypass Evasion Engine
 * Emulates human-level reading comprehension by resolving obfuscations,
 * homoglyphs, zero-width characters, spaced letters, and leetspeak.
 */

// Mapping of Cyrillic, Greek, and mathematical lookalike symbols to Latin ASCII
const HOMOGLYPHS = {
  // Cyrillic
  'а': 'a', 'А': 'a', 'б': 'b', 'Б': 'b', 'в': 'v', 'В': 'b', 'г': 'g', 'Г': 'g',
  'д': 'd', 'Д': 'd', 'е': 'e', 'Е': 'e', 'ё': 'e', 'Ё': 'e', 'ж': 'zh', 'Ж': 'zh',
  'з': 'z', 'З': 'z', 'и': 'i', 'И': 'i', 'й': 'y', 'Й': 'y', 'к': 'k', 'К': 'k',
  'л': 'l', 'Л': 'l', 'м': 'm', 'М': 'm', 'н': 'h', 'Н': 'h', 'о': 'o', 'О': 'o',
  'п': 'p', 'П': 'p', 'р': 'r', 'Р': 'p', 'с': 'c', 'С': 'c', 'т': 't', 'Т': 't',
  'у': 'y', 'У': 'y', 'ф': 'f', 'Ф': 'f', 'х': 'x', 'Х': 'x', 'ц': 'ts', 'Ц': 'ts',
  'ч': 'ch', 'Ч': 'ch', 'ш': 'sh', 'Ш': 'sh', 'щ': 'sh', 'Щ': 'sh', 'ъ': '', 'Ъ': '',
  'ы': 'y', 'Ы': 'y', 'ь': '', 'Ь': '', 'э': 'e', 'Э': 'e', 'ю': 'yu', 'Ю': 'yu',
  'я': 'ya', 'Я': 'ya', 'і': 'i', 'І': 'i', 'ї': 'i', 'Ї': 'i', 'є': 'e', 'Є': 'e',
  // Greek
  'α': 'a', 'Α': 'a', 'β': 'b', 'Β': 'b', 'γ': 'g', 'Γ': 'g', 'δ': 'd', 'Δ': 'd',
  'ε': 'e', 'Ε': 'e', 'ζ': 'z', 'Ζ': 'z', 'η': 'h', 'Η': 'h', 'θ': 'th', 'Θ': 'th',
  'ι': 'i', 'Ι': 'i', 'κ': 'k', 'Κ': 'k', 'λ': 'l', 'Λ': 'l', 'μ': 'm', 'Μ': 'm',
  'ν': 'n', 'Ν': 'n', 'ξ': 'x', 'Ξ': 'x', 'ο': 'o', 'Ο': 'o', 'π': 'p', 'Π': 'p',
  'ρ': 'r', 'Ρ': 'p', 'σ': 's', 'Σ': 's', 'τ': 't', 'Τ': 't', 'υ': 'u', 'Υ': 'y',
  'φ': 'f', 'Φ': 'f', 'χ': 'x', 'Χ': 'x', 'ψ': 'ps', 'Ψ': 'ps', 'ω': 'o', 'Ω': 'o'
};

// Common Leetspeak character substitutions
const LEETSPEAK = {
  '@': 'a', '4': 'a', '^': 'a',
  '8': 'b',
  '(': 'c', '<': 'c', '{': 'c', '[': 'c',
  '3': 'e', '€': 'e',
  '6': 'g', '9': 'g',
  '#': 'h',
  '1': 'i', '!': 'i', '|': 'i', '¡': 'i', 'l': 'i',
  '0': 'o',
  '5': 's', '$': 's', '§': 's',
  '7': 't', '+': 't',
  'v': 'u',
  '\\/\\/': 'w', 'vv': 'w',
  '%': 'x',
  '2': 'z'
};

class TextNormalizer {
  /**
   * Remove zero-width, non-printable, and invisible unicode characters
   */
  static cleanZeroWidth(text) {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/[\u200B-\u200D\uFEFF\u00A0\u2060\u180E\u202F\u205F\u3000\u034F]/g, '');
  }

  /**
   * Standard Unicode NFD normalization to remove accents, diacritics, and combining marks
   */
  static stripDiacritics(text) {
    if (!text) return '';
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Replace known homoglyphs (Cyrillic, Greek, Math letters) with ASCII equivalents
   */
  static replaceHomoglyphs(text) {
    if (!text) return '';
    let result = '';
    for (const char of text) {
      result += HOMOGLYPHS[char] || char;
    }
    return result;
  }

  /**
   * Translate common leetspeak characters into letters
   */
  static decodeLeetspeak(text) {
    if (!text) return '';
    let out = text;
    // Multi-char leet substitutions first
    out = out.replace(/\\\/\\\//g, 'w').replace(/vv/g, 'w');
    // Single-char substitutions
    for (const [leet, normal] of Object.entries(LEETSPEAK)) {
      if (leet.length === 1) {
        out = out.split(leet).join(normal);
      }
    }
    return out;
  }

  /**
   * Collapses repeating character spam (e.g. "fuuuck" -> "fuck", "nooooooo" -> "noo")
   */
  static collapseRepeats(text, maxKeep = 2) {
    if (!text) return '';
    const regex = new RegExp(`(.)\\1{${maxKeep},}`, 'g');
    return text.replace(regex, '$1$1');
  }

  /**
   * Collapses spaced out text used to evade filters (e.g. "f u c k" -> "fuck", "s . h . i . t" -> "shit")
   */
  static collapseSpacedLetters(text) {
    if (!text) return '';
    // Detect single letters separated by space or dots/dashes
    return text.replace(/(?:^|\s)([a-z0-9])[\s._\-*~]+([a-z0-9])(?:[\s._\-*~]+([a-z0-9]))*(?=$|\s)/gi, (match) => {
      const compacted = match.replace(/[\s._\-*~]+/g, '');
      return compacted.length >= 3 ? compacted : match;
    });
  }

  /**
   * Master de-obfuscation pipeline.
   * Returns a clean, normalized version of the input suitable for filter matching.
   * @param {string} text
   * @returns {string}
   */
  static normalize(text) {
    if (!text || typeof text !== 'string') return '';

    let res = this.cleanZeroWidth(text);
    res = this.stripDiacritics(res);
    res = this.replaceHomoglyphs(res);
    res = res.toLowerCase();
    res = this.decodeLeetspeak(res);
    res = this.collapseRepeats(res, 2);
    res = this.collapseSpacedLetters(res);

    return res.trim();
  }

  /**
   * Generates candidate variations to detect subtle evasion attempts
   * @param {string} text
   * @returns {string[]}
   */
  static getVariations(text) {
    if (!text) return [];
    const base = this.normalize(text);
    const noPunctuation = base.replace(/[^a-z0-9\s]/g, '');
    const compactNoSpaces = noPunctuation.replace(/\s+/g, '');
    
    return Array.from(new Set([
      text.toLowerCase(),
      base,
      noPunctuation,
      compactNoSpaces
    ]));
  }
}

module.exports = TextNormalizer;
