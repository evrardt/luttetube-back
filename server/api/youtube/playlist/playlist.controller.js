'use strict';

var _ = require('lodash');
var request = require('request');
var auth = require('../../../auth/auth.service');
var LuttePlaylist = require('../../../api/luttePlaylist/luttePlaylist.model');
var DocPlaylist = require('../../../api/docPlaylist/docPlaylist.model');

// Creates a new submission in the DB.
exports.create = function(req, res) {
  var playlistId = "";
  //console.log(req.body.submission.playlistId);
  if (req.body.submission.type === 'Lutte') {
    LuttePlaylist.find({"id":req.body.submission.playlistId}, function(err, playlists) {
      if (err) {
        res.status(400).json({ status : 'Internal serveur error' });
      }
      playlistId = playlists[0]._id;
      addToYoutube();
    });
  } else if (req.body.submission.type === 'Documentaires') {
    DocPlaylist.find({"id":req.body.submission.playlistId}, function(err, playlists) {
      if (err) {
          res.status(400).json({ status : 'Internal serveur error' });
      }
      playlistId = playlists[0]._id;
      addToYoutube();
    });
  }

  function addToYoutube() {
    var YOUTUBE_API_KEY = 'AIzaSyDrNpz22gF7QK2WJwjIKNBcJF3BabehGZQ';
    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key='+YOUTUBE_API_KEY;
    request.post({
        url:url,
        form: {
          snippet: {
            playlistId: playlistId,
            resourceId: {
              videoId: req.body.submission.videoId,
              kind: "youtube#video"
            }
          }
        }
      }, function (error, response, body) {
      console.log(body);
      if (!error && response.statusCode == 200) {

      }
    }).auth(null, null, true, '');
  }
};

function handleError(res, err) {
  return res.status(500).send(err);
}
