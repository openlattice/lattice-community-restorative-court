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
import { Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes } from '../../../core/edm/constants';
import { APP_PATHS } from '../../../core/redux/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { NeighborUtils } from '../../../utils/data';
import { GET_REFERRAL_REQUEST_NEIGHBORS, getReferralRequestNeighbors } from '../actions';

const { FQN } = Models;
const {
  DA_CASE,
  OFFENSE,
  OFFICERS,
  REFERRAL_REQUEST,
} = AppTypes;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getNeighborDetails, getNeighborESID } = NeighborUtils;

const LOG = new Logger('ReferralSagas');

function* getReferralRequestNeighborsWorker(action :SequenceAction) :Saga<*> {

  const workerResponse = {};

  try {
    yield put(getReferralRequestNeighbors.request(action.id));
    const { value } = action;
    const referralRequestEKIDs :UUID[] = value;

    const daCaseESID :UUID = yield select(selectEntitySetId(DA_CASE));
    const offenseESID :UUID = yield select(selectEntitySetId(OFFENSE));
    const officersESID :UUID = yield select(selectEntitySetId(OFFICERS));
    const referralRequestESID :UUID = yield select(selectEntitySetId(REFERRAL_REQUEST));

    const filter = {
      entityKeyIds: referralRequestEKIDs,
      destinationEntitySetIds: [officersESID],
      sourceEntitySetIds: [daCaseESID, offenseESID],
    };

    const response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: referralRequestESID, filter })
    );
    if (response.error) throw response.error;

    const fqnsByESID :Map = yield select((store) => store.getIn(APP_PATHS.FQNS_BY_ESID));

    const referralRequestNeighborMap :Map = Map().withMutations((mutator :Map) => {
      fromJS(response.data).forEach((neighborList :List, referralRequestEKID :UUID) => {
        neighborList.forEach((neighbor :Map) => {
          const entity :Map = getNeighborDetails(neighbor);
          const neighborESID :UUID = getNeighborESID(neighbor);
          const neighborFqn :FQN = fqnsByESID.get(neighborESID);
          const neighborsByReferralRequestEKID = mutator.get(neighborFqn, Map())
            .update(
              referralRequestEKID,
              List(),
              (existingEntities :List) => existingEntities.push(entity)
            );
          mutator.set(neighborFqn, neighborsByReferralRequestEKID);
        });
      });
    });

    workerResponse.data = referralRequestNeighborMap;
    yield put(getReferralRequestNeighbors.success(action.id, referralRequestNeighborMap));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getReferralRequestNeighbors.failure(action.id, error));
  }
  finally {
    yield put(getReferralRequestNeighbors.finally(action.id));
  }
  return workerResponse;
}

function* getReferralRequestNeighborsWatcher() :Saga<*> {

  yield takeEvery(GET_REFERRAL_REQUEST_NEIGHBORS, getReferralRequestNeighborsWorker);
}

export {
  getReferralRequestNeighborsWatcher,
  getReferralRequestNeighborsWorker,
};
