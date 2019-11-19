const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'login',
    path: '/login',
    component: require('./component/mod/login').default,
  },
  {
    name: 'home',
    path: '/home',
    component: require('./component/mod/home').default,
  },
  {
    name: 'user-list',
    path: '/user/list',
    component: require('./component/mod/user/list').default,
    props: true
  },
  {
    name: 'user-info',
    path: '/user/info/:id',
    component: require('./component/mod/user/info').default,
    props: true
  },
  {
    name: 'staff-list',
    path: '/staff/list',
    component: require('./component/mod/staff/list').default,
    props: true
  },
  {
    name: 'staff-info',
    path: '/staff/info/:id',
    component: require('./component/mod/staff/info').default,
    props: true
  },
  {
    name: 'company-list',
    path: '/company/list',
    component: require('./component/mod/company/list').default,
    props: true
  },
  {
    name: 'company-info',
    path: '/company/detail/:id',
    component: require('./component/mod/company/detail').default,
    props: true
  },
  {
    name: 'resource-list',
    path: '/resource/list',
    component: require('./component/mod/resource/list').default,
    props: true
  },
  {
    name: 'product-list',
    path: '/product/list',
    component: require('./component/mod/product/list').default,
    props: true,
  },
  {
    name: 'product-detail',
    path: '/product/detail/:id',
    component: require('./component/mod/product/detail').default,
    props: true,
  },
  {
    name: 'purchase-products',
    path: '/purchase/products',
    component: require('./component/mod/purchase/products').default,
    props: true,
  },
  {
    name: 'purchase-cart',
    path: '/purchase/cart',
    component: require('./component/mod/purchase/cart').default,
    props: true,
  },
  {
    name: 'purchase-info',
    path: '/purchase/info/:productId',
    component: require('./component/mod/purchase/info').default,
    props: true,
  },
  {
    name: 'purchase-info',
    path: '/purchase/cart/:cartId',
    component: require('./component/mod/purchase/info').default,
    props: true,
  },
  {
    name: 'resource-detail',
    path: '/resource/detail/:id',
    component: require('./component/mod/resource/detail').default,
    props: true
  },
  {
    name: 'meetingrooms-list',
    path: '/meetingrooms/list',
    component: require('./component/mod/meetingrooms/list').default,
    props: true
  },
  {
    name: 'order-list',
    path: '/order/list/:type',
    component: require('./component/mod/order/list').default,
    props: true
  },
  {
    name: 'order-detail',
    path: '/order/detail/:id',
    component: require('./component/mod/order/detail').default,
    props: true
  },
  {
    name: 'event-list',
    path: '/event/list',
    component: require('./component/mod/event/list').default,
  },
  {
    name: 'event-calendar',
    path: '/event/calendar',
    component: require('./component/mod/event/calendar').default,
  },
  {
    name: 'event-attendees',
    path: '/event/attendees/:id',
    component: require('./component/mod/event/attendees').default,
    props: true
  },
  {
    name: 'event-detail',
    path: '/event/detail/:id',
    component: require('./component/mod/event/detail').default,
    props: true
  },
  {
    name: 'sendmessage-list',
    path: '/sendmessage/list',
    component: require('./component/mod/sendmessage/list').default,
    props: true
  },
  {
    name:'feed-list',
    path: '/feed/list',
    component: require('./component/mod/feed/list').default,
    props: true
  },
  {
    name:'feed-detail',
    path: '/feed/detail/:id',
    component: require('./component/mod/feed/detail').default,
    props: true
  },
  {
    name:'benefits-list',
    path: '/benefits/list',
    component: require('./component/mod/benefits/list').default,
    props: true
  },
  {
    name:'benefits-detail',
    path: '/benefits/detail/:id',
    component: require('./component/mod/benefits/detail').default,
    props: true
  },
  {
    name:'apppage-list',
    path: '/apppage/list',
    component: require('./component/mod/apppage/list').default,
    props: true
  },
  {
    name:'apppage-detail',
    path: '/apppage/detail/:id',
    component: require('./component/mod/apppage/detail').default,
    props: true
  },
  {
    name:'push-list',
    path: '/push/list',
    component: require('./component/mod/push/list').default,
    props: true

  },
  {
    name:'h5-list',
    path: '/h5/list',
    component: require('./component/mod/h5/list').default,
    props: true
  },
  {
    name:'h5-content',
    path: '/h5/content/:id',
    component: require('./component/mod/h5/content').default,
    props: true
  },
  {
    name:'pushconf-content',
    path: '/pushconf/list',
    component: require('./component/mod/pushconf/list').default,
    props: true

  },
  {
    name:'pushconf-detail',
    path: '/pushconf/detail/:id',
    component: require('./component/mod/pushconf/detail').default,
    props: true

  },
  {
    name:'bookvisit-list',
    path: '/bookvisit/list',
    component: require('./component/mod/bookvisit/list').default,
    props: true

  },
  {
    name:'role-list',
    path: '/role/list',
    component: require('./component/mod/role/list').default,
    props: true

  }
];

// 附加信息
routes.forEach(item => {
  if (!item.meta) item.meta = {};
  item.meta.count = 0;
});

export default routes;
