// @flow
import { Map } from 'immutable';

import { RestitutionReferralReduxConstants } from '../../../core/redux/constants';

const { SELECTED_RESTITUTION_REFERRAL } = RestitutionReferralReduxConstants;

export default function reducer(state :Map, action :Object) {

  const { value } = action;
  const selectedForm :Map = value;
  return state
    .set(SELECTED_RESTITUTION_REFERRAL, selectedForm);

}
