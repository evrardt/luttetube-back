'use strict';

var _ = require('lodash');
var DocPlaylist = require('./docPlaylist.model');

// Get list of docPlaylists
exports.index = function(req, res) {
  DocPlaylist.find(function (err, docPlaylists) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json({ playlists : docPlaylists });
  });
};

// Get a single docPlaylist
exports.show = function(req, res) {
  DocPlaylist.findById(req.params.id, function (err, docPlaylist) {
    if (err) {
      return handleError(res, err);
    }
    if (!docPlaylist) {
      return res.status(404).json({ status : 'Not Found' });
    }
    return res.status(200).json({ playlist : docPlaylist });
  });
};

// Creates a new docPlaylist in the DB.
exports.create = function(req, res) {
  DocPlaylist.create(req.body, function(err, docPlaylist) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json({ playlist : docPlaylist });
  });
};

// Updates an existing docPlaylist in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  DocPlaylist.findById(req.params.id, function (err, docPlaylist) {
    if (err) {
      return handleError(res, err);
    }
    if (!docPlaylist) {
      return res.status(404).json({ status : 'Not Found' });
    }
    var updated = _.merge(docPlaylist, req.body);
    updated.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json({ playlist : docPlaylist });
    });
  });
};

// Deletes a docPlaylist from the DB.
exports.destroy = function(req, res) {
  DocPlaylist.findById(req.params.id, function (err, docPlaylist) {
    if (err) {
      return handleError(res, err);
    }
    if (!docPlaylist) {
      return res.status(404).json({ status : 'Not Found' });
    }
    docPlaylist.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).json({ status : 'No Content' });
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).json({ error : err });
}
