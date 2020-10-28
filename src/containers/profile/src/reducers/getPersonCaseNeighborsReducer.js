// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  PEOPLE_IN_CASE_BY_ROLE_EKID_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_ROLE_BY_CASE_EKID,
  STAFF_MEMBER_BY_STATUS_EKID,
} from './constants';

import { REQUEST_STATE } from '../../../../core/redux/constants';
import { GET_PERSON_CASE_NEIGHBORS, getPersonCaseNeighbors } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return getPersonCaseNeighbors.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_PERSON_CASE_NEIGHBORS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_PERSON_CASE_NEIGHBORS, action.id], action),
    SUCCESS: () => state
      .set(PEOPLE_IN_CASE_BY_ROLE_EKID_MAP, action.value.peopleInCaseByRoleEKIDMap)
      .set(PERSON_CASE_NEIGHBOR_MAP, action.value.personCaseNeighborMap)
      .set(PERSON_ROLE_BY_CASE_EKID, action.value.personRoleByCaseEKID)
      .set(STAFF_MEMBER_BY_STATUS_EKID, action.value.staffMemberByStatusEKID)
      .setIn([GET_PERSON_CASE_NEIGHBORS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_PERSON_CASE_NEIGHBORS, REQUEST_STATE], RequestStates.FAILURE),
  });
}
