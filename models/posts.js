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

  // 返回社区所有转换后的文章或某一用户的所有转换后的文章
  getPosts: function getPosts(author) {
    const query = {};
    if (author) {
      query.author = author;
    }
    return Post.find(query)
      .populate({ path: "author", model: "User" })
      .populate({ path: "type", model: "Types" })
      .sort({ _id: -1 })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },

  // 通过文章 id 获取一篇转换后的文章
  getPostById: function getPostById(postId) {
    return Post.findOne({ _id: postId })
      .populate({ path: "author", model: "User" })
      .populate({ path: "type", model: "Types" })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },

  // 通过文章类型，按照时间降序返回某一类型转换后的文章
  getPostsByType: function getPostsByType(typeId) {
    return Post.find({ type: typeId })
      .populate({ path: "author", model: "Users" })
      .populate({ path: "type", model: "Types" })
      .sort({ _id: -1 })
      .addCreatedAt()
      .addCommentsCount()
      .contentToHtml()
      .exec();
  },

  // 通过文章 id 返回文章原始内容（方便用户再次编辑）
  getRawPostById: function getRawPostById(postId) {
    return Post.findOne({ _id: postId })
      .populate({ path: "author", model: "Users" })
      .populate({ path: "type", model: "Types" })
      .exec();
  },

  // 修改某一篇文章
  editPostById: function updatePostById(postId, data) {
    return Post.update({ _id: postId }, { $set: data }).exec();
  },

  // 通过文章 id 删除一篇文章
  delPostById: function delPostById(postId) {
    return Post.deleteOne({ _id: postId })
      .exec()
      .then(function (res) {
        // 文章删除后，再删除该文章下的所有留言
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentsByPostId(postId);
        }
      });
  },

  // 通过文章 id 给浏览数 views 加 1
  incViews: function incViews(postId) {
    return Post.update({ _id: postId }, { $inc: { views: 1 } }).exec();
  },

  // 通过文章 id 给点赞数 likes 加 1
  incLikes: function incLikes(postId) {
    return Post.update({ _id: postId }, { $inc: { likes: 1 } }).exec();
  },

  // 搜索文章
  searchPost: function searchPost(content) {},
};
