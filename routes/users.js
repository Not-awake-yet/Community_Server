const sha1 = require('sha1');
const express = require("express");
const router = express.Router();

const Result = require("../utils/result");
const UserModel = require("../models/users");
const checkLogin = require("../middlewares/check").checkLogin;

// GET /users/getInfo 返回指定用户信息
router.get("/getInfo", checkLogin, function (req, res) {
  const author = req.user._id;

  UserModel.getUserByID(account)
    .then(function (user) {
      // 用户不存在，返回错误信息
      if (!user) {
        return res.json({
          status: "failure",
          result: {
            code: Result.USER_NOT_EXIST.code,
            message: {
              type: Result.USER_NOT_EXIST.message,
              info: "",
            },
          },
        });
      }

      // 用户存在, 返回用户信息
      return res.json({
        status: "success",
        result: {
          code: Result.FIND_SUCCESS.code,
          message: {
            type: Result.FIND_SUCCESS.message,
            info: user,
          },
        },
      });
    })
    .catch(function () {
      return res.json({
        status: "failure",
        result: {
          code: Result.OTHER_ERROR.code,
          message: {
            type: Result.OTHER_ERROR.message,
            info: "发生了未知的其他错误",
          },
        },
      });
    });
});

// POST /users/changepw  修改密码信息
router.post("/changepw", function (req, res) {
  const { account, password, repassword } = req.fields;

  try {
    // 参数校验
    if (!account.length) {
      throw new Error("缺失要修改账号");
    }
    if (!password.length) {
      throw new Error("缺失要修改的密码");
    }
    if (!repassword.length) {
      throw new Error("缺失确认的密码");
    }
    if (repassword !== password) {
      throw new Error("两次输入密码不一致");
    }

    // 参数校验通过
    UserModel.getUserByAccount(account)
      .then(function (user) {
        if (!user) {
          return res.json({
            status: "failure",
            result: {
              code: Result.USER_NOT_EXIST.code,
              message: {
                type: Result.USER_NOT_EXIST.message,
                info: "",
              },
            },
          });
        }

        UserModel.changeUserPW(account, sha1(password))
          .then(function () {
            return res.json({
              status: "success",
              result: {
                code: Result.EDIT_SUCCESS.code,
                message: {
                  type: Result.EDIT_SUCCESS.message,
                  info: "修改密码成功",
                },
              },
            });
          })
          .catch(function () {
            return res.json({
              status: "failure",
              result: {
                code: Result.OTHER_ERROR.code,
                message: {
                  type: Result.OTHER_ERROR.message,
                  info: "发生了未知的其他错误",
                },
              },
            });
          });
      })
      .catch(function () {
        return res.json({
          status: "failure",
          result: {
            code: Result.OTHER_ERROR.code,
            message: {
              type: Result.OTHER_ERROR.message,
              info: "发生了未知的其他错误",
            },
          },
        });
      });
  } catch (e) {
    return res.json({
      status: "failure",
      result: {
        code: Result.PARAM_IS_INVALID.code,
        message: {
          type: Result.PARAM_IS_INVALID.message,
          info: e.message,
        },
      },
    });
  }
});

// POST /users/chavatar  修改用户头像

// POST /users/changeif

module.exports = router;
