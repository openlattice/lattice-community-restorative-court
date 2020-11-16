// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { Models } from 'lattice';
import { DataApiActions, DataApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { SequenceAction } from 'redux-reqseq';

import { SUBMIT_DATA_GRAPH, submitDataGraph } from '../actions';

const LOG = new Logger('DataSagas');
const { DataGraphBuilder } = Models;
const { createEntityAndAssociationData } = DataApiActions;
const { createEntityAndAssociationDataWorker } = DataApiSagas;

function* submitDataGraphWorker(action :SequenceAction) :Generator<*, *, *> {

  const sagaResponse :Object = {};

  try {
    yield put(submitDataGraph.request(action.id, action.value));

    const dataGraph = (new DataGraphBuilder())
      .setAssociations(action.value.associationEntityData)
      .setEntities(action.value.entityData)
      .build();

    const response = yield call(createEntityAndAssociationDataWorker, createEntityAndAssociationData(dataGraph));
    if (response.error) throw response.error;
    sagaResponse.data = response.data;
    yield put(submitDataGraph.success(action.id, response.data));
  }
  catch (error) {
    sagaResponse.error = error;
    LOG.error(action.type, error);
    yield put(submitDataGraph.failure(action.id, error));
  }
  finally {
    yield put(submitDataGraph.finally(action.id));
  }

  return sagaResponse;
}

function* submitDataGraphWatcher() :Generator<*, *, *> {

  yield takeEvery(SUBMIT_DATA_GRAPH, submitDataGraphWorker);
}

export {
  submitDataGraphWatcher,
  submitDataGraphWorker,
};
