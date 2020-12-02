// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { SUBMIT_REPAIR_HARM_AGREEMENT, submitRepairHarmAgreement } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return submitRepairHarmAgreement.reducer(state, action, {
    REQUEST: () => state
      .setIn([SUBMIT_REPAIR_HARM_AGREEMENT, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SUBMIT_REPAIR_HARM_AGREEMENT, action.id], action),
    SUCCESS: () => state
      .setIn([SUBMIT_REPAIR_HARM_AGREEMENT, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SUBMIT_REPAIR_HARM_AGREEMENT, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SUBMIT_REPAIR_HARM_AGREEMENT, action.id]),
  });
}
