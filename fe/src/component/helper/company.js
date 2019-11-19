import { createModalHelper } from '../../util/modal';
import AddCompany from '../com/company/add';
import Choose from '../com/company/choose';

export let showAddCompany = createModalHelper(AddCompany);
export let showChooseCompany = createModalHelper(Choose);