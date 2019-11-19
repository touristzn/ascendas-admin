/**
 * @module data/pipes/user
 */
import api from '../api/server';
import caasApi from '../api/caas';

// 登录
export let nhosLogin = (data) => {
  let promise = api.form('adminx/auth/login', data)
  .then(res => {
    let user = res.data.result;
    user.token = res.headers['header_security_token'];
    return user;
  });
  
  return promise;
};

// 发送验证码
export let sendValidCode = (data) => {
  let promise = caasApi.post('api/admin/user/open/sendValidCode', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 登录
export let login = (data) => {
  let promise = caasApi.post('api/admin/user/open/webLogin', data)
  .then(res => {
    let user = res.data.data;
    console.log(res)
    user.token = res.headers['header_token'];
    return user;
  });

  return promise;
};

// 获取登录用户
export let loginInfo = (data) => {
  let promise = caasApi.post('api/admin/user/getCurrentUser', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 列表
export let list = (params) => {
  let promise = caasApi.get('api/admin/user/pageList', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//用户详情
export let detail = (params) => {
  let promise = caasApi.get('api/admin/user/userDetail', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 更新用户
export let modify = (data) => {
  let promise = caasApi.post('api/admin/user/updateInfo', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//用户门禁权限
export let doorlock = (params) => {
  let promise = caasApi.get('api/admin/doorlock/getEffectiveBusiness', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 人脸认证
export let face = (data) => {
  let promise = caasApi.post('/api/admin/faceRecognition/certified', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//添加用户
export let add = (data) => {
  let promise = caasApi.get('api/admin/user/createUser', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//删除用户
export let del = (data) => {
  let promise = caasApi.post('api/admin/user/updateInfo', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//重置密码
export let reset = (data) => {
  let promise = caasApi.post('api/admin/user/adminResetPassword', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};