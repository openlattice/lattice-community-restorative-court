/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import initializeApplicationReducer from './initializeApplicationReducer';

import { APP_REDUX_CONSTANTS, RS_INITIAL_STATE } from '../../../core/redux/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';

const {
  APP_CONFIG,
  ENTITY_SET_IDS,
  FQNS_BY_ESID,
  MATCH,
  ROOT,
} = APP_REDUX_CONSTANTS;

const INITIAL_STATE :Map = fromJS({
  // actions
  [INITIALIZE_APPLICATION]: RS_INITIAL_STATE,
  // data
  [APP_CONFIG]: Map(),
  [ENTITY_SET_IDS]: Map(),
  [FQNS_BY_ESID]: Map(),
  [MATCH]: {},
  [ROOT]: '/',
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case initializeApplication.case(action.type):
      return initializeApplicationReducer(state, action);

    default:
      return state;
  }
}
