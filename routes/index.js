const { API_NOT_EXIST } = require("../utils/resultcode");
const { failure } = require("../utils/result");

module.exports = function (app) {
  // 注册接口
  app.use("/signup", require("./signup"));

  // 登录接口
  app.use("/signin", require("./signin"));

  // 内容相关接口
  app.use("/posts", require("./posts"));

  // 类型相关接口
  app.use("/types", require("./types"));

  // 用户相关接口
  app.use("/users", require("./users"));

  // 评论相关接口
  app.use('/comments', require('./comments'));

  // 定义404处理机制
  app.use(function (req, res) {
    // console.log(res.headersSend);

    if (!res.headersSend) {
      res.status(404);
      return failure(res, API_NOT_EXIST)
    }
  });
};
