const express = require("express");
const router = express.Router();
const TypeModel = require("../models/types");
const PostModel = require("../models/posts");
const ResCode = require("../utils/resultcode");
const { checkLogin } = require("../middlewares/check");
const { success, failure } = require("../utils/result");

// 创建一个新的文章类型
router.post("/create", checkLogin, function (req, res, next) {
  const { name } = req.fields;

  // 参数校验
  if (!type) {
    return failure(res, ResCode.PARAM_NOT_COMPLETE);
  }

  const type = {
    name,
  };

  // 创建新种类
  TypeModel.create(type)
    .then(function () {
      const other = {
        info: "添加成功",
      };
      return success(res, ResCode.SUCCESS, undefined, other);
    })
    .catch(next);
});

// GET /types/alltype 返回所有的文章种类名
router.get("/alltype", checkLogin, function (req, res, next) {
  TypeModel.getAllTypes()
    .then(function (types) {
      // 查找成功, 返回所有的种类值
      return success(res, ResCode.SUCCESS, types);
    })
    .catch(next);
});

// GET /types/:typeId 返回指定种类的所有文章
router.get("/:typeId", checkLogin, function (req, res, next) {
  const typeId = req.params.typeId;

  PostModel.getPostsByType(typeId)
    .then(function (posts) {
      // 查询结果返回
      return success(res, ResCode.SUCCESS, posts);
    })
    .catch(next);
});

module.exports = router;
