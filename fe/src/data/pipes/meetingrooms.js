/**
 * @module data/converters/user
 */

import caasApi from '../api/caas';

// 会议室列表
export let listMeetingRooms = (data) => {
  let promise = caasApi.get('api/admin/reservation/listMeetingRooms', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 预订
export let booking = (data) => {
  let promise = caasApi.post('api/admin/reservation/reserve', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};

//预订列表
export let listBooking = (data) => {
  let promise = caasApi.get('api/admin/reservation/listReservations', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 取消预订
export let cancelBooking = (data) => {
  let promise = caasApi.post('api/admin/reservation/cancel', data)
  .then(res => {
    return res.data.data;
  });

  return promise;
};