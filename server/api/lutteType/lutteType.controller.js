'use strict';

var _ = require('lodash');
var LutteType = require('./lutteType.model');

// Get list of lutteTypes
exports.index = function(req, res) {
  LutteType.find(function (err, lutteTypes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(lutteTypes);
  });
};

// Get a single lutteType
exports.show = function(req, res) {
  LutteType.findById(req.params.id, function (err, lutteType) {
    if(err) { return handleError(res, err); }
    if(!lutteType) { return res.status(404).send('Not Found'); }
    return res.json(lutteType);
  });
};

// Creates a new lutteType in the DB.
exports.create = function(req, res) {
  LutteType.create(req.body, function(err, lutteType) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(lutteType);
  });
};

// Updates an existing lutteType in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  LutteType.findById(req.params.id, function (err, lutteType) {
    if (err) { return handleError(res, err); }
    if(!lutteType) { return res.status(404).send('Not Found'); }
    var updated = _.merge(lutteType, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(lutteType);
    });
  });
};

// Deletes a lutteType from the DB.
exports.destroy = function(req, res) {
  LutteType.findById(req.params.id, function (err, lutteType) {
    if(err) { return handleError(res, err); }
    if(!lutteType) { return res.status(404).send('Not Found'); }
    lutteType.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}