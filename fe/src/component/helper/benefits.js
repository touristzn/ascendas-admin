import { createModalHelper } from '../../util/modal';
import AddBenefits from '../com/benefits/add';
import Like from '../com/benefits/like';
import Choose from '../com/benefits/choose';

export let showAddBenefits = createModalHelper(AddBenefits);
export let showLikeBenefits = createModalHelper(Like);
export let showChooseBenefits = createModalHelper(Choose);