/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';
import type { Saga } from '@redux-saga/core';

import * as DataSagas from '../data/sagas';
import * as PeacemakerSagas from '../../containers/peacemaker/sagas';
import * as ProfileSagas from '../../containers/profile/src/sagas';
import * as ReferralSagas from '../../containers/referral/sagas';
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
    fork(DataSagas.submitPartialReplaceWatcher),

    // EDMSagas
    fork(EDMSagas.getEntityDataModelTypesWatcher),

    // PeacemakerSagas
    fork(PeacemakerSagas.addPeacemakerInformationWatcher),
    fork(PeacemakerSagas.editPeacemakerInformationWatcher),

    // ProfileSagas
    fork(ProfileSagas.addCaseStatusWatcher),
    fork(ProfileSagas.addContactActivityWatcher),
    fork(ProfileSagas.getFormNeighborsWatcher),
    fork(ProfileSagas.getPersonCaseNeighborsWatcher),
    fork(ProfileSagas.getPersonNeighborsWatcher),
    fork(ProfileSagas.getPersonWatcher),
    fork(ProfileSagas.getStaffWatcher),
    fork(ProfileSagas.loadProfileWatcher),

    // ReferralSagas
    fork(ReferralSagas.getCRCPeopleWatcher),
    fork(ReferralSagas.submitReferralFormWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),
  ]);
}
