'use strict';
var requestTool = require('../common/request-tool');
var auth = require('../common/auth');

module.exports = {

  checkIn: (req, res) => {
    /**
     * 向医生报到页面
    */
    let doctorId = req.query.doctorId || '';
    let doctor = req.query.doctor || '';
    let doctorPic = req.query.doctorPic || '';
    let doctorName = req.query.doctorName || '';
    let department = req.query.department || '';
    let doctorTitle = req.query.doctorTitle || '';
    let hospitalName = req.query.hospitalName || '';
    let tel = req.query.tel || '';
    let url = requestTool.setAuthUrl(`/find-doctor/check-in?Dotel=${tel}`);
    let Dotel = req.query.Dotel || req.query.tel;
    // 获取openId
    auth.getOpenId(req, res, url, (openId) => {
      // 判断是否登录
      auth.isLogin(req, (data) =>{
        // 判断是否实名认证
        requestTool.getHeader('certificationStatus', data.access_token, `userId=${data.userId}`, (_data) => {
          if (Dotel) {
             requestTool.get('doctorInfo',`tel=${Dotel}&userId=${data.userId}`, (_res) => {
                if (_res.code == 0 && _res.data) {
                  res.render('doctor/check-in',{
                      doctorId: _res.data.doctorId || '',
                      doctor: doctor,
                      doctorPic: _res.data.doctorPic || '',
                      doctorName: _res.data.doctorName || '',
                      department: _res.data.department || '',
                      doctorTitle: _res.data.doctorTitle || '',
                      hospitalName: _res.data.hospitalName || '',
                      applyStatus: _res.data.applyStatus || '',
                      url: global.config.userServer,
                      server: global.config.server,
                      userId: data.userId,
                      accessToken: data.access_token,
                      status: _data.data.status || ''
                  });
                }
              }, (err) => {
                res.render('error', {
                  message: '服务器请求错误，请返回页面重试~'
                });
              }) 
          } else if (_data.code === 403) {
            // Token过期或者错误跳转到登录页，并清除cookie
            res.clearCookie('accessToken');
            res.clearCookie('userId');
            res.redirect(`${global.config.root}/login?status=2`);
          } else {
            res.render('doctor/check-in',{
                doctorId: doctorId,
                doctor: doctor,
                doctorPic: doctorPic,
                doctorName: doctorName,
                department: department,
                doctorTitle: doctorTitle,
                server: global.config.server,
                hospitalName: hospitalName,
                applyStatus: '',
                url: global.config.userServer,
                userId: data.userId,
                accessToken: data.access_token,
                status: _data.data.status || ''
            });
          }
        }, (err) =>{
          res.render('error', {
            message: err
          });
        });
      },() =>{
        res.redirect(`${global.config.root}/login?status=8&&Dotel=${Dotel}&&doctor=doctor`);
      })
    }, (err) => {
      res.render('error', {
        message: err
      });
    })
  }}
