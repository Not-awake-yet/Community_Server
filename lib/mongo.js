const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 根据 id 生成创建时间 createdDate
mongolass.plugin('addCreatedDate', {
    afterFind: function (results) {
        results.forEach(function (item) {
          item.createdDate = moment(objectIdToTimestamp(item._id)).format('YYYY年MM月DD日 HH:mm:ss')
        });
        return results;
      },
    afterFindOne: function (result) {
      if (result) {
        result.createdDate = moment(objectIdToTimestamp(result._id)).format('YYYY年MM月DD日 HH:mm:ss')
      }
      return result;
    }
});

// 用户 Model
// m: 男 f: 女 x: 未知
exports.Users = mongolass.model('Users', {
    avatar: { type: 'string', default: 'img/avatar/default.jpg' },
    name: { type: 'string', required: true },
    account: { type: 'string', required: true },
    password: { type: 'string', required: true },
    gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
    birthday: { type: 'string', default: '2022年1月1日' },
    description: { type: 'string', default: '无' }
});
exports.Users.index({ account: 1 }, { unique: true }).exec() // 根据账号找到用户，账号全局唯一

// 文章 Model
exports.Posts = mongolass.model('Posts', {
  author: { type: Mongolass.Types.ObjectId, required: true, ref: 'Users' },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  type: { type: 'string', required: true },
  views: { type: 'string', default: '0' },
  likes: { type: 'string', default: '0' },
});
exports.Posts.index({ author: 1, _id: -1 }).exec();

// 类型 Model
exports.Types = mongolass.model('Types', {
  typeName: { type: 'string', required: true },
  backImgURL: { type: 'string', required: true, default: 'img/beijin/beijin1.jpg'}
});
exports.Posts.index({ _id: 1 }).exec();

// 评论 Model
exports.Comment = mongolass.model('Comment', {
  user: { type: Mongolass.Types.ObjectId, required: true },
  content: { type: 'string', required: true },
  postId: { type: Mongolass.Types.ObjectId, required: true }
});
exports.Comment.index({ postId: 1, _id: 1 }).exec() // 通过文章 id 获取该文章下所有评论, 按留言创建时间升序