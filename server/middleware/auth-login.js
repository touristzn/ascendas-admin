/**
 * 中间件：判断用户是否登陆
 */

module.exports = function(app, opts) {
  return async function authLoginMiddleware(ctx, next) {
    return next();
    // login user
    const loginUser = ctx.session.loginUser;
    
    if (!loginUser) {
      ctx.throw(401, '未登录或者登录过期');
    }

    ctx.state.loginUser = loginUser;

    return next();
  }
}
