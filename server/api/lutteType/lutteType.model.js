'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LutteTypeSchema = new Schema({
  type: String
});

module.exports = mongoose.model('LutteType', LutteTypeSchema);