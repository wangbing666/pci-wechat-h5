'use strict';

var express = require('express');
var router = express.Router();
var FatherController = require('../../controllers/father/father.controller');

router.route('/father').get(FatherController.getFather); // 父亲节入口页面

router.route('/make-greetingCard').get(FatherController.getMakeGreetingCard); // 编辑页面

router.route('/Share-page').get(FatherController.getSharePage); // 分享页面

router.route('/transpond').get(FatherController.getTranspond); // 分享转发

module.exports = router;