import moment from 'moment';
import {__} from './i18n';

// 检查购买结束时间是否可用
export function calcDateEnabledError(beginDate, calcDate, userType) {
  var beginMoment = moment(beginDate);
  var calcMoment = moment(calcDate);
  var beginYear = beginMoment.year(); //开始时间月份
  var beginMonth = beginMoment.month(); //开始时间月份
  var beginDay = beginMoment.date(); // 开始时间天数
  var beginEndDay = beginMoment
    .clone()
    .date(); // 开始时间所在月的最后一天
  var monthIntDay = 1; // 整月的天数

  var calcYear = calcMoment.year();
  var calcMonth = calcMoment.month(); // 计算时间月份
  var calcDay = calcMoment.date(); // 计算时间天数
  var calcEndDay = calcMoment
    .clone()
    .endOf('month')
    .date(); // 计算时间所在月最后一天

  var diff,
    flag;

  // 小于等于开始日期
  if (calcMoment.valueOf() <= beginMoment.valueOf()) {
    return __('结束日期必须大于开始日期');
  }

  if (userType == 'NEW') {
    if (calcEndDay != calcDay) {
      return __('结束日期必须为每个月月末');
    }

    if (beginDay > 15) {
      if (calcMonth == beginMonth && beginYear == calcYear) {
        return __('不能选择当月');
      }
    }
  } else {
    // 整月

    flag = false;

    if (beginDay >= calcEndDay) { // `开始日期`大于`结束日期当月最大天数`，结束日期为当月最大天数减1
      if (calcDay == calcEndDay - 1 && !(beginYear == calcYear && beginMonth == calcMonth)) {
        flag = true;
      }
    } else if (beginDay == 1) { // 开始日期为月初, 结束日期为月末
      if (calcEndDay == calcDay) {
        flag = true;
      }
    } else {
      if (beginDay == calcDay + 1 && (beginYear != calcYear || beginMonth != calcMonth)) {
        flag = true
      }
    }

    if (flag) {
      return false;
    } else {
      return '开始日期到结束日期必须为整月(如：`2014-02-15` 到 `2014-03-14`)';
    }
  }

  return false;
}

//购物车免费体验产品合同结束日期校验
export function freeExperienceEndDate(beginDate, calcDate) {
  var beginMoment = moment(beginDate);
  var calcMoment = moment(calcDate);
  // 小于等于开始日期
  if (calcMoment.valueOf() <= beginMoment.valueOf()) {
    return __('结束日期必须大于开始日期');
  }
  return false;
}

// 是否是会员类产品
// hotdesk，openoffice，pod，online membership，freetrial giftcard，储物柜
export function isMemberProduct(cat) {
  if (!cat)
    return false;

  if ([
    'HOTDESK',
    'HOTDESK_LITE',
    'OPENOFFICE',
    'POD',
    'MEMBERSHIP',
    'HOTDESK_GIFT_CARD',
    'LOCKER',
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 是否会议室
export function isMeetingRoom(cat) {
  if (!cat)
    return false;

  if ([
    'MEETINGROOM',
    'MEETINGROOM_GENERAL',
    'MEETINGROOM_GENERAL_LARGE',
    'MEETINGROOM_GENERAL_NORMAL',
    'LIVING_ROOM',
    'MEETINGROOM_GENERAL_SMALL',
    'MEETINGROOM_GENERAL_X_LARGE',
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 是否杂项
export function isSundry(cat) {
  if (!cat)
    return false;

  if ([
    'SUNDRY',
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 一般产品 hotdesk oo po
export function isNormalProduct(cat) {
  if (!cat)
    return false;

  if ([
    'MEETINGROOM',
    'MEETINGROOM_GENERAL',
    'MEETINGROOM_GENERAL_LARGE',
    'MEETINGROOM_GENERAL_NORMAL',
    'LIVING_ROOM',
    'MEETINGROOM_GENERAL_SMALL',
    'MEETINGROOM_GENERAL_X_LARGE',
    'SUNDRY'
  ].indexOf(cat) == -1) {
    return true;
  }

  return false;
}

// 是否会员
export function isMembership(cat) {
  if (!cat)
    return false;
  if (cat.indexOf('MEMBERSHIP') != -1) {
    return true;
  }

  return false;
}

// 是否可购买的产品类别
export function isCatCanBuy(cat) {
  if (!cat)
    return false;

  if (['MEMBERSHIP_GENERAL'].indexOf(cat) == -1) {
    return true;
  }

  return false;
}

// 是否需要输入购买数量
export function isCatWithBuyNum(cat) {
  if (!cat)
    return false;
  if ([
    'OPENOFFICE',
    'POD',
    'HOTDESK',
    'HOTDESK_LITE',
    'HOTDESK_FREE_TRIAL',
    'NAKEDCREDIT'
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 下单时是否需要选hub
export function isCatHubWithOrder(cat) {
  // return false;
  if (!cat)
    return false;
  if ([
    'HOTDESK',
    'HOTDESK_LITE',
    'MEMBERSHIP',
    'HOTDESK_GIFT_CARD',
    'HOTDESK_FREE_TRIAL',
    'NAKEDCREDIT',
    'SUNDRY'
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 是否需要生成合同
export function isCatHasContract(cat) {
  // return false;
  if (!cat)
    return false;

  if ([
    'HOTDESK',
    'HOTDESK_LITE',
    'OPENOFFICE',
    'POD'
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 是否需要押金
export function isNeedDeposit(cat) {
  // return false;
  if (!cat)
    return false;

  if ([
    'POD'
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 是否需要押金月份
export function isDepositMonths(cat) {
  // return false;
  if (!cat)
    return false;

  if (['OPENOFFICE', 'POD', 'LOCKER'].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 是否可以预定活动
export function isCanBookEvent(cat) {
  // return false;
  if (!cat)
    return false;

  if ([
    'MEETINGROOM',
    'MEETINGROOM_GENERAL',
    'LIVING_ROOM',
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 下单时是否需要审批人
export function isCatNeedApprover(cat) {
  if (!cat)
    return false;

  if ([
    'HOTDESK',
    'HOTDESK_LITE',
    'OPENOFFICE',
    'POD',
    'LOCKER'
  ].indexOf(cat) != -1) {
    return true;
  }

  return false;
}

// 支付方式是否可选择
export function isPayChannelCanSelect(channel) {
  if (!channel || channel == 'PRERECEIVED_OFFSET_RECEIVED')
    return false;
  return true;
}

// 几点到几点时间段
export function oClockPeriod(start, end) {
  if (start == end) {
    return start;
  } else {
    return start + ' ' + __('to') + ' ' + end;
  }
}

// 获取审批人
export function getApprovers(type='normal') {
  switch (type) {
    // 产品订单
    case 'normal':
      return [
        'yita',
        'edmund',
        'lance'
      ];
    // 活动订单
    case 'event':
      return [
        'yita',
        'edmund',
        'lance'
      ];
    default:
      return [];
  }
}
