// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { GET_FORM_NEIGHBORS, getFormNeighbors } from '../actions';

const { FORM_NEIGHBOR_MAP } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getFormNeighbors.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_FORM_NEIGHBORS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_FORM_NEIGHBORS, action.id], action),
    SUCCESS: () => state
      .set(FORM_NEIGHBOR_MAP, action.value)
      .setIn([GET_FORM_NEIGHBORS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_FORM_NEIGHBORS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_FORM_NEIGHBORS, action.id], action),
  });
}
