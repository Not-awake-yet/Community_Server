const sha1 = require("sha1");
const jwt = require("jsonwebtoken");
const config = require("config-lite")(__dirname);
const express = require("express");
const router = express.Router();

const Result = require("../utils/result");
const UserModel = require("../models/users");

// POST /signin 用户登录
router.post("/", function (req, res) {
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
    return res.json({
      status: "failure",
      result: {
        code: Result.PARAM_NOT_COMPLETE.code,
        message: {
          type: Result.PARAM_NOT_COMPLETE.message,
          info: e.message,
        },
      },
    });
  }

  // 上传参数校验通过，均不为空
  UserModel.getUserByAccount(account).then(function (user) {
    if (!user) {
      return res.json({
        status: "failure",
        result: {
          code: Result.USER_NOT_EXIST.code,
          message: {
            type: Result.USER_NOT_EXIST.message,
            info: Result.USER_NOT_EXIST.message,
          },
        },
      });
    }

    // 检查密码是否匹配
    if (sha1(password) !== user.password) {
      return res.json({
        status: "failure",
        result: {
          code: Result.USER_LOGIN_ERROR.code,
          message: {
            type: Result.USER_LOGIN_ERROR.message,
            info: Result.USER_LOGIN_ERROR.message,
          },
        },
      });
    }

    // // 密码匹配成功
    // // 将用户 ID 写入 token, 生成加签后的token
    let token = jwt.sign({ _id: user._id }, config.key, { expiresIn: "1h" });

    return res.json({
      status: "success",
      result: {
        code: Result.LOGIN_SUCCESS.code,
        message: {
          type: Result.LOGIN_SUCCESS.message,
          info: {
            name: user.name,
            token: token,
          },
        },
      },
    });
  });
});

module.exports = router;
