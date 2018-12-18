'use strict';

var requestTool = require('../common/request-tool');
var auth = require('../common/auth');
var moment = require("moment"); 

module.exports = {
  // 随访计划列表
	getfollowupPlan: (req, res) => {
		let url = requestTool.setAuthUrl('/followUp', '');
		auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        requestTool.getHeader('flupList', data.access_token, `userId=${data.userId}`, (_data) =>{
          if (_data && _data.code === 0 && _data.data.myFlupList.length === 0) {
            // 没有随访计划时的页面弹窗
            res.render('healthRecords/followupPlan',{
              myFlupList: [],
              "json": [],
              status: false
            })
          } else if (_data && _data.code === 0 && _data.data.myFlupList.length !== 0 && _data.data.myFlupList.length !== 1) {
            // 已登录跳转随访计划列表页面
            res.render('healthRecords/followupPlan',{
              myFlupList: _data.data.myFlupList,
              "json": _data.data.myFlupList,
              status: true
            })
          } else if (_data && _data.code === 0 && _data.data.myFlupList.length === 1) {
            // 只有一条随访计划跳转到随访详情页
            res.redirect(`${global.config.root}/followUpDetail?doctorId=${_data.data.myFlupList[0].doctorId}`);
          } else if (_data && _data.code === 403) {
            // Token过期或者错误跳转到登录页，并清除cookie
            res.clearCookie('accessToken');
            res.clearCookie('userId');
            res.redirect(`${global.config.root}/login?status=3`);
          } else {
            res.render('error', {
              message: _data.msg || '未知错误'
            });
          }
        }, (error) => {
          res.render('error', {
            message: error
          });
        })

      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=3`);
      });

    }, (err) => {
      res.render('error', {
        message: err
      });
    });
	},
  // 随访计划详情
  getfollowupPlanDetail: (req, res) => {

    let url = requestTool.setAuthUrl('/followUpDetail', '');
    let doctorId = req.query.doctorId || '';
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        // 获取医生ID查询随访详情
        if (doctorId) {
          let postData = {
            doctorId: doctorId,
            userId: data.userId
          }
          requestTool.postHeader('flupDetail', data.access_token, postData, (_data) =>{
            let date = _data.data.planDate.split('-');
            let feedbacks;
            // 判断token是否过期
            if (_data && _data.code === 0 && _data.data) {
              if (_data.data.feedbacks && _data.data.feedbacks.length !== 0) {
                feedbacks = _data.data.feedbacks
                // 循环并格式化日期
                for (let i = 0; i < feedbacks.length; i++) {
                  let a = new Set(feedbacks[i].plan);
                  let b = new Set(feedbacks[i].item);
                  let intersectionSet = new Set([...a].filter(x => b.has(x))); // ES6求交集a>b
                  let differenceABSet = new Set([...a].filter(x => !b.has(x))); // ES6求差集a>b
                  feedbacks[i].plan = []
                  intersectionSet.forEach(function(obj){
                    feedbacks[i].plan.push({name:obj, status:true})
                  })
                  differenceABSet.forEach(function(obj){
                    feedbacks[i].plan.push({name:obj, status:false})
                  })
                }
                res.render('healthRecords/followupPlanDetail',{
                  flupDetail: _data.data,
                  Y: Number(date[0]),
                  M: Number(date[1]),
                  D: Number(date[2])
                })
              } else {
                // 请求接口产生的其他错误
                res.render('error', {
                  message: '请求错误'
                });
              }
            } else if (_data && _data.code === 403) {
              // token过期，重新登录
              res.clearCookie('accessToken');
              res.clearCookie('userId');
              res.redirect(`${global.config.root}/login?status=3`);
            } else {
              // 其他操作产生的异常
              res.render('error', {
                message: _data.msg || '参数异常'
              });
            }
          }, (error) => {
            // 接口请求产生的错误
            res.render('error', {
                message: '接口请求错误'
            });
          })
        } else {
          // 没有医生ID的参数错误
          res.render('error', {
            message: '参数异常'
          });
        }
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=3`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  /**
   * 随访计划反馈页面，推送模板里的链接带的参数
   * @param fbId  模板ID
   * @param otherRemind 参数，提交的时候返回过去
   * @param feedbackTimes 第几次推送
   * @param dn      医生姓名
   */
  getFollowFeedback: (req, res) => {
    let fbId = req.query.fbId || '';
    let otherRemind = req.query.otherRemind || '';
    let feedbackTimes = req.query.feedbackTimes || '';
    let dn = req.query.dn || '';
    let url = requestTool.setAuthUrl(`/followfeedback?fbId=${fbId}&otherRemind=${otherRemind}&feedbackTimes=${feedbackTimes}&dn=${dn}`, '');
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) => {
        // 第一次推送
        if (feedbackTimes == 0) {
          requestTool.getHeaderUrl(`api/doctorPatient/flup/feedback/find/${fbId}`, data.access_token, '', (_data) =>{
            // 判断返回的参数firstPushStatus是否存在，存在的话表示患者做过随访，链接失效
            if (_data.code === 0 && _data.data && _data.data.firstPushStatus == true || _data.data.firstPushStatus == false) {
                res.redirect(`${global.config.root}/followfailure`);
            } else if (_data.code === 0 && _data.data && _data.data.plan && _data.data.plan.length !== 0 && _data.data.item) {
              let firstPushTime = moment(_data.data.firstPushTime).format('YYYY-MM-DD');
              res.render('healthRecords/followfeedback',{
                plan: _data.data.plan,
                item: _data.data.item,
                otherRemind: otherRemind,
                feedbackTimes: feedbackTimes,
                flupFeedbackId: fbId,
                firstPushTime: firstPushTime,
                dn: dn,
                url: global.config.userServer,
                access_token: data.access_token
              })
            } else if (_data.code === 403) {
              res.clearCookie('accessToken');
              res.clearCookie('userId');
              res.redirect(`${global.config.root}/login?status=6`);
            } else {
              res.render('error', {
                message: _data.msg || '未知错误'
              });
            }
          }, (error) => {
            res.render('error', {
              message: '请求出错了'
            });
          })
        } else if (feedbackTimes == 1) {
          // 第二次推送
          requestTool.getHeaderUrl(`api/doctorPatient/flup/feedback/find/${fbId}`, data.access_token, '', (_data) =>{
            // 判断返回的参数secondPushStatus是否存在，存在的话表示患者做过随访，链接失效
            if (_data.code === 0 && _data.data && _data.data.secondPushStatus == true || _data.data.secondPushStatus == false) {
                res.redirect(`${global.config.root}/followfailure`);
            } else if (_data.code === 0 && _data.data && _data.data.plan && _data.data.plan.length !== 0 && _data.data.item) {
              // 日期格式化，并求出做过列表和没做过随访的列表交集，渲染没有做过的随访
              let firstPushTime = moment(_data.data.firstPushTime).format('YYYY-MM-DD');
              let a = new Set(_data.data.plan);
              let b = new Set(_data.data.item);
              let differenceABSet = new Set([...a].filter(x => !b.has(x)));
              let plan = [];
              differenceABSet.forEach(function(obj){
                plan.push(obj)
              })
              res.render('healthRecords/followfeedback',{
                plan: plan,
                item: _data.data.item,
                otherRemind: otherRemind,
                feedbackTimes: feedbackTimes,
                firstPushTime: firstPushTime,
                flupFeedbackId: fbId,
                dn: dn,
                url: global.config.userServer,
                access_token: data.access_token
              })
            } else if (_data.code === 403) {
              // token过期，重新登录
              res.clearCookie('accessToken');
              res.clearCookie('userId');
              res.redirect(`${global.config.root}/login?status=6`);
            } else {
              res.render('error', {
                message: _data.msg || '请求错误'
              });
            }
          }, (error) => {
            res.render('error', {
              message: error
            });
          })
        } else {
          res.render('error', {
            message: '请求错误'
          });
        }
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=6&fbId=${fbId}&otherRemind=${otherRemind}&feedbackTimes=${feedbackTimes}&dn=${dn}`);
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  //随访计划链接失效
  getFollowFailure: (req, res) => {
    let url = requestTool.setAuthUrl('/followfailure', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('healthRecords/followfailure',{

      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }

}