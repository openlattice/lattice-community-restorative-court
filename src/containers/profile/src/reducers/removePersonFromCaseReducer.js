// @flow
import { List, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { PropertyTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { REMOVE_PERSON_FROM_CASE, removePersonFromCase } from '../actions';

const { ROLE } = PropertyTypes;
const { PERSON_CASE_NEIGHBOR_MAP } = ProfileReduxConstants;
const { getEntityKeyId } = DataUtils;

export default function reducer(state :Map, action :SequenceAction) {

  return removePersonFromCase.reducer(state, action, {
    REQUEST: () => state
      .setIn([REMOVE_PERSON_FROM_CASE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([REMOVE_PERSON_FROM_CASE, action.id], action),
    SUCCESS: () => {
      const { caseEKID, personEKID, personRole } = action.value;
      let peopleInCaseWithRole :List = state.getIn([PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID, personRole], List());
      const personToRemoveIndex = peopleInCaseWithRole
        .findIndex((person :Map) => getEntityKeyId(person) === personEKID);
      peopleInCaseWithRole = peopleInCaseWithRole.delete(personToRemoveIndex);
      const personCaseNeighborMap = state.get(PERSON_CASE_NEIGHBOR_MAP)
        .setIn([ROLE, caseEKID, personRole], peopleInCaseWithRole);
      return state
        .set(PERSON_CASE_NEIGHBOR_MAP, personCaseNeighborMap)
        .setIn([REMOVE_PERSON_FROM_CASE, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([REMOVE_PERSON_FROM_CASE, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([REMOVE_PERSON_FROM_CASE, action.id]),
  });
}
