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
import { EDIT_CONTACT, editContact } from '../actions';

const { CONTACT_INFO } = AppTypes;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.editContact()
 *
 */

function* editContactWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(editContact.request(id));
    const { value } = action;

    const { entityData } = value;
    const response :Object = yield call(submitPartialReplaceWorker, submitPartialReplace({ entityData }));
    if (response.error) throw response.error;

    const contactInfoESID = yield select(selectEntitySetId(CONTACT_INFO));
    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const contactMap = get(entityData, contactInfoESID);
    const contactEKID = contactMap ? Object.keys(contactMap)[0] : undefined;
    const contactData = contactMap && contactEKID ? contactMap[contactEKID] : undefined;
    const newContact :Map = formatNewEntityData(contactData, propertyFqnsByTypeId, contactEKID);

    workerResponse = { data: newContact };
    yield put(editContact.success(id, newContact));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(editContact.failure(id, error));
  }
  finally {
    yield put(editContact.finally(id));
  }
  return workerResponse;
}

function* editContactWatcher() :Saga<*> {

  yield takeEvery(EDIT_CONTACT, editContactWorker);
}

export {
  editContactWatcher,
  editContactWorker,
};
