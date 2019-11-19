/**
 * @module data/converters/user
 */

import caasApi from '../api/caas';

// guide 列表
export let list = (params) => {
  let promise = caasApi.get('api/admin/guide/guidedList', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// guide 详情
export let info = (params) => {
  let promise = caasApi.get('api/admin/guide/guideContent', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// guide 开放详情
export let openInfo = (params) => {
  let promise = caasApi.get('api/admin/guide/open/guideContentOpen', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// guide 增加
export let add = (data) => {
  let promise = caasApi.post('api/admin/guide/guidedAdd', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// guide 更新
export let update = (data) => {
  let promise = caasApi.post('api/admin/guide/guideUpdate', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// guide 改变状态
export let changeStatus = (data) => {
  let promise = caasApi.post('api/admin/guide/guideChangeStatus', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};