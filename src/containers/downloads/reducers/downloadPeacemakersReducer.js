// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { DOWNLOAD_PEACEMAKERS, downloadPeacemakers } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return downloadPeacemakers.reducer(state, action, {
    REQUEST: () => state
      .setIn([DOWNLOAD_PEACEMAKERS, REQUEST_STATE], RequestStates.PENDING)
      .setIn([DOWNLOAD_PEACEMAKERS, action.id], action),
    SUCCESS: () => state.setIn([DOWNLOAD_PEACEMAKERS, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([DOWNLOAD_PEACEMAKERS, REQUEST_STATE], RequestStates.FAILURE),
    FINALLY: () => state.deleteIn([DOWNLOAD_PEACEMAKERS, action.id]),
  });
}
