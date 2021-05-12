// @flow
import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { DataApiActions, DataApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { deleteEntitiesWorker } from './deleteEntities';

import { CREATE_OR_REPLACE_ASSOCIATION, createOrReplaceAssociation, deleteEntities } from '../actions';

const { createAssociations } = DataApiActions;
const { createAssociationsWorker } = DataApiSagas;

const LOG = new Logger('DataSagas');

function* createOrReplaceAssociationWorker(action :SequenceAction) :Saga<WorkerResponse> {

  let workerResponse :WorkerResponse;

  try {
    yield put(createOrReplaceAssociation.request(action.id));
    const { value } = action;
    workerResponse = { data: {} };

    const { associations, associationsToDelete } = value;

    if (associationsToDelete && associationsToDelete.length) {
      const deleteResponse = yield call(deleteEntitiesWorker, deleteEntities(associationsToDelete));
      if (deleteResponse.error) throw deleteResponse.error;
      workerResponse = { data: deleteResponse.data };
    }

    if (associations && Object.entries(associations).length) {
      const createAssociationResponse = yield call(createAssociationsWorker, createAssociations(associations));
      if (createAssociationResponse.error) throw createAssociationResponse.error;
      workerResponse = { data: createAssociationResponse.data };
    }

    yield put(createOrReplaceAssociation.success(action.id, workerResponse));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(createOrReplaceAssociation.failure(action.id, error));
  }
  finally {
    yield put(createOrReplaceAssociation.finally(action.id));
  }

  return workerResponse;
}

function* createOrReplaceAssociationWatcher() :Saga<*> {

  yield takeEvery(CREATE_OR_REPLACE_ASSOCIATION, createOrReplaceAssociationWorker);
}

export {
  createOrReplaceAssociationWatcher,
  createOrReplaceAssociationWorker,
};
