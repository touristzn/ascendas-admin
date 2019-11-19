import '../lib/polyfill';
import 'font-awesome/css/font-awesome.css';
import ElementUI from 'element-ui';
import Vue from 'vue';
import Rx from 'rxjs/Rx';
import VueRouter from 'vue-router';
import {VuePlugin} from 'gent-vue';
import App from '../component/sma-app';
import hub from '../data/hubs/main';
import store from '../data/stores/main';
import "../util/mixin";
import "../util/filter";

import 'element-ui/lib/theme-chalk/index.css';
import '../style/app.scss';

Vue.config.devtools = true;

Vue.use(VueRouter);
Vue.use(VuePlugin, {
  debugState: process.env.NODE_ENV === 'development'
});
Vue.use(ElementUI);

App.store = store;
App.hub = hub;

const Com = Vue.extend(App);
new Com({}).$mount('#app');
