import { createModalHelper } from '../../util/modal';
import EditEffective from '../com/order/edit-effective';
import EditPaidDate from '../com/order/edit-paid-date';
import EditLeave from '../com/order/edit-leave';

export let showEditEffective = createModalHelper(EditEffective);
export let showEditPaidDate = createModalHelper(EditPaidDate);
export let showEditLeave = createModalHelper(EditLeave);