/**
 * @module server/data/api/test
 */

const Request = require('gent-request/request');

/**
 * get api
 * @param {Object} ctx 
 */
module.exports.getApi = function(ctx) {
  if (ctx.testApi) return ctx.testApi;
  
  const api = new Request({
    baseURL: ctx.state.config.testApiBaseUrl,
    onSuccess(res) {
      return res;
    },
    onError(res) {
      // 使用koa模式的统一异常结构
      return Promise.reject({
        status: res.status,
        message: res.message,
        info: res.error.info,
      });
    }
  });

  return api;
}

