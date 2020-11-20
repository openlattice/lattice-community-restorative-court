// @flow
import { List, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { EDIT_PEACEMAKER_INFORMATION, editPeacemakerInformation } from '../../../peacemaker/actions';
import { FormConstants } from '../constants';

const { PERSON_NEIGHBOR_MAP } = ProfileReduxConstants;
const { COMMUNICATION, FORM, PERSON_DETAILS } = AppTypes;
const { NAME } = PropertyTypes;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;
const { getPropertyValue } = DataUtils;

export default function reducer(state :Map, action :SequenceAction) {

  return editPeacemakerInformation.reducer(state, action, {
    REQUEST: () => state
      .setIn([EDIT_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.PENDING)
      .setIn([EDIT_PEACEMAKER_INFORMATION, action.id], action),
    SUCCESS: () => {
      const { newCommunication, newForm, newPersonDetails } = action.value;

      let personNeighborMap :Map = state.get(PERSON_NEIGHBOR_MAP);
      const forms :List = personNeighborMap.get(FORM, List());
      const formIndex :number = forms
        .findIndex((form :Map) => getPropertyValue(form, [NAME, 0]) === PEACEMAKER_INFORMATION_FORM);
      if (formIndex !== -1) {
        personNeighborMap = personNeighborMap
          .updateIn([FORM, formIndex], Map(), (originalForm) => originalForm.merge(newForm));
      }

      personNeighborMap = personNeighborMap
        .updateIn([COMMUNICATION, 0], Map(), (originalCommunication) => originalCommunication.merge(newCommunication));
      personNeighborMap = personNeighborMap
        .updateIn([PERSON_DETAILS, 0], Map(), (originalPersonDetails) => originalPersonDetails.merge(newPersonDetails));

      return state
        .set(PERSON_NEIGHBOR_MAP, personNeighborMap)
        .setIn([EDIT_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([EDIT_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
