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
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { selectEntitySetId, selectPropertyTypeId } from '../../../../core/redux/selectors';
import { getSearchTerm } from '../../../../utils/search';
import { SEARCH_PEOPLE, searchPeople } from '../actions';

const { isNonEmptyString } = LangUtils;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;
const { PEOPLE } = AppTypes;
const { DOB, GIVEN_NAME, SURNAME } = PropertyTypes;

const LOG = new Logger('ProfileSagas');

function* searchPeopleWorker(action :SequenceAction) :Saga<*> {
  const { id, value } = action;

  let searchedPeople :List = List();
  let totalHits :number = 0;
  let response :Object = {};

  try {
    yield put(searchPeople.request(id, value));
    const {
      dob,
      firstName,
      lastName,
      maxHits,
      start,
    } = value;

    const peopleESID :?UUID = yield select(selectEntitySetId(PEOPLE));
    const firstNamePTID :?UUID = yield select(selectPropertyTypeId(GIVEN_NAME));
    const lastNamePTID :?UUID = yield select(selectPropertyTypeId(SURNAME));
    const dobPTID :?UUID = yield select(selectPropertyTypeId(DOB));

    const searchOptions = {
      entitySetIds: [peopleESID],
      start,
      maxHits,
      constraints: []
    };

    if (firstName === '*' && lastName === '*') {
      searchOptions.constraints.push({
        constraints: [{
          type: 'advanced',
          searchFields: [
            { searchTerm: '*', property: firstNamePTID },
            { searchTerm: '*', property: lastNamePTID }
          ],
        }]
      });
      response = yield call(searchEntitySetDataWorker, searchEntitySetData(searchOptions));
      if (response.error) throw response.error;
      searchedPeople = fromJS(response.data.hits);
      totalHits = response.data.numHits;
    }
    else {
      if (isNonEmptyString(firstName)) {
        const firstNameConstraint = getSearchTerm(firstNamePTID, firstName);
        searchOptions.constraints.push({
          min: 1,
          constraints: [{
            searchTerm: firstNameConstraint,
            fuzzy: true
          }]
        });
      }
      if (isNonEmptyString(lastName)) {
        const lastNameConstraint = getSearchTerm(lastNamePTID, lastName);
        searchOptions.constraints.push({
          min: 1,
          constraints: [{
            searchTerm: lastNameConstraint,
            fuzzy: true
          }]
        });
      }
      if (DateTime.fromISO(dob).isValid) {
        const dobConstraint = getSearchTerm(dobPTID, dob);
        searchOptions.constraints.push({
          min: 1,
          constraints: [{
            searchTerm: dobConstraint,
            fuzzy: true
          }]
        });
      }

      response = yield call(searchEntitySetDataWorker, searchEntitySetData(searchOptions));
      if (response.error) throw response.error;
      searchedPeople = fromJS(response.data.hits);
      totalHits = response.data.numHits;
    }

    yield put(searchPeople.success(id, { searchedPeople, totalHits }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchPeople.failure(id, error));
  }
  finally {
    yield put(searchPeople.finally(id));
  }
}

function* searchPeopleWatcher() :Saga<*> {

  yield takeEvery(SEARCH_PEOPLE, searchPeopleWorker);
}

export {
  searchPeopleWatcher,
  searchPeopleWorker,
};
