// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { SUBMIT_INTAKE, submitIntake } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return submitIntake.reducer(state, action, {
    REQUEST: () => state
      .setIn([SUBMIT_INTAKE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([SUBMIT_INTAKE, action.id], action),
    SUCCESS: () => state
      .setIn([SUBMIT_INTAKE, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([SUBMIT_INTAKE, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([SUBMIT_INTAKE, action.id]),
  });
}
