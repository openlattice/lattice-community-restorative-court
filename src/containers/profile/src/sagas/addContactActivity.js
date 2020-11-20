// @flow

import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { WorkerResponse } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { submitDataGraph } from '../../../../core/data/actions';
import { submitDataGraphWorker } from '../../../../core/data/sagas';
import { AppTypes } from '../../../../core/edm/constants';
import { EDM, PROPERTY_FQNS_BY_TYPE_ID } from '../../../../core/redux/constants';
import { selectEntitySetId } from '../../../../core/redux/selectors';
import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { ADD_CONTACT_ACTIVITY, addContactActivity } from '../actions';

const { isDefined } = LangUtils;
const { CONTACT_ACTIVITY } = AppTypes;
const { OPENLATTICE_ID_FQN } = Constants;

const LOG = new Logger('ProfileSagas');
/*
 *
 * ProfileActions.addContactActivity()
 *
 */

function* addContactActivityWorker(action :SequenceAction) :Saga<WorkerResponse> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(addContactActivity.request(id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const response :Object = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const { entityKeyIds } = response.data;
    const { entityData } = value;

    const contactActivityESID :UUID = yield select(selectEntitySetId(CONTACT_ACTIVITY));
    const contactActivityEKID :UUID = entityKeyIds[contactActivityESID][0];

    const propertyFqnsByTypeId = yield select((store :Map) => store.getIn([EDM, PROPERTY_FQNS_BY_TYPE_ID]));

    const newContactActivity :Map = Map().withMutations((mutator :Map) => {
      mutator.set(OPENLATTICE_ID_FQN, contactActivityEKID);
      fromJS(entityData[contactActivityESID][0]).forEach((entityValue :List, propertyTypeId :UUID) => {
        const propertyFqn = propertyFqnsByTypeId.get(propertyTypeId);
        mutator.set(propertyFqn, entityValue);
      });
    });

    yield put(addContactActivity.success(id, newContactActivity));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(addContactActivity.failure(id, error));
  }
  finally {
    yield put(addContactActivity.finally(id));
  }
  return workerResponse;
}

function* addContactActivityWatcher() :Saga<*> {

  yield takeEvery(ADD_CONTACT_ACTIVITY, addContactActivityWorker);
}

export {
  addContactActivityWatcher,
  addContactActivityWorker,
};
