import '../../lib/polyfill';
import Vue from 'vue';
import {VuePlugin} from 'gent-vue';
import App from '../component/event-share';
import hub from '../../data/hubs/h5';
import ElementUI from 'element-ui';
import "../../util/mixin";
import "../../util/filter";
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.css';
import '../style/reset.scss';
import '../style/page/event-share.scss';

Vue.use(VuePlugin, {
  debugState: process.env.NODE_ENV === 'development'
});
Vue.use(ElementUI);
App.hub = hub;

const Com = Vue.extend(App);
new Com({}).$mount('#app');
