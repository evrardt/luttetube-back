'use strict';

var _ = require('lodash');
var LuttePlaylist = require('./luttePlaylist.model');

// Get list of luttePlaylists
exports.index = function(req, res) {
  LuttePlaylist.find().sort('-date').exec(function (err, luttePlaylists) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json({ playlist : luttePlaylists });
  });
};

// Get a single luttePlaylist
exports.show = function(req, res) {
  LuttePlaylist.findById(req.params.id, function (err, luttePlaylist) {
    if (err) {
      return handleError(res, err);
    }
    if (!luttePlaylist) {
      return res.status(404).json({ status : 'Not Found' });
    }
    return res.status(200).json({ playlist : luttePlaylist });
  });
};

// Creates a new luttePlaylist in the DB.
exports.create = function(req, res) {
  LuttePlaylist.create(req.body, function(err, luttePlaylist) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json({ playlist : luttePlaylist });
  });
};

// Updates an existing luttePlaylist in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  LuttePlaylist.findById(req.params.id, function (err, luttePlaylist) {
    if (err) {
      return handleError(res, err);
    }
    if (!luttePlaylist) {
      return res.status(404).json({ status : 'Not Found' });
    }
    var updated = _.merge(luttePlaylist, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(luttePlaylist);
    });
  });
};

// Deletes a luttePlaylist from the DB.
exports.destroy = function(req, res) {
  LuttePlaylist.findById(req.params.id, function (err, luttePlaylist) {
    if (err) {
      return handleError(res, err);
    }
    if (!luttePlaylist) {
      return res.status(404).json({ status : 'Not Found' });
    }
    luttePlaylist.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).json({ status : 'No Content' });
    });
  });
};

function handleError(res, err) {
  // add error console log
  console.log(err);
  return res.status(500).json({ error : err });
}
