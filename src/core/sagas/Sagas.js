/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';
import type { Saga } from '@redux-saga/core';

import * as DataSagas from '../data/sagas';
import * as IntakeSagas from '../../containers/intake/sagas';
import * as PeacemakerSagas from '../../containers/peacemaker/sagas';
import * as ProfileSagas from '../../containers/profile/src/sagas';
import * as ReferralSagas from '../../containers/referral/sagas';
import * as RepairHarmSagas from '../../containers/repairharm/sagas';
import * as RestitutionReferralSagas from '../../containers/restitutionreferral/sagas';
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

    // IntakeSagas
    fork(IntakeSagas.submitIntakeWatcher),

    // PeacemakerSagas
    fork(PeacemakerSagas.addPeacemakerInformationWatcher),
    fork(PeacemakerSagas.editPeacemakerInformationWatcher),

    // ProfileSagas
    fork(ProfileSagas.addCaseStatusWatcher),
    fork(ProfileSagas.addContactActivityWatcher),
    fork(ProfileSagas.addPersonToCaseWatcher),
    fork(ProfileSagas.editContactWatcher),
    fork(ProfileSagas.editPersonWatcher),
    fork(ProfileSagas.editPersonDetailsWatcher),
    fork(ProfileSagas.getPersonCaseNeighborsWatcher),
    fork(ProfileSagas.getPersonNeighborsWatcher),
    fork(ProfileSagas.getPersonWatcher),
    fork(ProfileSagas.getStaffWatcher),
    fork(ProfileSagas.loadProfileWatcher),
    fork(ProfileSagas.searchPeopleWatcher),
    fork(ProfileSagas.submitContactWatcher),

    // ReferralSagas
    fork(ReferralSagas.getCRCPeopleWatcher),
    fork(ReferralSagas.getReferralRequestNeighborsWatcher),
    fork(ReferralSagas.submitReferralFormWatcher),

    // RepairHarmSagas
    fork(RepairHarmSagas.submitRepairHarmAgreementWatcher),

    // RestitutionReferralSagas
    fork(RestitutionReferralSagas.submitRestitutionReferralWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToRouteWatcher),
  ]);
}
