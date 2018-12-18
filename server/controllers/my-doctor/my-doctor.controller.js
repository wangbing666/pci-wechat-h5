'use strict';
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

    getIsMyDoc: (req, res) => {
        let url = requestTool.setAuthInfoUrl('/my-doctor', ''); // 重定向url
        let userId = req.signedCookies.userId || '';// 从cookie中找userId
        let accessToken = req.signedCookies.accessToken || ''; // 从cookie中找accessToken
        auth.getOpenId(req, res, url, (openId) => {
          if (userId && accessToken) {
            requestTool.getHeader('myDoctor',  accessToken,`userId=${userId}`, (myDoctor) => {
              if (myDoctor && myDoctor.code === 0 && myDoctor.data.content.length !== 0) {
                  res.render('doctor/my-doctor', {
                      data: myDoctor.data.content
                  });
              } else if(myDoctor && myDoctor.code === 0 && myDoctor.data.content.length ===0) {
                  res.render('doctor/no-check', {
                      url: `${global.config.root}/doctor/no-check`
                  });
              } else {
                  res.render('error', {
                      message: err
                  })
              }
          }, (err) => {
                res.render('error', {
                    message: err
                })
              })
          } else {
            res.render('doctor/no-check', {
                url: `${global.config.root}/doctor/no-check`
            });
          }
      });
    },

    goConsult: (req, res) => {
    // auth.setCookies(res, 'pci_secret', 'ovMkVwAqHDRVJ9cTDVAUDBmNjHYw');
    let url = requestTool.setAuthUrl('/my-doctor/consult-doctor');
    auth.getOpenId(req, res, url, (openId) => {
        res.render('doctor/consult-doctor', {
        url: `${global.config.root}/my-doctor/consult-doctor`
    });
    }, (err) => {
        res.render('error', {
            message: err
        });
    });
    }
}