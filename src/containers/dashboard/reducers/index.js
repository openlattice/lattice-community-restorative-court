// @flow
import { List, Map, fromJS } from 'immutable';

import addStaffReducer from './addStaffReducer';
import getCasesStatsReducer from './getCasesStatsReducer';
import getStaffCasesDataReducer from './getStaffCasesDataReducer';

import { RESET_REQUEST_STATE } from '../../../core/redux/actions';
import { DashboardReduxConstants, RS_INITIAL_STATE } from '../../../core/redux/constants';
import { resetRequestStateReducer } from '../../../core/redux/reducers';
import {
  ADD_STAFF,
  GET_CASES_STATS,
  GET_STAFF_CASES_DATA,
  addStaff,
  getCasesStats,
  getStaffCasesData,
} from '../actions';

const { CASES_STATS, STAFF_CASES_DATA } = DashboardReduxConstants;

const INITIAL_STATE :Map = fromJS({
  // actions
  [ADD_STAFF]: RS_INITIAL_STATE,
  [GET_CASES_STATS]: RS_INITIAL_STATE,
  [GET_STAFF_CASES_DATA]: RS_INITIAL_STATE,
  // data
  [CASES_STATS]: Map(),
  [STAFF_CASES_DATA]: List(),
});

export default function reducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case RESET_REQUEST_STATE: {
      return resetRequestStateReducer(state, action);
    }

    case addStaff.case(action.type): {
      return addStaffReducer(state, action);
    }

    case getCasesStats.case(action.type): {
      return getCasesStatsReducer(state, action);
    }

    case getStaffCasesData.case(action.type): {
      return getStaffCasesDataReducer(state, action);
    }

    default:
      return state;
  }
}
