const Collection = require("../lib/mongo").Collections;

module.exports = {
  // 收藏某一篇文章
  create: function create(collect) {
    return Collection.create(collect).exec();
  },

  // 返回用户收藏的所有文章
  getAllCollections: function getAllCollections(userId) {
    return Collection.find({ user: userId })
      .populate({ path: "user", model: "Posts" })
      .sort({ _id: -1 })
      .addCreatedAt()
      .exec();
  },

  // 返回用户的收藏文章数
  getCollectCount: function getCollectCount(userId) {
    return Collection.count({ user: userId }).exec();
  },
};
