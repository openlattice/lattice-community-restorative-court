// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { EDIT_PERSON_DETAILS, editPersonDetails } from '../actions';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;
const { PERSON_DETAILS } = AppTypes;

export default function reducer(state :Map, action :SequenceAction) {
  return editPersonDetails.reducer(state, action, {
    REQUEST: () => state
      .setIn([EDIT_PERSON_DETAILS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([EDIT_PERSON_DETAILS, action.id], action),
    SUCCESS: () => {
      const personNeighborMap :Map = state.get(PERSON_NEIGHBOR_MAP)
        .updateIn([PERSON_DETAILS, 0], Map(), (originalPersonDetails) => originalPersonDetails.merge(action.value));
      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([EDIT_PERSON_DETAILS, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([EDIT_PERSON_DETAILS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([EDIT_PERSON_DETAILS, action.id]),
  });
}
