import Store from 'gent-store';
import Rx from 'rxjs';

/**
 * @exports data/stores/modules/enums
 */
export default new Store({

  initialState: {
    all: {}
  },

  transactions: {
    updateAll(data, state) {
      state.all = data;
    }
  }
});
