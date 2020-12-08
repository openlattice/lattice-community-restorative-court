// @flow
import { List, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { EDIT_CONTACT, editContact } from '../actions';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;
const { CONTACT_INFO } = AppTypes;
const { getEntityKeyId } = DataUtils;

export default function reducer(state :Map, action :SequenceAction) {
  return editContact.reducer(state, action, {
    REQUEST: () => state
      .setIn([EDIT_CONTACT, REQUEST_STATE], RequestStates.PENDING)
      .setIn([EDIT_CONTACT, action.id], action),
    SUCCESS: () => {
      let personNeighborMap :Map = state.getIn(PERSON_NEIGHBOR_MAP);
      let contactInfo :List = personNeighborMap.get(CONTACT_INFO, List());
      const editedContactIndex = contactInfo
        .findIndex((contact :Map) => getEntityKeyId(action.value) === getEntityKeyId(contact));
      if (editedContactIndex !== -1) {
        contactInfo = contactInfo
          .update(editedContactIndex, Map(), contactInfo.get(editedContactIndex).merge(action.value));
      }
      personNeighborMap = personNeighborMap.set(CONTACT_INFO, contactInfo);
      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([EDIT_CONTACT, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([EDIT_CONTACT, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([EDIT_CONTACT, action.id]),
  });
}
