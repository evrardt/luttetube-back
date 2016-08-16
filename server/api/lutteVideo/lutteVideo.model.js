'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LutteVideoSchema = new Schema({
  publishedAt: Date,
  id: String,
  thumbnail: String,
  title: String,
  playlistId: String,
  videoId: String,
  duration: String
});

module.exports = mongoose.model('LutteVideo', LutteVideoSchema);