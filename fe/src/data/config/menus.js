// 菜单配置

/**
 * 最多四级
 * ```
 * [
 *   {
 *     title: '',     // 标题
 *     mod: '',       // 模块
 *     link: '',      // 外部链接
 *     target: '',    // target
 *     icon: '',      // 图标，一级二级有用
 *     children: [],  // 子菜单
 *   }
 * ]
 * ```
 */
export default [
  {
    title: '首页',
    path: '/home',
    icon: 'fa-home',
    children: [],
  },
  {
    title: '产品订购',
    icon: 'fa-shopping-cart',
    children: [
      {
        title: '产品订购',
        path: '/purchase/products'
      },
      {
        title: '购物车',
        path: '/purchase/cart'
      },
    ]
  },
  {
    title: '订单管理',
    icon: 'fa-address-card-o',
    children: [
      {
        title: '会员订单',
        path: '/order/list/membership'
      },
      {
        title: '会议室订单',
        path: '/order/list/meetingroom'
      },
      {
        title: '活动订单',
        path: '/order/list/event'
      },
      {
        title: '腾飞币订单',
        path: '/order/list/coin'
      }
    ]
  },
  {
    title: '成员管理',
    icon: 'fa-user',
    children: [
      {
        title: '公司列表',
        path: '/company/list'
      },
      {
        title: '用户列表',
        path: '/user/list'
      },
      {
        title: '员工列表',
        path: '/staff/list'
      }
    ]
  },
  {
    title: '基础数据',
    icon: 'fa-list-alt',
    children: [
      {
        title: '资源列表',
        path: '/resource/list'
      },
      {
        title: '产品列表',
        path: '/product/list'
      },
      {
        title: '角色管理',
        path: '/role/list'
      }
    ]
  },
  {
    title: '运营支持',
    icon: 'fa-server',
    children: [
      {
        title: '会议室预定',
        path: '/meetingrooms/list'
      },
      {
        title: '预约参观',
        path: '/bookvisit/list'
      },
      {
        title: '活动列表',
        path: '/event/list'
      },
      {
        title: '活动日历',
        path: '/event/calendar'
      }
    ]
  },
  {
    title: 'App支持',
    icon: 'fa-th-large',
    children: [
      {
        title: '群发消息',
        path: '/sendmessage/list/'
      },
      {
        title: '动态管理',
        path: '/feed/list'
      },
      {
        title: '福利管理',
        path: '/benefits/list'
      },
      {
        title: 'H5页面管理',
        path: '/h5/list'
      },
      {
        title: 'App页面配置',
        path: '/apppage/list'
      },
      {
        title:'推送用例配置',
        path:'/pushconf/list'
      },
      {
        title:'消息推送',
        path:'/push/list'
      }
    ]
  },
  // {
  //   title: '百度',
  //   link: 'http://www.baidu.com/',
  //   icon: 'fa-book',
  //   children: [],
  //   target: '_blank'
  // },
  // {
  //   title: "一级菜单",
  //   children: [
  //     {
  //       title: "二级菜单",
  //       icon: 'fa-book',
  //       children: [
  //         {
  //           title: "三级菜单",
  //           children: [
  //             {
  //               title: '四级菜单',
  //               path: '/home',
  //             }
  //           ]
  //         },
  //         {
  //           title: "三级菜单2",
  //           children: [
  //             {
  //               title: '四级菜单2',
  //               path: '/home',
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
];