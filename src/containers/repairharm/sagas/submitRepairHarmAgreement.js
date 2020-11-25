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
import { SUBMIT_REPAIR_HARM_AGREEMENT, submitRepairHarmAgreement } from '../actions';

const LOG = new Logger('RepairHarmSagas');

function* submitRepairHarmAgreementWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(submitRepairHarmAgreement.request(id));
    const { value } = action;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitRepairHarmAgreement.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(submitRepairHarmAgreement.failure(id, error));
  }
  finally {
    yield put(submitRepairHarmAgreement.finally(id));
  }
  return workerResponse;
}

function* submitRepairHarmAgreementWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_REPAIR_HARM_AGREEMENT, submitRepairHarmAgreementWorker);
}

export {
  submitRepairHarmAgreementWatcher,
  submitRepairHarmAgreementWorker,
};
