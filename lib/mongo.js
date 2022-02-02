const config = require("config-lite")(__dirname);
const Mongolass = require("mongolass");
const moment = require("moment");
const objectIdToTimestamp = require("objectid-to-timestamp");

const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 根据 id 生成创建时间 createdDate
mongolass.plugin("addCreatedDate", {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.createdDate = moment(objectIdToTimestamp(item._id)).format(
        "YYYY年MM月DD日 HH:mm:ss"
      );
    });
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
      result.createdDate = moment(objectIdToTimestamp(result._id)).format(
        "YYYY年MM月DD日 HH:mm:ss"
      );
    }
    return result;
  },
});

// 用户 Model
// m: 男 f: 女 x: 未知
exports.Users = mongolass.model("Users", {
  avatar: { type: "string", default: "img/default.jpg" },
  name: { type: "string", required: true },
  account: { type: "string", required: true },
  password: { type: "string", required: true },
  gender: { type: "string", enum: ["m", "f", "x"], default: "x" },
  birthday: { type: "string", default: "2022年1月1日" },
  description: { type: "string", default: "无" },
});
exports.Users.index({ account: 1 }, { unique: true }).exec(); // 根据账号找到用户，账号全局唯一

// 文章 Model
exports.Posts = mongolass.model("Posts", {
  author: { type: Mongolass.Types.ObjectId, required: true, ref: "Users" },
  title: { type: "string", required: true },
  content: { type: "string", required: true },
  type: { type: Mongolass.Types.ObjectId, required: true, ref: "Types" },
  views: { type: "number", default: 0 },
});
exports.Posts.index({ author: 1, _id: -1 }).exec(); // 按文章创建时间降序排列

// 类型模型
exports.Types = mongolass.model("Types", {
  typeName: { type: "string", required: true },
});
exports.Types.index({ _id: 1 }).exec();

// 评论 Model
exports.Comments = mongolass.model("Comments", {
  user: { type: Mongolass.Types.ObjectId, required: true, ref: "Users" },
  content: { type: "string", required: true },
  postId: { type: Mongolass.Types.ObjectId, required: true, ref: "Posts" },
});
exports.Comments.index({ postId: 1, _id: -1 }).exec(); // 通过文章 id 获取该文章下所有评论, 按评论创建时间降序

// 收藏 Model
exports.Collections = mongolass.model("Collections", {
  user: { type: Mongolass.Types.ObjectId, required: true, ref: "Users" },
  postId: { type: Mongolass.Types.ObjectId, required: true, ref: "Posts" },
});
exports.Collections.index({ user: 1, _id: -1 }).exec(); // 通过用户 id 获取该用户收藏的所有文章, 按收藏创建时间降序
