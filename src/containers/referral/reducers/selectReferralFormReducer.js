// @flow
import { Map } from 'immutable';

import { ReferralReduxConstants } from '../../../core/redux/constants';

const { SELECTED_REFERRAL_FORM } = ReferralReduxConstants;

export default function reducer(state :Map, action :Object) {

  const { value } = action;
  const selectedForm :Map = value;
  return state
    .set(SELECTED_REFERRAL_FORM, selectedForm);

}
