/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var LutteVideo = require('../api/lutteVideo/lutteVideo.model');
var User = require('../api/user/user.model');

User.find({}).remove(function() {
    User.create(require('../api/user/user.seed.json'));
});