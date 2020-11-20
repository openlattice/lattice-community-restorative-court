// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { GET_PERSON_NEIGHBORS, getPersonNeighbors } from '../actions';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getPersonNeighbors.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_PERSON_NEIGHBORS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_PERSON_NEIGHBORS, action.id], action),
    SUCCESS: () => state
      .set(PERSON_NEIGHBOR_MAP, action.value)
      .setIn([GET_PERSON_NEIGHBORS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_PERSON_NEIGHBORS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_PERSON_NEIGHBORS, action.id], action),
  });
}
