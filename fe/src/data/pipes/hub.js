/**
 * @module data/converters/user
 */

import api from '../api/server';

// 列表,用于选择
// page, count, type
export let list = (data) => {
  let promise = api.get('adminx/fe/hub/hubs', {
    params: data
  })
  .then(res => {
    return res.data.result;
  });

  return promise;
};

// 列表,用于hub管理
// page, count, type, cityId
export let feList = (data) => {
  let promise = api.get('adminx/fe/hub/feList', {
    params: data
  })
  .then(res => {
    return res.data.result;
  });

  return promise;
};

//门禁权限
export let entranceGuard = (data) => {
  let promise = api.get('adminx/fe/gateinfo/getuserorcompanygates', {
    params: data
  })
  .then(res => {
    return res.data.result;
  });

  return promise;
};