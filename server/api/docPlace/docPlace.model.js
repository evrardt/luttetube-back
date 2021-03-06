'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DocPlaceSchema = new Schema({
  city: String,
  location: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('DocPlace', DocPlaceSchema);