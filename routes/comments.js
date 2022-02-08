const express = require("express");
const router = express.Router();
const CommentModel = require("../models/comments");
const ResCode = require("../utils/resultcode");
const { success, failure } = require("../utils/result");
const { checkLogin } = require("../middlewares/check");

// POST /comments/create 创建一条评论
router.post("/create", checkLogin, function (req, res, next) {
  const user = req.user._id;
  const postId = req.fields.postId;
  const content = req.fields.content;

  // 校验参数
  try {
    if (!content.length) {
      throw new Error("请填写评论内容");
    }
  } catch (e) {
    const other = {
      info: e.message,
    };

    return failure(res, ResCode.PARAM_NOT_COMPLETE, undefined, other);
  }

  const comment = {
    user: user,
    postId: postId,
    content: content,
  };

  CommentModel.create(comment)
    .then(function () {
      return success(res, ResCode.SUCCESS);
    })
    .catch(next);
});

// GET /comments/:commentId/remove 删除一条评论
router.get("/:commentId/remove", checkLogin, function (req, res, next) {
  const commentId = req.params.commentId;
  const user = req.user._id;

  CommentModel.getCommentById(commentId).then(function (comment) {
    if (!comment) {
      throw new Error("评论不存在");
    }
    if (comment.user.toString() !== user.toString()) {
      throw new Error("没有权限删除评论");
    }
    CommentModel.delCommentById(commentId)
      .then(function () {
        const other = {
          info: "评论删除成功",
        };

        return success(res, ResCode.SUCCESS, undefined, other);
      })
      .catch(next);
  });
});

module.exports = router;
