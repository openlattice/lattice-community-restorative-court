// @flow
import { List, Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { SUBMIT_CONTACT, submitContact } from '../actions';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;
const { CONTACT_INFO } = AppTypes;

export default function reducer(state :Map, action :SequenceAction) {
  return submitContact.reducer(state, action, {
    REQUEST: () => state
      .setIn([SUBMIT_CONTACT, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SUBMIT_CONTACT, action.id], action),
    SUCCESS: () => {
      const personNeighborMap :Map = state.get(PERSON_NEIGHBOR_MAP)
        .update(CONTACT_INFO, List(), (contactList) => contactList.push(action.value));
      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([SUBMIT_CONTACT, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([SUBMIT_CONTACT, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SUBMIT_CONTACT, action.id]),
  });
}
