'use strict';

var express = require('express');
var router = express.Router();
var TestController = require('../../controllers/test/test.controller');

router.route('/')
  .get(TestController.getTest);
  // .post(TestController.postTest);

module.exports = router;
