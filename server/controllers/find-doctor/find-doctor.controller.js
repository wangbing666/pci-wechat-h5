'use strict';
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  findDoctor: (req, res) => {
    let url = requestTool.setAuthUrl('/find-doctor');
    let doctor = req.query.doctor || '';
    auth.getOpenId(req, res, url, (openId) => {
      auth.isLogin(req, (data) =>{
        res.render('doctor/find-doctor', {
            url: `${global.config.server}`,
            url2: `${global.config.userServer}`,
            doctor: doctor,
            userId: data.userId,
            accessToken: data.access_token
        });
      },() =>{
        res.redirect(`${global.config.root}/login?status=4&&doctor=doctor`);
      })
    });
  }
}