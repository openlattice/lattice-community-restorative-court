// @flow
import { List, Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { PropertyTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { ADD_PERSON_TO_CASE, addPersonToCase } from '../actions';

const { ROLE } = PropertyTypes;
const { PERSON_CASE_NEIGHBOR_MAP } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return addPersonToCase.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_PERSON_TO_CASE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_PERSON_TO_CASE, action.id], action),
    SUCCESS: () => {
      const { caseEKID, person, role } = action.value;
      let crcCaseRoleMap :Map = state.getIn([PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID], Map());
      crcCaseRoleMap = crcCaseRoleMap.update(role, List(), (roleList) => roleList.push(person));
      const personCaseNeighborMap = state.get(PERSON_CASE_NEIGHBOR_MAP)
        .setIn([ROLE, caseEKID], crcCaseRoleMap);
      return state
        .set(PERSON_CASE_NEIGHBOR_MAP, personCaseNeighborMap)
        .setIn([ADD_PERSON_TO_CASE, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([ADD_PERSON_TO_CASE, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([ADD_PERSON_TO_CASE, action.id]),
  });
}
