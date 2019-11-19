import { createModalHelper } from '../../util/modal';
import AddStaff from '../com/staff/add';
import ChooseStaff from '../com/staff/choose';
import ResetPassWord from '../com/staff/reset';

export let showAddStaff = createModalHelper(AddStaff);
export let showChooseStaff = createModalHelper(ChooseStaff);
export let showResetPassWord = createModalHelper(ResetPassWord);