/**
 * @module data/converters/user
 */

import api from '../api/server';

// 列表
export let activeCurrency = (params) => {
  let promise = api.get('adminx/fe/currency/activeCurrency', {
    params: params
  })
  .then(res => {
    return res.data.result;
  });

  return promise;
};