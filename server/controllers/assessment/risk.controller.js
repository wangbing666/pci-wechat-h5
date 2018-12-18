'use strict';

var querystring = require('querystring');
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');
var moment = require("moment");

module.exports = {

  getRisk: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ovMkVwH6ldi-JOG4tdiVqcLJmR5s');
    let url = requestTool.setAuthInfoUrl('/assessment/risk', '');
    auth.getOpenId(req, res, url, (openId) => {
      requestTool.getwithhandle('result', `openId=${openId}`, (result) => {
        if (result) {
          let time = moment(result.time).format('YYYY-MM-DD h:mm');
          let getDate = new Date(time).getDate();
          let getMonth = new Date(time).getMonth() + 1;
          let geYear = new Date(time).getFullYear();
          res.render('assessment/result', {
            level: result.level,
            result: result.result,
            name: result.name,
            month: getMonth,
            date: getDate,
            year: geYear
          });
        } else {
          res.redirect(`${global.config.root}/assessment`);
        }
      }, (err) => {
        res.render('error', {
          message: err
        })
      })
    });
  },

  getRiskEnter: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ox0ThwmPe29gK2bl8v7cbr6Z-emg');
    let url = requestTool.setAuthInfoUrl('/assessment', ''); // 重定向url
    auth.getOpenId(req, res, url, (openId) => {
      res.render('assessment/risk', {
        url: `${global.config.root}/assessment/verify?openId=${openId}`
      });
    }, (err) => {
      res.render('error', {
        message: err
      });
    });
  },

  // 提交风险评估接口
  riskVerify: (req, res) => {
    let openId = req.query.openId;
    if (openId) {
      let postData = req.body;
      postData.openId = openId;
      console.log(`[${new Date()}] Risk Post Data: ${JSON.stringify(postData)}`);
      requestTool.postApi(res, 'risk', postData, (_data) => {
        console.log(JSON.parse(_data));
        res.send(JSON.parse(_data));
      });
    } else {
      res.send({ code: -1, msg: "请求错误" });
    }
  }
}
