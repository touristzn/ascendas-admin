import { createModalHelper } from '../../util/modal';
import AddResource from '../com/resource/add';
import ChooseResource from '../com/resource/choose';
import Doorlock from '../com/resource/doorlock';

export let showAddResource = createModalHelper(AddResource);
export let showChooseResource = createModalHelper(ChooseResource);
export let showDoorlock = createModalHelper(Doorlock);