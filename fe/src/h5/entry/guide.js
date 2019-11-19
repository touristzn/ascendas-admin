import '../../lib/polyfill';
import Vue from 'vue';
import {VuePlugin} from 'gent-vue';
import App from '../component/guide';
import hub from '../../data/hubs/h5';
import "../../util/mixin";
import "../../util/filter";
import 'font-awesome/css/font-awesome.css';
import '../style/reset.scss';
import '../style/page/guide.scss';

Vue.use(VuePlugin, {
  debugState: process.env.NODE_ENV === 'development'
});
App.hub = hub;

const Com = Vue.extend(App);
new Com({}).$mount('#app');
