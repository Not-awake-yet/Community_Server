const express = require("express");
const router = express.Router();
const PostModel = require("../models/posts");
const ResCode = require("../utils/resultcode");
const { success, failure } = require("../utils/result");
const { checkLogin } = require("../middlewares/check");
const { upPic } = require("../middlewares/uppic");

// GET /posts/all 查看社区或某一用户的所有文章
// eg: GET /posts?author=xxx
router.get("/", function (req, res, next) {
  const author = req.query.author;

  PostModel.getPosts(author)
    .then(function (posts) {
      return success(res, ResCode.SUCCESS, posts);
    })
    .catch(next);
});

// GET /posts/one/:postId 查看一篇文章
router.get("/one/:postId", checkLogin, function (req, res, next) {
  const postId = req.params.postId;

  Promise.all([
    PostModel.getPostById(postId), // 获取文章具体信息
    CommentModel.getComments(postId), // 获取该文章所有评论
    PostModel.incViews(postId), // 浏览数加 1
  ])
    .then(function (result) {
      const post = result[0];
      const comments = result[1];
      if (!post) {
        throw new Error("该文章不存在");
      }

      const data = {
        post: post,
        comments: comments,
      };
      return success(res, ResCode.SUCCESS, data);
    })
    .catch(next);
});

// POST /posts/create 新建一篇文章
router.post("/create", checkLogin, function (req, res, next) {
  const author = req.user._id;
  const { title, content, typeId } = req.fields;

  // 校验参数
  try {
    if (!title.length) {
      throw new Error("缺失文章标题");
    }
    if (!content.length) {
      throw new Error("缺失文章内容");
    }
    if (!typeId.length) {
      throw new Error("缺失种类信息");
    }
  } catch (e) {
    const other = {
      info: e.message,
    };

    return failure(res, ResCode.PARAM_NOT_COMPLETE, undefined, other);
  }

  // 验证通过
  let post = {
    author: author,
    title: title,
    content: content,
    type: typeId,
  };

  // 向数据库插入文章信息
  PostModel.create(post)
    .then(function (data) {
      // 插入成功, 返回成功信息
      const other = {
        info: "新建文章 ID: " + data.ops[0]._id,
      };

      return success(res, ResCode.SUCCESS, undefined, other);
    })
    .catch(next);
});

// GET /posts/:postId/remove 删除一篇文章
router.get("/:postId/remove", checkLogin, function (req, res, next) {
  const postId = req.params.postId;
  const author = req.user._id;

  PostModel.getRawPostById(postId)
    .then(function (post) {
      try {
        if (!post) {
          // 文章不存在
          throw new Error("删除的文章不存在");
        }
        if (post.author._id.toString() !== author.toString()) {
          // 用户权限不够
          throw new Error("用户权限不够");
        }

        PostModel.delPostById(postId)
          .then(function () {
            // 删除成功, 返回成功信息
            const other = {
              info: "删除文章的标题: " + post.title,
            };

            return success(res, ResCode.SUCCESS, undefined, other);
          })
          .catch(next);
      } catch (e) {
        // 用户的权限不够或者删除文章不存在
        const other = {
          info: e.message,
        };

        return failure(res, ResCode.PARAM_IS_INVALID, undefined, other);
      }
    })
    .catch(next);
});

// POST /posts/:postId/edit 修改一篇文章
router.post("/:postId/edit", checkLogin, function (req, res, next) {
  const postId = req.params.postId;
  const author = req.user._id;
  const { title, content, typeId } = req.fields;

  try {
    if (!title.length) {
      throw new Error("缺失文章题目");
    }
    if (!content.length) {
      throw new Error("缺失文章内容");
    }
    if (!typeId.length) {
      throw new Error("缺失文章类型");
    }

    // 参数校验通过
    PostModel.getRawPostById(author, postId)
      .then(function (post) {
        // 文章不存在
        if (!post) {
          throw new Error("编辑的文章不存在");
        }

        // 权限不够
        if (post.author._id.toString() !== author.toString()) {
          throw new Error("用户权限不够");
        }

        PostModel.editPostById(postId, {
          title: title,
          content: content,
          type: typeId,
        })
          .then(function () {
            // 编辑成功, 返回成功的信息
            const other = {
              info: "编辑文章的标题: " + post.title,
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

    return failure(res, ResCode.PARAM_NOT_COMPLETE, undefined, other);
  }
});

// GET /posts/:content/search 搜索文章
router.get("/:content/search", checkLogin, function (req, res, next) {
  const content = req.params.content;

  PostModel.searchPost(content)
    .then(function (posts) {
      return success(res, ResCode.SUCCESS, posts);
    }).catch(next);
});

// POST /posts/picture  插入文章图片
router.post("/picture", checkLogin, upPic, function (req, res) {
  const picPath = req.picture;

  const other = {
    info: "图片地址: " + picPath,
  };

  return success(res, ResCode.SUCCESS, undefined, other);
});

module.exports = router;
