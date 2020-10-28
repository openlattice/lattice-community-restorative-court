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

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { NeighborUtils, getPropertyValue } from '../../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { APP_PATHS } from '../../../app/constants';
import { GET_PERSON_CASE_NEIGHBORS, getPersonCaseNeighbors } from '../actions';

const { isDefined } = LangUtils;
const { getEntityKeyId } = DataUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getNeighborDetails, getNeighborESID } = NeighborUtils;
const { FQN } = Models;
const { EFFECTIVE_DATE, TYPE } = PropertyTypes;
const {
  CASE,
  PEOPLE,
  ROLE,
  STATUS,
} = AppTypes;

const LOG = new Logger('ProfileSagas');

/*
 *
 * ProfileActions.getPersonCaseNeighbors()
 *
 */

function* getPersonCaseNeighborsWorker(action :SequenceAction) :Saga<*> {

  const workerResponse = {};

  try {
    yield put(getPersonCaseNeighbors.request(action.id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const { personCaseEKIDs, personEKID } = value;

    const caseESID :UUID = yield select(selectEntitySetId(CASE));
    const roleESID :UUID = yield select(selectEntitySetId(ROLE));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    let filter = {
      entityKeyIds: personCaseEKIDs,
      destinationEntitySetIds: [roleESID, statusESID],
      sourceEntitySetIds: [],
    };

    let response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: caseESID, filter })
    );
    if (response.error) throw response.error;

    const roleEKIDs = [];

    const fqnsByESID :Map = yield select((store) => store.getIn(APP_PATHS.FQNS_BY_ESID));

    const caseByRoleEKID :Map = Map().asMutable();

    const personCaseNeighborMap = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighborList :List, caseEKID :UUID) => {
        neighborList.forEach((neighbor :Map) => {
          const neighborESID :UUID = getNeighborESID(neighbor);
          const neighborFqn :FQN = fqnsByESID.get(neighborESID);
          const entity :Map = getNeighborDetails(neighbor);
          const entityEKID = getEntityKeyId(entity);
          if (neighborESID === roleESID) {
            roleEKIDs.push(entityEKID);
            const roleName = getPropertyValue(entity, TYPE);
            caseByRoleEKID.set(entityEKID, { caseEKID, roleName });
          }
          const entityList = mutator.get(neighborFqn, List()).push(entity);
          mutator.set(neighborFqn, entityList);
        });
        if (isDefined(mutator.get(STATUS))) {
          mutator.set(STATUS, mutator.get(STATUS).sortBy((status :Map) => status.getIn([EFFECTIVE_DATE, 0])));
        }
      });
    });

    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));

    filter = {
      entityKeyIds: roleEKIDs,
      destinationEntitySetIds: [],
      sourceEntitySetIds: [peopleESID],
    };

    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: roleESID, filter })
    );
    if (response.error) throw response.error;

    let personRoleByCaseEKID = Map().asMutable();

    const peopleInCaseByRoleEKIDMap = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighborList :List, roleEKID :UUID) => {
        const personInCase :Map = neighborList.get(0);
        const personInCaseEKID :?UUID = getEntityKeyId(personInCase);
        if (personInCaseEKID === personEKID) {
          const { caseEKID, roleName } = caseByRoleEKID.get(roleEKID);
          personRoleByCaseEKID.set(caseEKID, roleName);
        }
        mutator.set(roleEKID, personInCase);
      });
    });

    personRoleByCaseEKID = personRoleByCaseEKID.asImmutable();

    workerResponse.data = { peopleInCaseByRoleEKIDMap, personCaseNeighborMap };
    yield put(getPersonCaseNeighbors.success(action.id, {
      peopleInCaseByRoleEKIDMap,
      personCaseNeighborMap,
      personRoleByCaseEKID,
    }));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getPersonCaseNeighbors.failure(action.id, error));
  }
  finally {
    yield put(getPersonCaseNeighbors.finally(action.id));
  }
  return workerResponse;
}

function* getPersonCaseNeighborsWatcher() :Saga<*> {

  yield takeEvery(GET_PERSON_CASE_NEIGHBORS, getPersonCaseNeighborsWorker);
}

export {
  getPersonCaseNeighborsWatcher,
  getPersonCaseNeighborsWorker,
};
