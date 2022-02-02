const sha1 = require("sha1");
const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const ColModel = require("../models/collections");
const ResCode = require("../utils/resultcode");
const { success, failure } = require("../utils/result");
const { checkLogin } = require("../middlewares/check");
const { upPic } = require("../middlewares/uppic");

// GET /users/getInfo 返回指定用户信息
router.get("/getInfo", checkLogin, function (req, res, next) {
  const account = req.user.account;

  UserModel.getUserByAC(account)
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
  const account = req.user.account;
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
    UserModel.getUserByAC(account)
      .then(function (user) {
        if (!user) {
          return failure(res, ResCode.USER_NOT_EXIST);
        }

        UserModel.changeUserPW(account, sha1(password))
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
router.post("/chavatar", checkLogin, upPic, function (req, res, next) {
  const account = req.user.account;
  const picPath = req.picture;

  UserModel.changeUserAV(account, picPath)
    .then(function () {
      const other = {
        info: "头像: " + picPath,
      };

      return success(res, ResCode.SUCCESS, undefined, other);
    })
    .catch(next);
});

// POST /users/changeif  修改用户信息
router.post("/changeif", checkLogin, function (req, res, next) {
  const info = Object.assign({}, req.fields);

  // 判断 info 是否为空
  if (Object.keys(info).length === 0) {
    const other = {
      info: "修改 info 为空",
    };

    return failure(res, ResCode.PARAM_NOT_COMPLETE, undefined, other);
  }

  UserModel.changeUserInfo(info)
    .then(function () {
      return success(res, ResCode.SUCCESS);
    })
    .catch(next);
});

// GET /users/:postId/collect 收藏一篇文章或取消收藏
router.get("/:postId/collect", checkLogin, function (req, res, next) {
  ColModel.collectOrNot(req.user._id, req.params.postId)
    .then(function () {
      // 返回附带信息
      // const other = {
      //   info: "收藏成功",
      // };

      return success(res, ResCode.SUCCESS);
    })
    .catch(next);
});

// GET /users/collections 获取用户收藏的所有文章
router.get("/collections", checkLogin, function (req, res, next) {
  const userId = req.user._id;

  ColModel.getAllCollections(userId)
    .then(function (posts) {
      return success(res, ResCode.SUCCESS, posts);
    })
    .catch(next);
});

// GET /users/collect/count 获取用户的收藏文章数
router.get("/collect/count", checkLogin, function (req, res, next) {
  ColModel.getCollectCount(req.user._id)
    .then(function (colCount) {
      const data = {
        count: colCount,
      };

      return success(res, ResCode.SUCCESS, data);
    })
    .catch(next);
});

module.exports = router;
