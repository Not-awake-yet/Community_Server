const express = require("express");
const config = require("config-lite")(__dirname);
const routes = require("./routes");
const pkg = require("./package");
const winston = require("winston");
const expressWinston = require("express-winston");

// 导入需要的错误信息
const { SERVER_INTERNAL_ERROR } = require("./utils/result");
const { failure } = require("./utils/result");

const app = express();
app.use(express.static(__dirname + "/public"));

// 处理请求信息的中间件
app.use(require("express-formidable")());

// 正常请求的日志
app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      new winston.transports.File({
        filename: "logs/success.log",
      }),
    ],
  })
);

// 路由
routes(app);

// 请求错误的日志
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      new winston.transports.File({
        filename: "logs/error.log",
      }),
    ],
  })
);

// 错误处理函数
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  const other = {
    info: err.message,
  };

  return failure(res, SERVER_INTERNAL_ERROR, undefined, other);
});

// 监听端口, 启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`);
});
