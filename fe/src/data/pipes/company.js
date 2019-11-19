import caasApi from '../api/caas';

// 列表
export let list = (data) => {
  let promise = caasApi.get('api/admin/company/getCompanyPageList', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 公司
export let detail = (data) => {
  let promise = caasApi.get('api/admin/company/getCompany', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 更新公司信息
export let update = (data) => {
  let promise = caasApi.get('api/admin/company/update', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//创建公司信息
export let create = (data) => {
  let promise = caasApi.get('api/admin/company/create', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//移除成员
export let removeMember = (data) => {
  let promise = caasApi.post('api/admin/company/removeMember', data)
  .then(res => {
    return res.data.data;
  });
  return promise;
};
