/**
 * @module data/hubs/main
 */

import Hub from 'gent-hub';
import Rx from 'rxjs';
import * as userPipes from '../pipes/user';
import * as configPipes from '../pipes/config';
import * as companyPipes from '../pipes/company';
import * as resourcePipes from '../pipes/resource';
import * as hubPipes from '../pipes/hub';
import * as meetingroomsPipes from '../pipes/meetingrooms';
import * as orderPipes from '../pipes/order';
import * as productPipes from '../pipes/product';
import * as eventPipes from '../pipes/event';
import * as currencyPipes from '../pipes/currency';
import * as sendmessagePipes from '../pipes/sendmessage'
import * as feedPipes from '../pipes/feed';
import * as passportPipes from '../pipes/passport';
import * as industryPipes from '../pipes/industry';
import * as benefitsPipes from '../pipes/benefits'
import * as msgPipes from '../pipes/msg'
import * as comPipes from '../pipes/com'
import * as doorlockPipes from '../pipes/doorlock'
import * as guidePipes from '../pipes/guide'
import * as apppagePipes from '../pipes/apppage'
import * as pushconfPipes from '../pipes/pushconf'
import * as bookvisitPipes from '../pipes/bookvisit'
import * as pushPipes from '../pipes/push'
import * as rolePipes from '../pipes/role'

const hub = new Hub({
  Observable: Rx.Observable,
  beforeMiddlewares: [Hub.logMiddleware],
  afterMiddlewares: [Hub.logMiddleware],
});

/**
 * @namespace user
 */
hub.addPipes('user', userPipes);
/**
 * @namespace config
 */
hub.addPipes('config', configPipes);

/**
 * @namespace company
 */
hub.addPipes('company', companyPipes);
/**
 *
 *  * @namespace company
 */
hub.addPipes('event', eventPipes);

/**
 * @namespace resource
 */
hub.addPipes('resource', resourcePipes);

/**
 * @namespace hub
 */
hub.addPipes('hub', hubPipes);

/**
 * @namespace meetingrooms
 */
hub.addPipes('meetingrooms', meetingroomsPipes);

/**
 * @namespace order
 */
hub.addPipes('order', orderPipes);

/**
 * @namespace product
 */
hub.addPipes('product', productPipes);

/**
 * @namespace feed
 */
hub.addPipes('feed', feedPipes);

/**
 * @namespace currency
 */
hub.addPipes('currency', currencyPipes);

/**
 * @namespace sendmessage
 */
hub.addPipes('sendmessage', sendmessagePipes);

/**
 * @namespace passport
 */
hub.addPipes('passport', passportPipes);

/**
 * @namespace industry
 */
hub.addPipes('industry', industryPipes);

/**
 * @namespace msg
 */
hub.addPipes('msg', msgPipes);
/**
 * @namespace benefits
 */
hub.addPipes('benefits', benefitsPipes);

/**
 * @namespace com
 */
hub.addPipes('com', comPipes);

/**
 * @namespace doorlock
 */
hub.addPipes('doorlock', doorlockPipes);

/**
 * @namespace guide
 */
hub.addPipes('guide', guidePipes);

/**
 * @namespace apppage
 */
hub.addPipes('apppage', apppagePipes);

/**
 * @namespace pushconf
 */
hub.addPipes('pushconf', pushconfPipes);

/**
 * @namespace bookvisit
 */
hub.addPipes('bookvisit', bookvisitPipes);

/**
 * @namespace push
 */
hub.addPipes('push', pushPipes);

/**
 * @namespace rolePipes
 */
hub.addPipes('role', rolePipes);

export default hub;
