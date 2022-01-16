const API_NOT_EXIST = require("../utils/result").API_NOT_EXIST;

module.exports = function (app) {
  // 注册接口
  app.use("/signup", require("./signup"));

  // 登录接口
  app.use("/signin", require("./signin"));

  // 内容相关接口
  app.use("/posts", require("./posts"));

  // 类型相关接口
  app.use("/types", require("./types"));

  // 时间相关接口
  app.use("/times", require("./times"));

  // 用户相关接口
  app.use("/users", require("./users"));

  // 定义404处理机制
  app.use(function (req, res) {
    // console.log(res.headersSend);

    if (!res.headersSend) {
      return res.status(404).json({
        status: "failure",
        result: {
          code: API_NOT_EXIST.code,
          message: {
            type: API_NOT_EXIST.message,
            info: API_NOT_EXIST.message,
          },
        },
      });
    }
  });
};
