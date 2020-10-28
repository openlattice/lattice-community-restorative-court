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

import { getPersonCaseNeighborsWorker } from './getPersonCaseNeighbors';

import { AppTypes } from '../../../../core/edm/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { NeighborUtils } from '../../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { APP_PATHS, NEIGHBOR_DIRECTIONS } from '../../../app/constants';
import { GET_PERSON_NEIGHBORS, getPersonCaseNeighbors, getPersonNeighbors } from '../actions';

const { isDefined } = LangUtils;
const { getEntityKeyId } = DataUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getNeighborDetails, getNeighborESID } = NeighborUtils;
const { FQN } = Models;
const { CASE, PEOPLE } = AppTypes;
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

    const personNeighborMap = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighborList :List) => {
        neighborList.forEach((neighbor :Map) => {
          const neighborESID :UUID = getNeighborESID(neighbor);
          const neighborFqn :FQN = fqnsByESID.get(neighborESID);
          const entity :Map = getNeighborDetails(neighbor);
          const entityList = mutator.get(neighborFqn, List()).push(entity);
          mutator.set(neighborFqn, entityList);
        });
      });
    });

    if (isDefined(personNeighborMap.get(CASE))) {
      const personCaseEKIDs :UUID[] = personNeighborMap.get(CASE)
        .map((personCase :Map) => getEntityKeyId(personCase))
        .toJS();
      yield call(getPersonCaseNeighborsWorker, getPersonCaseNeighbors({ personCaseEKIDs, personEKID }));
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
