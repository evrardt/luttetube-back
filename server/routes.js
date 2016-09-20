/**
 * Main application routes
 */

'use strict';

var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/channels', require('./api/channel'));
  app.use('/api/submissions', require('./api/submission'));

  //app.use('/api/youtube/playlists', require('./api/youtube/playlist'));

  app.use('/api/users', require('./api/user'));
  app.use('/api/videos', require('./api/video'));
  app.use('/api/playlists', require('./api/playlist'));
  app.use('/api/places', require('./api/place'));
  app.use('/api/types', require('./api/type'));
  app.use('/auth', require('./auth'));
  

};
