// 全局枚举数据

export default {
  // h5页面状态
  guideStatus: [
    [
      'ENABLE', '已启用'
    ],
    [
      'DISABLE', '已禁用'
    ]
  ],
  orderGroup: [
    [
      'MEMBERSHIP', '会员订单'
    ],
    [
      'MEETINGROOM', '会议室订单'
    ],
    [
      'EVENT', '活动订单'
    ],
    [
      'COIN', '腾飞币订单'
    ]
  ],
  orderType: [
    [
      'NORMAL', '普通订单'
    ],
    [
      'PREORDER', '预存订单'
    ]
  ],
  orderStatus: [
    [
      'NOT_START', '未开始'
    ],
    [
      'ONGOING', '进行中'
    ],
    [
      'FINISHED', '已完成'
    ],
    [
      'CANCELLED', '已取消'
    ],
  ],
  orderLeaveReason: [
    [
      'WRONG_INFO', '信息录入错误'
    ],
    [
      'EARLY_LEAVE', '客户提前离开'
    ],
  ],
  feedDeleteType: [
    [
      'NONE', '已发布'
    ],
    [
      'USER', '会员删除'
    ],
    [
      'ADMIN', '后台删除'
    ],
  ],
  // 用户类型
  userType: [
    [
      1, '会员'
    ],
    [
      2, '员工'
    ]
  ],
  // 性别
  gender: [
    [
      'MALE', '男'
    ],
    [
      'FEMALE', '女'
    ],
    [
      'NOTSET', '未知'
    ]
  ],
  genderStrict: [
    [
      'MALE', '男'
    ],
    [
      'FEMALE', '女'
    ],
  ],
  // 用户状态
  userStatus: [
    [
      'Normal', '正常'
    ],
    [
      'Disabled', '已禁用'
    ]
  ],
  // 公司状态
  companyStatus: [
    [
      'Normal', '正常'
    ],
    [
      'Expired', '已过期'
    ]
  ],
  // 产品类型
  category: [
    [
      'HOTDESK', '移动工位'
    ],
    [
      'UFO', '顶层传统工位'
    ],
    [
      'POD', '私有工位'
    ],
    [
      'MEETINGROOM', '会议室'
    ],
    [
      'MEETINGROOM_GENERAL', '通用会议室'
    ],
    [
      'HOTDESK_FREE_TRIAL', '活动工位'
    ],
    [
      'LIVING_ROOM', '活动空间'
    ],
    [
      'COIN', '腾飞币'
    ]
  ],
  // 产品状态
  productStatus: [
    [
      'UNPUBLISHED', '未发布'
    ],
    [
      'PRE_PUBLISH', '预发布'
    ],
    [
      'PUBLISHED', '已发布'
    ]
  ],
  // 购买单元
  saleUnit: [
    ['YEAR', '年'],
    ['MONTH', '月'],
    ['WEEK', '周'],
    ['DAY', '天'],
    ['HOUR', '时'],
    ['MINUTE', '分'],
    ['PCS', '个']
  ],
  // yes or no
  yesOrNo: [
    [
      true, '是'
    ],
    [
      false, '否'
    ]
  ],
  feedCategory:[
    ['FEED','动态'],
    ['COMMERCIAL','商业需求'],
    ['EVENT','活动']
  ],
  feedStatus: [
    [
      'DEMAND', '需求中'
    ],
    [
      'SOLVED', '已解决'
    ],
    [
      'HELPED', '已处理'
    ],
    [
      'CANCELED', '已取消'
    ]
  ],
  resourceType: [
    [
      'SPACE', '空间'
    ],
    [
      'SERVICE', '服务'
    ]
  ],
  fapiaoType: [
    [
      'NONE', '不需要发票'
    ],
    [
      'NORMAL', '增值税普通发票'
    ],
    [
      'VAT', '增值税专用发票'
    ]
  ],
  clientType:[
    [
      'ANDROID', 'Android'
    ],
    [
      'IOS', 'IOS'
    ]
  ],
  caseStatus:[
    [
      'NEW','新增'
    ],
    [
      'PUBLISHED','启用'
    ],
    [
      'DISABLE','禁用'
    ],

  ],
  skipCase:[
    [
      'NATIVE_PAGE','App原生页面'
    ],
    [
      'WEB_PAGE','H5页面'
    ]
  ],
  pushParams: [
    ['BENEFIT_ID', '福利ID'],
    ['FEED_ID', '动态ID'],
    ['EVENT_ID', '活动ID'],
    ['USER_ID', '用户ID'],
    ['COMPANY_ID', '公司ID']
  ],
  reservationRange: [
    ['UPCOMING', '即将到来的'],
    ['HISTORY', '历史记录'],
    ['IN_USE', '使用中的']
  ],
  eventType: [
    ['INTERNAL_EVENT', '仅限受邀请者参加 (企业内部活动, 官网展示, app不展示)'],
    ['FOR_MEMBER_ONLY', '仅限会员参加 (官网展示, app展示)'],
    ['OPEN_TO_MEMBER_NON_MEMBER', '会员和非会员均可参加 (官网展示, app展示)']
  ],
  spaceType: [
    ['PO', '私有工位'],
    ['HD', '移动工位']
  ],
  benefitType: [
    ['ON_LINE_STORE', '线上商城'],
    ['OFF_LINE_STORE', '线下店铺'],
    ['GROUP_SERVICE', '企业服务']
  ],
  benefitServiceTo: [
    ['GROUP', '企业'],
    ['HUBBER', '个人']
  ],
  benefitDiscountType: [
    ['FULL_X_REDUCE_Y', '满多少减多少'],
    ['REDUCE', '减免'],
    ['DISCOUNT', '折扣'],
    ['FREE_GIFT', '免费礼品']
  ]
}
