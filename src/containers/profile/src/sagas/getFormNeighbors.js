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
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../../core/edm/constants';
import { APP_PATHS } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { NeighborUtils } from '../../../../utils/data';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { GET_FORM_NEIGHBORS, getFormNeighbors } from '../actions';

const { isDefined } = LangUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getNeighborDetails, getNeighborESID } = NeighborUtils;
const { FQN } = Models;
const {
  CRC_CASE,
  FORM,
  PEOPLE,
  REFERRAL_REQUEST,
  STAFF,
} = AppTypes;

const LOG = new Logger('ProfileSagas');

/*
 *
 * ProfileActions.getFormNeighbors()
 *
 */

function* getFormNeighborsWorker(action :SequenceAction) :Saga<*> {

  const workerResponse = {};

  try {
    yield put(getFormNeighbors.request(action.id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const formEKIDs :UUID[] = value;

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));
    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const referralRequestESID :UUID = yield select(selectEntitySetId(REFERRAL_REQUEST));
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const staffESID :UUID = yield select(selectEntitySetId(STAFF));

    const filter = {
      entityKeyIds: formEKIDs,
      destinationEntitySetIds: [crcCaseESID, referralRequestESID, staffESID],
      sourceEntitySetIds: [peopleESID],
    };

    const response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: formESID, filter })
    );
    if (response.error) throw response.error;

    const fqnsByESID :Map = yield select((store) => store.getIn(APP_PATHS.FQNS_BY_ESID));

    const formNeighborMap = Map().withMutations((mutator :Map) => {
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

    workerResponse.data = formNeighborMap;
    yield put(getFormNeighbors.success(action.id, formNeighborMap));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getFormNeighbors.failure(action.id, error));
  }
  finally {
    yield put(getFormNeighbors.finally(action.id));
  }
  return workerResponse;
}

function* getFormNeighborsWatcher() :Saga<*> {

  yield takeEvery(GET_FORM_NEIGHBORS, getFormNeighborsWorker);
}

export {
  getFormNeighborsWatcher,
  getFormNeighborsWorker,
};
