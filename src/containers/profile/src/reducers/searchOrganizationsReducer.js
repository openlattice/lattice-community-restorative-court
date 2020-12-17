// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { SEARCH_ORGANIZATIONS, searchOrganizations } from '../actions';

const { SEARCHED_ORGANIZATIONS, TOTAL_HITS } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return searchOrganizations.reducer(state, action, {
    REQUEST: () => state
      .setIn([SEARCH_ORGANIZATIONS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SEARCH_ORGANIZATIONS, action.id], action),
    SUCCESS: () => state
      .set(SEARCHED_ORGANIZATIONS, action.value.searchedOrganizations)
      .set(TOTAL_HITS, action.value.totalHits)
      .setIn([SEARCH_ORGANIZATIONS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SEARCH_ORGANIZATIONS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SEARCH_ORGANIZATIONS, action.id]),
  });
}
