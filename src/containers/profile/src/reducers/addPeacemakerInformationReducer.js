// @flow
import { List, Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation } from '../../../peacemaker/actions';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;
const { COMMUNICATION, FORM, PERSON_DETAILS } = AppTypes;

export default function reducer(state :Map, action :SequenceAction) {

  return addPeacemakerInformation.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_PEACEMAKER_INFORMATION, action.id], action),
    SUCCESS: () => {
      const { newCommunication, newForm, newPersonDetails } = action.value;

      let personNeighborMap :Map = state.get(PERSON_NEIGHBOR_MAP)
        .update(FORM, List(), (forms :List) => forms.push(newForm));
      personNeighborMap = personNeighborMap
        .update(COMMUNICATION, List(), (communication :List) => communication.push(newCommunication));
      personNeighborMap = personNeighborMap
        .update(PERSON_DETAILS, List(), (personDetails :List) => personDetails.push(newPersonDetails));
      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([ADD_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([ADD_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([ADD_PEACEMAKER_INFORMATION, action.id]),
  });
}
