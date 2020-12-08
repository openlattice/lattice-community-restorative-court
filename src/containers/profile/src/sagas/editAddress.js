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
import { EDIT_ADDRESS, editAddress } from '../actions';

const { LOCATION } = AppTypes;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.editAddress()
 *
 */

function* editAddressWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(editAddress.request(id));
    const { value } = action;

    const { entityData } = value;
    const response :Object = yield call(submitPartialReplaceWorker, submitPartialReplace({ entityData }));
    if (response.error) throw response.error;

    const locationESID = yield select(selectEntitySetId(LOCATION));
    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const addressMap = get(entityData, locationESID);
    const addressEKID = addressMap ? Object.keys(addressMap)[0] : undefined;
    const addressData = addressMap && addressEKID ? addressMap[addressEKID] : undefined;
    const newAddress :Map = formatNewEntityData(addressData, propertyFqnsByTypeId, addressEKID);

    workerResponse = { data: newAddress };
    yield put(editAddress.success(id, newAddress));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(editAddress.failure(id, error));
  }
  finally {
    yield put(editAddress.finally(id));
  }
  return workerResponse;
}

function* editAddressWatcher() :Saga<*> {

  yield takeEvery(EDIT_ADDRESS, editAddressWorker);
}

export {
  editAddressWatcher,
  editAddressWorker,
};
