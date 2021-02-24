// @flow

import {
  all,
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import { DataUtils, LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { selectEntitySetId, selectPropertyTypeId } from '../../../core/redux/selectors';
import { getAssociationDetails, getNeighborDetails, getNeighborESID } from '../../../utils/data';
import { getPersonName } from '../../../utils/people';
import { getSearchTerm } from '../../../utils/search';
import { EMPTY_VALUE, RoleConstants } from '../../profile/src/constants';
import { SEARCH_CASES, searchCases } from '../actions';
import { CASE_RESULT_NUMBER } from '../constants';

const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined, isNonEmptyString } = LangUtils;
const {
  CRC_CASE,
  DA_CASE,
  PEOPLE,
  STAFF,
} = AppTypes;
const { CASE_NUMBER, DA_CASE_NUMBER, ROLE } = PropertyTypes;
const { CASE_MANAGER, RESPONDENT } = RoleConstants;

const LOG = new Logger('DashboardSagas');

function* searchCasesWorker(action :SequenceAction) :Saga<*> {

  const workerResponse = {};

  try {
    yield put(searchCases.request(action.id));
    const {
      caseNumberInput,
      maxHits,
      start,
    } = action.value;

    let searchedCasesData :List = List();
    let totalHits :number = 0;

    const daCaseESID :UUID = yield select(selectEntitySetId(DA_CASE));
    const daCaseNumberPTID :UUID = yield select(selectPropertyTypeId(DA_CASE_NUMBER));
    const caseNumberPTID :UUID = yield select(selectPropertyTypeId(CASE_NUMBER));

    const searchDACaseNumberOptions = {
      entitySetIds: [daCaseESID],
      start,
      maxHits,
      constraints: []
    };
    const searchCaseNumberOptions = {
      entitySetIds: [daCaseESID],
      start,
      maxHits,
      constraints: []
    };

    if (isNonEmptyString(caseNumberInput)) {
      const daCaseNumberConstraint = getSearchTerm(daCaseNumberPTID, caseNumberInput);
      searchDACaseNumberOptions.constraints.push({
        min: 1,
        constraints: [{
          searchTerm: daCaseNumberConstraint,
          fuzzy: true
        }]
      });

      const caseNumberConstraint = getSearchTerm(caseNumberPTID, caseNumberInput);
      searchCaseNumberOptions.constraints.push({
        min: 1,
        constraints: [{
          searchTerm: caseNumberConstraint,
          fuzzy: true
        }]
      });

      const [daCaseNumberResponse, caseNumberResponse] = yield all([
        call(searchEntitySetDataWorker, searchEntitySetData(searchDACaseNumberOptions)),
        call(searchEntitySetDataWorker, searchEntitySetData(searchCaseNumberOptions)),
      ]);
      if (daCaseNumberResponse.error) throw daCaseNumberResponse.error;
      if (caseNumberResponse.error) throw caseNumberResponse.error;
      const daCases :List = fromJS(daCaseNumberResponse.data.hits).concat(fromJS(caseNumberResponse.data.hits));
      totalHits = daCaseNumberResponse.data.numHits + caseNumberResponse.data.numHits;

      const daCaseEKIDs = [];
      daCases.forEach((daCase :Map) => {
        daCaseEKIDs.push(getEntityKeyId(daCase));
      });

      if (daCaseEKIDs.length) {
        const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));

        let filter = {
          entityKeyIds: daCaseEKIDs,
          destinationEntitySetIds: [crcCaseESID],
          sourceEntitySetIds: [crcCaseESID],
        };

        let response = yield call(
          searchEntityNeighborsWithFilterWorker,
          searchEntityNeighborsWithFilter({ entitySetId: daCaseESID, filter })
        );
        if (response.error) throw response.error;

        const crcCaseByDaCaseEKID = fromJS(response.data)
          .map((crcCaseNeighborList :List) => getNeighborDetails(crcCaseNeighborList.get(0)));
        const crcCaseEKIDs = [];
        crcCaseByDaCaseEKID.forEach((crcCase :Map) => {
          crcCaseEKIDs.push(getEntityKeyId(crcCase));
        });

        const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
        const staffESID :UUID = yield select(selectEntitySetId(STAFF));

        filter = {
          entityKeyIds: crcCaseEKIDs,
          destinationEntitySetIds: [],
          sourceEntitySetIds: [peopleESID, staffESID],
        };

        response = yield call(
          searchEntityNeighborsWithFilterWorker,
          searchEntityNeighborsWithFilter({ entitySetId: crcCaseESID, filter })
        );
        if (response.error) throw response.error;
        const peopleAndStaffNeighborsByCRCCase = fromJS(response.data);

        const respondentsByCRCCaseEKID :Map = Map().withMutations((mutator) => {
          peopleAndStaffNeighborsByCRCCase.forEach((neighborsList :List, crcCaseEKID :UUID) => {
            const respondent = neighborsList.find((neighbor :Map) => {
              const neighborESID = getNeighborESID(neighbor);
              const role = getPropertyValue(getAssociationDetails(neighbor), [ROLE, 0]);
              return neighborESID === peopleESID && role === RESPONDENT;
            });
            if (isDefined(respondent)) {
              mutator.set(crcCaseEKID, getNeighborDetails(respondent));
            }
          });
        });

        const staffByCRCCaseEKID :Map = peopleAndStaffNeighborsByCRCCase.map((neighborsList :List) => {
          const staffPerson = neighborsList.find((neighbor :Map) => {
            const neighborESID = getNeighborESID(neighbor);
            return neighborESID === staffESID;
          });
          if (isDefined(staffPerson)) return getNeighborDetails(staffPerson);
          return Map();
        });

        searchedCasesData = List().withMutations((listMutator) => {
          daCases.forEach((daCase :Map) => {
            const caseResult = Map().withMutations((mapMutator) => {
              const daCaseEKID = getEntityKeyId(daCase);
              const daCaseNumber = getPropertyValue(daCase, [DA_CASE_NUMBER, 0], undefined);
              const caseNumber = getPropertyValue(daCase, [CASE_NUMBER, 0], EMPTY_VALUE);
              const crcCase = crcCaseByDaCaseEKID.get(daCaseEKID, '');
              const crcCaseEKID = getEntityKeyId(crcCase);
              const respondent = respondentsByCRCCaseEKID.get(crcCaseEKID, Map());
              const respondentName = getPersonName(respondent, EMPTY_VALUE);
              const respondentEKID = getEntityKeyId(respondent);
              const staffPerson = staffByCRCCaseEKID.get(crcCaseEKID, Map());
              const staffPersonName = getPersonName(staffPerson, EMPTY_VALUE);

              mapMutator.set(RESPONDENT, respondentName);
              mapMutator.set(CASE_RESULT_NUMBER, daCaseNumber || caseNumber);
              mapMutator.set(CASE_MANAGER, staffPersonName);
              mapMutator.set('respondentEKID', respondentEKID);
            });
            listMutator.push(caseResult);
          });
        });
      }
    }

    yield put(searchCases.success(action.id, { searchedCasesData, totalHits }));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(searchCases.failure(action.id, error));
  }
  finally {
    yield put(searchCases.finally(action.id));
  }
  return workerResponse;
}

function* searchCasesWatcher() :Saga<*> {

  yield takeEvery(SEARCH_CASES, searchCasesWorker);
}

export {
  searchCasesWatcher,
  searchCasesWorker,
};
