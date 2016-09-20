'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlaceSchema = new Schema({
  city: String,
  location: {
    lat: Number,
    lng: Number
  },
  channel: String
});

module.exports = mongoose.model('Place', PlaceSchema);