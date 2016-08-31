'use strict';

var _ = require('lodash');
var request = require('request');
var auth = require('../../../auth/auth.service');

// Creates a new submission in the DB.
exports.create = function(req, res) {
  var playlistId = "";
  //console.log(req.body.submission.playlistId);
  if (req.body.submission.type === 'Lutte') {
    var LuttePlaylist = require('../../../api/luttePlaylist/luttePlaylist.model');
    LuttePlaylist.find({"id":req.body.submission.playlistId}, function(err, playlists) {
        playlistId = playlists[0]._id;
        addToYoutube();
    });
  } else if (req.body.submission.type === 'Documentaires') {
    var DocPlaylist = require('../api/docPlaylist/docPlaylist.model');
    DocPlaylist.find({"id":req.body.submission.playlistId}, function(err, playlists) {
        playlistId = playlists[0]._id;
        addToYoutube();
    });
  }

  function addToYoutube() {
    var API_KEY = require('../../../config/api-key');
    var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key='+API_KEY.GOOGLE;
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