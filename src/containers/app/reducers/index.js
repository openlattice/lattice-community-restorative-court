/*
 * @flow
 */

import { Map, fromJS } from 'immutable';

import initializeApplicationReducer from './initializeApplicationReducer';

import { RS_INITIAL_STATE } from '../../../core/redux/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';
import {
  APP_CONFIG,
  FQNS_BY_ESID,
  MATCH,
  ROOT,
} from '../constants';

const INITIAL_STATE :Map = fromJS({
  // actions
  [INITIALIZE_APPLICATION]: RS_INITIAL_STATE,
  // data
  [APP_CONFIG]: Map(),
  [FQNS_BY_ESID]: Map(),
  [MATCH]: '',
  [ROOT]: '',
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case initializeApplication.case(action.type):
      return initializeApplicationReducer(state, action);

    default:
      return state;
  }
}
