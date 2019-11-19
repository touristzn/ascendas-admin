/**
 * 配置pm2发布
 */
const path = require('path');

const serverRoot = path.join(__dirname, '../../server');
const common = {
  cwd: serverRoot,
  name: 'ascendas-admin-dev',
  script: path.join(serverRoot, './app.js'),
  watch: false,
  error_file: path.resolve(serverRoot, '../log/pm2.log'),
  out_file: path.join(serverRoot, '../log/pm2.log'),
  ignore_watch: ['i18n'],
  combine_logs: true,
}

module.exports = {
  apps: [
    // dev
    Object.assign({}, common, {
      name: 'ascendas-admin-dev',
      watch: true,
    }),

    // fat
    Object.assign({}, common, {
      name: 'ascendas-admin-fat',
      watch: false,
    }),

    // uat
    Object.assign({}, common, {
      name: 'ascendas-admin-uat',
      watch: false,
    }),

    // pro
    Object.assign({}, common, {
      name: 'ascendas-admin-pro',
      watch: false,
    }),
  ]
}
