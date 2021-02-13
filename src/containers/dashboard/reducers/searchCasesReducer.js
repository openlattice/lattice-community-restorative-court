// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { DashboardReduxConstants, REQUEST_STATE } from '../../../core/redux/constants';
import { SEARCH_CASES, searchCases } from '../actions';

const { SEARCHED_CASES_DATA, TOTAL_CASES_HITS } = DashboardReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return searchCases.reducer(state, action, {
    REQUEST: () => state
      .setIn([SEARCH_CASES, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SEARCH_CASES, action.id], action),
    SUCCESS: () => state
      .set(SEARCHED_CASES_DATA, action.value.searchedCasesData)
      .set(TOTAL_CASES_HITS, action.value.totalHits)
      .setIn([SEARCH_CASES, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SEARCH_CASES, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SEARCH_CASES, action.id]),
  });
}
