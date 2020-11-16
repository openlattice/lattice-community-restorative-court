// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { STAFF_MEMBERS } from './constants';

import { REQUEST_STATE } from '../../../../core/redux/constants';
import { GET_STAFF, getStaff } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return getStaff.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_STAFF, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_STAFF, action.id], action),
    SUCCESS: () => state
      .set(STAFF_MEMBERS, action.value)
      .setIn([GET_STAFF, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_STAFF, REQUEST_STATE], RequestStates.FAILURE),
  });
}
