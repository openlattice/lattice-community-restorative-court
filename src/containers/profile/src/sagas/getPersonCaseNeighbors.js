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
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { APP_PATHS, ProfileReduxConstants } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { getAssociationDetails, getNeighborDetails, getNeighborESID } from '../../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { getReferralRequestNeighbors } from '../../../referral/actions';
import { getReferralRequestNeighborsWorker } from '../../../referral/sagas';
import { GET_PERSON_CASE_NEIGHBORS, getPersonCaseNeighbors } from '../actions';

const { isDefined } = LangUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { FQN } = Models;
const { ROLE } = PropertyTypes;
const {
  CHARGES,
  CHARGE_EVENT,
  CRC_CASE,
  FORM,
  ORGANIZATIONS,
  PEOPLE,
  REFERRAL_REQUEST,
  STAFF,
  STATUS,
} = AppTypes;
const { FORM_NEIGHBOR_MAP } = ProfileReduxConstants;

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

    const chargeEventESID :UUID = yield select(selectEntitySetId(CHARGE_EVENT));
    const chargesESID :UUID = yield select(selectEntitySetId(CHARGES));
    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));
    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const organizationsESID :UUID = yield select(selectEntitySetId(ORGANIZATIONS));
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const referralRequestESID :UUID = yield select(selectEntitySetId(REFERRAL_REQUEST));
    const staffESID :UUID = yield select(selectEntitySetId(STAFF));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    let filter = {
      entityKeyIds: personCaseEKIDs,
      destinationEntitySetIds: [statusESID],
      sourceEntitySetIds: [
        chargesESID,
        chargeEventESID,
        formESID,
        organizationsESID,
        peopleESID,
        referralRequestESID,
        staffESID
      ],
    };

    let response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: crcCaseESID, filter })
    );
    if (response.error) throw response.error;

    const statusEKIDs = [];
    const referralRequestEKIDs = [];
    const formEKIDs = [];
    const caseEKIDByFormEKID = Map().asMutable();

    const fqnsByESID :Map = yield select((store) => store.getIn(APP_PATHS.FQNS_BY_ESID));

    let personCaseNeighborMap = Map().withMutations((mutator :Map) => {
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
            formEKIDs.push(entityEKID);
            caseEKIDByFormEKID.set(entityEKID, caseEKID);
          }
          else if (neighborESID === peopleESID || neighborESID === organizationsESID || neighborESID === staffESID) {
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
          else if (neighborESID === referralRequestESID) {
            const referralRequestMap = mutator.get(REFERRAL_REQUEST, Map())
              .update(
                caseEKID,
                List(),
                (existingReferralRequests :List) => existingReferralRequests.push(entity)
              );
            mutator.set(REFERRAL_REQUEST, referralRequestMap);
            referralRequestEKIDs.push(entityEKID);
          }
          else if (neighborESID === chargesESID) {
            const chargesMap = mutator.get(CHARGES, Map())
              .update(
                caseEKID,
                List(),
                (existingCharges :List) => existingCharges.push(entity)
              );
            mutator.set(CHARGES, chargesMap);
          }
          else if (neighborESID === chargeEventESID) {
            const chargeEventMap = mutator.get(CHARGE_EVENT, Map())
              .update(
                caseEKID,
                List(),
                (existingChargeEvents :List) => existingChargeEvents.push(entity)
              );
            mutator.set(CHARGE_EVENT, chargeEventMap);
          }
          else {
            const entityList = mutator.get(neighborFqn, List()).push(entity);
            mutator.set(neighborFqn, entityList);
          }
        });
      });
    });

    if (formEKIDs.length) {
      filter = {
        entityKeyIds: formEKIDs,
        destinationEntitySetIds: [crcCaseESID, referralRequestESID, staffESID],
        sourceEntitySetIds: [peopleESID],
      };
      response = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId: formESID, filter })
      );
      if (response.error) throw response.error;

      const formNeighborsMap = Map().withMutations((mutator :Map) => {
        fromJS(response.data).forEach((neighborList :List, formEKID :UUID) => {
          neighborList.forEach((neighbor :Map) => {
            const neighborESID :UUID = getNeighborESID(neighbor);
            const neighborFqn :FQN = fqnsByESID.get(neighborESID);
            const entity :Map = getNeighborDetails(neighbor);
            let formMap = mutator.get(formEKID, Map());
            const entityList = formMap.get(neighborFqn, List()).push(entity);
            formMap = formMap.set(neighborFqn, entityList);
            mutator.set(formEKID, formMap);
          });
        });
      });
      personCaseNeighborMap = personCaseNeighborMap.set(FORM_NEIGHBOR_MAP, formNeighborsMap);
    }

    if (referralRequestEKIDs.length) {
      yield call(getReferralRequestNeighborsWorker, getReferralRequestNeighbors(referralRequestEKIDs));
    }

    filter = {
      entityKeyIds: statusEKIDs,
      destinationEntitySetIds: [referralRequestESID, staffESID],
      sourceEntitySetIds: [],
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
