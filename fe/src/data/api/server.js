import Request from 'gent-request/axios';
import store from '../stores/main';

const api = new Request({
  baseURL: API_BASE_URL,
  onRequest(opts) {
    let state = store.getState();
    let token = (state.loginUser && state.loginUser.token) 
      ? state.loginUser.token 
      : '';

    opts.timeout = 100000;
    opts.headers = opts.headers || [];
    opts.headers['Locale'] = state.language.replace('-', '_');

    if (token) {
      opts.headers['HEADER_SECURITY_TOKEN'] = token;
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

    if (res.data.code != 200) {
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
      message = res.error.info.message;
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

export default api;
