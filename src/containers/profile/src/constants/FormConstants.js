// @flow
import { selectReferralForm } from '../../../referral/actions';
import { selectRepairHarmAgreement } from '../../../repairharm/actions';

// Form Names:
export const REFERRAL_FORM :string = 'Referral Form';
export const INTAKE_FORM :string = 'Intake Form';
export const REPAIR_HARM_AGREEMENT :string = 'Repair Harm Agreement';
export const RESTITUTION_REFERRAL_FORM :string = 'Restitution Referral Form';
export const PEACEMAKER_INFORMATION_FORM :string = 'Peacemaker Information Form';

export const SELECT_FORM_ACTIONS_BY_FORM = {
  [INTAKE_FORM]: () => {},
  [REFERRAL_FORM]: selectReferralForm,
  [REPAIR_HARM_AGREEMENT]: selectRepairHarmAgreement,
  [RESTITUTION_REFERRAL_FORM]: () => {},
};
