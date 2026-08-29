const InviteTracker = require('../utils/inviteTracker');

module.exports = {
  name: 'inviteCreate',
  execute(invite) {
    InviteTracker.handleInviteCreate(invite);
  }
};
