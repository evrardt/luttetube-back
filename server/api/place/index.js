'use strict';

var express = require('express');
var controller = require('./place.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/channel/:name', controller.indexByChannel);
router.get('/channel/:name/:index/:offset', controller.indexByChannelAndPageToken);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;