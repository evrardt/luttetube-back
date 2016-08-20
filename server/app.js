/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var request = require('request');
var cors = require('cors');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
	}
);
// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);
app.use(cors());

var YOUTUBE_API_KEY = 'AIzaSyDrNpz22gF7QK2WJwjIKNBcJF3BabehGZQ';
var GEOCODING_API_KEY = 'AIzaSyBeSiUAWHFrk2Ix0wG5APMjSZmh8rBe7Uo';
var LUTTE_CHANNEL = 'UCFbqGcMqFybKLTgcxpSxwHw';
var DOC_CHANNEL = 'UCBgt22CRGqx0AdQSgJZE07g';

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));

  	var typeArray = [];
	var placeArray = [];
	var playlists = [];
	var videos = [];
	var typeOfSeed = "";

	getPlaylistsArray(LUTTE_CHANNEL, YOUTUBE_API_KEY);

	function seedDbForPlaylists(channel) {
		if (channel === LUTTE_CHANNEL) {
			var Place = require('./api/luttePlace/luttePlace.model');
			var Type = require('./api/lutteType/lutteType.model');
			var Playlist = require('./api/luttePlaylist/luttePlaylist.model');
			typeOfSeed = "lutte";
		} else if (channel === DOC_CHANNEL) {
			var Place = require('./api/docPlace/docPlace.model');
			var Type = require('./api/docType/docType.model');
			var Playlist = require('./api/docPlaylist/docPlaylist.model');
			typeOfSeed = "doc";
		}
		
		var temp = typeArray;
		typeArray = [];
		for (var i in temp) {
			typeArray.push({type:temp[i]});
		}

		Place.find({}).remove(function() {
			Place.create(placeArray);
			Type.find({}).remove(function() {
				Type.create(typeArray);
				Playlist.find({}).remove(function() {
					Playlist.create(playlists);
					console.log(typeOfSeed+" playlists Seed terminé");
					getPlaylistItems(0, channel);
				});
			});
		});
	}

	function getGeoLocation(channel, id) {
		if (id < placeArray.length) {
			var url = "https://maps.googleapis.com/maps/api/geocode/json?key="+GEOCODING_API_KEY+"&address="+placeArray[id].city;
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);
					placeArray[id].location = json.results[0].geometry.location;
				}
				if (!error) {
					getGeoLocation(channel, id+1);
				}
			});
		} else {
			seedDbForPlaylists(channel);
		}
	}

	function getPlaylistsArray(channel, apiKey, pageToken) {
		var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&channelId='+channel+'&key='+apiKey;
		if (pageToken) {
			url += "&pageToken="+pageToken;
		}
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				if (!pageToken) {
					pageToken = 0;
				}
				console.log("Youtube - Clé d'api valide pour "+pageToken);
				var json = JSON.parse(body);
				for (var i = 0; i < json.items.length; i++) {
					var splitedTitle = json.items[i].snippet.title.split(" - ");
					if (splitedTitle[0] && typeArray.indexOf(splitedTitle[0]) == -1) {
                        typeArray.push(splitedTitle[0]);
                    }
                    if (splitedTitle[2]) {
                        if (placeArray.length == 0) {
                            placeArray.push({city:splitedTitle[2]});
                        } else {
                            var test = false;
                            for (var j = 0; j < placeArray.length; j++) {
                                if (placeArray[j].city == splitedTitle[2]) {
                                    test = true;
                                }
                            }
                            if (!test) {
                                placeArray.push({city:splitedTitle[2]});
                            }
                        }
                    }
                    var date = null;
                    var monthly = null;
                    var place = null;
                    if (splitedTitle[2]) {
                        if (splitedTitle[1].split('/').length == 2) {
                            date = new Date(splitedTitle[1]+"/01");
                            monthly = true;
                        } else {
                            date = new Date(splitedTitle[1]);
                            monthly = false;
                        }
                        place = splitedTitle[2];
                    } else {
                        place = splitedTitle[1];
                    }
                    playlists.push({
                        id: json.items[i].id,
                        channelId: json.items[i].snippet.channelId,
                        description: json.items[i].snippet.description,
                        title: json.items[i].snippet.title,
                        type: splitedTitle[0],
                        date: date,
                        monthly: monthly,
                        place: place,
                        publishedAt: json.items[i].snippet.publishedAt,
                        thumbnail: json.items[i].snippet.thumbnails.medium.url,
                    });
                }
                if (json.nextPageToken) {
                    getPlaylistsArray(channel, apiKey, json.nextPageToken);
                } else {
                    getGeoLocation(channel, 0);
                }
			}
		})
	}

	function getPlaylistItems(id, channel, pageToken) {
		if (id < playlists.length) {
			var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+playlists[id].id+'&key='+YOUTUBE_API_KEY;
			if (pageToken) {
				url += '&pageToken='+pageToken;
			}
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					if (!pageToken) {
						pageToken = 0;
					}
					console.log("Youtube - Clé d'api valide pour "+pageToken);
					var json = JSON.parse(body);
					for (var i in json.items) {
						if (json.items[i].snippet.thumbnails) {
							var thumb = json.items[i].snippet.thumbnails.medium.url;
						} else {
							var thumb = "";
						}
						videos.push({
							id: json.items[i].id,
							thumbnail: thumb,
							title: json.items[i].snippet.title,
							playlistId : playlists[id].id,
							videoId: json.items[i].snippet.resourceId.videoId
						});
					}
					if (json.nextPageToken) {
						getPlaylistItems(id, channel, json.nextPageToken);
					} else {
						getPlaylistItems(id+1, channel);
					}
				}
			})
		} else {
			addDuration(0, function() {
				if (channel === LUTTE_CHANNEL) {
					var lutteVideo = require('./api/lutteVideo/lutteVideo.model');
					lutteVideo.find({}).remove(function() {
						lutteVideo.create(videos);
						console.log(typeOfSeed+" videos Seed terminé");
						typeArray = [];
						placeArray = [];
						playlists = [];
						playlists = [];
						videos = [];
						getPlaylistsArray(DOC_CHANNEL, YOUTUBE_API_KEY);
					});
				} else if (channel === DOC_CHANNEL) {
					var docVideo = require('./api/docVideo/docVideo.model');
					docVideo.find({}).remove(function() {
						docVideo.create(videos);
						console.log(typeOfSeed+" videos Seed terminé");
					});
				}
			});
		}
	}

	function addDuration(id, callback) {
		if (id < videos.length) {
			var url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&maxResults=50&id='+videos[id].videoId+'&key='+YOUTUBE_API_KEY;
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);
					if (json.items[0]) {
						videos[id].duration = parseDuration(json.items[0].contentDetails.duration);
					}
					addDuration(id+1, callback);
				}
			})
		} else {
			callback();
		}
	}

	function parseDuration(PT) {
		var output = [];
		var durationInSec = 0;
		var matches = PT.match(/P(?:(\d*)Y)?(?:(\d*)M)?(?:(\d*)W)?(?:(\d*)D)?T(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/i);
		var parts = [
			{ // years
			pos: 1,
			multiplier: 86400 * 365
			},
			{ // months
			pos: 2,
			multiplier: 86400 * 30
			},
			{ // weeks
			pos: 3,
			multiplier: 604800
			},
			{ // days
			pos: 4,
			multiplier: 86400
			},
			{ // hours
			pos: 5,
			multiplier: 3600
			},
			{ // minutes
			pos: 6,
			multiplier: 60
			},
			{ // seconds
			pos: 7,
			multiplier: 1
			}
		];
		
		for (var i = 0; i < parts.length; i++) {
			if (typeof matches[parts[i].pos] != 'undefined') {
			durationInSec += parseInt(matches[parts[i].pos]) * parts[i].multiplier;
			}
		}
		
		// Hours extraction
		if (durationInSec > 3599) {
			output.push(parseInt(durationInSec / 3600));
			durationInSec %= 3600;
		}
		// Minutes extraction with leading zero
		output.push(('0' + parseInt(durationInSec / 60)).slice(-2));
		// Seconds extraction with leading zero
		output.push(('0' + durationInSec % 60).slice(-2));
		
		return output.join(':');
	};
});

// Expose app
exports = module.exports = app;
