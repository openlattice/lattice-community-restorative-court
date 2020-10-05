/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import {
  APP,
  AUTH,
  EDM,
} from './constants';

import { AppReducer } from '../../containers/app';
import { EDMReducer } from '../edm';

export default function reducer(routerHistory :any) {

  return combineReducers({
    [APP]: AppReducer,
    [EDM]: EDMReducer,
    [AUTH]: AuthReducer,
    router: connectRouter(routerHistory),
  });
}
