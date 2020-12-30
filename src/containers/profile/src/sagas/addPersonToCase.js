// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { createOrReplaceAssociation } from '../../../../core/data/actions';
import { createOrReplaceAssociationWorker } from '../../../../core/data/sagas';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { selectEntitySetId, selectPropertyTypeId } from '../../../../core/redux/selectors';
import { ADD_PERSON_TO_CASE, addPersonToCase } from '../actions';
import { SearchContextConstants } from '../constants';

const {
  APPEARS_IN,
  CRC_CASE,
  ORGANIZATIONS,
  PEOPLE,
  STAFF,
} = AppTypes;
const { ROLE } = PropertyTypes;
const { ORGS_CONTEXT, STAFF_CONTEXT } = SearchContextConstants;

const LOG = new Logger('ProfileSagas');

function* addPersonToCaseWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id, value } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(addPersonToCase.request(id));
    const {
      caseEKID,
      entityEKID,
      role,
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

    const rolePTID = yield select(selectPropertyTypeId(ROLE));

    const associations = {
      [appearsInESID]: [
        {
          data: { [rolePTID]: [role] },
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

    yield put(addPersonToCase.success(id, { caseEKID, person: selectedPerson, role }));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(addPersonToCase.failure(id, error));
  }
  finally {
    yield put(addPersonToCase.finally(id));
  }
  return workerResponse;
}

function* addPersonToCaseWatcher() :Saga<*> {

  yield takeEvery(ADD_PERSON_TO_CASE, addPersonToCaseWorker);
}

export {
  addPersonToCaseWatcher,
  addPersonToCaseWorker,
};
