// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { EDIT_ADDRESS, editAddress } from '../actions';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;
const { LOCATION } = AppTypes;

export default function reducer(state :Map, action :SequenceAction) {
  return editAddress.reducer(state, action, {
    REQUEST: () => state
      .setIn([EDIT_ADDRESS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([EDIT_ADDRESS, action.id], action),
    SUCCESS: () => {
      const personNeighborMap :Map = state.get(PERSON_NEIGHBOR_MAP)
        .updateIn([LOCATION, 0], Map(), (originalAddress) => originalAddress.merge(action.value));
      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([EDIT_ADDRESS, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([EDIT_ADDRESS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([EDIT_ADDRESS, action.id]),
  });
}
