/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below
var User = require('../api/user/user.model');
//var Submission = require('../api/submission/submission.model');

User.find({}).remove(function() {
    User.create(require('../api/user/user.seed.json'));
});

//Submission.find({}).remove();