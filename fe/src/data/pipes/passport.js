/**
 * @module data/converters/user
 */

import api from '../api/caas';

// 登录
export let login = (data) => {
  let promise = api.post('api/passport/open/login', data)
  .then(res => {
    let user = res.data.result;
    user.token = res.headers['header_security_token'];
    return user;
  });

  return promise;
};
