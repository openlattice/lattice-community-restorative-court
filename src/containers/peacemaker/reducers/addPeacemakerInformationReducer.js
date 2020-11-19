// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return addPeacemakerInformation.reducer(state, action, {
    REQUEST: () => state
      .setIn([ADD_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.PENDING)
      .setIn([ADD_PEACEMAKER_INFORMATION, action.id], action),
    SUCCESS: () => state
      .setIn([ADD_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([ADD_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([ADD_PEACEMAKER_INFORMATION, action.id], action),
  });
}
