'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');
var moment = require("moment"); 

module.exports = {
  // 电子病历
  getEMR: (req, res) => {
    let url = requestTool.setAuthUrl('/EMR', '');
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        // 已登录验证是否实名认证
        requestTool.getHeader('certificationStatus', data.access_token, `userId=${data.userId}`, (_data) => {
          if (_data.code === 0 && _data.data && _data.data.status === 1) {
            // 已实名认证跳转到电子病历页面
            requestTool.getHealthClient(`${global.config.healthServer}record/history/list/${data.userId}?from=1`, '', (_res) => {
              if (_res.code === 0 && _res.data.content.length != 0) {
                let content = _res.data.content
                // 用moment将日期格式化
                for (let i = 0; i < content.length; i++) {
                  let date = content[i].checkDate.substring(0,10).replace(/-/g,'/');
                  content[i].dateSize = new Date(date).getTime()
                }
                // 将数组进行排序
                content.sort(function(a, b){
                  return b.dateSize - a.dateSize
                })
                // 渲染页面
                res.render('healthRecords/electronicMedicalRecords', {
                  data: content,
                  status: 'true',
                  medicareCard: _data.data.medicareCard,
                  auth: 'true'
                })
              } else if (_res.code === 0 && _res.data.content.length == 0) {
                // 没有电子病历时页面弹框
                res.render('healthRecords/electronicMedicalRecords', {
                  status: 'false',
                  auth: 'true',
                  medicareCard: _data.data.medicareCard
                })
              } else {
                // 未知的一些错误
                res.render('error', {
                  message: '未知错误'
                });
              }
            }, (err) => {
              res.render('error', {
                message: err
              });
            })
          } else if (_data.code === 403) {
            // Token过期或者错误跳转到登录页，并清除cookie
            res.clearCookie('accessToken');
            res.clearCookie('userId');
            res.redirect(`${global.config.root}/login?status=2`);
          } else if (_data.code === 0 && _data.data && _data.data.status === 2) {
            // 实名认证审核中的弹框通知
            res.render('healthRecords/electronicMedicalRecords', {
              auth: 'false'
            })
          } else {
            // 未认证跳转到实名认证页面
            res.redirect(`${global.config.root}/authlist?auth=false`);
          }
        }, (err) =>{
          res.render('error', {
            message: err
          });
        })
      },() =>{
        // 未登录重定向到登录页
        res.redirect(`${global.config.root}/login?status=2`);
      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  // 绑定社保页面
  getSocialSecurity: (req, res) => {
    let url = requestTool.setAuthUrl('/bindingSocialSecurity', '');
    let name;
    let card;
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        requestTool.getHeader('certificationStatus', data.access_token, `userId=${data.userId}`, (_data) => {
          if (_data.code === 0 && _data.data && _data.data.status === 1) {
            // 姓名和身份证以星号代替
            name = _data.data.name
            card = _data.data.idCard
            if (name && name.length === 2) {
              name = name.substring(0, 1) + "*"
            }
            if (name && name.length === 3) {
              name = name.substring(0, 1) + "*" + name.substring(2)
            }
            if (name && name.length === 4) {
              name = name.substring(0, 1) + "**" + name.substring(3)
            }
            if (card && card.length === 18) {
              card = card.substring(0,4) + '********' +card.substring(14)
            }
            if (card && card.length === 15) {
              card = card.substring(0,4) + '*****' +card.substring(11)
            }
          }
          // 已登录跳转绑定社保页面
          res.render('healthRecords/bindingSocialSecurity',{
            name: name,
            card: card
          })
        }, (err) =>{
          // 请求出错仍进页面，不显示姓名和身份证号
          res.render('healthRecords/bindingSocialSecurity',{
            name: '',
            card: ''
          })
        })
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=2`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  //绑定社保接口
  getSocialSecurityApi: (req, res) => {
    let cardNumber = req.query.cardNumber || '';
    let userId = req.signedCookies.userId || '';
    let access_token = req.signedCookies.accessToken || '';
    let data = {
      medicareCard: cardNumber,
      userId: userId
    }
    requestTool.postHeader('bindMedicareCard', access_token, data, (_data) => {
        if (_data) {
          res.send(_data);
        }
      }, (err) => {
        res.send(err);
      })
  }
}
