const Type = require("../lib/mongo").Types;

/**
 * 方便文章分类
 */
module.exports = {
  // 创建一个文章种类
  create: function create(type) {
    return Type.create(type).exec();
  },

  // 获取所有种类值
  getAllTypes: function getAllTypes() {
    return Type.find().exec();
  },
};
