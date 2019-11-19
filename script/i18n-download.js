const path = require('path');
const download = require('i18n-service-tool/download');
const config = require('../config/server/env.conf');
const i18nConfig = config.i18nServiceConfig;

const dir = path.resolve(__dirname, '../fe/root/i18n-data/');

download({
  server: i18nConfig.server,
  locales: i18nConfig.locales,
  site: i18nConfig.site,
  dir: dir,
  extension: '.js',
  transform(data) {
    let content = `window.pageConfig = window.pageConfig || {};window.pageConfig.i18nData = ${JSON.stringify(data)};`;
    return content;
  }
}).then(data => {
  console.log('download i18n success');
}).catch(err => {
  console.log(err)
  console.log('download i18n error');
});