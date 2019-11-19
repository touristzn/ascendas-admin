/**
 * @module data/converters/user
 */

import caasApi from '../api/caas';

// 列表
export let send = (data) => {
  let promise = caasApi.post('api/admin/msg/im/batchsend', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};