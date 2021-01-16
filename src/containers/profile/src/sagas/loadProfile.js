// @flow

import {
  all,
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { getPersonWorker } from './getPerson';
import { getPersonNeighborsWorker } from './getPersonNeighbors';
import { getStaffWorker } from './getStaff';

import { AppTypes } from '../../../../core/edm/constants';
import { NEIGHBOR_DIRECTIONS } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import {
  LOAD_PROFILE,
  getPerson,
  getPersonNeighbors,
  getStaff,
  loadProfile
} from '../actions';

const { isDefined } = LangUtils;
const {
  COMMUNICATION,
  CONTACT_ACTIVITY,
  CONTACT_INFO,
  CRC_CASE,
  FORM,
  LOCATION,
  PEACEMAKER_STATUS,
  PERSON_DETAILS,
} = AppTypes;
const { DST, SRC } = NEIGHBOR_DIRECTIONS;

const LOG = new Logger('ProfileSagas');

/*
 *
 * ProfileActions.loadProfile()
 *
 */

function* loadProfileWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  try {
    yield put(loadProfile.request(id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const personEKID :UUID = value;

    const caseESID :UUID = yield select(selectEntitySetId(CRC_CASE));
    const communicationESID = yield select(selectEntitySetId(COMMUNICATION));
    const contactActivityESID :UUID = yield select(selectEntitySetId(CONTACT_ACTIVITY));
    const contactInfoESID :UUID = yield select(selectEntitySetId(CONTACT_INFO));
    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const locationESID = yield select(selectEntitySetId(LOCATION));
    const peacemakerStatusESID = yield select(selectEntitySetId(PEACEMAKER_STATUS));
    const personDetailsESID = yield select(selectEntitySetId(PERSON_DETAILS));

    const neighborESIDs = [
      { direction: DST, entitySetId: caseESID },
      { direction: SRC, entitySetId: contactActivityESID },
      { direction: DST, entitySetId: formESID },
      { direction: DST, entitySetId: personDetailsESID },
      { direction: DST, entitySetId: communicationESID },
      { direction: DST, entitySetId: contactInfoESID },
      { direction: DST, entitySetId: locationESID },
      { direction: DST, entitySetId: peacemakerStatusESID },
    ];

    const workerResponses :Object[] = yield all([
      call(getPersonNeighborsWorker, getPersonNeighbors({ neighborESIDs, personEKID })),
      call(getPersonWorker, getPerson(personEKID)),
      call(getStaffWorker, getStaff()),
    ]);
    const responseError = workerResponses.reduce(
      (error, workerResponse) => error || workerResponse.error,
      undefined,
    );
    if (responseError) throw responseError;

    yield put(loadProfile.success(id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(loadProfile.failure(id, error));
  }
  finally {
    yield put(loadProfile.finally(id));
  }
}

function* loadProfileWatcher() :Saga<*> {

  yield takeEvery(LOAD_PROFILE, loadProfileWorker);
}

export {
  loadProfileWatcher,
  loadProfileWorker,
};
