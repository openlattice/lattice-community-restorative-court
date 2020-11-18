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
import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation } from '../actions';

const { isDefined } = LangUtils;

const LOG = new Logger('PeacemakerSagas');
/*
 *
 * PeacemakerActions.addPeacemakerInformation()
 *
 */

function* addPeacemakerInformationWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(addPeacemakerInformation.request(id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;
    yield put(addPeacemakerInformation.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(addPeacemakerInformation.failure(id, error));
  }
  finally {
    yield put(addPeacemakerInformation.finally(id));
  }
  return workerResponse;
}

function* addPeacemakerInformationWatcher() :Saga<*> {

  yield takeEvery(ADD_PEACEMAKER_INFORMATION, addPeacemakerInformationWorker);
}

export {
  addPeacemakerInformationWatcher,
  addPeacemakerInformationWorker,
};
