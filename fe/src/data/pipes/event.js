/**
 * @module data/converters/user
 */
import caasApi from '../api/caas';

//详情
export let getByOrder = (data) => {
  let promise = caasApi.get('api/admin/event/detail/orderId', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//列表
export let list = (data) => {
  let promise = caasApi.get('api/admin/event/list', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//详情
export let detail = (data) => {
  let promise = caasApi.get('api/admin/event/detail', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//详情-更改信息
export let manage = (data) => {
  let promise = caasApi.get('api/admin/event/manage', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//活动日历
export let calendar = (data) => {
  let promise = caasApi.get('api/admin/event/calendar', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//修改活动
export let modifyType = (data) => {
  let promise = caasApi.get('api/admin/event/disableOrEnable', {
    params: data
  })
    .then(res => {
      return res.data.data;
    });
  return promise;
};

//活动参与人列表
export let attendeesList = (data) => {
  let promise = caasApi.get('api/admin/event/attendees/list', {
    params: data
  })
    .then(res => {
      return res.data.data;
    });
  return promise;
};

//移除活动参与人
export let removeAttendees = (data) => {
  let promise = caasApi.get('api/admin/event/attendees/delete', {
    params: data
  })
    .then(res => {
      return res.data.data;
    });
  return promise;
};

//添加活动参与人
export let addAttendees = (data) => {
  let promise = caasApi.get('api/admin/event/attendees/add', {
    params: data
  }).then(res => {
      return res.data.data;
    });
  return promise;
};

//活动类型列表
export let eventTypes = (data) => {
  let promise = caasApi.get('api/admin/event/eventType/list', {
    params: data
  }).then(res => {
    return res.data.data;
  });
  return promise;
};

//类别
export let categories = (params) => {
  let promise = caasApi.get('api/admin/event/eventCategory/list', {
    params: params
  })
    .then(res => {
      return res.data.data;
    });
  return promise;
};

//h5_活动分享
export let share = (params) => {
  let promise = caasApi.get('api/open/event/detail', {
    params: params
  })
    .then(res => {
      return res.data.data;
    });
  return promise;
};

//导出
// export let exportList = (params) => {
//   let promise = caasApi.get('api/admin/event/export', {
//     params: params
//   })
//     .then(res => {
//       return res.data.data;
//     });
//   return promise;
// };


