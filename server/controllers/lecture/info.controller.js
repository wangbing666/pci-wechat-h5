'use strict';

var requestTool = require('../common/request-tool');
var moment = require("moment");	
var auth = require('../common/auth');

module.exports = {

  getIsinfo: (req,res) =>{
    //auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
  	let url = requestTool.setAuthUrl('/lecture/info'); // 重定向url
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(res, openId, (name) => {
        // 已登录跳转报名取消页面
        res.redirect(`${global.config.root}/lecture/info/enter`);
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=3`);
      });
    });
  },

  getInfo: (req, res) => {
  		let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
      if(openId){
        requestTool.getwithhandle('applyList',`openId=${openId}`, (_data) => {
          if (_data) {
            for (var i = 0; i < _data.content.length; i++) {
              _data.content[i].time = moment(_data.content[i].time).format('YYYY-MM-DD h:mm');
              _data.content[i].day = new Date(_data.content[i].time).getDay();
              if(_data.content[i].day == 0){
                _data.content[i].day = "日";
              }else if(_data.content[i].day == 1){
                _data.content[i].day = "一";
              }else if(_data.content[i].day == 2){
                _data.content[i].day = "二";
              }else if(_data.content[i].day == 3){
                _data.content[i].day = "三";
              }else if(_data.content[i].day == 4){
                _data.content[i].day = "四";
              }else if(_data.content[i].day == 5){
                _data.content[i].day = "五";
              }else if(_data.content[i].day == 6){
                _data.content[i].day = "六";
              };
              if(_data.content[i].status == 0){
                _data.content[i].statusName = "报名成功";
              }else if(_data.content[i].status == 1){
                _data.content[i].statusName = "报名取消";
              }else if(_data.content[i].status == 2){
                _data.content[i].statusName = "报名签到";
              }else if(_data.content[i].status == 3){
                _data.content[i].statusName = "报名过期";
              }
              if(_data.content[i].charge == 0){
                _data.content[i].charge = "免费";
              }
            }
                res.render('lecture/info', {
                  data:_data.content,
                  errorMessage:""
                });
            }
          }, (err) => {
            res.render('lecture/info', {
              data:[],
               errorMessage: err,
            });
        });
      }else{
        res.redirect(`${global.config.root}/lecture/info`);
      }
  		
     
  },

  getInfoCancel: (req,res) =>{
  	  let data = {};
  	  let id = req.query.id;
      let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
      data.openId = openId;
      data.joinId = id;
	    requestTool.post('applyCance', data, (data) => {
	      res.send(data);
	    });
  }



}
