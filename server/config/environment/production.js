'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/luttetubebackend'
  },
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