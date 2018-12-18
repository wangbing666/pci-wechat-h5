'use strict';

var express = require('express');
var router = express.Router();
var RiskController = require('../../controllers/assessment/risk.controller');

router.route('/risk').get(RiskController.getRisk);//检测入口
router.route('/').get(RiskController.getRiskEnter);//检测页面
router.route('/verify').post(RiskController.riskVerify);//检测请求

module.exports = router;

