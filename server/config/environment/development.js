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

  GOOGLE_ID: '594035240990-sd43k0rdjr624v6bmnltkv3r1pi0ah8f.apps.googleusercontent.com',
  GOOGLE_SECRET: 'TVJ9uIIn87x_LJLA65wVuZT3',

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
