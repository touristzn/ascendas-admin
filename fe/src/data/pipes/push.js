/**
 * @module data/pipes/user
 */
import api from '../api/server';
import caasApi from '../api/caas';
//页面列表
export let batchnotify = (data) => {
  let promise = caasApi.post('api/admin/msg/notification/batchnotify',data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};