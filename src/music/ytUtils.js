const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

/**
 * Cross-platform yt-dlp binary resolver with automatic permission fixing on Linux/Render
 * @returns {string|null}
 */
function getYtDlpPath() {
  const isPosix = process.platform !== 'win32';
  const binName = isPosix ? 'yt-dlp' : 'yt-dlp.exe';

  // 1. Check youtube-dl-exec constants
  try {
    const ytdlExec = require('youtube-dl-exec');
    if (ytdlExec.constants?.YOUTUBE_DL_PATH && fs.existsSync(ytdlExec.constants.YOUTUBE_DL_PATH)) {
      const p = ytdlExec.constants.YOUTUBE_DL_PATH;
      if (isPosix) {
        try { fs.chmodSync(p, 0o755); } catch {}
      }
      return p;
    }
  } catch {}

  // 2. Check local node_modules bin
  const localBin = path.join(__dirname, '..', '..', 'node_modules', 'youtube-dl-exec', 'bin', binName);
  if (fs.existsSync(localBin)) {
    if (isPosix) {
      try { fs.chmodSync(localBin, 0o755); } catch {}
    }
    return localBin;
  }

  // 3. Check alternative node_modules paths
  const altBin = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', binName);
  if (fs.existsSync(altBin)) {
    if (isPosix) {
      try { fs.chmodSync(altBin, 0o755); } catch {}
    }
    return altBin;
  }

  // 4. Check system PATH
  try {
    const sysCmd = isPosix ? 'which yt-dlp' : 'where yt-dlp';
    const out = execSync(sysCmd, { stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
    if (out) {
      const sysPath = out.split('\n')[0].trim();
      if (fs.existsSync(sysPath)) return sysPath;
    }
  } catch {}

  return null;
}

module.exports = {
  getYtDlpPath
};

