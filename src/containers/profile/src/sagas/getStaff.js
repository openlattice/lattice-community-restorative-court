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
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { GET_STAFF, getStaff } from '../actions';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { STAFF } = AppTypes;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.getStaff()
 *
 */

function* getStaffWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getStaff.request(id));

    const staffESID :UUID = yield select(selectEntitySetId(STAFF));
    const response = yield call(
      getEntitySetDataWorker, getEntitySetData({ entitySetId: staffESID })
    );
    if (response.error) throw response.error;
    const staff :List = fromJS(response.data);

    workerResponse.data = staff;
    yield put(getStaff.success(id, staff));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getStaff.failure(id, error));
  }
  finally {
    yield put(getStaff.finally(id));
  }
  return workerResponse;
}

function* getStaffWatcher() :Saga<*> {

  yield takeEvery(GET_STAFF, getStaffWorker);
}

export {
  getStaffWatcher,
  getStaffWorker,
};
