/**
 * @module data/pipes/user
 */
import api from '../api/server';
import caasApi from '../api/caas';

// 列表
export let list = (params) => {
  let promise = caasApi.get('api/admin/benefit/list', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//详情
export let detail = (params) => {
  let promise = caasApi.get('api/admin/benefit/getDetail', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//更改状态
export let changeStatus = (params) => {
  let promise = caasApi.get('api/admin/benefit/changeStatus', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//删除
export let del = (params) => {
  let promise = caasApi.get('api/admin/benefit/delete', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//添加
export let addAndUpdate = (params) => {
  let promise = caasApi.post('api/admin/benefit/addAndUpdate', params)
  .then(res => {
    return res.data.data;
  });

  return promise;
};


//点赞人列表
export let likeList = (params) => {
  let promise = caasApi.get('api/admin/benefit/likerList', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

