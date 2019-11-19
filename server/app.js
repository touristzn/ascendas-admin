"use strict";

/**
 * 项目主文件
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/server/env.conf');
const publicConf = require('../config/fe/public.conf');

// env
process.env.DEBUG = config.debug;

const http = require('http');
const uuidv4 = require('uuid/v4');
const koa = require('koa');
const morgan = require('morgan');
const session = require('koa-session');
const FileStore = require('koa-filestore');
const staticServe = require('koa-static');
const views = require('koa-views');
const bodyParser = require('koa-body');
const locale = require('koa-locale');
const i18n = require('koa-i18n-s');
const error = require('koa-error');
const conditional = require('koa-conditional-get');
const compress = require('koa-compress');
const etag = require('koa-etag');
const rewrite = require('koa-rewrite');
const proxy = require('koa-proxy');
const cors = require('@koa/cors');
const escapeStringRegexp = require('escape-string-regexp');
const debug = require('debug')('app:boot');
const loadRouter = require('./lib/load-router')
const NODE_ENV = process.env.NODE_ENV;

// new app
const app = new koa();

if (NODE_ENV !== 'production') {
  // compiler callback
  let lastHash = null;
  function compilerCallback(err, stats) {
    if (err) {
      // Do not keep cache anymore
      compiler.purgeInputFileSystem();
    }

    if (err) {
      lastHash = null;
      console.error(err.stack || err);
      if (err.details) console.error(err.details);
    }

    if (stats.hash !== lastHash) {
      lastHash = stats.hash;
      let statsString = stats.toString();
      // if (statsString) process.stdout.write(statsString + "\n");
    }
  }

  const webpack = require('webpack');
  const hotMiddleware = require('koa-webpack-hot');
  const webpackConfig = require('../build/webpack.conf');
  const compiler = webpack(webpackConfig);
  // run webpack
  const watching = compiler.watch({
    // aggregateTimeout: 300,
    // poll: undefined
  }, compilerCallback);

  app.use(rewrite(/^\/.+\/__webpack_hmr/, '/__webpack_hmr'));
  app.use(hotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    // heartbeat: 10 * 1000
  }));
}

// locale
locale(app);

app.name = 'ascendas-admin-server';
app.keys = ['app start server secrect', 'hello koa'];
app.env = process.env.NODE_ENV;
app.appENV = process.env.APP_ENV;
//如果为 true，则解析 "Host" 的 header 域，并支持 X-Forwarded-Host
app.proxy = true;
//默认为2，表示 .subdomains 所忽略的字符偏移量。
app.subdomainOffset = 2;
app.uuid = uuidv4();

app.use(cors({
  allowHeaders: ['HEADER_SECURITY_TOKEN', 'Locale', 'content-type'],
  exposeHeaders: ['HEADER_SECURITY_TOKEN']
}));
app.use(proxy({
  host:  'http://app.rfuat.nakedhub.cn',
  match: /^\/nakedhub\//        // ...just the /static folder
}));

// error template
app.use(async (ctx, next) => {
  try {
    let xRequestedWith = ctx.request.headers['x-requested-with'] || '';
    ctx.state.isAjax = xRequestedWith.toLowerCase() == 'xmlhttprequest';
    ctx.state.config = config;

    await next();

    // use state.result as body
    if (!ctx.body && ctx.state.result) {
      ctx.body = {
        error: null,
        result: ctx.state.result
      };
    }
  } catch(err) {
    // log exceptions
    console.log(err);

    // headers
    ctx.set(err.headers || {});

    // status
    ctx.status = http.STATUS_CODES[err.status] ? err.status : 500;
    
    // default err info
    let errInfo = {
      status: err.status || 500,
      message: err.message || 'Server Error',
      info: err.info || null
    };  

    // error body
    ctx.body = {
      error: errInfo,
      result: null
    };
  }
});

// 开启访问日志
const morganFn = morgan('combined', {});
app.use(async (ctx, next) => {
  if (ctx.request.path.indexOf(publicConf.publicPath) == 0) {
    return next();
  }
  return new Promise((resolve, reject) => {
    morganFn(ctx.req, ctx.res, (err) => {
      err ? reject(err) : resolve(ctx)
    })
  }).then(next);
});

// compress
app.use(compress({
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));
// use it upstream from etag so
// that they are present
app.use(conditional());
// add etags
app.use(etag());

// 静态文件
if (publicConf.publicPath != '/') {
  let publicPath = escapeStringRegexp(publicConf.publicPath);
  let exp = new RegExp(`^${publicPath}(.+)$`);
  app.use(rewrite(exp, '/$1'));
}
app.use(staticServe(publicConf.distPath));
app.use(async (ctx, next) => {
  // 静态文件找不到就不要继续了
  // if (ctx.request.path.substr(0, 8) == '/static/') {
  //   return;
  // }
  await next();
});

// 中英文
// app.use(i18n(app, {
//   directory: config.i18nDir === 'temp'
//     ? path.join(__dirname, './i18n/temp')
//     : path.join(__dirname, './i18n/fixed'),
//   extension: '.json',
//   locales: ['zh-CN', 'en-US'],
//   defualtLocale: 'zh-CN',
//   modes: ['url', 'header'],
//   mappings: {
//     'zh': 'zh-CN',
//     'zh-TW': 'zh-CN',
//     'zh-HK': 'zh-CN',
//     'en': 'en-US'
//   },
//   rewrite: true,
// }));

// 开启session
// app.use(session(app, {
//   store: new FileStore({
//     cacheDir: path.resolve(__dirname, '../.cache/session/')
//   })
// }));

// body
app.use(bodyParser({
  multipart: true,
  jsonLimit: '1mb',
  formLimit: '500kb',
}));

// views
app.use(views(path.resolve(publicConf.distPath, '_view'), {
  extension: 'html',
  map: {
    html: 'ejs'
  }
}));

app.use(rewrite(/^\/app(\/.*|$)/, '/app/'));
app.use(rewrite(/^(\/[a-zA-Z-]+)?\/app(\/.*|$)/, '/app/'));
// 加载路由
loadRouter(app, {
  dir: path.join(__dirname, './router'),
  deep: true,
})

// not found
app.use(async (ctx, next) => {
  console.log(ctx.path)
  ctx.throw('Not Found!', 404);
});

// 开启监听服务
const server = app.listen(config.port);

console.log(`=====server listen on: ${config.port}=====`);
