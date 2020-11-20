// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map, get } from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { submitPartialReplace } from '../../../core/data/actions';
import { submitPartialReplaceWorker } from '../../../core/data/sagas';
import { AppTypes } from '../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../core/redux/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { EntityUtils } from '../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../utils/error/constants';
import { EDIT_PEACEMAKER_INFORMATION, editPeacemakerInformation } from '../actions';

const { isDefined } = LangUtils;
const { formatNewEntityData } = EntityUtils;
const { COMMUNICATION, FORM, PERSON_DETAILS } = AppTypes;

const LOG = new Logger('PeacemakerSagas');

function* editPeacemakerInformationWorker(action :SequenceAction) :Saga<*> {
  const { id, value } = action;

  try {
    yield put(editPeacemakerInformation.request(id));
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const { entityData } = value;
    const response :Object = yield call(submitPartialReplaceWorker, submitPartialReplace({ entityData }));
    if (response.error) throw response.error;

    const communicationESID = yield select(selectEntitySetId(COMMUNICATION));
    const formESID = yield select(selectEntitySetId(FORM));
    const personDetailsESID = yield select(selectEntitySetId(PERSON_DETAILS));

    const communicationMap = get(entityData, communicationESID);
    const formMap = get(entityData, formESID);
    const personDetailsMap = get(entityData, personDetailsESID);

    const communicationEKID = communicationMap ? Object.keys(communicationMap)[0] : undefined;
    const formEKID = formMap ? Object.keys(formMap)[0] : undefined;
    const personDetailsEKID = personDetailsMap ? Object.keys(personDetailsMap)[0] : undefined;

    const communicationData = communicationMap && communicationEKID ? communicationMap[communicationEKID] : undefined;
    const formData = formMap && formEKID ? formMap[formEKID] : undefined;
    const personDetailsData = personDetailsMap && personDetailsEKID ? personDetailsMap[personDetailsEKID] : undefined;

    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const newCommunication :Map = formatNewEntityData(communicationData, propertyFqnsByTypeId);
    const newForm :Map = formatNewEntityData(formData, propertyFqnsByTypeId);
    const newPersonDetails :Map = formatNewEntityData(personDetailsData, propertyFqnsByTypeId);

    yield put(editPeacemakerInformation.success(id, { newCommunication, newForm, newPersonDetails }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(editPeacemakerInformation.failure(id, error));
  }
  finally {
    yield put(editPeacemakerInformation.finally(id));
  }
}

function* editPeacemakerInformationWatcher() :Saga<*> {

  yield takeEvery(EDIT_PEACEMAKER_INFORMATION, editPeacemakerInformationWorker);
}

export {
  editPeacemakerInformationWatcher,
  editPeacemakerInformationWorker,
};