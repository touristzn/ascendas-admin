import Store from 'gent-store';
import Rx from 'rxjs';
import { copyJson } from '../../lib/utils';

/**
 * @exports data/stores/modules/cache
 * 用来缓存接口数据
 */
export default new Store({
  name: 'CacheStore',

  initialState: {
    enums: null
  },

  transactions: {
    updateEnums(enums, state) {
      state.enums = enums;
    }
  }
});
