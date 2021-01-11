/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import {
  APP,
  AUTH,
  DashboardReduxConstants,
  DownloadsReduxConstants,
  EDM,
  IntakeReduxConstants,
  ProfileReduxConstants,
  ReferralReduxConstants,
  RepairHarmReduxConstants,
  RestitutionReferralReduxConstants,
} from './constants';

import AppReducer from '../../containers/app/reducers';
import dashboardReducer from '../../containers/dashboard/reducers';
import downloadsReducer from '../../containers/downloads/reducers';
import intakeReducer from '../../containers/intake/reducers';
import peacemakerReducer from '../../containers/peacemaker/reducers';
import profileReducer from '../../containers/profile/src/reducers';
import referralReducer from '../../containers/referral/reducers';
import repairHarmReducer from '../../containers/repairharm/reducers';
import restitutionReferralReducer from '../../containers/restitutionreferral/reducers';
import { PEACEMAKER } from '../../containers/peacemaker/reducers/constants';
import { EDMReducer } from '../edm';

const { DASHBOARD } = DashboardReduxConstants;
const { DOWNLOADS } = DownloadsReduxConstants;
const { INTAKE } = IntakeReduxConstants;
const { PROFILE } = ProfileReduxConstants;
const { REFERRAL } = ReferralReduxConstants;
const { REPAIR_HARM } = RepairHarmReduxConstants;
const { RESTITUTION_REFERRAL } = RestitutionReferralReduxConstants;

export default function reducer(routerHistory :any) {

  return combineReducers({
    [APP]: AppReducer,
    [AUTH]: AuthReducer,
    [DASHBOARD]: dashboardReducer,
    [DOWNLOADS]: downloadsReducer,
    [EDM]: EDMReducer,
    [INTAKE]: intakeReducer,
    [PEACEMAKER]: peacemakerReducer,
    [PROFILE]: profileReducer,
    [REFERRAL]: referralReducer,
    [REPAIR_HARM]: repairHarmReducer,
    [RESTITUTION_REFERRAL]: restitutionReferralReducer,
    router: connectRouter(routerHistory),
  });
}
