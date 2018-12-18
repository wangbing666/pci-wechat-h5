'use strict';

var express = require('express');
var router = express.Router();
var CheckIn = require('../../controllers/find-doctor/check-in.controller');

router.route('/find-doctor/check-in').get(CheckIn.checkIn);//向医生报到

module.exports = router;