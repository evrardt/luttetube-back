'use strict';

var _ = require('lodash');
var LutteVideo = require('./lutteVideo.model');

// Get list of lutteVideos
exports.index = function(req, res) {
  LutteVideo.find(function (err, lutteVideos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(lutteVideos);
  });
};

// Get a single lutteVideo
exports.show = function(req, res) {
  LutteVideo.findById(req.params.id, function (err, lutteVideo) {
    if(err) { return handleError(res, err); }
    if(!lutteVideo) { return res.status(404).send('Not Found'); }
    return res.json(lutteVideo);
  });
};

// Creates a new lutteVideo in the DB.
exports.create = function(req, res) {
  LutteVideo.create(req.body, function(err, lutteVideo) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(lutteVideo);
  });
};

// Updates an existing lutteVideo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  LutteVideo.findById(req.params.id, function (err, lutteVideo) {
    if (err) { return handleError(res, err); }
    if(!lutteVideo) { return res.status(404).send('Not Found'); }
    var updated = _.merge(lutteVideo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(lutteVideo);
    });
  });
};

// Deletes a lutteVideo from the DB.
exports.destroy = function(req, res) {
  LutteVideo.findById(req.params.id, function (err, lutteVideo) {
    if(err) { return handleError(res, err); }
    if(!lutteVideo) { return res.status(404).send('Not Found'); }
    lutteVideo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}