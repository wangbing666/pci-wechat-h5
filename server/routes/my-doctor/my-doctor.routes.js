'use strict';

var express = require('express');
var router = express.Router();
var MyDoctor = require('../../controllers/my-doctor/my-doctor.controller');

router.route('/my-doctor').get(MyDoctor.getIsMyDoc);//我的医生入口

router.route('/my-doctor/consult-doctor').get(MyDoctor.goConsult);//咨询医生

module.exports = router;