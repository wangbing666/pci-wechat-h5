'use strict';
var querystring = require('querystring');
var sign = require('./sign.js');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  getFather: (req, res) => {
    var qrCode = req.query.qrCode || '';
    var share = req.query.share || '';
    // auth.setCookies(res, 'pci_secret', 'ovMkVwCVm__t7PODaLbA0r5ZkIAw');
    let url = requestTool.setAuthUrl('/father/father');// 重定向url
    auth.getOpenId(req, res, url, (openId) => {
      getHomePage(openId);
        if(qrCode){
          QRcode(openId);
        }       
      });
   
    //统计页面访问量和独立访客数
    function getHomePage(openId){
      res.render('father/father');
      requestTool.getStatistics('statistics',`openId=${openId}&type=0`,(_result) => {
        if(_result.code == 0){
          console.log("页面访问量");
        }
      }, err=>{
        console.log('服务器请求错误');
      });
      requestTool.getStatistics('statistics',`openId=${openId}&type=1`,(_result) => {
        if(_result.code == 0){
          console.log("独立访客数");
        } 
      },err=>{
        console.log('服务器请求错误');
      });
      if(share){
        requestTool.getStatistics('statistics',`openId=${openId}&type=5`,(_result) => {
          if(_result.code == 0){
            console.log("页面分享转发人数");
          }
        },err=>{
          console.log('服务器请求错误');
        });
      }
    };


    //统计扫描二维码数量和人数
    function QRcode(openId){
      requestTool.getStatistics('statistics',`openId=${openId}&type=2`,(_result) => {
        if(_result.code == 0){
          console.log("二维码扫码数量");
        }
      },err=>{
        console.log('服务器请求错误');
      });
      requestTool.getStatistics('statistics',`openId=${openId}&type=3`,(_result) => {
        if(_result.code == 0){
          console.log("二维码扫码人数");
        } 
      },err=>{
        console.log('服务器请求错误');
      }); 
    };
  },


  getMakeGreetingCard: (req,res) => {
    let url = requestTool.setAuthUrl('/father/make-greetingCard');// 重定向url
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    if(openId){
      res.render('father/make-greetingCard');
    }else{
      auth.getFatherOpenId(req, res, url, (openId) => {
       res.render('father/make-greetingCard');
      });
    }
  },

  getSharePage: (req,res) => {
    let url = requestTool.setAuthUrl('/father/make-greetingCard');// 重定向url
    let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
    var img = "";
    var appellation = req.query.appellation || '';
    var content = req.query.content || "";
    var signature = req.query.signature || "";
    var id = req.query.id || "";
    if(id == 1){
      img = "/father-1_03.png";
    }else if( id == 2){
      img = '/father-02.png';
    }else if(id == 3){
      img = '/father_03.png';
    }else{
      img = '/timg.jpg';
    };
    if(openId){
      res.render('father/Share-page', {
        appellation:appellation,
        content:content,
        signature:signature,
        img:img
      });
    }else{
      auth.getOpenId(req, res, url, (openId) => {
        res.render('father/Share-page', {
          appellation:appellation,
          content:content,
          signature:signature,
          img:img
        });
      });
    }
  },

  getTranspond: (req,res) => {
    let openId = req.signedCookies.pci_secret || '';// 从cookie中找openId
    requestTool.getStatistics('statistics',`openId=${openId}&type=4`,(_result) => {
        if(_result.code == 0){
          res.send("页面分享成功");
        }
    }, err =>{
        res.send("接口请求错误");
    });
  }

}
