const express = require('express');
const router = express.Router();

const TypeModel = require('../models/types');
const PostModel = require('../models/posts');
const Result = require('../utils/result');
const checkLogin = require('../middlewares/check').checkLogin;

// 创建一个新的文章类型
router.post('/create', checkLogin, function (req, res) {
    const { type } = req.fields;

    // 参数校验
    if ( !type ) {
        return res.json({
            status: 'failure',
            result: {
                code: Result.PARAM_IS_BLANK.code,
                message: {
                    type: Result.PARAM_IS_BLANK.message,
                    info: Result.PARAM_IS_BLANK.message,
                }
            }
        });
    }

    // 创建新种类
    TypeModel.create(type).then(function () {
        return res.json({
            status: 'success',
            result: {
                code: Result.ADD_SUCCESS.code,
                message: {
                    type: Result.ADD_SUCCESS.message,
                    info: Result.ADD_SUCCESS.message
                }
            }
        });
    }).catch( function () {
        return res.json({
            status: 'failure',
            result: {
                code: Result.OTHER_ERROR.code,
                message: {
                    type: Result.OTHER_ERROR.message,
                    info: "发生了未知的其他错误"
                }
            }
        });
    });
});

// GET /types/alltype 返回所有的文章种类和种类背景图片URL
router.get('/alltype', checkLogin, function (req, res) {
    TypeModel.getAllTypes().then(function (types) {        
        // 查找成功, 返回所有的种类值
        return res.json({
            status: 'success',
            result: {
                code: Result.FIND_SUCCESS.code,
                message: {
                    type: Result.FIND_SUCCESS.message,
                    info: types
                }
            }
        });
    }).catch(function () {
        return res.json({
            status: 'failure',
            result: {
                code: Result.OTHER_ERROR.code,
                message: {
                    type: Result.OTHER_ERROR.message,
                    info: "发生了未知的其他错误"
                }
            }
        });
    });
});

// GET /types/:typeId 返回指定种类的所有文章以及该种类背景图片URL
router.get('/:typeId', checkLogin, function (req, res) {
    const author = req.user._id;
    const typeId = req.params.typeId;

    PostModel
        .getPostsByType(author, typeId).then(function (posts) {
            // 查询结果返回
            return res.json({
                status: 'success',
                result: {
                    code: Result.FIND_SUCCESS.code,
                    message: {
                        type: Result.FIND_SUCCESS.message,
                        info: posts
                    }
                }
            });
        }).catch( function () {
            return res.json({
                status: 'failure',
                result: {
                    code: Result.OTHER_ERROR.code,
                    message: {
                        type: Result.OTHER_ERROR.message,
                        info: "发生了未知的其他错误"
                    }
                }
            });
        });
});


module.exports = router;