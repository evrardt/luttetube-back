'use strict';

var _ = require('lodash');
var Type = require('./type.model');

// Get list of types
exports.index = function(req, res) {
  Type.find(function (err, types) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(types);
  });
};

// Get list of types filtered by channel name
exports.indexByChannel = function(req, res) {
  Type.find({'channel': req.params.name}, function (err, types) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(types);
  });
};

// Get list of types filtered by channel name with a page token
exports.indexByChannelAndPageToken = function(req, res) {
  Type.find({'channel': req.params.name}).skip(req.params.index).limit(req.params.offset).exec(function (err, types) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(types);
  });
};

// Get a single type
exports.show = function(req, res) {
  Type.findById(req.params.id, function (err, type) {
    if(err) { return handleError(res, err); }
    if(!type) { return res.status(404).send('Not Found'); }
    return res.json(type);
  });
};

// Creates a new type in the DB.
exports.create = function(req, res) {
  Type.create(req.body, function(err, type) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(type);
  });
};

// Updates an existing type in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Type.findById(req.params.id, function (err, type) {
    if (err) { return handleError(res, err); }
    if(!type) { return res.status(404).send('Not Found'); }
    var updated = _.merge(type, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(type);
    });
  });
};

// Deletes a type from the DB.
exports.destroy = function(req, res) {
  Type.findById(req.params.id, function (err, type) {
    if(err) { return handleError(res, err); }
    if(!type) { return res.status(404).send('Not Found'); }
    type.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}