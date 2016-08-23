'use strict';

var _ = require('lodash');
var Submission = require('./submission.model');

// Get list of submissions
exports.index = function(req, res) {
  Submission.find(function (err, submissions) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json({ submissions : submissions });
  });
};

// Get a single submission
exports.show = function(req, res) {
  Submission.findById(req.params.id, function (err, submission) {
    if (err) {
      return handleError(res, err);
    }
    if (!submission) {
      return res.status(404).json({ status : 'Not Found' });
    }
    return res.status(200).json({ response : submission });
  });
};

// Creates a new submission in the DB.
exports.create = function(req, res) {
  Submission.create(req.body, function(err, submission) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json({ data : submission });
  });
};

// Updates an existing submission in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Submission.findById(req.params.id, function (err, submission) {
    if (err) {
      return handleError(res, err);
    }
    if (!submission) {
      return res.status(404).json({ status : 'Not Found' });
    }
    var updated = _.merge(submission, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json({ data : submission });
    });
  });
};


// Deletes a submission from the DB.
exports.destroy = function(req, res) {
  Submission.findById(req.params.id, function (err, submission) {
    if (err) {
      return handleError(res, err);
    }
    if (!submission) {
      return res.status(404).json({ status : 'Not Found' });
    }
    submission.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).json({ status : 'No Content' });
    });
  });
};


function handleError(res, err) {
  return res.status(500).json({ error : err });
}
