// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map, getIn } from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph } from '../../../core/data/actions';
import { submitDataGraphWorker } from '../../../core/data/sagas';
import { AppTypes } from '../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../core/redux/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { formatNewEntityData } from '../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../utils/error/constants';
import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation } from '../actions';

const { isDefined } = LangUtils;
const {
  COMMUNICATION,
  FORM,
  PEACEMAKER_STATUS,
  PERSON_DETAILS,
} = AppTypes;

const LOG = new Logger('PeacemakerSagas');
/*
 *
 * PeacemakerActions.addPeacemakerInformation()
 *
 */

function* addPeacemakerInformationWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(addPeacemakerInformation.request(id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const { entityKeyIds } = response.data;
    const { entityData } = value;

    const communicationESID = yield select(selectEntitySetId(COMMUNICATION));
    const formESID = yield select(selectEntitySetId(FORM));
    const personDetailsESID = yield select(selectEntitySetId(PERSON_DETAILS));
    const peacemakerStatusESID = yield select(selectEntitySetId(PEACEMAKER_STATUS));

    const communicationEKID = getIn(entityKeyIds, [communicationESID, 0]);
    const formEKID = getIn(entityKeyIds, [formESID, 0]);
    const personDetailsEKID = getIn(entityKeyIds, [personDetailsESID, 0]);
    const peacemakerStatusEKID = getIn(entityKeyIds, [peacemakerStatusESID, 0]);

    const communicationData = getIn(entityData, [communicationESID, 0]);
    const formData = getIn(entityData, [formESID, 0]);
    const personDetailsData = getIn(entityData, [personDetailsESID, 0]);
    const peacemakerStatusData = getIn(entityData, [peacemakerStatusESID, 0]);

    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const newCommunication :Map = formatNewEntityData(communicationData, propertyFqnsByTypeId, communicationEKID);
    const newForm :Map = formatNewEntityData(formData, propertyFqnsByTypeId, formEKID);
    const newPersonDetails :Map = formatNewEntityData(personDetailsData, propertyFqnsByTypeId, personDetailsEKID);
    const newPeacemakerStatus :Map = formatNewEntityData(
      peacemakerStatusData,
      propertyFqnsByTypeId,
      peacemakerStatusEKID
    );

    yield put(addPeacemakerInformation.success(id, {
      newCommunication,
      newForm,
      newPeacemakerStatus,
      newPersonDetails,
    }));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(addPeacemakerInformation.failure(id, error));
  }
  finally {
    yield put(addPeacemakerInformation.finally(id));
  }
  return workerResponse;
}

function* addPeacemakerInformationWatcher() :Saga<*> {

  yield takeEvery(ADD_PEACEMAKER_INFORMATION, addPeacemakerInformationWorker);
}

export {
  addPeacemakerInformationWatcher,
  addPeacemakerInformationWorker,
};
