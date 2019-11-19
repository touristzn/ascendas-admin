/**
 * @module data/converters/user
 */

import api from '../api/server';
import caasApi from '../api/caas';

// 列表
export let list = (params) => {
  let promise = caasApi.get('api/admin/msg/feed/list', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};
//详情
export let detail = (params) => {
  let promise = caasApi.get('api/admin/msg/feed/detail', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};
//修改 
export let editInfo = (params) => {
  let promise = caasApi.get('api/admin/msg/feed/modify', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 修改状态
export let modifyDeletedBy = (params) => {
  let promise = api.get('/adminx/fe/feed//modifyDeletedBy'+ params.id, {
    params: params
  })
  .then(res => {
    return res.data.result;
  });

  return promise;
};
// 日志
export let modifyRecords = (params) => {
  let promise = api.get('adminx/fe/feed/modifyRecords', {
    params: params
  })
  .then(res => {
    return res.data.result;
  });

  return promise;
};