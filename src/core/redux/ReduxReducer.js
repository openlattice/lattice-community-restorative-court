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

import profileReducer from '../../containers/profile/src/reducers';
import { AppReducer } from '../../containers/app';
import { PROFILE } from '../../containers/profile/src/reducers/constants';
import { EDMReducer } from '../edm';

export default function reducer(routerHistory :any) {

  return combineReducers({
    [APP]: AppReducer,
    [EDM]: EDMReducer,
    [AUTH]: AuthReducer,
    [PROFILE]: profileReducer,
    router: connectRouter(routerHistory),
  });
}
