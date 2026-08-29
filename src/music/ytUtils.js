const path = require('path');
const fs = require('fs');

/**
 * Cross-platform yt-dlp binary resolver
 * Automatically resolves binary path on Windows (.exe) and Linux/Unix (no extension)
 * @returns {string|null}
 */
function getYtDlpPath() {
  try {
    const ytdlExec = require('youtube-dl-exec');
    if (ytdlExec.constants?.YOUTUBE_DL_PATH && fs.existsSync(ytdlExec.constants.YOUTUBE_DL_PATH)) {
      return ytdlExec.constants.YOUTUBE_DL_PATH;
    }
  } catch {}

  const binName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
  const localBin = path.join(__dirname, '..', '..', 'node_modules', 'youtube-dl-exec', 'bin', binName);
  if (fs.existsSync(localBin)) {
    return localBin;
  }

  return null;
}

module.exports = {
  getYtDlpPath
};
