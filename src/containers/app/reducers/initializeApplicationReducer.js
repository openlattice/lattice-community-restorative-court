/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';

const INITIAL_STATE :Map = fromJS({
  [INITIALIZE_APPLICATION]: { [REQUEST_STATE]: RequestStates.STANDBY },
  appConfig: {},
  root: '',
  match: {},
});

export default function reducer(state :Map = INITIAL_STATE, action :SequenceAction) {

  return initializeApplication.reducer(state, action, {
    REQUEST: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
