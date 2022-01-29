const sha1 = require("sha1");
const express = require("express");
const router = express.Router();
const ResCode = require("../utils/resultcode");
const UserModel = require("../models/users");
const { success, failure } = require("../utils/result");

// POST /signup 注册页
router.post("/", function (req, res, next) {
  const name = req.fields.name;
  const account = req.fields.account;
  let password = req.fields.password;
  const repassword = req.fields.repassword;

  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error("名字请限制在 1-10 个字符");
    }
    if (password.length < 6) {
      throw new Error("密码至少 6 个字符");
    }
    if (password !== repassword) {
      throw new Error("两次输入的密码不一致");
    }
  } catch (e) {
    // 参数校验失败(参数不合法)，返回错误信息
    const other = {
      info: e.message,
    };

    return failure(res, ResCode.PARAM_IS_INVALID, undefined, other);
  }

  // 校验通过, 将密码进行加密，存储用户信息至数据库
  password = sha1(password);

  const user = {
    name,
    account,
    password,
  };

  UserModel.create(user)
    .then(function (data) {
      // 插入信息成功, 返回成功的状态
      const other = {
        info: data.ops[0].name + "，注册成功",
      };

      return success(res, ResCode.SUCCESS, undefined, other);
    })
    .catch(function (e) {
      // 插入信息失败，返回失败的信息
      if (e.message.match("duplicate key")) {
        return failure(res, ResCode.USER_HAS_EXISTED);
      } else {
        next(e);
      }
    });
});

module.exports = router;
