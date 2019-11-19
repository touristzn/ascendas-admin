/**
 * @module data/converters/config
 */

import api from '../api/server';
import Rx from 'rxjs';
import cacheStore from '../stores/cache';
import menusConfig from '../config/menus';
import enumsConfig from '../config/enums';

/**
 * 获取菜单列表, 最多四级
 * @return {array}
 */
export let menus = () => {
  let menus = menusConfig;

  // format menus
  menus.forEach(a => {
    a.isFolded = false;
    a.children = a.children || [];

    a.children.forEach(b => {
      b.isFolded = false;
      b.children = b.children || [];

      b.children.forEach(c => {
        c.isFolded = false;
        c.children = c.children || [];

        c.children.forEach(d => {
          d.isFolded = false;
          d.children = [];
        });

      });

    });

  });

  let promise = Promise.resolve(menus);
  return promise;
};

// enums
// just 啊 例子
export let enums = (data) => {
  // 从缓存取
  let cacheData = cacheStore.getState().enums;
  if (cacheData) return Promise.resolve(cacheData);

  // enums 暂时配置在前端的，假装从接口取的
  let promise = new Promise((resolve, reject) => {
    resolve(enumsConfig);
  });
  return promise;
};