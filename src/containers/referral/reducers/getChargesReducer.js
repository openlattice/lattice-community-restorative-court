// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE, ReferralReduxConstants } from '../../../core/redux/constants';
import { GET_CHARGES, getCharges } from '../actions';

const { CHARGES } = ReferralReduxConstants;

export default function reducer(state :Map, action :SequenceAction) {

  return getCharges.reducer(state, action, {
    REQUEST: () => state
      .setIn([GET_CHARGES, REQUEST_STATE], RequestStates.PENDING)
      .setIn([GET_CHARGES, action.id], action),
    SUCCESS: () => state
      .set(CHARGES, action.value)
      .setIn([GET_CHARGES, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([GET_CHARGES, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([GET_CHARGES, action.id]),
  });
}
