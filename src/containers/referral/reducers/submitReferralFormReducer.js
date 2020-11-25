// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { SUBMIT_REFERRAL_FORM, submitReferralForm } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return submitReferralForm.reducer(state, action, {
    REQUEST: () => state
      .setIn([SUBMIT_REFERRAL_FORM, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SUBMIT_REFERRAL_FORM, action.id], action),
    SUCCESS: () => state
      .setIn([SUBMIT_REFERRAL_FORM, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SUBMIT_REFERRAL_FORM, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SUBMIT_REFERRAL_FORM, action.id]),
  });
}
