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
import { GET_CHARGES, getCharges } from '../actions';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { CHARGES } = AppTypes;

const LOG = new Logger('ReferralSagas');

function* getChargesWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getCharges.request(id));

    const chargesESID :UUID = yield select(selectEntitySetId(CHARGES));
    const response = yield call(
      getEntitySetDataWorker, getEntitySetData({ entitySetId: chargesESID })
    );
    if (response.error) throw response.error;
    const charges :List = fromJS(response.data);

    workerResponse.data = charges;
    yield put(getCharges.success(id, charges));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getCharges.failure(id, error));
  }
  finally {
    yield put(getCharges.finally(id));
  }
  return workerResponse;
}

function* getChargesWatcher() :Saga<*> {

  yield takeEvery(GET_CHARGES, getChargesWorker);
}

export {
  getChargesWatcher,
  getChargesWorker,
};
