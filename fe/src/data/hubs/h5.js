/**
 * @module data/hubs/main
 */

import Hub from 'gent-hub';
import Rx from 'rxjs';
import * as booktourPipes from '../pipes/booktour';
import * as guidePipes from '../pipes/guide';
import * as eventPipes from '../pipes/event';


const hub = new Hub({
  Observable: Rx.Observable,
  beforeMiddlewares: [Hub.logMiddleware],
  afterMiddlewares: [Hub.logMiddleware],
});

/**
 * @namespace user
 */
hub.addPipes('booktour', booktourPipes);

/**
 * @namespace guide
 */
hub.addPipes('guide', guidePipes);

/**
 * @namespace event
 */
hub.addPipes('event', eventPipes);

export default hub;
