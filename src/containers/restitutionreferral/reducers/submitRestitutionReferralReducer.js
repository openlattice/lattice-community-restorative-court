// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { SUBMIT_RESTITUTION_REFERRAL, submitRestitutionReferral } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return submitRestitutionReferral.reducer(state, action, {
    REQUEST: () => state
      .setIn([SUBMIT_RESTITUTION_REFERRAL, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SUBMIT_RESTITUTION_REFERRAL, action.id], action),
    SUCCESS: () => state
      .setIn([SUBMIT_RESTITUTION_REFERRAL, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SUBMIT_RESTITUTION_REFERRAL, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SUBMIT_RESTITUTION_REFERRAL, action.id]),
  });
}
