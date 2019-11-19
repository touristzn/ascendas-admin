/**
 * @module data/converters/user
 */
import caasApi from '../api/caas';

// 列表
export let list = (params) => {
  let promise = caasApi.get('api/admin/order/listOrders', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 详情
export let detail = (params) => {
  let promise = caasApi.get(`api/admin/order/getOrder`, {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 订单使用人列表
export let listOrderUsers = (params) => {
  let promise = caasApi.get(`api/admin/order/listOrderUsers`, {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 活动订单活动类型
export let eventTypes = (params) => {
  let promise = caasApi.get(`api/admin/order/listEventTypes`, {
    params: params
  })
  .then(res => {
    return res.data.data.map(item => {
      item.id = item.code;
      return item;
    });
  });

  return promise;
};

// 删除
export let del = (data) => {
  let promise = caasApi.post('api/admin/order/removeOrder', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 修改使用人
export let bindUser= (data) => {
  let promise = caasApi.post('api/admin/order/bindUser', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 只会修改传入的字段
export let selectiveUpdate= (data) => {
  let promise = caasApi.post('api/admin/order/selectiveUpdate', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 预存订单转正
export let convertToNormal= (data) => {
  let promise = caasApi.post('api/admin/order/convertToNormal', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 计算价格
export let calculatePrice = (data) => {
  let promise = caasApi.post('api/admin/order/calculatePrice', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 下单
export let purchase = (data) => {
  let promise = caasApi.post('api/admin/order/purchase', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 重新计算价格
export let reCalculatePrice = (data) => {
  let promise = caasApi.post('api/admin/order/reCalculatePrice', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 修改预存订单
export let updatePreOrder = (data) => {
  let promise = caasApi.post('api/admin/order/updatePreOrder', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};