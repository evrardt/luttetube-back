'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VideoSchema = new Schema({
  publishedAt: Date,
  id: String,
  thumbnail: String,
  title: String,
  playlistId: String,
  link: String,
  duration: String,
  hosting: String,
  channel: String
});

module.exports = mongoose.model('Video', VideoSchema);