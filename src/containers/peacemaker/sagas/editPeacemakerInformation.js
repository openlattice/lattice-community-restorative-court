// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  get,
} from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { submitPartialReplace } from '../../../core/data/actions';
import { submitPartialReplaceWorker } from '../../../core/data/sagas';
import { AppTypes } from '../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../core/redux/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../utils/error/constants';
import { EDIT_PEACEMAKER_INFORMATION, editPeacemakerInformation } from '../actions';

const { isDefined } = LangUtils;
const { COMMUNICATION, FORM, PERSON_DETAILS } = AppTypes;

const LOG = new Logger('PeacemakerSagas');

const formatNewEntityData = (data :Object, propertyFqnsByTypeId :Map) :Map => (
  Map().withMutations((mutator :Map) => {
    fromJS(data).forEach((entityValue :List, propertyTypeId :UUID) => {
      const propertyFqn = propertyFqnsByTypeId.get(propertyTypeId);
      mutator.set(propertyFqn, entityValue);
    });
  })
);

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

    const communicationData = get(entityData, communicationESID);
    const formData = get(entityData, formESID);
    const personDetailsData = get(entityData, personDetailsESID);

    const communicationEKID = Object.keys(communicationData)[0];
    const formEKID = Object.keys(formData)[0];
    const personDetailsEKID = Object.keys(personDetailsData)[0];

    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const newCommunication :Map = formatNewEntityData(communicationData[communicationEKID], propertyFqnsByTypeId);
    const newForm :Map = formatNewEntityData(formData[formEKID], propertyFqnsByTypeId);
    const newPersonDetails :Map = formatNewEntityData(personDetailsData[personDetailsEKID], propertyFqnsByTypeId);

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
