const Type = require("../lib/mongo").Types;

module.exports = {
    // 创建一个文章种类
    create: function create(typeName) {
        return Type.create({ typeName: typeName }).exec()
    },

    // 获取所有种类值
    getAllTypes: function getAllTypes() {
        return Type
            .find()
            .sort({ _id: -1 })
            .exec();
    }
}