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
import { NeighborUtils } from '../../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { APP_PATHS } from '../../../app/constants';
import { GET_PERSON_CASE_NEIGHBORS, getPersonCaseNeighbors } from '../actions';

const { isDefined } = LangUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getAssociationDetails, getNeighborDetails, getNeighborESID } = NeighborUtils;
const { FQN } = Models;
const { EFFECTIVE_DATE, ROLE } = PropertyTypes;
const {
  CASE,
  FORM,
  PEOPLE,
  REFERRAL_REQUEST,
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

    const personCaseEKIDs :UUID[] = value;

    const caseESID :UUID = yield select(selectEntitySetId(CASE));
    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const referralRequestESID :UUID = yield select(selectEntitySetId(REFERRAL_REQUEST));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    let filter = {
      entityKeyIds: personCaseEKIDs,
      destinationEntitySetIds: [referralRequestESID, statusESID],
      sourceEntitySetIds: [formESID, peopleESID],
    };

    let response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: caseESID, filter })
    );
    if (response.error) throw response.error;

    const statusEKIDs = [];

    const fqnsByESID :Map = yield select((store) => store.getIn(APP_PATHS.FQNS_BY_ESID));

    const personCaseNeighborMap = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighborList :List, caseEKID :UUID) => {
        neighborList.forEach((neighbor :Map) => {
          const neighborESID :UUID = getNeighborESID(neighbor);
          const neighborFqn :FQN = fqnsByESID.get(neighborESID);
          const entity :Map = getNeighborDetails(neighbor);
          const entityEKID = getEntityKeyId(entity);

          if (neighborESID === statusESID) {
            const statusMap = mutator.get(STATUS, Map())
              .update(
                caseEKID,
                List(),
                (existingStatusesForCase :List) => existingStatusesForCase.push(entity)
              );
            mutator.set(STATUS, statusMap);
            statusEKIDs.push(entityEKID);
          }
          else if (neighborESID === formESID) {
            const formMap = mutator.get(FORM, Map())
              .update(
                caseEKID,
                List(),
                (existingFormsForCase :List) => existingFormsForCase.push(entity)
              );
            mutator.set(FORM, formMap);
          }
          else if (neighborESID === peopleESID) {
            const associationDetails = getAssociationDetails(neighbor);
            const role = getPropertyValue(associationDetails, [ROLE, 0]);
            const roleMap = mutator.get(ROLE, Map())
              .update(
                caseEKID,
                Map(),
                (existingRolesForCase :Map) => existingRolesForCase
                  .set(role, existingRolesForCase.get(role, List()).push(entity))
              );
            mutator.set(ROLE, roleMap);
          }
          else {
            const entityList = mutator.get(neighborFqn, List()).push(entity);
            mutator.set(neighborFqn, entityList);
          }
        });
      });
    });

    const staffESID :UUID = yield select(selectEntitySetId(STAFF));

    filter = {
      entityKeyIds: statusEKIDs,
      destinationEntitySetIds: [staffESID],
      sourceEntitySetIds: [referralRequestESID],
    };

    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: statusESID, filter })
    );
    if (response.error) throw response.error;

    const statusNeighbors :Map = fromJS(response.data);

    const staffMemberByStatusEKID :Map = Map().withMutations((mutator :Map) => {
      statusNeighbors.forEach((neighborList :List, statusEKID :UUID) => {
        const onlyStaffNeighbors = neighborList.filter((neighbor :Map) => getNeighborESID(neighbor) === staffESID);
        const staffMember = onlyStaffNeighbors.get(0);
        if (isDefined(staffMember)) {
          mutator.set(statusEKID, getNeighborDetails(staffMember));
        }
      });
    });

    const data = { personCaseNeighborMap, staffMemberByStatusEKID };
    workerResponse.data = data;
    yield put(getPersonCaseNeighbors.success(action.id, data));
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
