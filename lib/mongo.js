const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
          item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY年MM月DD日 HH:mm')
        });
        return results;
      },
    afterFindOne: function (result) {
      if (result) {
        result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY年MM月DD日 HH:mm')
      }
      return result;
    }
});

// 用户模型
exports.Users = mongolass.model('Users', {
    avatar: { type: 'string', required: true, default: 'img/default/avatar.jpg' },
    name: { type: 'string', required: true },
    password: { type: 'string', required: true },
    account: { type: 'string', required: true },
});
exports.Users.index({ account: 1 }, { unique: true }).exec() // 根据账号找到用户，账号全局唯一

// 日记模型
exports.Posts = mongolass.model('Posts', {
  author: { type: Mongolass.Types.ObjectId, required: true },
  title: { type: 'string', required: true },
  content: { type: 'string', required: true },
  type: { type: Mongolass.Types.ObjectId, required: true },
  createDate: { type: 'string', required: true }
});
exports.Posts.index({ author: 1, _id: -1 }).exec();

// 类型模型
exports.Types = mongolass.model('Types', {
  typeName: { type: 'string', required: true },
  backImgURL: { type: 'string', required: true, default: 'img/beijin/beijin1.jpg'}
});
exports.Posts.index({ _id: 1 }).exec();