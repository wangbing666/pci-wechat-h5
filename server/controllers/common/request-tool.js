'use strict';
var superagent = require('superagent');

var BASE_URL = global.config.server;
var User_BASE_URL = global.config.userServer;
var Father_BASE_URL = global.config.fatherServer;
var api = require('./api-url.json');

var requestTool = {};

/**
 * 使用superagent进行get请求
 * @param  {} key    [api key]
 * @param  {} param  [query参数]
 * @param  {} call   [callback函数]
 * @param  {} error  [error函数]
 * @return {}        []
 */
requestTool.get = function(key, param, call, error) {
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

/**
 * 使用superagent进行get添加请求头请求
 * @param  {} key    [api key]
 * @param  {} param  [query参数]
 * @param  {} call   [callback函数]
 * @param  {} error  [error函数]
 * @return {}        []
 */
requestTool.getHeader = function(key, accessToken, param, call, error) {
  superagent
    .get(User_BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .set('access-token', accessToken)
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

/**
 * 使用superagent进行get拼接url添加请求头请求
 * @param  {} key    [api key]
 * @param  {} param  [query参数]
 * @param  {} call   [callback函数]
 * @param  {} error  [error函数]
 * @return {}        []
 */
requestTool.getHeaderUrl = function(key, accessToken, param, call, error) {
  superagent
    .get(User_BASE_URL + key)
    .set('Content-Type', 'application/json')
    .set('access-token', accessToken)
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

/**
 * 使用superagent添加healthClient进行get请求
 * @param  {} key    [api key]
 * @param  {} param  [query参数]
 * @param  {} call   [callback函数]
 * @param  {} error  [error函数]
 * @return {}        []
 */
requestTool.getHealthClient = function(url, param, call, error) {
  superagent
    .get(url)
    .set('Content-Type', 'application/json')
    .set('healthClient', 'pci')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}



/**
 * 使用superagent进行get统计请求
 * @param  {} key    [api key]
 * @param  {} param  [query参数]
 * @param  {} call   [callback函数]
 * @param  {} error  [error函数]
 * @return {}        []
 */
requestTool.getStatistics = function(key, param, call, error) {
  superagent
    .get(Father_BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

//获取access_token
requestTool.getAccessToken = function(call, error) {
  superagent
    .get(BASE_URL + 'api/micro/accessToken')
    .set('Content-Type', 'application/json')
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

//获取jsapi_ticket
requestTool.getJsapiTicket = function(param, call, error) {
  superagent
    .get('https://api.weixin.qq.com/cgi-bin/ticket/getticket')
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

// 封装API get请求
requestTool.getApi = function(res, key, param, call) {
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        res.send({ code: -1, msg: '接口请求错误' });
      } else {
        call(sres.text);
      }
    });
}

// 直接返回接口的data数据
requestTool.getwithhandle = function(key, param, call, error) {
  console.log(`[${new Date()}] GET URL: ${BASE_URL}${api[key]}`);
  console.log(`[${new Date()}] GET URL: ${param}`);
  superagent
    .get(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        if (JSON.parse(sres.text).code === 0) {
          call(JSON.parse(sres.text).data);
        } else {
          let msg = '';
          if (JSON.parse(sres.text).msg) {
            msg = JSON.parse(sres.text).msg;
          } else {
            msg = '接口返回错误';
          }
          error(msg);
        }
      }
    });
}

// 请求单独的url地址
requestTool.getwithurl = function(url, param, call, error) {
  superagent
    .get(url)
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

// 请求单独的url地址
requestTool.getToken = function(url, param, call, error) {
  superagent
    .get(url)
    .set('Content-Type', 'application/json')
    .query(param)
    .end(function(err, sres) {
      console.log(sres);
    });
}

/**
 * 使用superagent进行post请求
 * @param  {} key    [api key]
 * @param  {} data   [post data]
 * @param  {} call   [callback函数]
 * @param  {} error  [error函数]
 * @return {}        []
 */
requestTool.post = function(key, data, call, error) {
  superagent.post(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(sres.text);
      }
    });
}

/**
 * 使用superagent添加请求头进行post请求
 * @param  {} key    [api key]
 * @param  {} data   [post data]
 * @param  {} call   [callback函数]
 * @param  {} error  [error函数]
 * @return {}        []
 */
requestTool.postHeader = function(key, accessToken, data, call, error) {
  superagent.post(User_BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .set('access-token', accessToken)
    .send(data)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        call(JSON.parse(sres.text));
      }
    });
}

// 直接返回接口的data数据
requestTool.postwithhandle = function(key, data, call, error) {
  superagent.post(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function(err, sres) {
      if (err) {
        error(err);
      } else {
        if (JSON.parse(sres.text).code === 0) {
          call(JSON.parse(sres.text).data);
        } else {
          let msg = '';
          if (JSON.parse(sres.text).msg) {
            msg = JSON.parse(sres.text).msg;
          } else {
            msg = '接口返回错误';
          }
          error(msg);
        }
      }
    });
}

// 封装API post请求
requestTool.postApi = function(res, key, data, call) {
  superagent.post(BASE_URL + api[key])
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function(err, sres) {
      if (err) {
        res.send({ code: -1, msg: '接口请求错误' });
      } else {
        call(sres.text);
      }
    });
}

/**
 * 设置base微信获取code的链接
 * @param {} redirectUrl [微信重定向Url]
 * @param {} state       [Url参数]
 */
requestTool.setAuthUrl = function(redirectUrl, state) {
  let uri = encodeURIComponent(`${global.config.domain}${global.config.root}${redirectUrl}`);
  let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${global.config.appId}&redirect_uri=${uri}&response_type=code&scope=snsapi_base&state=${state}#wechat_redirect`;
  return url;
}

/**
 * 设置userinfo微信获取code的链接
 * @param {} redirectUrl [微信重定向Url]
 */
requestTool.setAuthInfoUrl = function(redirectUrl) {
  let uri = encodeURIComponent(`${global.config.domain}${global.config.root}${redirectUrl}`);
  let url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${global.config.appId}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&#wechat_redirect`;
  return url;
}

module.exports = requestTool;
