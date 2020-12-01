// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, ReferralReduxConstants } from '../../../core/redux/constants';
import { GET_CRC_PEOPLE, getCRCPeople } from '../actions';

const { CRC_PEOPLE } = ReferralReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getCRCPeople.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_CRC_PEOPLE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_CRC_PEOPLE, action.id], action),
    SUCCESS: () => state
      .set(CRC_PEOPLE, action.value)
      .setIn([GET_CRC_PEOPLE, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_CRC_PEOPLE, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_CRC_PEOPLE, action.id]),
  });
}
