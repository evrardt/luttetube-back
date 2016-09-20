/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var Channel = require('../api/channel/channel.model');
var Type = require('../api/type/type.model');
var Place = require('../api/place/place.model');
var Playlist = require('../api/playlist/playlist.model');
var Video = require('../api/video/video.model');
var User = require('../api/user/user.model');
//var Submission = require('../api/submission/submission.model');

/*User.find({}).remove(function() {
    User.create(require('../api/user/user.seed.json'));
});*/

//Submission.find({}).remove();