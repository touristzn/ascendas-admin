import '../../lib/polyfill';
import Vue from 'vue';
import {VuePlugin} from 'gent-vue';
import App from '../component/book-tour';
import hub from '../../data/hubs/h5';
import ElementUI from 'element-ui';
import "../../util/mixin";
import "../../util/filter";
import 'element-ui/lib/theme-chalk/index.css';
import '../style/page/book-tour.scss';

Vue.use(VuePlugin, {
  debugState: process.env.NODE_ENV === 'development'
});
Vue.use(ElementUI);
App.hub = hub;

const Com = Vue.extend(App);
new Com({}).$mount('#app');
