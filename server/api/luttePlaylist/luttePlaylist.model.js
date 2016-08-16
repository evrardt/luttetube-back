'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LuttePlaylistSchema = new Schema({
  id: String,
  channelId: String,
  description: String,
  title: String,
  type: String,
  date: Date,
  monthly: Boolean,
  place: String,
  publishedAt: Date,
  thumbnail: String
});

module.exports = mongoose.model('LuttePlaylist', LuttePlaylistSchema);