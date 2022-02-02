const Collection = require("../lib/mongo").Collections;

module.exports = {
  // 返回用户收藏的所有文章
  getAllCollections: function getAllCollections(userId) {
    return Collection.find({ user: userId })
      .populate({ path: "postId", model: "Posts" })
      .sort({ _id: -1 })
      .addCreatedAt()
      .exec();
  },

  // 返回用户的收藏文章数
  getCollectCount: function getCollectCount(userId) {
    return Collection.count({ user: userId }).exec();
  },

  // 收藏或者取消收藏
  collectOrNot: function collectOrNot(userId, postId) {
    return Collection.find({ $and: [{ user: userId }, { postId: postId }] })
      .exec()
      .then(function (res) {
        if (res) {
          // 如果文章已被收藏，则删除
          Collection.delete({
            $and: [{ user: userId }, { postId: postId }],
          }).exec();
        } else {
          // 如果文章未被收藏，则创建
          Collection.create({ user: userId, postId: postId }).exec();
        }
      });
  },
};
