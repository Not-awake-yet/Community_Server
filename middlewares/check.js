const config = require("config-lite")(__dirname);
const jwt = require("jsonwebtoken");
const { USER_NOT_LOGGED } = require("../utils/resultcode");
const { failure } = require("../utils/result");

module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) return failure(res, USER_NOT_LOGGED);

    jwt.verify(token, config.key, function (err, user) {
      // token 验证失败
      if (err) return failure(res, USER_NOT_LOGGED);

      // token 验证成功， 将用户信息保存在请求中
      req.user = user.user;
      next();
    });
  },
};
