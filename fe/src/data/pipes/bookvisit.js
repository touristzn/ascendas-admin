/**
 * @module data/converters/user
 */
import caasApi from '../api/caas';

//获取预约参观列表
export let list = (data) => {
  let promise = caasApi.get('api/admin/open/user/getVisit', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//添加
export let add = (data) => {
  let promise = caasApi.get('api/admin/open/user/addVisit', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//删除
export let del = (data) => {
  let promise = caasApi.get('api/admin/open/user/delVisit', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
};

//导出
// export let getDownloadUrl = (data) => {
//   let promise = caasApi.getDownloadUrl('api/admin/open/user/delVisit', {
//     params: data
//   })
//   .then(res => {
//     return res.data.data;
//   });
//   return promise;
// };
export let download = (data) => {
  let promise = caasApi.openDownload('api/admin/open/user/delVisit', {
    params: data
  })
  .then(res => {
    return res.data.data;
  });
  return promise;
}

