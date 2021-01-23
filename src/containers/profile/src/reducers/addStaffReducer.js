// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { ADD_STAFF, addStaff } from '../../../dashboard/actions';

const { STAFF_MEMBERS } = ProfileReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return addStaff.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_STAFF, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_STAFF, action.id], action),
    SUCCESS: () => {
      const staffMembers = state.get(STAFF_MEMBERS).push(action.value);
      return state
        .set(STAFF_MEMBERS, staffMembers)
        .setIn([ADD_STAFF, REQUEST_STATE], RequestStates.SUCCESS);
    },
    FAILURE: () => state.setIn([ADD_STAFF, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([ADD_STAFF, action.id]),
  });
}
