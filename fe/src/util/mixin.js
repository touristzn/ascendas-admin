import Vue from 'vue';
import {__, language} from './i18n';
import {
  getLanguage, 
  getBaseUrl, 
  getBaseUrlWithLanguage
} from './site';

// mixins
Vue.mixin({
  methods: {
    // 获取语言
    getLanguage,
    // 获取根地址
    getBaseUrl,
    // 获取根地址带语言
    getBaseUrlWithLanguage,
    // 翻译
    __(key, vars={}) {
      return __(key, vars) || key;
    },
    // validator transform trim
    tfTrim(str) {
      return str.trim();
    },
    // 获取字段的国际化对象
    getFieldLangsObj() {
      let obj = {};
      let langs = this.$state.apiLanguages;
      langs.forEach(lang => {
        obj[lang.key] = '';
      });
      return obj;
    }
  }
});
