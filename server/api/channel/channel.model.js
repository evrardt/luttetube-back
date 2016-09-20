'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChannelSchema = new Schema({
  name: String,
  key: String,
  displayedName: String,
  title: String,
  maps: Boolean
});

module.exports = mongoose.model('Channel', ChannelSchema);