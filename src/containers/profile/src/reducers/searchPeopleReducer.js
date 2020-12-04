// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { SEARCH_PEOPLE, searchPeople } from '../actions';

const { SEARCHED_PEOPLE, TOTAL_HITS } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return searchPeople.reducer(state, action, {
    REQUEST: () => state
      .setIn([SEARCH_PEOPLE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SEARCH_PEOPLE, action.id], action),
    SUCCESS: () => state
      .set(SEARCHED_PEOPLE, action.value.searchedPeople)
      .set(TOTAL_HITS, action.value.totalHits)
      .setIn([SEARCH_PEOPLE, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SEARCH_PEOPLE, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SEARCH_PEOPLE, action.id]),
  });
}
