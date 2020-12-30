// @flow
import { Map, fromJS } from 'immutable';

import downloadReferralsByAgencyReducer from './downloadReferralsByAgencyReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { RS_INITIAL_STATE } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import { DOWNLOAD_REFERRALS_BY_AGENCY, downloadReferralsByAgency } from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [DOWNLOAD_REFERRALS_BY_AGENCY]: RS_INITIAL_STATE,
  // data
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case downloadReferralsByAgency.case(action.type): {
      return downloadReferralsByAgencyReducer(state, action);
    }

    default:
      return state;
  }
}
