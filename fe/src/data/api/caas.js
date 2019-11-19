import moment from 'moment';
import MD5 from 'md5.js';
import { Base64 } from 'js-base64';
import Request from 'gent-request/axios';
import store from '../stores/main';
import qs from 'qs';

const apiBaseUrl = CAAS_API_BASE;
const apiSecret = CAAS_API_SECRET;
const apiVersion = CAAS_API_VERSION;
const apiAppId = CAAS_API_APPID;

// 加密数据
function encryptData (obj) {
  let date = new Date();
  let data = Object.assign({}, obj, {
    appId: apiAppId,
    version: apiVersion,
    timestamp: moment().format('YYYY-MM-DD')
  });

  let msg = JSON.stringify(data);
  msg = Base64.encodeURI(msg);

  let sign = new MD5().update(msg + apiSecret).digest('hex');
  msg = encodeURI(msg);
  msg = encodeURI(msg);

  return {
    msg,
    sign: sign.toUpperCase()
  }
}

const api = new Request({
  baseURL: apiBaseUrl,
  onRequest(opts) {
    let state = store.getState();
    let token = (state.loginUser && state.loginUser.token) 
      ? state.loginUser.token 
      : ''; 

    opts.timeout = 100000;
    opts.headers = opts.headers || [];
    opts.headers['Locale'] = state.language.replace('-', '_');

    if (token) {
      opts.headers['header_token'] = token;
      opts.headers['header_security_token'] = token;
    }

    return opts;
  },
  validateStatus(status) {
    return status >= 200 && status < 300;
  },
  onSuccess(res) {
    // 返回的数据结构错误
    if (!res.data) {
      return Promise.reject({
        code: null,
        message: '数据格式错误',
        info: null
      });
    }

    if (res.data.code != 0) {
      // if (res.data.code == 410) {
      //   this.$message.error(res.data.msg);
      //   store.commit('setLoginUser', null);
      //   window.location.reload();
      //   return;
      // }

      return Promise.reject({
        code: res.data.code,
        message: res.data.msg,
        info: res.data
      });
    }

    return res;
  },
  // 数据异常统一处理，可以返回一个 Promise.resolve() 转为正常状态
  onError(res) {
    let code = null;
    let message = res.message;
    let errInfo = null;

    if (res.error.info && typeof res.error.info == 'object') {
      code = res.error.info.code;
      message = res.error.info.msg;
      errInfo = res.error.info;
    }

    let error = {
      code: code,
      message: message,
      info: errInfo
    };
    
    // if (error.code == 410) {
    //   this.$message.error(error.message);
    //   store.commit('setLoginUser', null);
    //   window.location.reload();
    //   return;
    // }

    return Promise.reject(error);
  }
});

// back
api.originGet = api.get.bind(api);

// get
api.get = function (url, opts) {
  let obj = encryptData(opts.params || {});
  opts.params = obj;
  return this.request({
    url,
    method: 'get'
  }, opts);
}

// post
api.post = function(url, data={}, opts={}) {
  let obj = encryptData(data);
  return this.form(url, obj, opts);
}

// get download url
api.getDownloadUrl = function(url, opts={}) {
  let obj = encryptData(opts.params || {});
  let reqUrl = apiBaseUrl;

  reqUrl = reqUrl.replace(/\/$/, '') + '/';
  reqUrl = reqUrl + url.replace(/^\//, '');
  reqUrl = reqUrl + `?msg=${obj.msg}&sign=${obj.sign}&time=${Date.now()}`;

  return url;
}

// open download
api.openDownload = function(url, opts={}) {
  window.open(api.getDownloadUrl(url, opts={}));
}


export default api;
