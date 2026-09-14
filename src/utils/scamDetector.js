const { createCanvas, loadImage } = require('@napi-rs/canvas');
const jsQR = require('jsqr');
let Tesseract = null;
try {
  Tesseract = require('tesseract.js');
} catch (err) {
  console.warn('[SCAM DETECTOR] tesseract.js could not be loaded:', err.message);
}

// In-memory LRU cache to avoid re-scanning the same image repeatedly
const scanCache = new Map();
const MAX_CACHE_SIZE = 500;

// High-risk dangerous file extensions commonly uploaded as malware/stealers
const DANGEROUS_EXTENSIONS = [
  '.scr', '.exe', '.bat', '.cmd', '.pif', '.vbs', '.vbe',
  '.ps1', '.iso', '.jar', '.hta', '.msi', '.com', '.reg'
];

// Typosquatted / phishing domain patterns that mimic Discord or Steam
const PHISHING_DOMAINS = [
  /discrod[.-]/i,
  /dlscord[.-]/i,
  /disccord[.-]/i,
  /discord-nitro[.-]/i,
  /nitro-gift[.-]/i,
  /free-nitro[.-]/i,
  /discordgift[.-]/i,
  /discorde[.-]/i,
  /discort[.-]/i,
  /steanncommunity[.-]/i,
  /steamcomminuty[.-]/i,
  /steamcommunity-trade[.-]/i,
  /steam-gift[.-]/i,
  /steampromo[.-]/i,
  /steamairdrop[.-]/i
];

// Known scam text trigger groups
const SCAM_PATTERNS = [
  {
    type: 'STEAM_GIFT_CARD',
    label: 'Fake Steam Gift Card / Wallet Scam',
    patterns: [
      /\$?(50|100|200)\s*(steam\s*(gift|card|wallet)|gift\s*card)/i,
      /steam\s*community\s*(gift|giveaway|wallet)/i,
      /take\s*your\s*steam\s*gift/i,
      /claim\s*your\s*steam\s*card/i,
      /free\s*steam\s*(wallet|gift|code)/i,
      /steampromo/i
    ]
  },
  {
    type: 'NITRO_PHISHING',
    label: 'Discord Nitro Phishing Scam',
    patterns: [
      /discord\s*nitro\s*(for\s*free|free\s*for|free\s*month|3\s*months|year)/i,
      /claim\s*(your\s*)?(free\s*)?nitro/i,
      /nitro\s*(airdrop|giveaway|celebration)/i,
      /scan\s*(this\s*)?qr\s*code\s*(to\s*get|for)\s*nitro/i,
      /free\s*nitro\s*(promo|generator|subscription)/i,
      /get\s*3\s*months\s*of\s*discord\s*nitro/i
    ]
  },
  {
    type: 'ACCIDENTAL_REPORT_SCAM',
    label: 'Steam Account False Report Scam',
    patterns: [
      /accidentally\s*reported\s*(your\s*)?(steam\s*)?account/i,
      /i\s*reported\s*you\s*by\s*mistake/i,
      /contact\s*(the\s*)?(steam|valve)\s*admin/i,
      /valve\s*support\s*(on\s*discord|rep)/i,
      /account\s*pending\s*ban\s*appeal/i
    ]
  },
  {
    type: 'CRYPTO_AIRDROP_SCAM',
    label: 'Fake Crypto / Token Giveaway Scam',
    patterns: [
      /(elon\s*musk|tesla|binance)\s*(airdrop|giveaway|promo)/i,
      /\b\d{3,5}\s*(usdt|eth|btc|sol)\s*(giveaway|claim|airdrop)/i,
      /use\s*code\s*[:\s]*[a-z0-9]+\s*to\s*claim/i,
      /crypto\s*airdrop\s*event/i
    ]
  },
  {
    type: 'BETA_TESTER_STEALER',
    label: 'Fake Game Beta / Malware Download Scam',
    patterns: [
      /(test|playtest)\s*my\s*(new\s*)?(indie\s*game|steam\s*game)/i,
      /paying\s*\$?(20|50|100)\s*to\s*(test|try)\s*my\s*game/i,
      /download\s*and\s*run\s*the\s*(game|demo|exe)/i,
      /looking\s*for\s*(game\s*)?testers\s*\$/i
    ]
  }
];

class ScamDetector {
  /**
   * Fast synchronous scan of text content
   * @param {string} text
   * @returns {{ isScam: boolean, scamType?: string, reason?: string, matched?: string }}
   */
  static checkText(text) {
    if (!text || typeof text !== 'string') return { isScam: false };
    const clean = text.toLowerCase();

    // 1. Phishing Domain Check
    for (const pattern of PHISHING_DOMAINS) {
      if (pattern.test(clean)) {
        return {
          isScam: true,
          scamType: 'PHISHING_DOMAIN',
          reason: 'Message contains a known phishing or counterfeit domain mimicking Discord or Steam.',
          matched: pattern.toString()
        };
      }
    }

    // 2. Scam Text Patterns
    for (const group of SCAM_PATTERNS) {
      for (const p of group.patterns) {
        if (p.test(clean)) {
          return {
            isScam: true,
            scamType: group.type,
            reason: group.label,
            matched: p.toString()
          };
        }
      }
    }

    return { isScam: false };
  }

  /**
   * Scan image buffer or URL for QR codes using @napi-rs/canvas and jsQR
   * @param {string|Buffer} imageInput
   * @returns {Promise<{ found: boolean, isHijack?: boolean, data?: string, reason?: string }>}
   */
  static async scanQrCode(imageInput) {
    try {
      const img = await loadImage(imageInput);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        const data = code.data.trim();
        // Discord Mobile Login Hijack: Discord Remote Auth URLs look like: https://discord.com/ra/xxxx
        if (/discord(app)?\.com\/ra\/[a-zA-Z0-9_-]+/i.test(data)) {
          return {
            found: true,
            isHijack: true,
            data,
            reason: 'Discord Remote Auth (QR Code Login) token grabber hijack detected.'
          };
        }

        // Check if QR data directs to a known phishing domain
        for (const pd of PHISHING_DOMAINS) {
          if (pd.test(data)) {
            return {
              found: true,
              isHijack: true,
              data,
              reason: `QR code points to a phishing domain: ${data}`
            };
          }
        }

        return { found: true, isHijack: false, data };
      }
    } catch (err) {
      // Non-fatal if QR scanner cannot parse image format
    }
    return { found: false };
  }

  /**
   * Scan image for embedded scam text using OCR (Tesseract.js)
   * @param {string|Buffer} imageInput
   * @returns {Promise<{ hasScamText: boolean, text: string, scamType?: string, reason?: string }>}
   */
  static async scanImageOcr(imageInput) {
    if (!Tesseract) return { hasScamText: false, text: '' };

    try {
      // Run OCR with a 6-second race timeout so message execution never hangs
      const ocrPromise = Tesseract.recognize(imageInput, 'eng', {
        logger: () => {}
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('OCR Timeout')), 6000)
      );

      const result = await Promise.race([ocrPromise, timeoutPromise]);
      const extractedText = result?.data?.text || '';

      if (extractedText.trim().length > 0) {
        const check = this.checkText(extractedText);
        if (check.isScam) {
          return {
            hasScamText: true,
            text: extractedText.trim(),
            scamType: check.scamType,
            reason: check.reason
          };
        }
      }

      return { hasScamText: false, text: extractedText.trim() };
    } catch (err) {
      return { hasScamText: false, text: '' };
    }
  }

  /**
   * Comprehensive scan of a Discord Message (Text, Attachments, Images, QR, Embeds)
   * @param {import('discord.js').Message} message
   * @returns {Promise<{ isScam: boolean, scamType?: string, reason?: string, details?: string, ocrText?: string, qrData?: string, evidenceUrl?: string }>}
   */
  static async analyzeMessage(message) {
    if (!message) return { isScam: false };

    // 1. DANGEROUS FILE ATTACHMENTS
    if (message.attachments && message.attachments.size > 0) {
      for (const [_, attachment] of message.attachments) {
        const filename = (attachment.name || '').toLowerCase();
        for (const ext of DANGEROUS_EXTENSIONS) {
          if (filename.endsWith(ext)) {
            return {
              isScam: true,
              scamType: 'DANGEROUS_FILE_ATTACHMENT',
              reason: `Malicious or executable file attachment detected: \`${attachment.name}\``,
              details: `Blocked executable extension \`${ext}\` commonly associated with Discord token grabbers and malware.`,
              evidenceUrl: attachment.url
            };
          }
        }
      }
    }

    // 2. TEXT CONTENT & EMBED CHECKS
    const textToCheck = [
      message.content,
      ...message.embeds.map(e => `${e.title || ''} ${e.description || ''} ${e.footer?.text || ''}`)
    ].join(' ');

    const textCheck = this.checkText(textToCheck);
    if (textCheck.isScam) {
      return {
        isScam: true,
        scamType: textCheck.scamType,
        reason: textCheck.reason,
        details: `Triggered by matching pattern: ${textCheck.matched}`,
        ocrText: textToCheck.slice(0, 500)
      };
    }

    // 3. IMAGE ATTACHMENTS & EMBED IMAGES (OCR + QR CODE SCANNING)
    const mediaUrls = [];
    if (message.attachments && message.attachments.size > 0) {
      for (const [_, att] of message.attachments) {
        const ct = att.contentType || '';
        const name = (att.name || '').toLowerCase();
        if (ct.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(name)) {
          mediaUrls.push({ url: att.url, name: att.name });
        }
      }
    }

    for (const embed of message.embeds) {
      if (embed.image?.url) mediaUrls.push({ url: embed.image.url, name: 'Embed Image' });
      if (embed.thumbnail?.url) mediaUrls.push({ url: embed.thumbnail.url, name: 'Embed Thumbnail' });
    }

    // Scan media
    for (const item of mediaUrls.slice(0, 3)) {
      // Check cache first
      if (scanCache.has(item.url)) {
        const cached = scanCache.get(item.url);
        if (cached.isScam) return cached;
        continue;
      }

      // 3a. Check for Phishing / Token-Grabber QR Code
      const qrResult = await this.scanQrCode(item.url);
      if (qrResult.found && qrResult.isHijack) {
        const scamResult = {
          isScam: true,
          scamType: 'QR_CODE_LOGIN_HIJACK',
          reason: 'Discord Mobile Login QR Code token grabber detected inside image.',
          details: qrResult.reason,
          qrData: qrResult.data,
          evidenceUrl: item.url
        };
        this.cacheResult(item.url, scamResult);
        return scamResult;
      }

      // 3b. Run OCR Text Extraction
      const ocrResult = await this.scanImageOcr(item.url);
      if (ocrResult.hasScamText) {
        const scamResult = {
          isScam: true,
          scamType: ocrResult.scamType,
          reason: ocrResult.reason,
          details: `Scam text found inside image: "${ocrResult.text.slice(0, 160)}"`,
          ocrText: ocrResult.text.slice(0, 800),
          evidenceUrl: item.url
        };
        this.cacheResult(item.url, scamResult);
        return scamResult;
      }

      this.cacheResult(item.url, { isScam: false });
    }

    return { isScam: false };
  }

  static cacheResult(key, result) {
    if (scanCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = scanCache.keys().next().value;
      scanCache.delete(oldestKey);
    }
    scanCache.set(key, result);
  }
}

module.exports = ScamDetector;
