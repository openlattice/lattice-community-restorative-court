/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';
import type { Saga } from '@redux-saga/core';

import * as DashboardSagas from '../../containers/dashboard/sagas';
import * as DataSagas from '../data/sagas';
import * as DownloadsSagas from '../../containers/downloads/sagas';
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

    // DashboardSagas
    fork(DashboardSagas.getCasesStatsWatcher),
    fork(DashboardSagas.getStaffCasesDataWatcher),

    // DataSagas
    fork(DataSagas.submitDataGraphWatcher),
    fork(DataSagas.submitPartialReplaceWatcher),

    // DownloadsSagas
    fork(DownloadsSagas.downloadCasesWatcher),
    fork(DownloadsSagas.downloadReferralsWatcher),

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
    fork(ProfileSagas.editAddressWatcher),
    fork(ProfileSagas.editContactWatcher),
    fork(ProfileSagas.editPersonWatcher),
    fork(ProfileSagas.editPersonDetailsWatcher),
    fork(ProfileSagas.getPersonCaseNeighborsWatcher),
    fork(ProfileSagas.getPersonNeighborsWatcher),
    fork(ProfileSagas.getPersonWatcher),
    fork(ProfileSagas.getStaffWatcher),
    fork(ProfileSagas.loadProfileWatcher),
    fork(ProfileSagas.searchOrganizationsWatcher),
    fork(ProfileSagas.searchPeopleWatcher),
    fork(ProfileSagas.submitAddressWatcher),
    fork(ProfileSagas.submitContactWatcher),

    // ReferralSagas
    fork(ReferralSagas.getAgenciesWatcher),
    fork(ReferralSagas.getCRCPeopleWatcher),
    fork(ReferralSagas.getChargesWatcher),
    fork(ReferralSagas.getOrganizationsWatcher),
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
