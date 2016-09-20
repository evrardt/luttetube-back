'use strict';

var _ = require('lodash');
var Playlist = require('./playlist.model');

// Get list of playlists
exports.index = function(req, res) {
  Playlist.find().sort('-date').exec(function (err, playlists) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(playlists);
  });
};

// Get count of playlists
exports.count = function(req, res) {
  Playlist.count({'channel': req.params.name}).exec(function (err, count) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(count);
  });
};

// Get count of playlists by category filtered by channel name
exports.countByChannelTypeAndPageToken = function(req, res) {
  console.log(req.params.category);
  Playlist.count({'channel': req.params.name, 'type': req.params.category}).exec(function (err, count) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(count);
  });
};

// Get list of playlists filtered by channel name
exports.indexByChannel = function(req, res) {
  Playlist.find({'channel': req.params.name}).sort('-date').exec(function (err, playlists) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(playlists);
  });
};

// Get list of playlists filtered by channel name with a page token
exports.indexByChannelAndPageToken = function(req, res) {
  Playlist.find({'channel': req.params.name}).sort('-date').skip(req.params.index).limit(req.params.offset).exec(function (err, playlists) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(playlists);
  });
};

// Get list of playlists by category filtered by channel name
exports.indexByChannelAndType = function(req, res) {
  Playlist.find({'channel': req.params.name}).sort('-date').limit(req.params.offset).exec(function (err, playlists) {
    if(err) { return handleError(res, err); }
    var returnedPlaylists = [];
    for (var i in playlists) {
      var test = false;
      for (var j in returnedPlaylists) {
        if (returnedPlaylists[j].type === playlists[i].type) {
          test = true;
        }
      }
      if (!test) {
        returnedPlaylists.push(playlists[i]);
      }
    }
    return res.status(200).json(returnedPlaylists);
  });
};

// Get list of playlists by category and pageToken
exports.indexByChannelTypeAndPageToken = function(req, res) {
  Playlist.find({'channel': req.params.name, 'type': req.params.category}).sort('-date').skip(req.params.index).limit(req.params.offset).exec(function (err, playlists) {
    if(err) { return handleError(res, err); }
    console.log(playlists);
    return res.status(200).json(playlists);
  });
};

// Get a single playlist
exports.show = function(req, res) {
  Playlist.findById(req.params.id, function (err, playlist) {
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.status(404).send('Not Found'); }
    return res.json(playlist);
  });
};

// Creates a new playlist in the DB.
exports.create = function(req, res) {
  Playlist.create(req.body, function(err, playlist) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(playlist);
  });
};

// Updates an existing playlist in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Playlist.findById(req.params.id, function (err, playlist) {
    if (err) { return handleError(res, err); }
    if(!playlist) { return res.status(404).send('Not Found'); }
    var updated = _.merge(playlist, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(playlist);
    });
  });
};

// Deletes a playlist from the DB.
exports.destroy = function(req, res) {
  Playlist.findById(req.params.id, function (err, playlist) {
    if(err) { return handleError(res, err); }
    if(!playlist) { return res.status(404).send('Not Found'); }
    playlist.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}