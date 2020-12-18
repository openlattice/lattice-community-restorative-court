// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, ReferralReduxConstants } from '../../../core/redux/constants';
import { GET_AGENCIES, getAgencies } from '../actions';

const { AGENCIES } = ReferralReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getAgencies.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_AGENCIES, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_AGENCIES, action.id], action),
    SUCCESS: () => state
      .set(AGENCIES, action.value)
      .setIn([GET_AGENCIES, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_AGENCIES, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_AGENCIES, action.id]),
  });
}
