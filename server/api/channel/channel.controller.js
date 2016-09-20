'use strict';

var _ = require('lodash');
var Channel = require('./channel.model');

// Get list of channels
exports.index = function(req, res) {
  Channel.find(function (err, channels) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(channels);
  });
};

// Get a single channel
exports.show = function(req, res) {
  Channel.findById(req.params.id, function (err, channel) {
    if(err) { return handleError(res, err); }
    if(!channel) { return res.status(404).send('Not Found'); }
    return res.json(channel);
  });
};

// Creates a new channel in the DB.
exports.create = function(req, res) {
  Channel.create(req.body, function(err, channel) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(channel);
  });
};

// Updates an existing channel in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Channel.findById(req.params.id, function (err, channel) {
    if (err) { return handleError(res, err); }
    if(!channel) { return res.status(404).send('Not Found'); }
    var updated = _.merge(channel, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(channel);
    });
  });
};

// Deletes a channel from the DB.
exports.destroy = function(req, res) {
  Channel.findById(req.params.id, function (err, channel) {
    if(err) { return handleError(res, err); }
    if(!channel) { return res.status(404).send('Not Found'); }
    channel.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}