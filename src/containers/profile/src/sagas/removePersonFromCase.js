// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { DataUtils, LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { deleteEntities } from '../../../../core/data/actions';
import { deleteEntitiesWorker } from '../../../../core/data/sagas';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { getAssociationDetails, getNeighborDetails } from '../../../../utils/data';
import { REMOVE_PERSON_FROM_CASE, removePersonFromCase } from '../actions';

const { APPEARS_IN, CRC_CASE, STAFF } = AppTypes;
const { ROLE } = PropertyTypes;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;

const LOG = new Logger('ProfileSagas');

function* removePersonFromCaseWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id, value } = action;
  let workerResponse :WorkerResponse;

  try {
    yield put(removePersonFromCase.request(id));
    const { caseEKID, personEKID } = value;

    const appearsInESID = yield select(selectEntitySetId(APPEARS_IN));
    const crcCaseESID = yield select(selectEntitySetId(CRC_CASE));
    const staffESID = yield select(selectEntitySetId(STAFF));
    const filter = {
      entityKeyIds: [caseEKID],
      destinationEntitySetIds: [],
      sourceEntitySetIds: [staffESID],
    };

    let response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: crcCaseESID, filter })
    );
    if (response.error) throw response.error;
    workerResponse = { data: response.data };

    const peopleNeighbors :List = fromJS(response.data[caseEKID]);
    const selectedPersonNeighbor :?Map = peopleNeighbors
      .find((neighbor :Map) => getEntityKeyId(getNeighborDetails(neighbor)) === personEKID);

    let personRole :string = '';

    if (isDefined(selectedPersonNeighbor)) {

      const appearsInAssociation :Map = getAssociationDetails(selectedPersonNeighbor);
      personRole = getPropertyValue(appearsInAssociation, [ROLE, 0]);
      const appearsInEKID :?UUID = getEntityKeyId(getAssociationDetails(selectedPersonNeighbor));
      const associationToDelete = [{ entitySetId: appearsInESID, entityKeyIds: [appearsInEKID] }];

      response = yield call(deleteEntitiesWorker, deleteEntities(associationToDelete));
      if (response.error) throw response.error;
      workerResponse = { data: response.data };
    }

    yield put(removePersonFromCase.success(id, { caseEKID, personEKID, personRole }));
  }
  catch (error) {
    workerResponse = { error };
    LOG.error(action.type, error);
    yield put(removePersonFromCase.failure(id, error));
  }
  finally {
    yield put(removePersonFromCase.finally(id));
  }
  return workerResponse;
}

function* removePersonFromCaseWatcher() :Saga<*> {

  yield takeEvery(REMOVE_PERSON_FROM_CASE, removePersonFromCaseWorker);
}

export {
  removePersonFromCaseWatcher,
  removePersonFromCaseWorker,
};
