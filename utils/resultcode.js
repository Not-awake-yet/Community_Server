class ResultCode {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }
}

module.exports = {
  // 成功状态码
  SUCCESS: new ResultCode(2001, "请求成功"),

  // 客户端错误
  PARAM_IS_INVALID: new ResultCode(4001, "参数无效"),
  PARAM_NOT_COMPLETE: new ResultCode(4002, "缺少参数"),
  PARAM_TYPE_ERROR: new ResultCode(4003, "参数格式非法"),
  DATA_NOT_FOUND: new ResultCode(4004, "没有匹配的数据"),
  API_NOT_EXIST: new ResultCode(4005, "请求的 API 不存在"),
  USER_NOT_LOGGED: new ResultCode(4006, "用户未登录"),
  USER_NOT_EXIST: new ResultCode(4007, "该用户不存在"),
  USER_HAS_EXISTED: new ResultCode(4008, "该用户已存在"),

  // 服务端内部错误
  SERVER_INTERNAL_ERROR: new ResultCode(5001, "服务器出错"),
  SERVER_RESTRICTED: new ResultCode(5002, "服务器维护中"),

  // 其他错误
  OTHER_ERROR: new ResultCode(6001, "其他类型错误"),
};
