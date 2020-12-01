// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, ReferralReduxConstants } from '../../../core/redux/constants';
import { GET_REFERRAL_REQUEST_NEIGHBORS, getReferralRequestNeighbors } from '../actions';

const { REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getReferralRequestNeighbors.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_REFERRAL_REQUEST_NEIGHBORS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_REFERRAL_REQUEST_NEIGHBORS, action.id], action),
    SUCCESS: () => state
      .set(REFERRAL_REQUEST_NEIGHBOR_MAP, action.value)
      .setIn([GET_REFERRAL_REQUEST_NEIGHBORS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_REFERRAL_REQUEST_NEIGHBORS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_REFERRAL_REQUEST_NEIGHBORS, action.id]),
  });
}
