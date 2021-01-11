// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, fromJS } from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { selectEntitySetId, selectPropertyTypeId } from '../../../../core/redux/selectors';
import { getSearchTerm } from '../../../../utils/search';
import { SEARCH_ORGANIZATIONS, searchOrganizations } from '../actions';

const { isNonEmptyString } = LangUtils;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;
const { ORGANIZATIONS } = AppTypes;
const { ORGANIZATION_NAME } = PropertyTypes;

const LOG = new Logger('ProfileSagas');

function* searchOrganizationsWorker(action :SequenceAction) :Saga<*> {
  const { id, value } = action;

  let searchedOrganizations :List = List();
  let totalHits :number = 0;
  let response :Object = {};

  try {
    yield put(searchOrganizations.request(id, value));
    const { organizationName, maxHits, start } = value;

    const organizationsESID :UUID = yield select(selectEntitySetId(ORGANIZATIONS));
    const organizationNamePTID :UUID = yield select(selectPropertyTypeId(ORGANIZATION_NAME));

    const searchOptions = {
      entitySetIds: [organizationsESID],
      start,
      maxHits,
      constraints: []
    };

    if (organizationName === '*') {
      searchOptions.constraints.push({
        constraints: [{
          type: 'advanced',
          searchFields: [
            { searchTerm: '*', property: organizationNamePTID },
          ],
        }]
      });
      response = yield call(searchEntitySetDataWorker, searchEntitySetData(searchOptions));
      if (response.error) throw response.error;
      searchedOrganizations = fromJS(response.data.hits);
      totalHits = response.data.numHits;
    }
    else {
      if (isNonEmptyString(organizationName)) {
        const organizationNameConstraint = getSearchTerm(organizationNamePTID, organizationName);
        searchOptions.constraints.push({
          min: 1,
          constraints: [{
            searchTerm: organizationNameConstraint,
            fuzzy: true
          }]
        });
      }

      response = yield call(searchEntitySetDataWorker, searchEntitySetData(searchOptions));
      if (response.error) throw response.error;
      searchedOrganizations = fromJS(response.data.hits);
      totalHits = response.data.numHits;
    }

    yield put(searchOrganizations.success(id, { searchedOrganizations, totalHits }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchOrganizations.failure(id, error));
  }
  finally {
    yield put(searchOrganizations.finally(id));
  }
}

function* searchOrganizationsWatcher() :Saga<*> {

  yield takeEvery(SEARCH_ORGANIZATIONS, searchOrganizationsWorker);
}

export {
  searchOrganizationsWatcher,
  searchOrganizationsWorker,
};
