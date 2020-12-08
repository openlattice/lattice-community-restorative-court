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
import { SUBMIT_CONTACT, submitContact } from '../actions';

const { CONTACT_INFO } = AppTypes;

const LOG = new Logger('ProfileSagas');

function* submitContactWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(submitContact.request(id));
    const { value } = action;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const { entityData } = value;
    const contactInfoESID = yield select(selectEntitySetId(CONTACT_INFO));
    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const contactMap = get(entityData, contactInfoESID);
    const contactEKID = contactMap ? Object.keys(contactMap)[0] : undefined;
    const contactData = contactMap && contactEKID ? contactMap[contactEKID] : undefined;
    const newContact :Map = formatNewEntityData(contactData, propertyFqnsByTypeId, contactEKID);

    yield put(submitContact.success(id, newContact));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(submitContact.failure(id, error));
  }
  finally {
    yield put(submitContact.finally(id));
  }
  return workerResponse;
}

function* submitContactWatcher() :Saga<*> {

  yield takeEvery(SUBMIT_CONTACT, submitContactWorker);
}

export {
  submitContactWatcher,
  submitContactWorker,
};
