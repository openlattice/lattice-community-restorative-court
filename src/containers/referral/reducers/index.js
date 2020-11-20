// @flow
import { List, Map, fromJS } from 'immutable';

import getCRCPeopleReducer from './getCRCPeopleReducer';
import submitReferralFormReducer from './submitReferralFormReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { RS_INITIAL_STATE, ReferralReduxConstants } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import {
  GET_CRC_PEOPLE,
  SUBMIT_REFERRAL_FORM,
  getCRCPeople,
  submitReferralForm,
} from '../actions';

const { CRC_PEOPLE } = ReferralReduxConstants;

const INITIAL_STATE :Map = fromJS({
  // actions
  [GET_CRC_PEOPLE]: RS_INITIAL_STATE,
  [SUBMIT_REFERRAL_FORM]: RS_INITIAL_STATE,
  // data
  [CRC_PEOPLE]: List(),
});

export default function profileReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case getCRCPeople.case(action.type):
      return getCRCPeopleReducer(state, action);

    case submitReferralForm.case(action.type):
      return submitReferralFormReducer(state, action);

    default:
      return state;
  }
}
