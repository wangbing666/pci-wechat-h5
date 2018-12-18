'use strict';

var express = require('express');
var router = express.Router();
var uploadCaseHistory = require('../../controllers/healthRecords/uploadCaseHistory.controller'); // 上传病历
var electronicMedicalRecords = require('../../controllers/healthRecords/electronicMedicalRecords.controller'); // 电子病历
var followupPlan = require('../../controllers/healthRecords/followupPlan.controller'); // 随访计划
var realNameAuth = require('../../controllers/healthRecords/realNameAuth.controller'); // 实名认证

router.route('/uploadCaseHistory').get(uploadCaseHistory.getCaseHistory); // 上传病历页面
router.route('/uploadrecord').get(uploadCaseHistory.getUploadRecord); // 上传记录页面

router.route('/EMR').get(electronicMedicalRecords.getEMR); // 电子病历页面
router.route('/bindingSocialSecurity').get(electronicMedicalRecords.getSocialSecurity); // 绑定医保卡页面
router.route('/bindingSocialSecuritySuccess').get(electronicMedicalRecords.getSocialSecurityApi); // 绑定社保卡接口

router.route('/followUp').get(followupPlan.getfollowupPlan); // 随访计划列表页面
router.route('/followUpDetail').get(followupPlan.getfollowupPlanDetail); // 随访计划详情页面
router.route('/followfeedback').get(followupPlan.getFollowFeedback); // 随访计划反馈页面
router.route('/followfailure').get(followupPlan.getFollowFailure); // 随访计划链接失效


router.route('/authlist').get(realNameAuth.getAuthList); // 实名认证列表页面
router.route('/authphone').get(realNameAuth.getAuthPhone); // 手机号认证页面
router.route('/authcard').get(realNameAuth.getAuthCard); // 身份证认证页面

module.exports = router;
