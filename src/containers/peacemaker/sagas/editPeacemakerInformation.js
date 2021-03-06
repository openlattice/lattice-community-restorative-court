// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  Map,
  get,
  getIn,
  remove,
  setIn,
} from 'immutable';
import { LangUtils, Logger } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph, submitPartialReplace } from '../../../core/data/actions';
import { submitDataGraphWorker, submitPartialReplaceWorker } from '../../../core/data/sagas';
import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../core/redux/constants';
import { selectEntitySetId, selectPropertyTypeId } from '../../../core/redux/selectors';
import { formatNewEntityData } from '../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../utils/error/constants';
import { EDIT_PEACEMAKER_INFORMATION, editPeacemakerInformation } from '../actions';

const { isDefined } = LangUtils;
const {
  COMMUNICATION,
  FORM,
  HAS,
  PEACEMAKER_STATUS,
  PEOPLE,
  PERSON_DETAILS,
} = AppTypes;
const { EFFECTIVE_DATE, GENERAL_DATETIME, STATUS } = PropertyTypes;

const LOG = new Logger('PeacemakerSagas');

function* editPeacemakerInformationWorker(action :SequenceAction) :Saga<*> {
  const { id, value } = action;

  try {
    yield put(editPeacemakerInformation.request(id));
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const {
      entityData,
      formEKID,
      peacemakerStatusEKID,
      personEKID,
    } = value;

    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const formESID = yield select(selectEntitySetId(FORM));
    const generalDateTimePTID = yield select(selectPropertyTypeId(GENERAL_DATETIME));
    const dateTrained = getIn(entityData, [formESID, formEKID, generalDateTimePTID, 0]);
    const now = DateTime.local();
    let updatedEntityData = entityData;
    if (isDefined(dateTrained)) {
      const dateTimeTrained = DateTime.fromSQL(dateTrained.concat(' ', now.toISOTime())).toISO();
      updatedEntityData = setIn(updatedEntityData, [formESID, formEKID, generalDateTimePTID, 0], dateTimeTrained);
    }

    let newPeacemakerStatus :Map = Map();
    const peacemakerStatusESID = yield select(selectEntitySetId(PEACEMAKER_STATUS));
    const statusPTID = yield select(selectPropertyTypeId(STATUS));
    const peacemakerStatus = getIn(entityData, [peacemakerStatusESID, peacemakerStatusEKID, statusPTID, 0]);
    if (isDefined(peacemakerStatus)) {
      const effectiveDatePTID = yield select(selectPropertyTypeId(EFFECTIVE_DATE));
      const entityDataToSubmit = {
        [peacemakerStatusESID]: [{
          [statusPTID]: [peacemakerStatus],
          [effectiveDatePTID]: [now.toISO()]
        }]
      };
      updatedEntityData = remove(updatedEntityData, peacemakerStatusESID);
      // updatedEntityData = removeIn(updatedEntityData, [peacemakerStatusESID, peacemakerStatusEKID, statusPTID, 0]);
      // updatedEntityData = removeIn(
      //   updatedEntityData,
      //   [peacemakerStatusESID, peacemakerStatusEKID, effectiveDatePTID, 0]
      // );
      const hasESID = yield select(selectEntitySetId(HAS));
      const peopleESID = yield select(selectEntitySetId(PEOPLE));
      const associationEntityData = {
        [hasESID]: [{
          data: {},
          srcEntitySetId: peopleESID,
          srcEntityKeyId: personEKID,
          dstEntitySetId: peacemakerStatusESID,
          dstEntityIndex: 0,
        }]
      };
      const response :Object = yield call(
        submitDataGraphWorker,
        submitDataGraph({ associationEntityData, entityData: entityDataToSubmit })
      );
      if (response.error) throw response.error;
      const { entityKeyIds } = response.data;
      const newStatusEKID = getIn(entityKeyIds, [peacemakerStatusESID, 0]);
      newPeacemakerStatus = formatNewEntityData(
        getIn(entityDataToSubmit, [peacemakerStatusESID, 0]),
        propertyFqnsByTypeId,
        newStatusEKID
      );
    }

    const response :Object = yield call(
      submitPartialReplaceWorker,
      submitPartialReplace({ entityData: updatedEntityData })
    );
    if (response.error) throw response.error;

    const communicationESID = yield select(selectEntitySetId(COMMUNICATION));
    const personDetailsESID = yield select(selectEntitySetId(PERSON_DETAILS));

    const communicationMap = get(entityData, communicationESID);
    const formMap = get(entityData, formESID);
    const personDetailsMap = get(entityData, personDetailsESID);

    const communicationEKID = communicationMap ? Object.keys(communicationMap)[0] : undefined;
    // const formEKID = formMap ? Object.keys(formMap)[0] : undefined;
    const personDetailsEKID = personDetailsMap ? Object.keys(personDetailsMap)[0] : undefined;

    const communicationData = communicationMap && communicationEKID ? communicationMap[communicationEKID] : undefined;
    const formData = formMap && formEKID ? formMap[formEKID] : undefined;
    const personDetailsData = personDetailsMap && personDetailsEKID ? personDetailsMap[personDetailsEKID] : undefined;

    const newCommunication :Map = formatNewEntityData(communicationData, propertyFqnsByTypeId);
    const newForm :Map = formatNewEntityData(formData, propertyFqnsByTypeId);
    const newPersonDetails :Map = formatNewEntityData(personDetailsData, propertyFqnsByTypeId);

    yield put(editPeacemakerInformation.success(id, {
      newCommunication,
      newForm,
      newPeacemakerStatus,
      newPersonDetails,
    }));
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
