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
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph } from '../../../../core/data/actions';
import { submitDataGraphWorker } from '../../../../core/data/sagas';
import { AppTypes } from '../../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { formatNewEntityData } from '../../../../utils/data';
import { SUBMIT_ADDRESS, submitAddress } from '../actions';

const { LOCATION } = AppTypes;

const LOG = new Logger('ProfileSagas');

function* submitAddressWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(submitAddress.request(id));
    const { value } = action;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const { entityData } = value;
    const locationESID = yield select(selectEntitySetId(LOCATION));
    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const addressMap = get(entityData, locationESID);
    const addressEKID = addressMap ? Object.keys(addressMap)[0] : undefined;
    const addressData = addressMap && addressEKID ? addressMap[addressEKID] : undefined;
    const newAddress :Map = formatNewEntityData(addressData, propertyFqnsByTypeId, addressEKID);

    yield put(submitAddress.success(id, newAddress));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(submitAddress.failure(id, error));
  }
  finally {
    yield put(submitAddress.finally(id));
  }
  return workerResponse;
}

function* submitAddressWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_ADDRESS, submitAddressWorker);
}

export {
  submitAddressWatcher,
  submitAddressWorker,
};
