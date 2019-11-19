const getApi = require('./api/test').getApi;

exports.getTest = async (ctx, params) => {
  let api = getApi(ctx);
  return api.get('/get');
}