// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph } from '../../../core/data/actions';
import { submitDataGraphWorker } from '../../../core/data/sagas';
import { AppTypes } from '../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../core/redux/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { formatNewEntityData } from '../../../utils/data';
import { ADD_STAFF, addStaff } from '../actions';

const { STAFF } = AppTypes;

const LOG = new Logger('DashboardSagas');

/*
 *
 * DashboardActions.addStaff()
 *
 */

function* addStaffWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(addStaff.request(id));
    const { value } = action;
    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const { entityData } = value;
    const { entityKeyIds } = response.data;

    const staffESID :UUID = yield select(selectEntitySetId(STAFF));
    const staffEKID :UUID = entityKeyIds[staffESID][0];

    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const newStaffMember :Map = formatNewEntityData(entityData[staffESID][0], propertyFqnsByTypeId, staffEKID);

    yield put(addStaff.success(id, newStaffMember));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(addStaff.failure(id, error));
  }
  finally {
    yield put(addStaff.finally(id));
  }
  return workerResponse;
}

function* addStaffWatcher() :Saga<*> {

  yield takeEvery(ADD_STAFF, addStaffWorker);
}

export {
  addStaffWatcher,
  addStaffWorker,
};
