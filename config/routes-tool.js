'use strict';

var routesConfig = require('./routes-config.json');
var routesFilePath = '../server/routes/';
var routesTool = {};

/**
 * 重置路由
 * @return {[type]} [description]
 */
function resetRoutesConfig() {
  if (global.config.root) {
    routesConfig.root = global.config.root;
  }
}

resetRoutesConfig();

/**
 * 设置错误监听
 * @param {[type]} app [description]
 */
function setErrorHandler(app) {
  app.use(function(req, res, next) {
    res.status(404);
    try {
      res.render('404');
    } catch (e) {
      console.error('404 set header after sent');
    }
  });

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    try {
      res.render('error', {
        message: err.message,
        error: err
      });
    } catch (e) {
      console.error('500 set header after sent');
    }
  });
}

/**
 * 批量设置 routes-config.json 中配置的路由
 * @param {[type]} app [description]
 */
function setRoutes(app) {
  var routes = routesConfig.routes;
  for (var i in routes) {
    var route = routes[i];
    app.use(
      routesConfig.root + route.parentUrl,
      require(routesFilePath + route.routePath));
  }
}

routesTool.useRoutes = function(app) {
  setRoutes(app);
  setErrorHandler(app);
}

routesTool.routesConfig = routesConfig;

module.exports = routesTool;
