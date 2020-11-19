// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { Models } from 'lattice';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { DataUtils, LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { getFormNeighborsWorker } from './getFormNeighbors';
import { getPersonCaseNeighborsWorker } from './getPersonCaseNeighbors';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { APP_PATHS, NEIGHBOR_DIRECTIONS } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { NeighborUtils } from '../../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import {
  GET_PERSON_NEIGHBORS,
  getFormNeighbors,
  getPersonCaseNeighbors,
  getPersonNeighbors,
} from '../actions';

const { isDefined } = LangUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const {
  getAssociationDetails,
  getAssociationESID,
  getNeighborDetails,
  getNeighborESID,
} = NeighborUtils;
const { FQN } = Models;
const {
  APPEARS_IN,
  CASE,
  FORM,
  PEOPLE,
} = AppTypes;
const { DATETIME_ADMINISTERED, ROLE } = PropertyTypes;
const { DST, SRC } = NEIGHBOR_DIRECTIONS;

const LOG = new Logger('ProfileSagas');

/*
 *
 * ProfileActions.getPersonNeighbors()
 *
 */

function* getPersonNeighborsWorker(action :SequenceAction) :Saga<*> {

  const workerResponse = {};

  try {
    yield put(getPersonNeighbors.request(action.id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const { neighborESIDs, personEKID } = value;
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const filter = {
      entityKeyIds: [personEKID],
      destinationEntitySetIds: [],
      sourceEntitySetIds: [],
    };
    neighborESIDs.forEach((neighbor) => {
      if (neighbor.direction === DST) filter.destinationEntitySetIds.push(neighbor.entitySetId);
      if (neighbor.direction === SRC) filter.sourceEntitySetIds.push(neighbor.entitySetId);
    });

    const response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: peopleESID, filter })
    );
    if (response.error) throw response.error;

    const fqnsByESID :Map = yield select((store) => store.getIn(APP_PATHS.FQNS_BY_ESID));
    const appearsInESID :UUID = yield select(selectEntitySetId(APPEARS_IN));

    let personNeighborMap = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighborList :List) => {
        neighborList.forEach((neighbor :Map) => {
          const entity :Map = getNeighborDetails(neighbor);
          const caseEKID = getEntityKeyId(entity);

          const associationESID :UUID = getAssociationESID(neighbor);
          if (associationESID === appearsInESID) {
            const associationDetails :Map = getAssociationDetails(neighbor);
            const role :string = getPropertyValue(associationDetails, [ROLE, 0]);
            const roleMap = mutator.get(ROLE, Map()).set(caseEKID, role);
            mutator.set(ROLE, roleMap);
          }
          const neighborESID :UUID = getNeighborESID(neighbor);
          const neighborFqn :FQN = fqnsByESID.get(neighborESID);
          const entityList = mutator.get(neighborFqn, List()).push(entity);
          mutator.set(neighborFqn, entityList);
        });
      });
    });
    if (isDefined(personNeighborMap.get(CASE))) {
      const personCaseEKIDs :UUID[] = personNeighborMap.get(CASE)
        .map((personCase :Map) => getEntityKeyId(personCase))
        .toJS();
      yield call(getPersonCaseNeighborsWorker, getPersonCaseNeighbors(personCaseEKIDs));
    }

    const forms = personNeighborMap.get(FORM);
    if (isDefined(forms)) {
      personNeighborMap = personNeighborMap
        .set(FORM, forms.sortBy((status :Map) => status.getIn([DATETIME_ADMINISTERED, 0])).reverse());

      const formEKIDs :UUID[] = forms
        .map((form :Map) => getEntityKeyId(form))
        .toJS();
      yield call(getFormNeighborsWorker, getFormNeighbors(formEKIDs));
    }

    workerResponse.data = personNeighborMap;
    yield put(getPersonNeighbors.success(action.id, personNeighborMap));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getPersonNeighbors.failure(action.id, error));
  }
  finally {
    yield put(getPersonNeighbors.finally(action.id));
  }
  return workerResponse;
}

function* getPersonNeighborsWatcher() :Saga<*> {

  yield takeEvery(GET_PERSON_NEIGHBORS, getPersonNeighborsWorker);
}

export {
  getPersonNeighborsWatcher,
  getPersonNeighborsWorker,
};
