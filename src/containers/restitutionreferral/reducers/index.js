// @flow
import { Map, fromJS } from 'immutable';

import selectRestitutionReferralReducer from './selectRestitutionReferralReducer';
import submitRestitutionReferralReducer from './submitRestitutionReferralReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { RS_INITIAL_STATE, RestitutionReferralReduxConstants } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import { SELECT_RESTITUTION_REFERRAL, SUBMIT_RESTITUTION_REFERRAL, submitRestitutionReferral } from '../actions';

const { SELECTED_RESTITUTION_REFERRAL } = RestitutionReferralReduxConstants;

const INITIAL_STATE :Map = fromJS({
  // actions
  [SUBMIT_RESTITUTION_REFERRAL]: RS_INITIAL_STATE,
  // data
  [SELECTED_RESTITUTION_REFERRAL]: Map(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case SELECT_RESTITUTION_REFERRAL: {
      return selectRestitutionReferralReducer(state, action);
    }

    case submitRestitutionReferral.case(action.type):
      return submitRestitutionReferralReducer(state, action);

    default:
      return state;
  }
}
