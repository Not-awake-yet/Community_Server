const fs = require('fs');
const path = require('path');
const { PARAM_NOT_COMPLETE } = require("../utils/resultcode");
const { failure } = require("../utils/result");

module.exports = {
  upPic: function upPic(req, res, next) {
    const picPath = req.files.picture.path.split(path.sep).pop();
  
    try {
      if (!req.files.picture.name) {
        throw "用户未上传图片";
      }
    } catch {
      const other = {
        info: e.message,
      };

      // 删除上传图片
      fs.unlink(req.files.picture.path);
      return failure(res, PARAM_NOT_COMPLETE, undefined, other);
    }
    
    req.picture = picPath;
    next();
  },
};