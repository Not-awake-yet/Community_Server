const express = require("express");
const config = require("config-lite")(__dirname);
const routes = require("./routes");
const pkg = require("./package");
const winston = require('winston');
const expressWinston = require('express-winston');

// 导入需要的错误信息
const SERVER_INTERNAL_ERROR = require('./utils/result').SERVER_INTERNAL_ERROR;

const app = express();
app.use(express.static(__dirname + '/public'));

// 处理请求信息的中间件
app.use(require('express-formidable')());

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

// 路由
routes(app);

// 请求错误的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

// 错误处理函数
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  return res.json({
    status: "failure",
    result: {
      code: SERVER_INTERNAL_ERROR.code,
      message: {
        type: SERVER_INTERNAL_ERROR.message,
        info: SERVER_INTERNAL_ERROR.message    
      },
    },
  });
});

// 监听端口, 启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`);
});
