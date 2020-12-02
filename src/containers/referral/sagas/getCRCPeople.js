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
import { GET_CRC_PEOPLE, getCRCPeople } from '../actions';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { PEOPLE } = AppTypes;

const LOG = new Logger('ReferralSagas');

function* getCRCPeopleWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getCRCPeople.request(id));

    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const response = yield call(
      getEntitySetDataWorker, getEntitySetData({ entitySetId: peopleESID })
    );
    if (response.error) throw response.error;
    const crcPeople :List = fromJS(response.data);

    workerResponse.data = crcPeople;
    yield put(getCRCPeople.success(id, crcPeople));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getCRCPeople.failure(id, error));
  }
  finally {
    yield put(getCRCPeople.finally(id));
  }
  return workerResponse;
}

function* getCRCPeopleWatcher() :Saga<*> {

  yield takeEvery(GET_CRC_PEOPLE, getCRCPeopleWorker);
}

export {
  getCRCPeopleWatcher,
  getCRCPeopleWorker,
};
