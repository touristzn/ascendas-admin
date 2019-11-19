const router = require('koa-router')();

// locale data
router.get('/api/i18n/localeData.js', async (ctx, next) => {
  let data = ctx.i18n.getLocaleData();
  ctx.set('Content-Type', 'application/javascript; charset=utf-8');
  ctx.body = 'window.pageConfig = window.pageConfig || {}; window.pageConfig.localeData='+ JSON.stringify(data) +';';
});

module.exports = router;
