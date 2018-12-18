'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  // 获取账号绑定页面
  getAccountBind: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ox0ThwmPe29gK2bl8v7cbr6Z-emg');
    let url = requestTool.setAuthUrl('/family', ''); // 重定向url
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        // 已登录跳转家庭账号页面
        requestTool.getwithhandle('familyApply', `openId=${openId}`, (_data) => {
          res.render('basic/account-bind', {
            content: _data.content
          });
        }, (err) => {
          res.render('error', {
            message: '请求错误'
          })
        });
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=7`);
      });
    });
  },

  // 获取添加绑定账号页面
  getAccountBindAdd: (req, res) => {
    let errorMessage = req.query.errorMessage || '';
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    if (openId) {
      auth.isLogin(req, (data) => {
        res.render('basic/account-bind-add', {
          postUrl: '/family/add',
          errorMessage: errorMessage
        });
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=7`);
      });
    } else {
      res.redirect(`${global.config.root}/family`);
    }
  },

  // 绑定账号
  bindAccount: (req, res) => {
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let postData = ''; // 记录form表单提交的数据

    if (openId && req.method.toLowerCase() === 'post') {
      req.addListener('data', (data) => {
        postData += data;
      });

      req.addListener('end', () => {
        let bindData = querystring.parse(postData);
        bindData.openId = openId;
        console.log(`[${new Date()}] POST /login : ${JSON.stringify(bindData)}`);
        requestTool.postwithhandle('familyApply', bindData, (result) => {
          res.send({code: 0})
        }, (error) => {
          res.send({code: 1, msg:error})
        });
      });
    }
  },

  // 通过手机号查找账号信息
  getAccountSearch: (req, res) => {
    var tel = req.query.tel || '';
    requestTool.getApi(res, 'familySearch', `tel=${tel}`, (data) => {
      res.send(data);
    });
  },

}
