'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
  category: String,
  playlist: String,
  link: [String],
  type: String,
  newCategory: Boolean,
  newPlaylist: Boolean
});

module.exports = mongoose.model('Submission', SubmissionSchema);