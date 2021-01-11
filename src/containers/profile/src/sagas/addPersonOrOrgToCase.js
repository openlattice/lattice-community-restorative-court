// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { getIn } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { createOrReplaceAssociation } from '../../../../core/data/actions';
import { createOrReplaceAssociationWorker } from '../../../../core/data/sagas';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { selectEntitySetId, selectPropertyTypeId } from '../../../../core/redux/selectors';
import { updateFormWithDateAsDateTime } from '../../../../utils/form';
import { ADD_PERSON_OR_ORG_TO_CASE, addPersonOrOrgToCase } from '../actions';
import { SearchContextConstants } from '../constants';

const {
  APPEARS_IN,
  CRC_CASE,
  ORGANIZATIONS,
  PEOPLE,
  STAFF,
} = AppTypes;
const { GENERAL_DATETIME, ROLE } = PropertyTypes;
const { ORGS_CONTEXT, STAFF_CONTEXT } = SearchContextConstants;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const LOG = new Logger('ProfileSagas');

function* addPersonOrOrgToCaseWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id, value } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(addPersonOrOrgToCase.request(id));
    const {
      caseEKID,
      entityEKID,
      formData,
      searchContext,
    } = value;

    const appearsInESID = yield select(selectEntitySetId(APPEARS_IN));
    const crcCaseESID = yield select(selectEntitySetId(CRC_CASE));
    const peopleESID = yield select(selectEntitySetId(PEOPLE));
    const staffESID = yield select(selectEntitySetId(STAFF));
    const organizationsESID = yield select(selectEntitySetId(ORGANIZATIONS));

    let srcESID = peopleESID;
    if (searchContext === STAFF_CONTEXT) {
      srcESID = staffESID;
    }
    if (searchContext === ORGS_CONTEXT) {
      srcESID = organizationsESID;
    }

    const generalDateTimePTID = yield select(selectPropertyTypeId(GENERAL_DATETIME));
    const rolePTID = yield select(selectPropertyTypeId(ROLE));

    const dateAssignedPath = [
      getPageSectionKey(1, 1),
      getEntityAddressKey(0, APPEARS_IN, GENERAL_DATETIME)
    ];

    const formDataWithDateTime = updateFormWithDateAsDateTime(formData, dateAssignedPath);
    const dateTimeAssigned = getIn(formDataWithDateTime, dateAssignedPath);
    const role = getIn(formDataWithDateTime, [getPageSectionKey(1, 1), getEntityAddressKey(0, APPEARS_IN, ROLE)]);

    const associations = {
      [appearsInESID]: [
        {
          data: {
            [generalDateTimePTID]: [dateTimeAssigned],
            [rolePTID]: [role]
          },
          src: {
            entitySetId: srcESID,
            entityKeyId: entityEKID
          },
          dst: {
            entitySetId: crcCaseESID,
            entityKeyId: caseEKID
          }
        }
      ]
    };

    const response :WorkerResponse = yield call(
      createOrReplaceAssociationWorker,
      createOrReplaceAssociation({ associations, associationsToDelete: [] })
    );
    if (response.error) throw response.error;
    workerResponse = { data: response.data };

    const { selectedPerson } = value;

    yield put(addPersonOrOrgToCase.success(id, { caseEKID, person: selectedPerson, role }));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(addPersonOrOrgToCase.failure(id, error));
  }
  finally {
    yield put(addPersonOrOrgToCase.finally(id));
  }
  return workerResponse;
}

function* addPersonOrOrgToCaseWatcher() :Saga<*> {

  yield takeEvery(ADD_PERSON_OR_ORG_TO_CASE, addPersonOrOrgToCaseWorker);
}

export {
  addPersonOrOrgToCaseWatcher,
  addPersonOrOrgToCaseWorker,
};
