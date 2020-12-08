// @flow
import { List, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { ADD_CASE_STATUS, addCaseStatus } from '../actions';

const { getEntityKeyId } = DataUtils;
const { STATUS } = AppTypes;
const { PERSON_CASE_NEIGHBOR_MAP, STAFF_MEMBERS, STAFF_MEMBER_BY_STATUS_EKID } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return addCaseStatus.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_CASE_STATUS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_CASE_STATUS, action.id], action),
    SUCCESS: () => {
      const { caseEKID, newStatus, selectedStaffEKID } = action.value;
      let personCaseNeighborMap = state.get(PERSON_CASE_NEIGHBOR_MAP);
      const caseStatuses :List = personCaseNeighborMap.getIn([STATUS, caseEKID], List()).unshift(newStatus);
      personCaseNeighborMap = personCaseNeighborMap.setIn([STATUS, caseEKID], caseStatuses);

      const staffMembers :List = state.get(STAFF_MEMBERS);
      const staffMember :Map = staffMembers.find((staff :Map) => getEntityKeyId(staff) === selectedStaffEKID);
      const staffMemberByStatusEKID :Map = state.get(STAFF_MEMBER_BY_STATUS_EKID, Map())
        .set(getEntityKeyId(newStatus), staffMember);
      return state
        .set(PERSON_CASE_NEIGHBOR_MAP, personCaseNeighborMap)
        .set(STAFF_MEMBER_BY_STATUS_EKID, staffMemberByStatusEKID)
        .setIn([ADD_CASE_STATUS, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([ADD_CASE_STATUS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([ADD_CASE_STATUS, action.id], action),
  });
}
