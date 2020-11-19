// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { EDIT_PEACEMAKER_INFORMATION, editPeacemakerInformation } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return editPeacemakerInformation.reducer(state, action, {
    REQUEST: () => state
      .setIn([EDIT_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.PENDING)
      .setIn([EDIT_PEACEMAKER_INFORMATION, action.id], action),
    SUCCESS: () => state
      .setIn([EDIT_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([EDIT_PEACEMAKER_INFORMATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
