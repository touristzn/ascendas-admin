import { createModalHelper } from '../../util/modal';
import AddUser from '../com/user/add';
import ChooseUser from '../com/user/choose'

export let showAddUser = createModalHelper(AddUser);
export let showChooseUser = createModalHelper(ChooseUser);