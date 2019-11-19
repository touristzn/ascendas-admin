import caasApi from '../api/caas';

// 列表
export let list = (data) => {
  let promise = caasApi.get('api/admin/role/getPageList', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 更新角色信息/启用/禁用
export let update = (data) => {
  let promise = caasApi.get('api/admin/role/update', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 创建角色信息
export let add = (data) => {
  let promise = caasApi.get('api/admin/role/create', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 角色删除
export let del = (data) => {
  let promise = caasApi.get('api/admin/role/delete', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 给角色分配权限
export let permission = (data) => {
  let promise = caasApi.get('api/admin/role/assignPermission', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//权限列表
export let permissionList = (data) => {
  let promise = caasApi.get('api/admin/role/allPermissions', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//获取当前角色的权限
export let rolePermission = (data) => {
  let promise = caasApi.get('api/admin/role/rolePermissionDetails', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};
