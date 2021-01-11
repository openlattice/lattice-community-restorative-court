// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { DashboardReduxConstants, REQUEST_STATE } from '../../../core/redux/constants';
import { GET_STAFF_CASES_DATA, getStaffCasesData } from '../actions';

const { STAFF_CASES_DATA } = DashboardReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getStaffCasesData.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_STAFF_CASES_DATA, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_STAFF_CASES_DATA, action.id], action),
    SUCCESS: () => state
      .set(STAFF_CASES_DATA, action.value)
      .setIn([GET_STAFF_CASES_DATA, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_STAFF_CASES_DATA, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_STAFF_CASES_DATA, action.id]),
  });
}
