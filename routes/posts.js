const express = require("express");
const router = express.Router();

const Result = require("../utils/result");
const PostModel = require("../models/posts");
const checkLogin = require("../middlewares/check").checkLogin;

// POST /posts/create 添加一篇日记
router.post("/create", checkLogin, function (req, res) {
  const author = req.user._id;
  const { title, content, typeId, createDate } = req.fields;

  // 校验参数
  try {
    if (!title.length) {
      throw new Error("缺失日记标题");
    }
    if (!content.length) {
      throw new Error("缺失日记内容");
    }
    if (!typeId.length) {
      throw new Error("缺失种类信息");
    }
    if (!createDate.length) {
      throw new Error("缺失上传日期");
    }
  } catch (e) {
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

  // 验证通过
  let post = {
    author: author,
    title: title,
    content: content,
    type: typeId,
    createDate: createDate,
  };

  // 向数据库插入日记信息
  PostModel.create(post)
    .then(function (data) {
      // 插入成功, 返回成功信息
      return res.json({
        status: "success",
        result: {
          code: Result.ADD_SUCCESS.code,
          message: {
            type: Result.ADD_SUCCESS.message,
            info: "文章 Id：" + data.ops[0]._id,
          },
        },
      });
    })
    .catch(function () {
      // 插入失败,返回错误信息
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

// GET /posts/:postId/remove 删除一篇日记
router.get("/:postId/remove", checkLogin, function (req, res) {
  const postId = req.params.postId;
  const author = req.user._id;

  PostModel.getRawPostById(author, postId)
    .then(function (post) {
      try {
        if (!post) {
          // 日记不存在
          throw new Error("删除的日记不存在");
        }
        if (post.author._id.toString() !== author.toString()) {
          // 用户权限不够
          throw new Error("用户权限不够");
        }

        PostModel.delPostById(postId)
          .then(function () {
            // 删除成功, 返回成功信息
            return res.json({
              status: "success",
              result: {
                code: Result.DELETE_SUCCESS.code,
                message: {
                  type: Result.DELETE_SUCCESS.message,
                  info: "删除文章的标题：" + post.title,
                },
              },
            });
          })
          .catch(function () {
            //  删除失败，返回错误信息
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
        // 用户的权限不够或者删除日记不存在
        return res.json({
          status: "failure",
          result: {
            code: Result.POST_DELETE_ERROR.code,
            message: {
              type: Result.POST_DELETE_ERROR.message,
              info: e.message,
            },
          },
        });
      }
    })
    .catch(function () {
      //  删除失败，返回错误信息
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

// POST /posts/:postId/edit 修改一篇日记
router.post("/:postId/edit", checkLogin, function (req, res) {
  const postId = req.params.postId;
  const author = req.user._id;
  const { title, content, typeId } = req.fields;

  try {
    if (!title.length) {
      throw new Error("缺失日记题目");
    }
    if (!content.length) {
      throw new Error("缺失日记内容");
    }
    if (!typeId.length) {
      throw new Error("缺失日记类型");
    }

    // 参数校验通过
    PostModel.getRawPostById(author, postId)
      .then(function (post) {
        try {
          // 日记不存在
          if (!post) {
            throw new Error("编辑的日记不存在");
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
              return res.json({
                status: "success",
                result: {
                  code: Result.EDIT_SUCCESS.code,
                  message: {
                    type: Result.EDIT_SUCCESS.message,
                    info: "编辑文章的标题：" + post.title,
                  },
                },
              });
            })
            .catch(function () {
              //  编辑失败，返回错误信息
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
              code: Result.POST_EDIT_ERROR.code,
              message: {
                type: Result.POST_EDIT_ERROR.message,
                info: e.message,
              },
            },
          });
        }
      })
      .catch(function () {
        //  编辑失败，返回错误信息
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
        code: Result.PARAM_NOT_COMPLETE.code,
        message: {
          type: Result.PARAM_NOT_COMPLETE.message,
          info: e.message,
        },
      },
    });
  }
});

// GET /posts/:postId 查看一篇日记
router.get("/:postId", checkLogin, function (req, res) {
  const author = req.user._id;
  const postId = req.params.postId;

  PostModel.getPostById(author, postId)
    .then(function (post) {
      if (!post) {
        return res.json({
          status: "failure",
          result: {
            code: Result.POST_NOT_EXIT.code,
            message: {
              type: Result.POST_NOT_EXIT.message,
              info: "",
            },
          },
        });
      }

      // 日记存在, 返回日记信息
      return res.json({
        status: "success",
        result: {
          code: Result.FIND_SUCCESS.code,
          message: {
            type: Result.FIND_SUCCESS.message,
            info: post,
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

module.exports = router;
