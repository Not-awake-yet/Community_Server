class ResultCode {    
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}

module.exports = {
    // 成功状态码
    REGISTERED_SUCCESS: new ResultCode(2001, "注册成功"),
    LOGIN_SUCCESS: new ResultCode(2002, "登录成功"),
    EDIT_SUCCESS: new ResultCode(2003, "修改成功"),
    ADD_SUCCESS: new ResultCode(2004, "添加成功"),
    DELETE_SUCCESS: new ResultCode(2005, "删除成功"),
    FIND_SUCCESS: new ResultCode(2006, "查询成功"),

    // 其他错误
    OTHER_ERROR: new ResultCode(3001, "其他类型错误"),

    // 客户端错误
    PARAM_IS_INVALID: new ResultCode(4001, "参数无效"),
    PARAM_IS_BLANK: new ResultCode(4002, "参数为空"),
    PARAM_TYPE_ERROR: new ResultCode(4003, "参数类型错误"),
    API_NOT_EXIST: new ResultCode(4004, "请求的 API 不存在"),
    PARAM_NOT_COMPLETE: new ResultCode(4005, "参数缺失"),
    USER_NOT_LOGGED: new ResultCode(4006, "用户未登录, 请先进行登录"),
    USER_LOGIN_ERROR: new ResultCode(4007, "账号或密码错误, 请输入正确的账号和密码"),
    USER_NOT_EXIST: new ResultCode(4008, "该用户不存在"),
    USER_HAS_EXISTED: new ResultCode(4009, "该用户已存在"),
    POST_EDIT_ERROR: new ResultCode(4010, "编辑日记错误"),
    POST_DELETE_ERROR: new ResultCode(4011, "删除文章错误"),
    FIND_ERROR: new ResultCode(4012, "查找文章错误"),

    // 服务端内部错误
    SERVER_INTERNAL_ERROR: new ResultCode(5001, "服务器内部发生错误")
}