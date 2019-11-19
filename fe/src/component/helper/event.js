import { createModalHelper } from '../../util/modal';
import addAttendees from '../com/event/add';
import chooseCategories from '../com/event/categories';
import chooseEvent from '../com/event/choose'

export let showAddEventAttendees = createModalHelper(addAttendees);
export let showChooseCategories = createModalHelper(chooseCategories);
export let showChooseEvent = createModalHelper(chooseEvent);

