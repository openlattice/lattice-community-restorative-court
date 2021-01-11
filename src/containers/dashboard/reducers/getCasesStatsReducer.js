// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { DashboardReduxConstants, REQUEST_STATE } from '../../../core/redux/constants';
import { GET_CASES_STATS, getCasesStats } from '../actions';

const { CASES_STATS } = DashboardReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getCasesStats.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_CASES_STATS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_CASES_STATS, action.id], action),
    SUCCESS: () => state
      .set(CASES_STATS, action.value)
      .setIn([GET_CASES_STATS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_CASES_STATS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_CASES_STATS, action.id]),
  });
}
