/**
 * 配置server端，不同发布环境的一些信息
 */

const APP_ENV = process.env.APP_ENV || 'dev';
const configs = {};

const common = {
  env: APP_ENV,
  debug: 'app:*',

  // i18n资源文件读取目录：temp, fixed
  i18nDir: 'fixed',

  // i18n-service 配置
  i18nServiceConfig: {
    server: 'http://i18n.nakedhub.com/',
    site: 'ascendas',
    locales: ['zh-CN', 'en-US']
  },

  // aliyun oss config
  ossConfig: {
    endpoint: 'https://oss-cn-shanghai.aliyuncs.com',
    accessKeyId: 'accessKeyId',
    accessKeySecret: 'accessKeySecret',
    bucket: 'bucket',
    bucketUrl: 'https://bucket.oss-cn-shanghai.aliyuncs.com',
    secure: true,
  }
}

// dev
configs['dev'] = Object.assign({}, common, {
  port: '8002',
});

// fat
configs['fat'] = Object.assign({}, common, {
  port: '8002',
});

// uat
configs['uat'] = Object.assign({}, common, {
  port: '8002',
});

// pro
configs['pro'] = Object.assign({}, common, {
  port: '8002',
});

module.exports = configs[APP_ENV];
