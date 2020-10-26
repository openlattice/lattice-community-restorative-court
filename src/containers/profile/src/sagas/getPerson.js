// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map, fromJS } from 'immutable';
import { DataApiActions, DataApiSagas } from 'lattice-sagas';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { PEOPLE } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { GET_PERSON, getPerson } from '../actions';

const { isDefined } = LangUtils;
const { getEntityData } = DataApiActions;
const { getEntityDataWorker } = DataApiSagas;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.getPerson()
 *
 */

function* getPersonWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getPerson.request(id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const personEKID :UUID = value;

    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const response = yield call(
      getEntityDataWorker, getEntityData({ entitySetId: peopleESID, entityKeyId: personEKID })
    );
    if (response.error) throw response.error;
    const participant :Map = fromJS(response.data);

    workerResponse.data = participant;
    yield put(getPerson.success(id, participant));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getPerson.failure(id, error));
  }
  finally {
    yield put(getPerson.finally(id));
  }
  return workerResponse;
}

function* getPersonWatcher() :Saga<*> {

  yield takeEvery(GET_PERSON, getPersonWorker);
}

export {
  getPersonWatcher,
  getPersonWorker,
};
