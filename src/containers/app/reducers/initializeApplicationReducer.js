/*
 * @flow
 */

import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { REQUEST_STATE } from '../../../core/redux/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';
import {
  APP_CONFIG,
  ENTITY_SET_IDS,
  FQNS_BY_ESID,
  MATCH,
  ROOT,
} from '../constants';

export default function initializeApplicationReducer(state :Map, action :SequenceAction) {

  return initializeApplication.reducer(state, action, {
    REQUEST: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.PENDING),
    SUCCESS: () => state
      .set(APP_CONFIG, action.value.appConfig)
      .set(ENTITY_SET_IDS, action.value.entitySetIdsByFqn)
      .set(FQNS_BY_ESID, action.value.fqnsByESID)
      .set(MATCH, action.value.match)
      .set(ROOT, action.value.root)
      .setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.SUCCESS),
    FAILURE: () => state.setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.FAILURE),
  });
}
