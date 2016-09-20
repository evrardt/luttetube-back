/**
 * Express configuration
 */

'use strict';

var request = require('request');
var appConfig = require('./config/config');

module.exports = function(app) {
    var env = app.get('env');

    if (env === 'development') {
        var googleApiKey = appConfig.google_api[0].key;
    } else {
        var googleApiKey = appConfig.google_api[1].key;
    }

    var typeArray = [];
	var placeArray = [];
	var playlists = [];
	var videos = [];
	var typeOfSeed = "";

	getPlaylistsArray(0);

    function getPlaylistsArray(channelIndex, pageToken) {
		var url = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet%2CcontentDetails&channelId='+appConfig.channels[channelIndex].key+'&key='+googleApiKey;
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
					if (splitedTitle[0]) {
						var test = false;
						for (var j = 0; j < typeArray.length; j++) {
							if (typeArray[j].type == splitedTitle[0]) {
								test = true;
							}
						}
						if (!test) {
							typeArray.push({type:splitedTitle[0], channel:appConfig.channels[channelIndex].name});
						}
                    }
                    if (splitedTitle[2]) {
                        if (placeArray.length == 0) {
                            placeArray.push({city:splitedTitle[2], channel:appConfig.channels[channelIndex].name});
                        } else {
                            var test = false;
                            for (var j = 0; j < placeArray.length; j++) {
                                if (placeArray[j].city == splitedTitle[2]) {
                                    test = true;
                                }
                            }
                            if (!test) {
                                placeArray.push({city:splitedTitle[2], channel:appConfig.channels[channelIndex].name});
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
						channel: appConfig.channels[channelIndex].name
                    });
                }
                if (json.nextPageToken) {
                    getPlaylistsArray(channelIndex, json.nextPageToken);
                } else {
					if (channelIndex+1 < appConfig.channels.length) {
						getPlaylistsArray(channelIndex+1);
					} else {
						getGeolocation(0);
					}
                }
			}
		})
	}

	function getGeolocation(id) {
		if (id < placeArray.length) {
			var url = "https://maps.googleapis.com/maps/api/geocode/json?key="+googleApiKey+"&address="+placeArray[id].city;
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var json = JSON.parse(body);
					placeArray[id].location = json.results[0].geometry.location;
					getGeolocation(id+1);
				}
			});
		} else {
			seedPlace(0, 0);
		}
	}

    function seedPlace(id) {
        if (placeArray.length > 0) {
            var Place = require('./api/place/place.model');
			Place.find({"city":placeArray[id].city}, function(err, places) {
                if (places.length == 0) {
                    var temp = new Place(placeArray[id]);
                    temp.save(function (err, temp) {
                        
                    });
                } 
                if (id+1 < placeArray.length) {
                    seedPlace(id+1);
                } else {
                    seedType(0);
                }
            });
        } else {
            seedType(0);
        }
    }

    function seedType(id) {

        var Type = require('./api/type/type.model');

        Type.find({"type":typeArray[id].type}, function(err, types) {
            if (types.length == 0) {
                var temp = new Type(typeArray[id]);
                temp.save(function (err, temp) {
                    
                });
            } 
            if (id+1 < typeArray.length) {
                seedType(id+1);
            } else {
                seedPlaylists(0);
            }
        });
    }

    function seedPlaylists(id) {

        var Playlist = require('./api/playlist/playlist.model');
        Playlist.find({"id":playlists[id].id,"channel":playlists[id].channel}, function(err, returnedPlaylists) {
			if (returnedPlaylists.length == 0) {
                var temp = new Playlist(playlists[id]);
                temp.save(function (err, temp) {
                    
                });
            } 
            if (id+1 < playlists.length) {
                seedPlaylists(id+1);
            } else {
                console.log("Playlists Seed terminé");
				Playlist.find({}).exec(function(err, returnedPlaylists) {
					playlists = returnedPlaylists;
				});
                getPlaylistItems(0);
            }
        });
    }

	function getPlaylistItems(id, pageToken) {
		if (id < playlists.length) {
			var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId='+playlists[id].id+'&key='+googleApiKey;
			if (pageToken) {
				url += '&pageToken='+pageToken;
			}
			request(url, function (error, response, body) {
				if (!error && response.statusCode == 200) {
					if (!pageToken) {
						pageToken = 0;
					}
					console.log("Youtube - Clé d'api valide pour la vidéo");
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
							playlistId : playlists[id]._id,
							link: json.items[i].snippet.resourceId.videoId,
							hosting: "youtube",
							channel: playlists[id].channel
						});
					}
					if (json.nextPageToken) {
						getPlaylistItems(id, json.nextPageToken);
					} else {
						getPlaylistItems(id+1);
					}
				}
			})
		} else {
			addDuration(0, function() {
				seedPlaylistsVideos(0);
			});
		}
	}

    function seedPlaylistsVideos(id) {
        var video = require('./api/video/video.model');
		video.find({"id":videos[id].id,"channel":videos[id].channel}, function(err, returnedVideos) {
			if (returnedVideos.length == 0) {
				var temp = new video(videos[id]);
				temp.save(function (err, temp) {
					
				});
			} 
			if (id+1 < videos.length) {
				seedPlaylistsVideos(id+1);
			} else {
				console.log("Videos Seed terminé");
				seedChannels(0);
			}
		});
	}

	function seedChannels(channelIndex) {
		var channel = require('./api/channel/channel.model');
		channel.find({"name":appConfig.channels[channelIndex].name}, function(err, channels) {
			if (channels.length == 0) {
				var temp = new channel(appConfig.channels[channelIndex]);
				temp.save(function (err, temp) {
					
				});
			} 
			if (channelIndex+1 < appConfig.channels.length) {
				seedChannels(channelIndex+1);
			} else {
                console.log("Channels Seed terminé");
			}
		});
	}

	function addDuration(id, callback) {
		if (id < videos.length) {
			var url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&maxResults=50&id='+videos[id].link+'&key='+googleApiKey;
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

};