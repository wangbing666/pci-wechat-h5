'use strict';
var sign = require('./sign.js');
var qiniu = require('qiniu');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');
var files = require('./files.js');

module.exports = {
  /*
  * 获取JSSDK配置信息
  * 将获取到的access_token和jsapi_ticket存入到本地json文件中，判断写入的时间和当前时间差超过7000秒再重新获取
  */
  getSignature: (req,res) => {
    var url = req.query.url || '';
    var date = new Date().getTime();
    var jsapidata = {};
    jsapidata.type = "jsapi";
    jsapidata.access_token = "";
    files.readFile(req, res, 'jsapi_ticket', (ticket) => {
      if (Number(ticket.date) + 7000000 > date) {
        let signature = sign(ticket.jsapi_ticket,url); //签名算法
        res.send({
          appId:global.config.appId,
          nonceStr:signature.nonceStr,
          timestamp:signature.timestamp,
          signature:signature.signature,
        })
      } else {
        requestTool.getAccessToken((_data) => {
          files.writtenFile("access_token", _data.data);
          jsapidata.access_token = _data.data;
          requestTool.getJsapiTicket(jsapidata,(_res) =>{
            if (_res.ticket) {
              files.writtenFile("jsapi_ticket", _res.ticket);
              let signature = sign(_res.ticket,url); //签名算法
              res.send({
                appId:global.config.appId,
                nonceStr:signature.nonceStr,
                timestamp:signature.timestamp,
                signature:signature.signature,
              })
            } else {
              res.send({
                msg: 'access_token过期或无效'
              })
            }
          }, err =>{
              res.send("请求jsapi_ticket失败");
          })
        },err =>{
            res.send("请求access_token失败");
        })
      }
    }) 
  },

  // token过期，清除cookie,重新登录
  resetLogin: (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('userId');
    res.send({
      code: 0
    })
  },

  // 分享网页
  getShare: (req, res) => {
    let url = requestTool.setAuthUrl('/share', '');
    auth.getOpenId(req, res, url, (openId) => {
      res.render('share/share')
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  }
}