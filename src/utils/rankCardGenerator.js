const { createCanvas, loadImage } = require('@napi-rs/canvas');
const https = require('https');
const http = require('http');

/**
 * Fetch image buffer safely with timeout
 * @param {string} url 
 * @param {number} timeoutMs 
 * @returns {Promise<Buffer|null>}
 */
async function fetchImageBuffer(url, timeoutMs = 3500) {
  if (!url) return null;
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, { timeout: timeoutMs }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return resolve(null);
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      });
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.on('error', () => resolve(null));
    } catch {
      resolve(null);
    }
  });
}

/**
 * Helper to draw rounded rectangle
 */
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Generate AmariBot-style Rank Card
 * 
 * @param {Object} options
 * @param {string} options.username - Username to display
 * @param {string} [options.avatarUrl] - User avatar image URL
 * @param {number|string} [options.serverRank=1] - Server rank (#)
 * @param {number|string} [options.weeklyRank=1] - Weekly rank (#)
 * @param {number|string} [options.weeklyXp=0] - Weekly XP earned
 * @param {number} [options.level=0] - Current level
 * @param {number} [options.currentXp=0] - XP in current level
 * @param {number} [options.neededXp=100] - XP needed for next level
 * @param {string} [options.accentColor='#f4c444'] - Hex accent color
 * @returns {Promise<Buffer>} PNG Buffer
 */
async function generateRankCard({
  username = 'Member',
  avatarUrl = null,
  serverRank = 1,
  weeklyRank = 1,
  weeklyXp = 0,
  level = 0,
  currentXp = 0,
  neededXp = 100,
  accentColor = '#f4c444'
}) {
  const width = 940;
  const height = 260;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Validate accent color
  const safeAccent = /^#([0-9A-Fa-f]{6})$/.test(accentColor) ? accentColor : '#f4c444';

  // 1. Draw Card Background
  roundRect(ctx, 0, 0, width, height, 16);
  ctx.fillStyle = '#202226'; // Dark charcoal
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2b2d31';
  ctx.stroke();

  // 2. Draw Avatar
  const avatarCenterX = 95;
  const avatarCenterY = 110;
  const avatarRadius = 55;

  let avatarLoaded = false;
  if (avatarUrl) {
    try {
      const buffer = await fetchImageBuffer(avatarUrl);
      if (buffer) {
        const img = await loadImage(buffer);
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          img,
          avatarCenterX - avatarRadius,
          avatarCenterY - avatarRadius,
          avatarRadius * 2,
          avatarRadius * 2
        );
        ctx.restore();
        avatarLoaded = true;
      }
    } catch {
      avatarLoaded = false;
    }
  }

  // Fallback avatar if failed
  if (!avatarLoaded) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCenterX, avatarCenterY, avatarRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#313338';
    ctx.fill();
    ctx.fillStyle = safeAccent;
    ctx.font = 'bold 42px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((username[0] || 'M').toUpperCase(), avatarCenterX, avatarCenterY);
    ctx.restore();
  }

  // 3. Accent bar under avatar
  const pillWidth = 72;
  const pillHeight = 12;
  const pillX = avatarCenterX - pillWidth / 2;
  const pillY = 182;
  roundRect(ctx, pillX, pillY, pillWidth, pillHeight, 6);
  ctx.fillStyle = safeAccent;
  ctx.fill();

  // 4. Middle Section - User Name & Stats
  // Username (with truncate if very long)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  let displayUsername = username;
  if (ctx.measureText(displayUsername).width > 420) {
    while (ctx.measureText(displayUsername + '...').width > 420 && displayUsername.length > 0) {
      displayUsername = displayUsername.slice(0, -1);
    }
    displayUsername += '...';
  }
  ctx.fillText(displayUsername, 185, 82);

  // Stats Columns
  const col1X = 185;
  const col2X = 345;
  const col3X = 495;

  // Headers (Muted Gray)
  ctx.fillStyle = '#8e9297';
  ctx.font = 'bold 13px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillText('SERVER RANK', col1X, 130);
  ctx.fillText('WEEKLY RANK', col2X, 130);
  ctx.fillText('WEEKLY EXP', col3X, 130);

  // Values (Bold White)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.fillText(`#${serverRank}`, col1X, 172);
  ctx.fillText(`#${weeklyRank}`, col2X, 172);
  ctx.fillText(Number(weeklyXp || 0).toLocaleString(), col3X, 172);

  // 5. Right Stat Boxes
  const rightBoxX = 645;
  const rightBoxWidth = 260;

  // Box 1: LEVEL
  const levelBoxY = 38;
  const levelBoxHeight = 82;
  roundRect(ctx, rightBoxX, levelBoxY, rightBoxWidth, levelBoxHeight, 10);
  ctx.fillStyle = '#18191c';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#2c2e33';
  ctx.stroke();

  // "LEVEL" label
  ctx.fillStyle = '#8e9297';
  ctx.font = 'bold 14px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('LEVEL', rightBoxX + 22, levelBoxY + 50);

  // Level number
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(String(level || 0), rightBoxX + rightBoxWidth - 22, levelBoxY + 55);

  // Box 2: EXP
  const expBoxY = 132;
  const expBoxHeight = 92;
  roundRect(ctx, rightBoxX, expBoxY, rightBoxWidth, expBoxHeight, 10);
  ctx.fillStyle = '#18191c';
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#2c2e33';
  ctx.stroke();

  // "EXP" label
  ctx.fillStyle = '#8e9297';
  ctx.font = 'bold 13px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('EXP', rightBoxX + 22, expBoxY + 40);

  // Exp numbers: current / needed
  const safeCurrXp = Math.max(0, parseInt(currentXp) || 0);
  const safeNeedXp = Math.max(1, parseInt(neededXp) || 100);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${safeCurrXp.toLocaleString()} / ${safeNeedXp.toLocaleString()}`, rightBoxX + rightBoxWidth - 22, expBoxY + 40);

  // Progress bar in EXP box
  const barX = rightBoxX + 22;
  const barY = expBoxY + 56;
  const barWidth = rightBoxWidth - 44;
  const barHeight = 12;
  const barRadius = 6;

  // Track background
  roundRect(ctx, barX, barY, barWidth, barHeight, barRadius);
  ctx.fillStyle = '#2b2d31';
  ctx.fill();

  // Progress Fill
  const progressRatio = Math.min(1, Math.max(0, safeCurrXp / safeNeedXp));
  if (progressRatio > 0) {
    const fillWidth = Math.max(barRadius * 2, Math.round(barWidth * progressRatio));
    roundRect(ctx, barX, barY, Math.min(barWidth, fillWidth), barHeight, barRadius);
    ctx.fillStyle = safeAccent;
    ctx.fill();
  }

  return canvas.toBuffer('image/png');
}

module.exports = { generateRankCard };
