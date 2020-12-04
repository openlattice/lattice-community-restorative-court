// @flow
import {
  all,
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { DataApiActions, DataApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { DELETE_ENTITIES, deleteEntities } from '../actions';

const { deleteEntityData } = DataApiActions;
const { deleteEntityDataWorker } = DataApiSagas;

const LOG = new Logger('DataSagas');

function* deleteEntitiesWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;

  try {
    yield put(deleteEntities.request(action.id, action.value));
    const dataForDelete :Object[] = action.value;

    const calls = [];
    dataForDelete.forEach((data :Object) => {
      const { entitySetId, entityKeyIds } = data;
      calls.push(call(deleteEntityDataWorker, deleteEntityData({ entitySetId, entityKeyIds })));
    });
    const deleteResponses = yield all(calls);
    deleteResponses.forEach((response) => {
      if (response.error) throw response.error;
    });
    workerResponse = { data: deleteResponses.length };

    yield put(deleteEntities.success(action.id));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(deleteEntities.failure(action.id, error));
  }
  finally {
    yield put(deleteEntities.finally(action.id));
  }

  return workerResponse;
}

function* deleteEntitiesWatcher() :Saga<*> {

  yield takeEvery(DELETE_ENTITIES, deleteEntitiesWorker);
}

export {
  deleteEntitiesWatcher,
  deleteEntitiesWorker,
};
