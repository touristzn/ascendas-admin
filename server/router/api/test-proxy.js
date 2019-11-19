/**
 * 代理api，浏览器直接访问第三方api，但受当前系统身份认证
 */

const router = require('koa-router')();
const authLogin = require('../../middleware/auth-login');
const getApi = require('../../data/api/test').getApi;

// download
router.get('/api/test-proxy/download/(.*)', authLogin(), async (ctx, next) => {
  let api = getApi(ctx);
  let apiPath = ctx.params[0];
  let params = ctx.request.query;
  let response;

  try {
    response = await api.download(apiPath, {params});
  } catch (e) {
    ctx.throw(e);
  }

  ctx.set('Content-disposition', response.headers['content-disposition']);
  ctx.set('Content-type', response.headers['content-type']);
  ctx.body = response.data;
});

// donwload stream
router.get('/api/test-proxy/download-s/(.*)', authLogin(), async (ctx, next) => {
  let api = getApi(ctx);
  try {
    response = await api.downloadStream(apiPath, {params});
  } catch (e) {
    ctx.throw(e);
  }

  ctx.set('Content-disposition', response.headers['content-disposition']);
  ctx.set('Content-type', response.headers['content-type']);
  ctx.body = response.data;
});

// get
router.get('/api/test-proxy/(.*)', authLogin(), async (ctx, next) => {
  let api = getApi(ctx);
  let apiPath = ctx.params[0];
  let params = ctx.request.query;
  let response = await api.get(apiPath, {params});
  // result
  ctx.state.result = response.data;
});

// post
router.post('/api/test-proxy/(.*)', authLogin(), async (ctx, next) => {
  let api = getApi(ctx);
  let apiPath = ctx.params[0];
  let params = ctx.request.query;
  let data = ctx.request.body.data || {};
  let requestType = ctx.request.body.requestType || 'json';
  
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }

  if (requestType == 'json') {
    let response = api.json(apiPath, data, {params});
  } else if (requestType == 'form') {
    let response = api.form(apiPath, data, {params});
  } else if (requestType == 'formData') {
    let response = api.formData(apiPath, data, {params});
  }

  // result
  ctx.state.result = response.data;
});

// formData upload 
router.post('/proxy/upload/(.*)', authLogin(), async (ctx, next) => {
  let api = getApi(ctx);
  let apiPath = ctx.params[0];
  let params = ctx.request.query;
  let files = ctx.request.body.files;
  let fields = ctx.request.body.fields;
  let data = Object.assign({}, fields);

  Object.keys(files).forEach(key => {
    let file = files[key];
    data[key] = {
      value: fs.createReadStream(file.path),
      options: {
        filename: file.name
      }
    }
  });

  let response = await api.formData(apiPath, data, {params});

  this.state.result = response.data;
});

module.exports = router;
