/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';
import type { Saga } from '@redux-saga/core';

import * as DataSagas from '../data/sagas';
import * as ProfileSagas from '../../containers/profile/src/sagas';
import { AppSagas } from '../../containers/app';
import { EDMSagas } from '../edm';
import { RoutingSagas } from '../router';

export default function* sagas() :Saga<*> {

  yield all([
    // "lattice-auth" sagas
    fork(AuthSagas.watchAuthAttempt),
    fork(AuthSagas.watchAuthSuccess),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthExpired),
    fork(AuthSagas.watchLogout),

    // AppSagas
    fork(AppSagas.initializeApplicationWatcher),

    // DataSagas
    fork(DataSagas.submitDataGraphWatcher),

    // EDMSagas
    fork(EDMSagas.getEntityDataModelTypesWatcher),

    // ProfileSagas
    fork(ProfileSagas.getFormNeighborsWatcher),
    fork(ProfileSagas.getPersonCaseNeighborsWatcher),
    fork(ProfileSagas.getPersonNeighborsWatcher),
    fork(ProfileSagas.getPersonWatcher),
    fork(ProfileSagas.getStaffWatcher),
    fork(ProfileSagas.loadProfileWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),
  ]);
}
