'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();
router
  .get('/', passport.authenticate('google', {
    failureRedirect: '/signup',
    scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.force-ssl','https://www.googleapis.com/auth/youtube.force-ssl', 'https://www.googleapis.com/auth/userinfo.email'],
    session: false
  }))

  .get('/callback', passport.authenticate('google', {
    failureRedirect: '/login',
    session: false
  }), auth.setTokenCookie,
    function(req, res) {
      res.redirect('http://luttetube.fr');
    }
  );

module.exports = router;