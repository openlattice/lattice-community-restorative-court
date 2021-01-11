// @flow
import { Map, fromJS } from 'immutable';

import downloadCasesReducer from './downloadCasesReducer';
import downloadReferralsReducer from './downloadReferralsReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { RS_INITIAL_STATE } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import {
  DOWNLOAD_CASES,
  DOWNLOAD_REFERRALS,
  downloadCases,
  downloadReferrals,
} from '../actions';

const INITIAL_STATE :Map = fromJS({
  // actions
  [DOWNLOAD_CASES]: RS_INITIAL_STATE,
  [DOWNLOAD_REFERRALS]: RS_INITIAL_STATE,
  // data
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case downloadCases.case(action.type): {
      return downloadCasesReducer(state, action);
    }

    case downloadReferrals.case(action.type): {
      return downloadReferralsReducer(state, action);
    }

    default:
      return state;
  }
}
