/**
 * @module data/converters/user
 */

import api from '../api/server';
import caasApi from '../api/caas';

// 列表
export let list = (params) => {
  let promise = caasApi.get('api/admin/product/listProducts', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 详情
export let info = (params) => {
  let promise = caasApi.get(`api/admin/product/getProduct`, {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 添加
export let add = (data) => {
  let promise = caasApi.post(`api/admin/product/manageProduct`, data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 更新
export let modify = (data) => {
  let promise = caasApi.post(`api/admin/product/manageProduct`, data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 删除
export let del = (data) => {
  let promise = caasApi.post(`api/admin/product/removeProduct`, data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 更改状态
export let changeStatus = (data) => {
  let promise = caasApi.post(`api/admin/product/changeStatus`, data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 产品单元类别
export let saleUnits = (params) => {
  let promise = caasApi.get(`api/admin/product/getSaleUnits`, {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 币种
export let currencies = (params) => {
  let promise = caasApi.get(`api/admin/product/listCurrencies`, {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};