/**
 * 用于配置 webpack.DefinePlugin
 */

const APP_ENV = process.env.APP_ENV || 'dev';
const NODE_ENV = process.env.NODE_ENV || 'development';
const defines = {};

// common
const common = {
  'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  CAAS_API_SECRET: JSON.stringify('EAKRJNLEKD'),
  CAAS_API_APPID: JSON.stringify('acendashub'),
  CAAS_API_VERSION: JSON.stringify('1.0'),
  REPLACE_BUILD_TIME: `${Date.now()}`,
  REPLACE_PUBLIC_PATH: '/'
}

// dev
defines['dev'] = Object.assign({}, common, {
  CAAS_API_BASE: JSON.stringify('http://ascendas-uat.nakedhub.com/'),
  API_BASE_URL: JSON.stringify('http://127.0.0.1:8002/nakedhub/')
});

// fat
defines['fat'] = Object.assign({}, common, {
  CAAS_API_BASE: JSON.stringify('http://ascendas-fat.nakedhub.com/'),
  API_BASE_URL: JSON.stringify('http://app.rfit.nakedhub.com/nakedhub/'),
});

// uat
defines['uat'] = Object.assign({}, common, {
  CAAS_API_BASE: JSON.stringify('http://ascendas-uat.nakedhub.com/'),
  API_BASE_URL: JSON.stringify('http://app.rfit.nakedhub.com/nakedhub/'),
});

// pro
defines['pro'] =  Object.assign({}, common, {
  CAAS_API_BASE: JSON.stringify('http://ascendas.nakedhub.com/'),
  API_BASE_URL: JSON.stringify('http://app.rfit.nakedhub.com/nakedhub/'),
});

// module.exports
module.exports = defines[APP_ENV];