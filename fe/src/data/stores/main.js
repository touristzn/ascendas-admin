import Store from 'gent-store';
import Rx from 'rxjs';
import enums from './modules/enums';
import cart from './modules/cart';
import { getLanguage } from '../../util/site';

const loginUser = JSON.parse(localStorage.getItem("loginUser") || 'null');
// api端用的语言
const apiLanguages = [
  {
    label: '简体中文',
    key: 'zh_CN'
  },
  {
    label: '英文',
    key: 'en_US'
  },
];

// 前端用的语言
const feLanguages = [
  {
    label: '简体中文',
    key: 'zh-CN'
  },
  {
    label: '英文',
    key: 'en-US'
  }
];

/**
 * @exports data/store/main
 */
export default new Store({
  // debug
  // 调试
  debug: process.env.NODE_ENV !== 'production',

  /**
   * @namespace
   * store 初始数据结构
   */
  initialState: {
    /**
     * @namespace
     * 登录用户
     */
    loginUser: loginUser,

    // 语言
    language: getLanguage(),

    // api端用的语言
    apiLanguages: apiLanguages,

    // 前端用的语言
    feLanguages: feLanguages,

    /**
     * @namespace
     * 项目配置
     */
    config: {
      /** */
      activeMod: 'home',
      /** */
      menus: [],
      /** */
      subMenus: [],
      /** */
      isMenuFolded: false,
      /** */
      isSubMenuFolded: false,
    },

    /** 
     * 打开的页面
    */
    openPages: []
  },

  /**
   * @namespace
   * 子模块
   */
  modules: {
    /** */
    enums,
    cart
  },

  /**
   * @namespace
   * 事务
   */
  transactions: {
    /**
     * 设置当前页面
     * @param {string} mod
     * @param {object} state
     */
    setActiveMod(mod, state) {
      state.config.activeMod = mod;
    },
    /**
     * 设置菜单
     * @param {array} menus
     * @param {object} state
     */
    setMenus(menus, state) {
      state.config.menus = menus;
    },
    /**
     * 设置登录用户
     * @param {Object} user 
     * @param {Object} state 
     */
    setLoginUser(user, state) {
      state.loginUser = user;
      localStorage.setItem("loginUser", JSON.stringify(user));
    }
  }
})
