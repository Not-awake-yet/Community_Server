const sha1 = require("sha1");
const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const ResCode = require("../utils/resultcode");
const { success, failure } = require("../utils/result");
const { checkLogin } = require("../middlewares/check");

// GET /users/getInfo 返回指定用户信息
router.get("/getInfo", checkLogin, function (req, res, next) {
  const userId = req.user._id;

  UserModel.getUserByID(userId)
    .then(function (user) {
      // 用户不存在，返回错误信息
      if (!user) {
        return failure(res, ResCode.USER_NOT_EXIST);
      }

      // 用户存在, 返回用户信息
      return success(res, ResCode.SUCCESS, user);
    })
    .catch(next);
});

// POST /users/changepw  修改密码信息
router.post("/changepw", checkLogin, function (req, res, next) {
  const userId = req.user._id;
  const { password, repassword } = req.fields;

  try {
    // 参数校验
    if (!password.length) {
      throw new Error("原密码不能为空");
    }
    if (!repassword.length) {
      throw new Error("确认密码不能为空");
    }
    if (repassword !== password) {
      throw new Error("两次输入密码不一致");
    }
    // 参数校验通过
    UserModel.getUserByID(userId)
      .then(function (user) {
        if (!user) {
          return failure(res, ResCode.USER_NOT_EXIST);
        }

        UserModel.changeUserPW(userId, sha1(password))
          .then(function () {
            const other = {
              info: "修改密码成功",
            };

            return success(res, ResCode.SUCCESS, undefined, other);
          })
          .catch(next);
      })
      .catch(next);
  } catch (e) {
    const other = {
      info: e.message,
    };

    return failure(res, ResCode.PARAM_IS_INVALID, undefined, other);
  }
});

// POST /users/chavatar  修改用户头像

// POST /users/changeif  修改用户信息

module.exports = router;
