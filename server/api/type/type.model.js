'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TypeSchema = new Schema({
  type: String,
  channel: String
});

module.exports = mongoose.model('Type', TypeSchema);