'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/luttetubebackend-dev'
  },

  seedDB: true,
  SESSION_SECRET: "luttetubebackend-secret",

  FACEBOOK_ID: 'app-id',
  FACEBOOK_SECRET: 'secret',

  TWITTER_ID: 'app-id',
  TWITTER_SECRET: 'secret',

  GOOGLE_ID: 'app-id',
  GOOGLE_SECRET: 'secret',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
