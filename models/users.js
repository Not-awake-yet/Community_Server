const User = require('../lib/mongo').Users

module.exports = {
    // 注册一个用户
    create: function create (user) {
        return User.create(user).exec();
    },

    // 通过账号获取用户信息
    getUserByAccount: function getUserByAccount (account) {
        return User
            .findOne({ account: account })
            .addCreatedAt()
            .exec()
    },

    // 修改用户密码
    changeUserPW: function changeUserPW (account, password) {
        return User
            .updateOne({ account: account }, { $set: { password: password }})
            .exec()
    }
}