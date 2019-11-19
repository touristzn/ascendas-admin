import { createModalHelper } from '../../util/modal';
import AddRole from '../com/role/add';
import EditPermission from '../com/role/editPermission';
import ViewPermission from '../com/role/viewPermission';
import Choose from '../com/role/choose';

export let showAddRole = createModalHelper(AddRole);
export let showEditPermission = createModalHelper(EditPermission);
export let showViewPermission = createModalHelper(ViewPermission);
export let showChooseRole = createModalHelper(Choose);