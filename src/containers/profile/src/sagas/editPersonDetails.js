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
import { EDIT_PERSON_DETAILS, editPersonDetails } from '../actions';

const { PERSON_DETAILS } = AppTypes;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.editPersonDetails()
 *
 */

function* editPersonDetailsWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(editPersonDetails.request(id));
    const { value } = action;

    const { entityData } = value;
    const response :Object = yield call(submitPartialReplaceWorker, submitPartialReplace({ entityData }));
    if (response.error) throw response.error;

    const personDetailsESID = yield select(selectEntitySetId(PERSON_DETAILS));
    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const personDetailsMap = get(entityData, personDetailsESID);
    const personDetailsEKID = personDetailsMap ? Object.keys(personDetailsMap)[0] : undefined;
    const personDetailsData = personDetailsMap && personDetailsEKID ? personDetailsMap[personDetailsEKID] : undefined;
    const newPersonDetails :Map = formatNewEntityData(personDetailsData, propertyFqnsByTypeId);
    console.log('newPersonDetails ', newPersonDetails.toJS());

    workerResponse = { data: newPersonDetails };
    yield put(editPersonDetails.success(id, newPersonDetails));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(editPersonDetails.failure(id, error));
  }
  finally {
    yield put(editPersonDetails.finally(id));
  }
  return workerResponse;
}

function* editPersonDetailsWatcher() :Saga<*> {

  yield takeEvery(EDIT_PERSON_DETAILS, editPersonDetailsWorker);
}

export {
  editPersonDetailsWatcher,
  editPersonDetailsWorker,
};
