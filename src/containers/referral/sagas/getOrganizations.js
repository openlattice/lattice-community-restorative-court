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
import { GET_ORGANIZATIONS, getOrganizations } from '../actions';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { ORGANIZATIONS } = AppTypes;

const LOG = new Logger('ReferralSagas');

function* getOrganizationsWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getOrganizations.request(id));

    const organizationsESID :UUID = yield select(selectEntitySetId(ORGANIZATIONS));
    const response = yield call(
      getEntitySetDataWorker, getEntitySetData({ entitySetId: organizationsESID })
    );
    if (response.error) throw response.error;
    const organizations :List = fromJS(response.data);

    workerResponse.data = organizations;
    yield put(getOrganizations.success(id, organizations));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getOrganizations.failure(id, error));
  }
  finally {
    yield put(getOrganizations.finally(id));
  }
  return workerResponse;
}

function* getOrganizationsWatcher() :Saga<*> {

  yield takeEvery(GET_ORGANIZATIONS, getOrganizationsWorker);
}

export {
  getOrganizationsWatcher,
  getOrganizationsWorker,
};
