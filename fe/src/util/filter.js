import Vue from 'vue';
import moment from 'moment';

// dateTime: YYYY-MM-DD HH:mm:ss
Vue.filter('dateTime', function(value, format="YYYY-MM-DD HH:mm:ss") {
  if (!value) return '';
  return moment(value).format(format);
});

// date: YYYY-MM-DD
Vue.filter('date', function(value, format="YYYY-MM-DD") {
  if (!value) return '';
  return moment(value).format(format);
});

// enum text
Vue.filter('enumText', function(value, enums={}, enumKey="") {
  if (typeof value === 'undefined' || !enumKey) return '';
  let items = enums[enumKey] || [];
  let text = value;
  items.forEach(item => {
    if (item[0] === value) text = item[1];
  });
  return text;
});