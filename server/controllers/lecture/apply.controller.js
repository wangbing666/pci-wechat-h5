'use strict';
var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getIsapply: (req,res) =>{
    //auth.setCookies(res, 'pci_secret', 'ox0ThwtVjZiQMWLCx3SwupAqG4zk');
    let url = requestTool.setAuthUrl('/lecture/apply'); // 重定向url
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(res, openId, (name) => {
        // 已登录跳转报名页面
        res.redirect(`${global.config.root}/lecture/apply/enter`);
      }, () => {
        // 未登录跳转登录页面
        res.redirect(`${global.config.root}/login?status=1`);
      });
    });
  },


  getApply: (req, res) => {
    let err = req.query.err;
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    let errorMessage = '';
    if(err){
      errorMessage = err;
    };
   requestTool.getwithhandle('lecture',"", (_data) => {
        if (_data && _data.length !== 0) {
          if(openId){
            res.render('lecture/apply', {
              "json":_data,
              name:_data[0].name,
              id:_data[0].id,
              errorMessage: errorMessage
            });
          }else{
            res.redirect(`${global.config.root}/lecture/apply`);
          }         
        } else if(_data && _data.length == 0){
          if(openId){
            res.render('lecture/apply',{
              "json":_data,
              name:"",
              id:"",
              errorMessage:'没有可报名的讲座'
            });
          }else{
            res.redirect(`${global.config.root}/lecture/apply`);
          } 
        }
      }, (err) => {
        res.render('lecture/apply', {
          errorMessage: err,
        });
      });
  },

//报名成功页面
  Success: (req, res) => {
    let img = req.query.img;
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    if(openId){
      res.render('lecture/apply-success',{
        imgUrl : img
      });
    }else{
      res.redirect(`${global.config.root}/lecture/apply`);
    }
},

//报名请求
  applyVerify: (req, res) => {
      let data = {};
      var success = {};
      var error = {};
      let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
      data.openId = openId;
      data.name = req.query.name;
      data.sex = req.query.sex;
      data.lectureId = req.query.lectureId;
      data.age = req.query.age;
      requestTool.postwithhandle('apply', data, (_data) => {
        if (_data) {
          success.code = 0;
          success._data = _data;
          res.send(success);
        }
      }, (err) => {
        error.code = 1;
        error.err = err;
        res.send(error);
      })
  },
}