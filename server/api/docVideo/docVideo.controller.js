'use strict';

var _ = require('lodash');
var DocVideo = require('./docVideo.model');

// Get list of docVideos
exports.index = function(req, res) {
  DocVideo.find(function (err, docVideos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(docVideos);
  });
};

// Get a single docVideo
exports.show = function(req, res) {
  DocVideo.findById(req.params.id, function (err, docVideo) {
    if(err) { return handleError(res, err); }
    if(!docVideo) { return res.status(404).send('Not Found'); }
    return res.json(docVideo);
  });
};

// Creates a new docVideo in the DB.
exports.create = function(req, res) {
  DocVideo.create(req.body, function(err, docVideo) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(docVideo);
  });
};

// Updates an existing docVideo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DocVideo.findById(req.params.id, function (err, docVideo) {
    if (err) { return handleError(res, err); }
    if(!docVideo) { return res.status(404).send('Not Found'); }
    var updated = _.merge(docVideo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(docVideo);
    });
  });
};

// Deletes a docVideo from the DB.
exports.destroy = function(req, res) {
  DocVideo.findById(req.params.id, function (err, docVideo) {
    if(err) { return handleError(res, err); }
    if(!docVideo) { return res.status(404).send('Not Found'); }
    docVideo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}