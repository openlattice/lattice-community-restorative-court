// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map, get } from 'immutable';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { submitPartialReplace } from '../../../../core/data/actions';
import { submitPartialReplaceWorker } from '../../../../core/data/sagas';
import { AppTypes } from '../../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { formatNewEntityData } from '../../../../utils/data';
import { EDIT_PERSON, editPerson } from '../actions';

const { PEOPLE } = AppTypes;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.editPerson()
 *
 */

function* editPersonWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(editPerson.request(id));
    const { value } = action;

    const { entityData } = value;
    const response :Object = yield call(submitPartialReplaceWorker, submitPartialReplace({ entityData }));
    if (response.error) throw response.error;

    const peopleESID = yield select(selectEntitySetId(PEOPLE));
    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const personMap = get(entityData, peopleESID);
    const personEKID = personMap ? Object.keys(personMap)[0] : undefined;
    const personData = personMap && personEKID ? personMap[personEKID] : undefined;
    const newPerson :Map = formatNewEntityData(personData, propertyFqnsByTypeId);

    workerResponse = { data: newPerson };
    yield put(editPerson.success(id, newPerson));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(editPerson.failure(id, error));
  }
  finally {
    yield put(editPerson.finally(id));
  }
  return workerResponse;
}

function* editPersonWatcher() :Saga<*> {

  yield takeEvery(EDIT_PERSON, editPersonWorker);
}

export {
  editPersonWatcher,
  editPersonWorker,
};
