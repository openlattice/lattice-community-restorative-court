/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { APP_REDUX_CONSTANTS, REQUEST_STATE } from '../../../core/redux/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';

const { APP_CONFIG, ENTITY_SET_IDS, FQNS_BY_ESID } = APP_REDUX_CONSTANTS;

export default function reducer(state :Map, action :SequenceAction) {

  return initializeApplication.reducer(state, action, {
    REQUEST: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state
      .set(APP_CONFIG, action.value.appConfig)
      .set(ENTITY_SET_IDS, action.value.entitySetIdsByFqn)
      .set(FQNS_BY_ESID, action.value.fqnsByESID)
      .setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
