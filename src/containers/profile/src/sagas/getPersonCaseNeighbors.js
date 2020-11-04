// @flow

import {
  all,
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
const { EFFECTIVE_DATE } = PropertyTypes;
const {
  CASE,
  FORM,
  PEOPLE,
  REFERRAL_REQUEST,
  ROLE,
  STAFF,
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
    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const roleESID :UUID = yield select(selectEntitySetId(ROLE));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    const filter = {
      entityKeyIds: personCaseEKIDs,
      destinationEntitySetIds: [roleESID, statusESID],
      sourceEntitySetIds: [formESID],
    };

    const response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: caseESID, filter })
    );
    if (response.error) throw response.error;

    const roleEKIDs = [];
    const statusEKIDs = [];

    const fqnsByESID :Map = yield select((store) => store.getIn(APP_PATHS.FQNS_BY_ESID));

    const caseByRoleEKID :Map = Map().asMutable();

    let personCaseNeighborMap = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighborList :List, caseEKID :UUID) => {
        neighborList.forEach((neighbor :Map) => {
          const neighborESID :UUID = getNeighborESID(neighbor);
          const neighborFqn :FQN = fqnsByESID.get(neighborESID);
          const entity :Map = getNeighborDetails(neighbor);
          const entityEKID = getEntityKeyId(entity);
          if (neighborESID === roleESID) {
            roleEKIDs.push(entityEKID);
            const roleName = getPropertyValue(entity, PropertyTypes.STATUS);
            caseByRoleEKID.set(entityEKID, { caseEKID, roleName });
          }
          if (neighborESID === statusESID) {
            statusEKIDs.push(entityEKID);
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
    const staffESID :UUID = yield select(selectEntitySetId(STAFF));
    const referralRequestESID :UUID = yield select(selectEntitySetId(REFERRAL_REQUEST));

    const roleFilter = {
      entityKeyIds: roleEKIDs,
      destinationEntitySetIds: [],
      sourceEntitySetIds: [peopleESID],
    };
    const statusFilter = {
      entityKeyIds: statusEKIDs,
      destinationEntitySetIds: [],
      sourceEntitySetIds: [referralRequestESID, staffESID],
    };

    const [roleResponse, statusResponse] = yield all([
      call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId: roleESID, filter: roleFilter })
      ),
      call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId: statusESID, filter: statusFilter })
      ),
    ]);
    if (roleResponse.error) throw roleResponse.error;
    if (statusResponse.error) throw statusResponse.error;

    /*
     * role-related maps
     */

    let personRoleByCaseEKID = Map().asMutable();
    const peopleInCaseByRoleEKIDMap = Map().withMutations((mutator :Map) => {
      fromJS(roleResponse.data).forEach((neighborList :List, roleEKID :UUID) => {
        const personInCase :Map = getNeighborDetails(neighborList.get(0));
        const personInCaseEKID :?UUID = getEntityKeyId(personInCase);
        if (personInCaseEKID === personEKID) {
          const { caseEKID, roleName } = caseByRoleEKID.get(roleEKID);
          personRoleByCaseEKID.set(caseEKID, roleName);
        }
        mutator.set(roleEKID, personInCase);
      });
    });
    personRoleByCaseEKID = personRoleByCaseEKID.asImmutable();

    /*
     * status-related maps
     */

    const statusNeighbors :Map = fromJS(statusResponse.data);
    const referralRequest :Map = statusNeighbors.find((neighborList :List) => {
      const entity = neighborList.find((neighbor :Map) => getNeighborESID(neighbor) === referralRequestESID);
      if (isDefined(entity)) return getNeighborDetails(entity);
      return undefined;
    });
    personCaseNeighborMap = personCaseNeighborMap.set(REFERRAL_REQUEST, List([referralRequest]));

    const staffMemberByStatusEKID :Map = Map().withMutations((mutator :Map) => {
      statusNeighbors.forEach((neighborList :List, statusEKID :UUID) => {
        const onlyStaffNeighbors = neighborList.filter((neighbor :Map) => getNeighborESID(neighbor) === staffESID);
        const staffMember = onlyStaffNeighbors.get(0);
        if (isDefined(staffMember)) {
          mutator.set(statusEKID, getNeighborDetails(staffMember));
        }
      });
    });

    workerResponse.data = { peopleInCaseByRoleEKIDMap, personCaseNeighborMap };
    yield put(getPersonCaseNeighbors.success(action.id, {
      peopleInCaseByRoleEKIDMap,
      personCaseNeighborMap,
      personRoleByCaseEKID,
      staffMemberByStatusEKID,
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
