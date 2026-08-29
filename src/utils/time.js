const ms = require('ms');

class TimeUtils {
  static parseDuration(input) {
    if (!input) return null;
    try {
      const milliseconds = ms(input);
      if (!milliseconds || isNaN(milliseconds) || milliseconds < 1000) {
        return null;
      }
      return milliseconds;
    } catch {
      return null;
    }
  }

  static formatDuration(milliseconds) {
    if (!milliseconds || isNaN(milliseconds)) return '0s';
    return ms(milliseconds, { long: true });
  }

  static discordTimestamp(date, style = 'F') {
    const unix = Math.floor(new Date(date).getTime() / 1000);
    return `<t:${unix}:${style}> (<t:${unix}:R>)`;
  }
}

module.exports = TimeUtils;
