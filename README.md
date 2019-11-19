# Smart Admin

> 一个完全前后端分离的后台管理脚手架，前端 + Node Server.

## 功能

- 基础: Webpack3 + Vue2 + Koa2 + RxJS5.
- UI框架: [Element](http://element-cn.eleme.io/#/zh-CN).
- 数据管理: [data-hub](https://github.com/ccqgithub/data-hub).
- Session管理: [koa-session](https://github.com/koajs/session), + [koa-filestore](https://github.com/ccqgithub/koa-filestore).
- 路由: 前端(vue-router) + 后端(koa-router).
- 文档生成: 集成[jsdoc](http://usejsdoc.org/).
- 国际化支持: 使用[koa-i18n-s](https://github.com/ccqgithub/koa-i18n-s), [i18n-s](https://github.com/ccqgithub/i18n-s).
- 主题定制: 通过合理的代码组织，可以很方便实现主题定制.

## 依赖

- NodeJs@8.x
- Webpack@3.x
- Koa@2.x
- Vue@2.x
- vue-router@2.x
- RsJS@5.x

## 命令行

- 安装依赖：`npm install`
- 本地开发：`npm run dev`
- 发布生产：`npm run prod`
- 生成文档：`npm run jsdoc`
- 下载翻译内容：`npm run i18n`, `npm run i18n-temp`

## 文档工具

- [JsDoc](http://usejsdoc.org/index.html).
- [JsDoc中文文档](http://www.css88.com/doc/jsdoc/index.html).
- [JsDoc-Vuejs](https://github.com/Kocal/jsdoc-vuejs).
- [主题:docstrap](https://github.com/docstrap/docstrap).

## 数据结构

1. server router 正确情况下最终输出结果

```js
if (!ctx.body && ctx.state.result) {
  ctx.body = {
    error: null,
    result: ctx.state.result
  };
}
```

2. server里代码抛出的异常`error`格式，兼容koa异常结构：

- error.status
- error.message
- error.info 
- error.otherKey
- ...

```js
// router 中可以使用ctx.throw抛出
ctx.throw(400);
ctx.throw(400, 'name required');
ctx.throw(400, 'name required', { user: user });

// 其他代码中，抛出自定义异常
let error = {
  status: status,
  message: 'message',
  info: info,
  otherKey: 'xxx'
  ...
}

throw error;
```

3. server http 接口返回数据结构：

```js
// 正确情况
{
  error: null,
  result: {}
}

// 有异常情况
{
  error: {
    code: xxx,
    message: xxx,
    info: xxx
  },
  result: null
}
```

4. 前端基础接口返回格式 [gent-request](https://github.com/gent-data/gent-request).

```js
{
  // status code 状态码, 没有 response 时为 -1
  status: 200,

  // 错误提示消息
  message: 'OK',

  // 数据，只有 `resolve` 时存在
  data: null,

  // 头部信息, 有 `response` 是存在，否则为空对象 `{}`
  headers: {},

  // 错误详情, 只有 `reject` 时存在
  error: {
    // 标识各种错误类型，便于调试、定位错误
    type: 'NO_RESPONSE',

    // 错误详情，用于服务端使用 `status code` 标识错误，同时用 `response body` 输出错误详情
    info: {code: 500},

    // response body
    body: ''
  },

  // 请求相关信息
  info: {
    baseURL: '',
    url: ''
    method: '',
    params: {},
    data: {},
    responseType: ''
  }
}
```

5. 前端代码抛出异常`error`格式

- error.status
- error.message
- error.info 
- error.otherKey
- ...

```js
let error = {
  status: status,
  message: 'message',
  info: info
}

throw error;
```

## 访问链接
- `http://localhost:8002/app`


## 目录

```
---
  |---- build: 构建脚本
  |---- config: 配置文件
  |---- fe: 前端代码
  | |
  | |----asset: 静态资源
  | |----component: 组件
  | |----entry: 入口js
  | |----html: 入口html，与entry一一对应
  | |----lib: 其他代码
  | |----style: 样式
  | |----data: 数据
  | | |
  | | |----src/data/converters: 数据源
  | | |----src/data/hubs: 数据板
  | | |----src/data/stores: 全局数据仓库
  | | |----src/data/validate: 一些表单验证相关
  | |
  |
  |---- server: node server 代码
  |---- turorials: 代码注释之外的文档，使用jsdoc生成的文档会包含它
```

## 国际化翻译使用

步骤：

1. 在 i18n.nakedhub.com 上填写。
2. 在项目跑`npm run i18n`将翻译拉到项目里。
3. 在vue组件模板中使用： `<div>{{__('context.key')}}</div>`, 或者：`<div :title="__('context.key', {})"></div>`。
4. 在vue组件js中使用 `this.__('context.key')`。

相关：

- 引用函数为`__('context.key', {a: 'xx', b: 'oo'})`的方式， 第二个参数可以不传。具体参见文档[i18n-s](https://github.com/ccqgithub/i18n-s)。

- `context`表示翻译分组，`key`表示翻译id，第二个参数表示传给字符串的变量。

- `com`分组下引用的时候直接用`key`, 如 `com` 下的 `test`，是`__('test')` 而不是`__('com.test')`。

- 翻译字符串中可以包含变量如`"${a} is ${b}'s father"`, 翻译的时候通过第二个参数传入变量内容: `__('context.key', {a: 'xx', b: 'oo'})`。

最终生成的json文件为：

```json
{
  "test": "test string",
  "b.test": "test string b",
  "a is b's father": "${a} is ${b}'s father",

  "c": {
    "test": "test string c"
  }
}
```

对应使用方法：

```js
// translate with vars
let str = i18n.__('test');

// translate with dot
let str = i18n.__('b.test');

// translate with context
let str = i18n.__('c.test');

// translate with vars
let str = i18n.__('a is b\'s father', {
  a: 'Json',
  b: 'Joy'
});
```