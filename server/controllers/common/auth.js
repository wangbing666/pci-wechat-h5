'use strict';

var requestTool = require('./request-tool');

var auth = {};

/**
 * 存储加密的cookie
 * @param  {[type]} res         [response]
 * @param  {[type]} openId      [openId]
 * @param  {[type]} accessToken [accessToken]
 * @return {[type]}             []
 */
auth.setCookies = (res, key, value) => {
  res.cookie(key, value, { maxAge: 72000000, httpOnly: true, signed: true });
}

/**
 * 存储加密的cookie永久保留
 * @param  {[type]} res         [response]
 * @param  {[type]} openId      [openId]
 * @param  {[type]} accessToken [accessToken]
 * @return {[type]}             []
 */
auth.setUserCookies = (res, key, value) => {
  res.cookie(key, value, { maxAge: 2592000000, httpOnly: true, signed: true });
}

/**
 * 通过code获取openId
 * @param  {[type]} res  [response]
 * @param  {[type]} code [code]
 * @param  {[type]} call [callback函数]
 * @return {[type]}      []
 */
auth.getToken = (res, code, call) => {
  requestTool.getwithhandle('getToken', `code=${code}`, call, (err) => {
    res.render('error', {
      "message": err
    });
  });
}

  // 父亲节页面使用
auth.getTokenCopy = (res, code, call) => {
  requestTool.getwithurl('https://api.weixin.qq.com/sns/oauth2/access_token', `appid=${global.config.appId}&secret=${global.config.secret}&code=${code}&grant_type=authorization_code`, call, (err) => {
    res.render('error', {
      "message": '请求错误'
    });
  });
}

/**
 * 获取openId
 * @param  {[type]} req         [request]
 * @param  {[type]} res         [response]
 * @param  {[type]} redirectUrl [redirectUrl]
 * @param  {[type]} call        [callback函数]
 * @return {[type]}             []
 */
auth.getOpenId = (req, res, redirectUrl, call) => {
  console.log(`[${new Date()}] Cookies: ${JSON.stringify(req.signedCookies)}`);
  let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
  let code = req.query.code || ''; // 微信返回code
  if (openId) {
    call(openId);
  } else if (code) {
    console.log(`[${new Date()}] Request Code: ${code}`);
    auth.getToken(res, code, (data) => {
      console.log(`[${new Date()}] GET OpenId: ${data.openid}      用户的openId`);
      auth.setCookies(res, 'pci_secret', data.openid);
      call(data.openid);
    });
  } else {
    console.log(`[${new Date()}] Redirect Url: ${redirectUrl}`);
    res.redirect(redirectUrl);
  }
}

/**
 * 判断用户是否关注
 * @param  {[type]} req         [request]
 * @param  {[type]} res         [response]
 * @param  {[type]} redirectUrl [redirectUrl]
 * @param  {[type]} call        [callback函数]
 * @return {[type]}             []
 */

auth.getUserAttention = (res, openId, call) => {
  let accdata = {};
    accdata.grant_type ="client_credential";
    accdata.appid = global.config.appId;
    accdata.secret = global.config.secret;
    requestTool.getAccessToken(accdata,(_res) => {
      requestTool.getwithurl('https://api.weixin.qq.com/cgi-bin/user/info', `access_token=${_res.access_token}&openId=${openId}`, (data) => {
        call(data);
      }, (err) => {
        res.send("请求用户信息失败");
      });
    },err =>{
      res.send("请求access_token失败");
    })
}

/**
 * 返回父亲节的state参数
 * @param  {[type]} req         [request]
 * @param  {[type]} res         [response]
 * @param  {[type]} redirectUrl [redirectUrl]
 * @param  {[type]} call        [callback函数]
 * @return {[type]}             []
 */
auth.getFatherOpenId = (req, res, redirectUrl, call) => {
  console.log(`[${new Date()}] Cookies: ${JSON.stringify(req.signedCookies)}`);
  let openId = req.signedCookies.pci_secret || ''; // 从cookie中找openId
  let code = req.query.code || ''; // 微信返回code
  if (openId) {
    call(openId);
  } else if (code) {
    auth.getToken(res, code, (data) => {
      console.log(`[${new Date()}] GET OpenId: ${data.openid}`);
      auth.setCookies(res, 'pci_secret', data.openid);
      call(openId);
    });
  } else {
    console.log(`[${new Date()}] Redirect Url: ${redirectUrl}`);
    res.redirect(redirectUrl);
  }
}

/**
 * 判断用户是否登录
 * 0 登录 1 讲座报名 2 家庭账号绑定 3 讲座报名信息
 * @param  {[type]} res       [response]
 * @param  {[type]} openId    [openId]
 * @param  {[type]} call      [已登录操作]
 * @param  {[type]} calllogin [未登录返回登录操作]
 * @return {}                 []
 */
auth.isLogin = (req, call, calllogin) => {
  let access_token = req.signedCookies.accessToken || '';
  let userId = req.signedCookies.userId || '';
  let data = {
    access_token: access_token,
    userId: userId
  };
  if (access_token && userId) {
    call(data);
  } else {
    calllogin();
  }
}

module.exports = auth;
