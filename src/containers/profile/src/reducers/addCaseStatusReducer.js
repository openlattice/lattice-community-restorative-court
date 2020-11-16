// @flow
import { List, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { PERSON_CASE_NEIGHBOR_MAP, STAFF_MEMBERS, STAFF_MEMBER_BY_STATUS_EKID } from './constants';

import { AppTypes } from '../../../../core/edm/constants';
import { REQUEST_STATE } from '../../../../core/redux/constants';
import { ADD_CASE_STATUS, addCaseStatus } from '../actions';

const { getEntityKeyId } = DataUtils;
const { STATUS } = AppTypes;

export default function reducer(state :Map, action :SequenceAction) {

  return addCaseStatus.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_CASE_STATUS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_CASE_STATUS, action.id], action),
    SUCCESS: () => {
      const { caseEKID, newStatus, selectedStaffEKID } = action.value;
      let personCaseNeighborMap = state.get(PERSON_CASE_NEIGHBOR_MAP);
      const caseStatuses :List = personCaseNeighborMap.getIn([STATUS, caseEKID], List()).push(newStatus);
      console.log('caseStatuses ', caseStatuses.toJS());
      personCaseNeighborMap = personCaseNeighborMap.setIn([STATUS, caseEKID], caseStatuses);
      console.log('personCaseNeighborMap ', personCaseNeighborMap.toJS());

      const staffMembers :List = state.get(STAFF_MEMBERS);
      const staffMember :Map = staffMembers.find((staff :Map) => getEntityKeyId(staff) === selectedStaffEKID);
      console.log('staffMember: ', staffMember);
      const staffMemberByStatusEKID :Map = state.get(STAFF_MEMBER_BY_STATUS_EKID, Map())
        .set(getEntityKeyId(newStatus), staffMember);
      console.log('staffMemberByStatusEKID: ', staffMemberByStatusEKID.toJS());
      return state
        .set(PERSON_CASE_NEIGHBOR_MAP, personCaseNeighborMap)
        .set(STAFF_MEMBER_BY_STATUS_EKID, staffMemberByStatusEKID)
        .setIn([ADD_CASE_STATUS, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([ADD_CASE_STATUS, REQUEST_STATE], RequestStates.FAILURE),
  });
}
