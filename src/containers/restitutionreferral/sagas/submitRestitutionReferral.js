// @flow

import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph } from '../../../core/data/actions';
import { submitDataGraphWorker } from '../../../core/data/sagas';
import { SUBMIT_RESTITUTION_REFERRAL, submitRestitutionReferral } from '../actions';

const LOG = new Logger('RestitutionReferralSagas');

function* submitRestitutionReferralWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(submitRestitutionReferral.request(id));
    const { value } = action;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitRestitutionReferral.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(submitRestitutionReferral.failure(id, error));
  }
  finally {
    yield put(submitRestitutionReferral.finally(id));
  }
  return workerResponse;
}

function* submitRestitutionReferralWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_RESTITUTION_REFERRAL, submitRestitutionReferralWorker);
}

export {
  submitRestitutionReferralWatcher,
  submitRestitutionReferralWorker,
};
