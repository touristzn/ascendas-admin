/**
 * @module data/pipes/user
 */
import api from '../api/server';
import caasApi from '../api/caas';

export let add = (data) => {
  let promise = caasApi.get('/api/mobile/open/user/addVisit', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};
