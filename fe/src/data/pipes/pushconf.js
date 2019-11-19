/**
 * @module data/pipes/user
 */
import api from '../api/server';
import caasApi from '../api/caas';
//页面列表
export let list = (data) => {
  let promise = caasApi.get('api/admin/msg/notification/case/list', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};
//添加页面
export let add = (data) => {
  let promise = caasApi.post('api/admin/msg/notification/case/add',data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};
//页面详情
export let detail = (data) => {
  let promise = caasApi.get('api/admin/msg/notification/case/detail', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};
//修改页面
export let modify = (data) => {
  let promise = caasApi.post('api/admin/msg/notification/case/modify',data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};
//修改页面
export let remove = (data) => {
  let promise = caasApi.post('api/admin/msg/notification/case/remove',data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};