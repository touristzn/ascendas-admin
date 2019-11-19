const router = require('koa-router')();

router.get('/', async (ctx, next) => {
  ctx.redirect('/app/')
});

// 首页
router.get('/app/', async (ctx, next) => {
  await ctx.render('app');
});

module.exports = router;
