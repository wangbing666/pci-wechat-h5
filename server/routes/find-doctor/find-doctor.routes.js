'use strict';

var express = require('express');
var router = express.Router();
var FindDoctor = require('../../controllers/find-doctor/find-doctor.controller');

router.route('/find-doctor').get(FindDoctor.findDoctor);//找医生入口

module.exports = router;