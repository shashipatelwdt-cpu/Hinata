const InviteTracker = require('../utils/inviteTracker');

module.exports = {
  name: 'inviteDelete',
  execute(invite) {
    InviteTracker.handleInviteDelete(invite);
  }
};
