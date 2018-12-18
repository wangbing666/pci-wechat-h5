'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {
 //上传图片页面
	getCaseHistory: (req, res) => {
		let url = requestTool.setAuthUrl('/uploadCaseHistory', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        // 已登录跳转上传病历页面
        res.render('healthRecords/uploadCaseHistory',{
          access_token: data.access_token,
          healthUrl: global.config.healthServer,
          server: global.config.server,
          userId: data.userId
        })
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=1`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
	},

  //上传记录页面
  getUploadRecord: (req, res) => {
    let url = requestTool.setAuthUrl('/uploadrecord', '');
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        // 已登录跳转上传记录页面
        requestTool.getHealthClient(`${global.config.healthServer}record/photo/list/${data.userId}`, '', (_res) => {
          if (_res.code === 0 && _res.data.content) {
            res.render('healthRecords/uploadrecord',{
              content: _res.data.content
            })
          } else {
            // 未知的一些错误
            res.render('error', {
              message: '未知错误'
            });
          }
        }, (err) => {
          res.render('error', {
            message: '网络出错了'
          });
        })
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=9`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }
}