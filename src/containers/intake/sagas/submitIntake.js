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
import { SUBMIT_INTAKE, submitIntake } from '../actions';

const LOG = new Logger('IntakeSagas');

function* submitIntakeWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(submitIntake.request(id));
    const { value } = action;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitIntake.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(submitIntake.failure(id, error));
  }
  finally {
    yield put(submitIntake.finally(id));
  }
  return workerResponse;
}

function* submitIntakeWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_INTAKE, submitIntakeWorker);
}

export {
  submitIntakeWatcher,
  submitIntakeWorker,
};
