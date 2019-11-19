/**
 * @module lib/site
 */

const {
  language,
  i18nData,
  isLanguageWithUrl
} = pageConfig;

// 获取语言
export function getLanguage() {
  return language;
}

// 获取翻译数据
export function getI18nData() {
  return i18nData;
}

// 根地址
export function getBaseUrl() {
  return location.protocol + '//' + location.host + '/';
}

// 带语言的根地址
export function getBaseUrlWithLanguage() {
  let url = getBaseUrl();
  return isLanguageWithUrl ? url + `${language}/` : url;
}

// app 根地址
export function getAppBaseUrl() {
  let p = isLanguageWithUrl ? `/${language}/` : '/';
  return p + 'app/';
}