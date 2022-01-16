const config = require('config-lite')(__dirname);
const jwt = require('jsonwebtoken');

const USER_NOT_LOGGED = require('../utils/result').USER_NOT_LOGGED;

module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        const token = req.headers['authorization'];
        
        if (token == null) {
            return res.json({
                status: 'failure',
                result: {
                    code: USER_NOT_LOGGED.code,
                    message: {
                        type: USER_NOT_LOGGED.message,
                        info: USER_NOT_LOGGED.message
                    }
                }
            });
        }

        jwt.verify(token, config.key, function (err, user) {
            if (err) {
                // token 验证失败
                return res.json({
                    status: 'failure',
                    result: {
                        code: USER_NOT_LOGGED.code,
                        message: {
                            type: USER_NOT_LOGGED.message,
                            info: USER_NOT_LOGGED.message
                        }
                    }
                });
            }
            
            // token 验证成功， 将用户信息保存在请求中
            req.user = user;
            next();
        });
    }
}