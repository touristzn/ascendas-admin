/**
 * @module data/converters/user
 */

import caasApi from '../api/caas';

// 删除资源和权限关系
export let deleteResourcePermission = (data) => {
  let promise = caasApi.post('api/admin/doorlock/deleteResourcePermission', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 删除资源和权限关系
export let bindResourcePermission = (data) => {
  let promise = caasApi.post('api/admin/doorlock/bindResourcePermission', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 获取资源底下绑定的门禁权限
export let getResourcePermission = (params) => {
  let promise = caasApi.get('api/admin/doorlock/getResourcePermission', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 获取第三方门禁权限列表
export let getThirdPermission = (params) => {
  let promise = caasApi.get('api/admin/doorlock/getThirdPermission', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};