function resDataFormat(status, result, data, other) {
  const response = {
    status,
    code: result.code,
    message: result.message,
  };
  response["data"] = data ? data : {};
  response["other"] = other ? other : {};

  return response;
}

module.exports = {
  success: function (res, result, data, other) {
    res.json(resDataFormat("success", result, data, other));
  },
  failure: function (res, result, data, other) {
    res.json(resDataFormat("failure", result, data, other));
  },
};
