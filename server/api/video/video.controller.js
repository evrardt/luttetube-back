'use strict';

var _ = require('lodash');
var Video = require('./video.model');

// Get list of videos
exports.index = function(req, res) {
  Video.find(function (err, videos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(videos);
  });
};

// Get list of videos filtered by channel name
exports.indexByChannel = function(req, res) {
  Video.find({'channel': req.params.name}, function (err, videos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(videos);
  });
};

// Get list of videos filtered by channel name with a page token
exports.indexByChannelAndPageToken = function(req, res) {
  Video.find({'channel': req.params.name}).skip(req.params.index).limit(req.params.offset).exec(function (err, videos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(videos);
  });
};

// Get list of videos filtered by playlistId
exports.indexByPlaylistIdAndPageToken = function(req, res) {
  Video.find({'playlistId': req.params.id}).exec(function (err, videos) {
    console.log(videos);
    if(err) { return handleError(res, err); }
    return res.status(200).json(videos);
  });
};

// Get a single video
exports.show = function(req, res) {
  Video.findById(req.params.id, function (err, video) {
    if(err) { return handleError(res, err); }
    if(!video) { return res.status(404).send('Not Found'); }
    return res.json(video);
  });
};

// Creates a new video in the DB.
exports.create = function(req, res) {
  Video.create(req.body, function(err, video) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(video);
  });
};

// Updates an existing video in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Video.findById(req.params.id, function (err, video) {
    if (err) { return handleError(res, err); }
    if(!video) { return res.status(404).send('Not Found'); }
    var updated = _.merge(video, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(video);
    });
  });
};

// Deletes a video from the DB.
exports.destroy = function(req, res) {
  Video.findById(req.params.id, function (err, video) {
    if(err) { return handleError(res, err); }
    if(!video) { return res.status(404).send('Not Found'); }
    video.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}