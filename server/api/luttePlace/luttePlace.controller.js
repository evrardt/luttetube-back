'use strict';

var _ = require('lodash');
var LuttePlace = require('./luttePlace.model');

// Get list of luttePlaces
exports.index = function(req, res) {
  LuttePlace.find(function (err, luttePlaces) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json({ places : luttePlaces });
  });
};

// Get a single luttePlace
exports.show = function(req, res) {
  LuttePlace.findById(req.params.id, function (err, luttePlace) {
    if (err) {
      return handleError(res, err);
    }
    if (!luttePlace) {
      return res.status(404).json({ status : 'Not Found' });
    }
    return res.status(200).json({ place : luttePlace });
  });
};

// Creates a new luttePlace in the DB.
exports.create = function(req, res) {
  LuttePlace.create(req.body, function(err, luttePlace) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json({ place : luttePlace });
  });
};

// Updates an existing luttePlace in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  LuttePlace.findById(req.params.id, function (err, luttePlace) {
    if (err) {
      return handleError(res, err);
    }
    if (!luttePlace) {
      return res.status(404).json({ status : 'Not Found' });
    }
    var updated = _.merge(luttePlace, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json({ place : luttePlace });
    });
  });
};

// Deletes a luttePlace from the DB.
exports.destroy = function(req, res) {
  LuttePlace.findById(req.params.id, function (err, luttePlace) {
    if (err) {
      return handleError(res, err);
    }
    if (!luttePlace) {
      return res.status(404).json({ status : 'Not Found' });
    }
    luttePlace.remove(function(err) {
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
