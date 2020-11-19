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
  ProfileReduxConstants,
} from './constants';

import peacemakerReducer from '../../containers/peacemaker/reducers';
import profileReducer from '../../containers/profile/src/reducers';
import { AppReducer } from '../../containers/app';
import { PEACEMAKER } from '../../containers/peacemaker/reducers/constants';
import { EDMReducer } from '../edm';

const { PROFILE } = ProfileReduxConstants;

export default function reducer(routerHistory :any) {

  return combineReducers({
    [APP]: AppReducer,
    [AUTH]: AuthReducer,
    [EDM]: EDMReducer,
    [PEACEMAKER]: peacemakerReducer,
    [PROFILE]: profileReducer,
    router: connectRouter(routerHistory),
  });
}
