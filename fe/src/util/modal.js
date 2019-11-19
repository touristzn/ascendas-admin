import Vue from 'vue';
import hub from '../data/hubs/main';
import store from '../data/stores/main';

export function createModalHelper(modal) {
  return (props={}, events={}) => {
    let el = document.createElement('div');
    let Comp = Vue.extend(modal);
    let propsData;

    propsData = Object.assign({}, {
      visible: true,
      appendToBody: true
    }, props);

    document.body.appendChild(el);

    let instance = new Comp({
      el: el,
      store,
      hub,
      propsData
    });

    // events
    for (let key of Object.keys(events)) {
      let event = events[key];
      instance.$on(key, event);
    }

    instance.$on('close', () => {
      instance.$nextTick(() => {
        instance.$destroy(true);
        instance.$el.parentNode.removeChild(instance.$el);
      });
    });
  }
}
