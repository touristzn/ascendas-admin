/**
 * @module data/converters/user
 */

import caasApi from '../api/caas';

// 列表
export let list = (data) => {
  let promise = caasApi.post('api/admin/industry/list', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};