const sha1 = require("sha1");
const express = require("express");
const router = express.Router();

const ResultInfo = require("../utils/result");
const UserModel = require("../models/users");

// POST /signup 注册页
router.post("/", function (req, res) {
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
    // 注册失败，返回错误信息
    return res.json({
      status: "failure",
      result: {
        code: ResultInfo.PARAM_IS_INVALID.code,
        message: {
          type: ResultInfo.PARAM_IS_INVALID.message,
          info: e.message,
        },
      },
    });
  }

  // 校验通过, 将密码进行加密，存储用户信息至数据库
  password = sha1(password);

  let user = {
    name: name,
    account: account,
    password: password,
  };
  UserModel.create(user)
    .then(function (data) {
      // 插入信息成功, 返回成功的状态
      return res.json({
        status: "success",
        result: {
          code: ResultInfo.REGISTERED_SUCCESS.code,
          message: {
            type: ResultInfo.REGISTERED_SUCCESS.message,
            info: data.ops[0].name,
          },
        },
      });
    })
    .catch(function (e) {
      // 插入信息失败，返回失败的信息

      if (e.message.match("duplicate key")) {
        return res.json({
          status: "failure",
          result: {
            code: ResultInfo.USER_HAS_EXISTED.code,
            message: {
              type: ResultInfo.USER_HAS_EXISTED.message,
              info: "",
            },
          },
        });
      } else {
        return res.json({
          status: "failure",
          result: {
            code: ResultInfo.OTHER_ERROR.code,
            message: {
              type: ResultInfo.OTHER_ERROR.message,
              info: e.message,
            },
          },
        });
      }
    });
});

module.exports = router;
