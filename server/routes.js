/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/submissions', require('./api/submission'));
  app.use('/api/lutte/videos', require('./api/lutteVideo'));
  app.use('/api/doc/videos', require('./api/docVideo'));
  app.use('/api/lutte/playlists', require('./api/luttePlaylist'));
  app.use('/api/lutte/places', require('./api/luttePlace'));
  app.use('/api/lutte/types', require('./api/lutteType'));
  app.use('/api/doc/playlists', require('./api/docPlaylist'));
  app.use('/api/doc/places', require('./api/docPlace'));
  app.use('/api/doc/types', require('./api/docType'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/youtube/playlists', require('./api/youtube/playlist'));

  app.use('/auth', require('./auth'));
  

};
