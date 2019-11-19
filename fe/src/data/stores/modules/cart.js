import Store from 'gent-store';
import Rx from 'rxjs';
import { copyJson } from '../../../lib/utils';

const defaultCartItems = JSON.parse(localStorage.getItem('cart-items') || "{}");

/**
 * @exports data/stores/modules/enums
 */
export default new Store({

  initialState: {
    items: defaultCartItems,
    maxId: localStorage.getItem('cart-max-id') || 0,
  },

  transactions: {
    addCartItem(info, state) {
      let maxId = Number(state.maxId);
      let newItems = copyJson(state.items);

      newItems[maxId + 1] = info;
      state.maxId = maxId + 1;
      state.items = newItems;
      localStorage.setItem('cart-items', JSON.stringify(state.items));
      localStorage.setItem('cart-max-id', state.maxId);
    },
    removeCartItem(id, state) {
      let newItems = copyJson(state.items);
      delete newItems[id];
      state.items = newItems;
      localStorage.setItem('cart-items', JSON.stringify(state.items));
    },
    updateCartItem({cartId, info}, state) {
      let newItems = copyJson(state.items);
      newItems[cartId] = info;
      state.items = newItems;
      localStorage.setItem('cart-items', JSON.stringify(state.items));
    },
    clearCart(data, state) {
      state.items = {};
      localStorage.setItem('cart-items', JSON.stringify(state.items));
    }
  }
});
