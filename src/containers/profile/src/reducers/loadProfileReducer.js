// @flow
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../../core/redux/constants';
import { LOAD_PROFILE, loadProfile } from '../actions';

export default function reducer(state :Map, action :SequenceAction) {

  return loadProfile.reducer(state, action, {
    REQUEST: () => state
      .setIn([LOAD_PROFILE, REQUEST_STATE], RequestStates.PENDING)
      .setIn([LOAD_PROFILE, action.id], action),
    SUCCESS: () => state
      .setIn([LOAD_PROFILE, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([LOAD_PROFILE, REQUEST_STATE], RequestStates.FAILURE),
  });
}
