/**
 * 配置不同环境的打包发布参数
 */

const path = require('path');
const APP_ENV = process.env.APP_ENV || 'dev';
const configs = {};

// common
const common = {
  distPath: path.join(__dirname, '../../dist'),
  publicPath: '/',
  sourceMap: true,
  compress: false,
}

// dev
configs['dev'] = Object.assign({}, common, {
  compress: false
});

// fat
configs['fat'] = Object.assign({}, common, {
  compress: true
});

// uat
configs['uat'] = Object.assign({}, common, {
  compress: true
});

// pro
configs['pro'] = Object.assign({}, common, {
  compress: true
});

// module.exports
module.exports = configs[APP_ENV];
