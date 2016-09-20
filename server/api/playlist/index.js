'use strict';

var express = require('express');
var controller = require('./playlist.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/channel/:name/count', controller.count);
router.get('/channel/:name', controller.indexByChannel);
router.get('/channel/:name/:index/:offset', controller.indexByChannelAndPageToken);
router.get('/channel/:name/category', controller.indexByChannelAndType);
router.get('/channel/:name/type/:category/count', controller.countByChannelTypeAndPageToken);
router.get('/channel/:name/:category/:index/:offset', controller.indexByChannelTypeAndPageToken);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;