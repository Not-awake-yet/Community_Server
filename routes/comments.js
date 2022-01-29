const express = require("express");
const router = express.Router();

const { checkLogin } = require("../middlewares/check");
const CommentModel = require("../models/comments");

// POST /comments 创建一条评论
router.post("/", checkLogin, function (req, res, next) {
  const author = req.session.user._id;
  const postId = req.fields.postId;
  const content = req.fields.content;

  // 校验参数
  try {
    if (!content.length) {
      throw new Error("请填写评论内容");
    }
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("back");
  }

  const comment = {
    author: author,
    postId: postId,
    content: content,
  };

  CommentModel.create(comment)
    .then(function () {
      req.flash("success", "评论成功");
      // 评论成功后跳转到上一页
      res.redirect("back");
    })
    .catch(next);
});

// GET /comments/:commentId/remove 删除一条评论
router.get("/:commentId/remove", checkLogin, function (req, res, next) {
  const commentId = req.params.commentId;
  const author = req.session.user._id;

  CommentModel.getCommentById(commentId).then(function (comment) {
    if (!comment) {
      throw new Error("评论不存在");
    }
    if (comment.author.toString() !== author.toString()) {
      throw new Error("没有权限删除评论");
    }
    CommentModel.delCommentById(commentId)
      .then(function () {
        req.flash("success", "删除评论成功");
        // 删除成功后跳转到上一页
        res.redirect("back");
      })
      .catch(next);
  });
});

module.exports = router;
