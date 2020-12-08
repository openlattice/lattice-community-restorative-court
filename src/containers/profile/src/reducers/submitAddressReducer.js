// @flow
import { List, Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { SUBMIT_ADDRESS, submitAddress } from '../actions';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;
const { LOCATION } = AppTypes;

export default function reducer(state :Map, action :SequenceAction) {
  return submitAddress.reducer(state, action, {
    REQUEST: () => state
      .setIn([SUBMIT_ADDRESS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SUBMIT_ADDRESS, action.id], action),
    SUCCESS: () => {
      const personNeighborMap :Map = state.get(PERSON_NEIGHBOR_MAP)
        .update(LOCATION, List(), (addressList) => addressList.push(action.value));
      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([SUBMIT_ADDRESS, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([SUBMIT_ADDRESS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SUBMIT_ADDRESS, action.id]),
  });
}
