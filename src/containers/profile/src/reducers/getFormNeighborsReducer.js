// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { FORM_NEIGHBOR_MAP } from './constants';

import { REQUEST_STATE } from '../../../../core/redux/constants';
import { GET_FORM_NEIGHBORS, getFormNeighbors } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return getFormNeighbors.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_FORM_NEIGHBORS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_FORM_NEIGHBORS, action.id], action),
    SUCCESS: () => state
      .set(FORM_NEIGHBOR_MAP, action.value)
      .setIn([GET_FORM_NEIGHBORS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_FORM_NEIGHBORS, REQUEST_STATE], RequestStates.FAILURE),
  });
}
