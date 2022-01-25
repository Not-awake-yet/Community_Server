const Post = require("../lib/mongo").Posts;
const CommentModel = require("./comments");

// 给 post 添加留言数 commentsCount
Post.plugin("addCommentsCount", {
  afterFind: function (posts) {
    return Promise.all(
      posts.map(function (post) {
        return CommentModel.getCommentsCount(post._id).then(function (
          commentsCount
        ) {
          post.commentsCount = commentsCount;
          return post;
        });
      })
    );
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then(function (count) {
        post.commentsCount = count;
        return post;
      });
    }
    return post;
  },
});

// 将 post 的 content 从 markdown 转换成 html
Post.plugin("contentToHtml", {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content);
      return post;
    });
  },
  afterFindOne: function (post) {
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  },
});

module.exports = {
  // 创建一篇文章
  create: function create(post) {
    return Post.create(post).exec();
  },

  // 通过文章 Id 返回文章
  getPostById: function getPostById(author, postId) {
    return Post.findOne({ $and: [{ _id: postId }, { author: author }] })
      .populate({ path: "author", model: "Users" })
      .populate({ path: "type", model: "Types" })
      .exec();
  },

  // 通过文章类型，按照时间降序返回某一类型的文章
  getPostsByType: function getPostsByType(author, typeId) {
    return Post.find({ $and: [{ author: author }, { type: typeId }] })
      .populate({ path: "author", model: "Users" })
      .populate({ path: "type", model: "Types" })
      .sort({ _id: -1 })
      .exec();
  },

  // 通过时间，返回某一特定时间的文章
  getPostsByTime: function getPostsByTime(author, createDate) {
    return Post.find({
      $and: [
        { author: author },
        { createDate: { $regex: `^.*${createDate}.*$` } },
      ],
    })
      .populate({ path: "author", model: "Users" })
      .populate({ path: "type", model: "Types" })
      .sort({ _id: -1 })
      .exec();
  },

  // 通过文章 Id 返回文章原始内容
  getRawPostById: function getRawPostById(author, postId) {
    return Post.findOne({ $and: [{ author: author }, { _id: postId }] })
      .populate({ path: "author", model: "Users" })
      .exec();
  },

  // 修改文章内容
  editPostById: function updatePostById(postId, data) {
    return Post.update({ _id: postId }, { $set: data }).exec();
  },

  // 通过文章 Id 删除一篇文章
  delPostById: function delPostById(postId) {
    return Post.deleteOne({ _id: postId }).exec();
  },
};
