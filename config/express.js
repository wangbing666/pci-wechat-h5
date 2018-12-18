'use strict';

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routesTool = require('./routes-tool');

module.exports = function() {

    var app = express();
    var resources = {
        view: '/client/views',
        assets: '/client/assets'
    };

    // 设置模版引擎
    app.set('views', global.config.filedir + resources.view);
    app.set('view engine', 'ejs');

    app.use(logger('[:date[clf]] :method :url :status :response-time ms - :res[content-length]'));
    // app.use(logger('combined'));

    app.use(bodyParser.json());


    app.use(cookieParser('pcihahah'));

    //设置全局函数
    app.locals['_src'] = function(src) {
        return global.config.domain + routesTool.routesConfig.root + src;
    };

    // console.log(global.config.filedir + resources.assets);
    // 静态资源访问路径设置
    app.use(routesTool.routesConfig.root, express.static(global.config.filedir + resources.assets));

    // 路由配置
    routesTool.useRoutes(app);



    return app;

}