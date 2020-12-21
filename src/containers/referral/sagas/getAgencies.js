// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, fromJS } from 'immutable';
import { DataApiActions, DataApiSagas } from 'lattice-sagas';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../core/edm/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { GET_AGENCIES, getAgencies } from '../actions';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { AGENCY } = AppTypes;

const LOG = new Logger('ReferralSagas');

function* getAgenciesWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getAgencies.request(id));

    const agencyESID :UUID = yield select(selectEntitySetId(AGENCY));
    const response = yield call(
      getEntitySetDataWorker, getEntitySetData({ entitySetId: agencyESID })
    );
    if (response.error) throw response.error;
    const agencies :List = fromJS(response.data);

    workerResponse.data = agencies;
    yield put(getAgencies.success(id, agencies));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getAgencies.failure(id, error));
  }
  finally {
    yield put(getAgencies.finally(id));
  }
  return workerResponse;
}

function* getAgenciesWatcher() :Saga<*> {

  yield takeEvery(GET_AGENCIES, getAgenciesWorker);
}

export {
  getAgenciesWatcher,
  getAgenciesWorker,
};
