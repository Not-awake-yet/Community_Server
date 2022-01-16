const express = require("express");
const router = express.Router();

const Result = require("../utils/result");
const checkLogin = require("../middlewares/check").checkLogin;
const PostModel = require("../models/posts");

function getWeek(date) {
  switch (date.getDay()) {
    case 0:
      return "星期日";
    case 1:
      return "星期一";
    case 2:
      return "星期二";
    case 3:
      return "星期三";
    case 4:
      return "星期四";
    case 5:
      return "星期五";
    case 6:
      return "星期六";
  }
}

// GET /times/now 获取当前时间
router.get("/now", checkLogin, function (req, res) {
  const date = new Date();
  const ymd =
    date.getFullYear().toString() +
    "年" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "月" +
    date.getDate().toString().padStart(2, "0") +
    "日";
  const hms =
    date.getHours().toString().padStart(2, "0") +
    ":" +
    date.getMinutes().toString().padStart(2, "0") +
    ":" +
    date.getSeconds().toString().padStart(2, "0");
  const time = ymd + " " + hms + " " + getWeek(date);

  // 返回时间
  return res.json({
    status: "success",
    result: {
      code: Result.FIND_SUCCESS.code,
      message: {
        type: Result.FIND_SUCCESS.message,
        info: time,
      },
    },
  });
});

// POST /times/memory 获取指定时间的日记
router.post("/memory", checkLogin, function (req, res) {
  const { time } = req.fields;
  const author = req.user._id;

  // 参数校验
  try {
    if (!time.length) {
      throw new Error("请传入要查询的日期");
    }
  } catch (e) {
    // 未输入日期参数
    return res.json({
      status: "failure",
      result: {
        code: Result.PARAM_IS_BLANK.code,
        message: {
          tyep: Result.PARAM_IS_BLANK.message,
          info: e.message,
        },
      },
    });
  }

  // 校验成功，开始查询
  PostModel.getPostsByTime(author, time)
    .then(function (posts) {
      // 返回查询到的文章信息
      return res.json({
        status: "success",
        result: {
          code: Result.FIND_SUCCESS.code,
          message: {
            type: Result.FIND_SUCCESS.message,
            info: posts,
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
