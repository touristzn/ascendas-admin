/**
 * @module data/pipes/com
 */

import caasApi from '../api/caas';

// oss 配置信息
// ossCase: ORIGINAL_IMAGE_PROTECT, UPLOAD_IMAGE
export let ossConfig = (params) => {
  let promise = caasApi.get('api/base/config/oss', {
    params: params
  })
  .then(res => {
    return res.data.data;
  });

  return promise;
};

// 国家码列表
export let mobileCodeList = (params) => {
  let promise = caasApi.get('api/common/open/getMobileCodeList', {})
  .then(res => {
    return res.data.data;
  });

  return promise;
};