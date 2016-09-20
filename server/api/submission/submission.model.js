'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
  category: String,
  playlist: String,
  playlistId: String,
  link: String,
  title: String,
  duration: String,
  embed: String,
  thumbnail: String,
  status: Number,
  validatedBy: String,
  type: String,
  newCategory: Boolean,
  newPlaylist: Boolean
});

module.exports = mongoose.model('Submission', SubmissionSchema);