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
  ReferralReduxConstants,
} from './constants';

import peacemakerReducer from '../../containers/peacemaker/reducers';
import profileReducer from '../../containers/profile/src/reducers';
import referralReducer from '../../containers/referral/reducers';
import { AppReducer } from '../../containers/app';
import { PEACEMAKER } from '../../containers/peacemaker/reducers/constants';
import { EDMReducer } from '../edm';

const { PROFILE } = ProfileReduxConstants;
const { REFERRAL } = ReferralReduxConstants;

export default function reducer(routerHistory :any) {

  return combineReducers({
    [APP]: AppReducer,
    [AUTH]: AuthReducer,
    [EDM]: EDMReducer,
    [PEACEMAKER]: peacemakerReducer,
    [PROFILE]: profileReducer,
    [REFERRAL]: referralReducer,
    router: connectRouter(routerHistory),
  });
}
