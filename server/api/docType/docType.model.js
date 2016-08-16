'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DocTypeSchema = new Schema({
  type: String
});

module.exports = mongoose.model('DocType', DocTypeSchema);