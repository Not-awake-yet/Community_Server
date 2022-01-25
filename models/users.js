const User = require('../lib/mongo').Users

module.exports = {
    // 注册一个用户
    create: function create (user) {
        return User.create(user).exec();
    },

    // 通过ID获取用户信息
    getUserByID: function getUserByID (id) {
        return User
            .findOne({ _id: id })
            .addCreatedAt()
            .exec()
    },

    // 修改用户密码
    changeUserPW: function changeUserPW (id, password) {
        return User
            .updateOne({ _id: id }, { $set: { password: password }})
            .exec()
    },

    // 修改用户头像
    changeUserAV: function changeUserAV (id, avatar) {
        return User
            .updateOne({ _id: id}, { $set: { avatar: avatar }})
            .exec()
    },

    // 修改用户信息
    changeUserInfo: function changeUserInfo (id, info) {
        return User
            .updateOne({ _id: id}, { $set: info})
            .exec()
    }
}