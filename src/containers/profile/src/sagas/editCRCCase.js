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
import { EDIT_CRC_CASE, editCRCCase } from '../actions';

const { CRC_CASE } = AppTypes;

const LOG = new Logger('ProfileSagas');

function* editCRCCaseWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(editCRCCase.request(id));
    const { value } = action;

    const { entityData } = value;
    const response :Object = yield call(submitPartialReplaceWorker, submitPartialReplace({ entityData }));
    if (response.error) throw response.error;

    const crcCaseESID = yield select(selectEntitySetId(CRC_CASE));
    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const crcCaseMap = get(entityData, crcCaseESID);
    const crcCaseEKID = crcCaseMap ? Object.keys(crcCaseMap)[0] : undefined;
    const crcCaseData = crcCaseMap && crcCaseEKID ? crcCaseMap[crcCaseEKID] : undefined;
    const newCRCCase :Map = formatNewEntityData(crcCaseData, propertyFqnsByTypeId);

    workerResponse = { data: newCRCCase };
    yield put(editCRCCase.success(id, { crcCaseEKID, newCRCCase }));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(editCRCCase.failure(id, error));
  }
  finally {
    yield put(editCRCCase.finally(id));
  }
  return workerResponse;
}

function* editCRCCaseWatcher() :Saga<*> {

  yield takeEvery(EDIT_CRC_CASE, editCRCCaseWorker);
}

export {
  editCRCCaseWatcher,
  editCRCCaseWorker,
};
