// @flow

import {
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { ERR_ACTION_VALUE_NOT_DEFINED } from '../../../../utils/error/constants';
import { GET_PERSON_CASES, getPersonCases } from '../actions';

const { isDefined } = LangUtils;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const LOG = new Logger('ProfileSagas');

/*
 *
 * ProfileActions.getPersonCases()
 *
 */

function* getPersonCasesWorker(action :SequenceAction) :Saga<*> {

  try {
    yield put(getPersonCases.request(action.id));
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    const personEKID :UUID = value;

    const personESID :UUID = '';
    const filter = {
      entityKeyIds: [personEKID],
      destinationEntitySetIds: [],
      sourceEntitySetIds: [],
    };
    const response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: personESID, filter })
    );
    if (response.error) throw response.error;
    const personCases = fromJS(response.data).get(personEKID, List())
      .map((neighbor :Map) => neighbor.get('neighborDetails'));

    yield put(getPersonCases.success(action.id, personCases));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getPersonCases.failure(action.id, error));
  }
  finally {
    yield put(getPersonCases.finally(action.id));
  }
}

function* getPersonCasesWatcher() :Saga<*> {

  yield takeEvery(GET_PERSON_CASES, getPersonCasesWorker);
}

export {
  getPersonCasesWatcher,
  getPersonCasesWorker,
};
