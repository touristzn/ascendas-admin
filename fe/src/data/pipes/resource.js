import caasApi from '../api/caas';

// 列表
export let list = (data) => {
  let promise = caasApi.get('api/admin/resource/listResources', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 详情
export let info = (params) => {
  let promise = caasApi.get(`api/admin/resource/getResource`, {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 添加
export let add = (data) => {
  let promise = caasApi.post(`api/admin/resource/manageResource`, data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};


// 修改
export let modify = (data) => {
  let promise = caasApi.post(`api/admin/resource/manageResource`, data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 删除
export let del = (data) => {
  let promise = caasApi.post(`api/admin/resource/removeResource`, data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 设施
export let facilities = ({id}) => {
  let promise = caasApi.get(`api/admin/resource/facilities`, {
    //
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};