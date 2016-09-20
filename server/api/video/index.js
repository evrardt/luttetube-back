'use strict';

var express = require('express');
var controller = require('./video.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/channel/:name', controller.indexByChannel);
router.get('/channel/:name/:index/:offset', controller.indexByChannelAndPageToken);
router.get('/playlist/:id/:index/:offset', controller.indexByPlaylistIdAndPageToken);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;