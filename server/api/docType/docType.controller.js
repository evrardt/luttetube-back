'use strict';

var _ = require('lodash');
var DocType = require('./docType.model');

// Get list of docTypes
exports.index = function(req, res) {
  DocType.find(function (err, docTypes) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json({ type : docTypes });
  });
};

// Get a single docType
exports.show = function(req, res) {
  DocType.findById(req.params.id, function (err, docType) {
    if (err) {
      return handleError(res, err);
    }
    if (!docType) {
      return res.status(404).json({ status : 'Not Found' });
    }
    return res.status(200).json({ type : docType });
  });
};

// Creates a new docType in the DB.
exports.create = function(req, res) {
  DocType.create(req.body, function(err, docType) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json({ type : docType });
  });
};

// Updates an existing docType in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  DocType.findById(req.params.id, function (err, docType) {
    if (err) {
      return handleError(res, err);
    }
    if (!docType) {
      return res.status(404).json({ status : 'Not Found' });
    }
    var updated = _.merge(docType, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json({ type : docType });
    });
  });
};

// Deletes a docType from the DB.
exports.destroy = function(req, res) {
  DocType.findById(req.params.id, function (err, docType) {
    if (err) {
      return handleError(res, err);
    }
    if (!docType) {
      return res.status(404).json({ status : 'Not Found' });
    }
    docType.remove(function(err) {
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
