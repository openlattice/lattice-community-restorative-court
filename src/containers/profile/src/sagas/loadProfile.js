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
const { CASE, FORM, ROLE } = AppTypes;
const { DST } = NEIGHBOR_DIRECTIONS;

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

    const caseESID :UUID = yield select(selectEntitySetId(CASE));
    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const roleESID :UUID = yield select(selectEntitySetId(ROLE));

    const neighborESIDs = [
      { direction: DST, entitySetId: caseESID },
      { direction: DST, entitySetId: formESID },
      { direction: DST, entitySetId: roleESID },
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
