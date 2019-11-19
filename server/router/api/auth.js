const router = require('koa-router')();

// auth login
router.post('/api/auth/login', async (ctx, next) => {
  let {username, password} = ctx.request.body;

  // password is not correct
  if (password !== '123456') {
    ctx.throw(400, '密码为123456');
  }

  // login user
  let user = {
    username,
    id: 1
  };

  ctx.session.loginUser = user;
  ctx.state.result = user;
});

// auth login
router.get('/api/auth/logout', async (ctx, next) => {
  ctx.session.loginUser = null;
  ctx.state.result = 'OK';
});

module.exports = router;
