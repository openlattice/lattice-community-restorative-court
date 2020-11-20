// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map } from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph } from '../../../../core/data/actions';
import { submitDataGraphWorker } from '../../../../core/data/sagas';
import { AppTypes } from '../../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { EntityUtils } from '../../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { ADD_CASE_STATUS, addCaseStatus } from '../actions';

const { isDefined } = LangUtils;
const { formatNewEntityData } = EntityUtils;
const { STATUS } = AppTypes;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.addCaseStatus()
 *
 */

function* addCaseStatusWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(addCaseStatus.request(id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const { associationEntityData, entityData } = value;
    const response :Object = yield call(submitDataGraphWorker, submitDataGraph({ associationEntityData, entityData }));
    if (response.error) throw response.error;

    const { entityKeyIds } = response.data;
    const { caseEKID, selectedStaffEKID } = value;

    const statusESID :UUID = yield select(selectEntitySetId(STATUS));
    const statusEKID :UUID = entityKeyIds[statusESID][0];

    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const newStatus :Map = formatNewEntityData(entityData[statusESID][0], propertyFqnsByTypeId, statusEKID);

    yield put(addCaseStatus.success(id, { caseEKID, newStatus, selectedStaffEKID }));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(addCaseStatus.failure(id, error));
  }
  finally {
    yield put(addCaseStatus.finally(id));
  }
  return workerResponse;
}

function* addCaseStatusWatcher() :Saga<*> {

  yield takeEvery(ADD_CASE_STATUS, addCaseStatusWorker);
}

export {
  addCaseStatusWatcher,
  addCaseStatusWorker,
};
