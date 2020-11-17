/*
 * @flow
 */

import {
  all,
  call,
  put,
  takeEvery,
} from '@redux-saga/core/effects';
import { Map, fromJS, getIn } from 'immutable';
import { Models } from 'lattice';
import {
  AppApiActions,
  AppApiSagas,
} from 'lattice-sagas';
import { LangUtils, Logger, ValidationUtils } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { SequenceAction } from 'redux-reqseq';

import { getEntityDataModelTypes } from '../../../core/edm/actions';
import { AppTypes } from '../../../core/edm/constants';
import { getEntityDataModelTypesWorker } from '../../../core/edm/sagas/getEntityDataModelTypes';
import { ERR_ACTION_VALUE_TYPE } from '../../../utils/error/constants';
import { INITIALIZE_APPLICATION, initializeApplication } from '../actions';
import { APP_NAME, ENTITY_SET_ID } from '../constants';

const { isValidUUID } = ValidationUtils;
const { isDefined } = LangUtils;
const { FQN } = Models;
const { getApp, getAppConfigs } = AppApiActions;
const { getAppWorker, getAppConfigsWorker } = AppApiSagas;

const LOG = new Logger('AppSagas');

/*
 *
 * AppActions.initializeApplication()
 *
 */

function* initializeApplicationWorker(action :SequenceAction) :Saga<*> {
  const workerResponse :Object = {};
  console.log('action ', action);

  try {
    yield put(initializeApplication.request(action.id));

    const { value: { match, organizationId, root } } = action;
    // if (!isValidUUID(organizationId)) throw ERR_ACTION_VALUE_TYPE;
    // if (typeof root !== 'string') throw ERR_ACTION_VALUE_TYPE;
    // if (!isDefined(match)) throw ERR_ACTION_VALUE_TYPE;
    // yield put(initializeApplication.request(action.id));

    /*
     * 1. load App and EDM
     */

    const [appResponse, edmResponse] = yield all([
      call(getAppWorker, getApp(APP_NAME)),
      call(getEntityDataModelTypesWorker, getEntityDataModelTypes())
    ]);
    if (appResponse.error) throw appResponse.error;
    if (edmResponse.error) throw edmResponse.error;

    /*
     * 2. load AppConfig, AppTypes
     */

    const app = appResponse.data;
    const appConfigsResponse = yield call(getAppConfigsWorker, getAppConfigs(app.id));
    if (appConfigsResponse.error) throw appConfigsResponse.error;
    const appConfig = appConfigsResponse.data.reduce((acc, config) => {
      let selectedConfig = acc;
      if (config.organization.id === organizationId) {
        selectedConfig = config;
      }
      return selectedConfig;
    }, {});

    const fqnsByESID = Map().withMutations((mutator :Map) => {
      fromJS(AppTypes).forEach((fqn :FQN) => {
        mutator.set(getIn(appConfig, ['config', fqn, ENTITY_SET_ID]), fqn);
      });
    });

    const entitySetIdsByFqn = fromJS(appConfig).get('config').map((fqnMap :Map) => fqnMap.get(ENTITY_SET_ID, ''));

    workerResponse.data = {
      appConfig,
      entitySetIdsByFqn,
      fqnsByESID,
      root,
      match,
    };

    yield put(initializeApplication.success(action.id, workerResponse.data));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(initializeApplication.failure(action.id, error));
  }
  finally {
    yield put(initializeApplication.finally(action.id));
  }
  return workerResponse;
}

function* initializeApplicationWatcher() :Saga<*> {

  yield takeEvery(INITIALIZE_APPLICATION, initializeApplicationWorker);
}

export {
  initializeApplicationWatcher,
  initializeApplicationWorker,
};
