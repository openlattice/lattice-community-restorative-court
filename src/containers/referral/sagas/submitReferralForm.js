// @flow

import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph } from '../../../core/data/actions';
import { submitDataGraphWorker } from '../../../core/data/sagas';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../utils/error/constants';
import { SUBMIT_REFERRAL_FORM, submitReferralForm } from '../actions';

const { isDefined } = LangUtils;

const LOG = new Logger('ReferralSagas');

function* submitReferralFormWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(submitReferralForm.request(id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitReferralForm.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(submitReferralForm.failure(id, error));
  }
  finally {
    yield put(submitReferralForm.finally(id));
  }
  return workerResponse;
}

function* submitReferralFormWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_REFERRAL_FORM, submitReferralFormWorker);
}

export {
  submitReferralFormWatcher,
  submitReferralFormWorker,
};
