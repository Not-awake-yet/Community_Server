const sha1 = require("sha1");
const jwt = require("jsonwebtoken");
const config = require("config-lite")(__dirname);
const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const ResCode = require("../utils/resultcode");
const { success, failure } = require("../utils/result");

// POST /signin 用户登录
router.post("/", function (req, res, next) {
  const account = req.fields.account;
  const password = req.fields.password;

  // 校验参数
  try {
    if (!account.length) {
      throw new Error("请输入账号");
    }
    if (!password.length) {
      throw new Error("请输入密码");
    }
  } catch (e) {
    // 请求参数缺失
    const other = {
      info: e.message,
    };

    return failure(res, ResCode.PARAM_NOT_COMPLETE, undefined, other);
  }

  // 上传参数校验通过，均不为空
  UserModel.getUserByAC(account).then(function (user) {
    if (!user) {
      return failure(res, ResCode.USER_NOT_EXIST);
    }

    // 检查密码是否匹配
    if (sha1(password) !== user.password) {
      return failure(res, ResCode.PARAM_IS_INVALID);
    }

    // 密码匹配成功
    // 将用户 ID 写入 token, 生成加签后的token
    const token = jwt.sign({ _id: user._id }, config.key, { expiresIn: "24h" });

    const other = {
      info: user.name + "，登录成功",
    };

    return success(res, ResCode.SUCCESS, token, other);
  }).catch(next);
});

module.exports = router;
