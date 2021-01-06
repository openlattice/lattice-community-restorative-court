// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DataUtils, LangUtils, Logger } from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { getNeighborDetails } from '../../../utils/data';
import { CaseStatusConstants } from '../../profile/src/constants';
import { GET_CASES_STATS, getCasesStats } from '../actions';
import { CASES_STATS_CONSTANTS } from '../constants';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;
const { CRC_CASE, STATUS } = AppTypes;
const { NOTES } = PropertyTypes;
const { CLOSED, REASONS_FOR_CLOSED_CASE, RESOLUTION } = CaseStatusConstants;

const LOG = new Logger('DashboardSagas');

function* getCasesStatsWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getCasesStats.request(id));

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));

    let response :Object = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId: crcCaseESID }));
    if (response.error) throw response.error;
    const crcCases :List = fromJS(response.data);
    const crcCaseEKIDs :UUID[] = crcCases.map((crcCase :Map) => getEntityKeyId(crcCase)).toJS();

    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    const filter = {
      entityKeyIds: crcCaseEKIDs,
      destinationEntitySetIds: [statusESID],
      sourceEntitySetIds: [],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: crcCaseESID, filter })
    );
    if (response.error) throw response.error;

    const statusesByCRCCaseEKID :Map = fromJS(response.data)
      .map((neighborsList :List) => neighborsList
        .map((neighbor :Map) => getNeighborDetails(neighbor)));

    const casesStats :Map = Map().withMutations((mutator) => {
      mutator.set(CASES_STATS_CONSTANTS.TOTAL_CASES, crcCases.count());

      statusesByCRCCaseEKID.forEach((statuses :List) => {
        const closedStatus = statuses
          .find((status :Map) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CLOSED);
        const resolutionStatus = statuses
          .find((status :Map) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === RESOLUTION);

        if (!isDefined(resolutionStatus) && !isDefined(closedStatus)) {
          const openCount :number = mutator.get(CASES_STATS_CONSTANTS.OPEN_CASES, 0);
          mutator.set(CASES_STATS_CONSTANTS.OPEN_CASES, openCount + 1);
        }

        const reasonForClosedCase = getPropertyValue(closedStatus, [NOTES, 0]);

        if (isDefined(resolutionStatus) || reasonForClosedCase === REASONS_FOR_CLOSED_CASE[0]) {
          const successfulCount :number = mutator.get(CASES_STATS_CONSTANTS.SUCCESSFUL, 0);
          mutator.set(CASES_STATS_CONSTANTS.SUCCESSFUL, successfulCount + 1);
        }
        if (reasonForClosedCase === REASONS_FOR_CLOSED_CASE[1]) {
          const declinedCount :number = mutator.get(CASES_STATS_CONSTANTS.RESPONDENT_DECLINED, 0);
          mutator.set(CASES_STATS_CONSTANTS.RESPONDENT_DECLINED, declinedCount + 1);
        }
        if (reasonForClosedCase === REASONS_FOR_CLOSED_CASE[2]) {
          const noContactCount :number = mutator.get(CASES_STATS_CONSTANTS.NO_CONTACT, 0);
          mutator.set(CASES_STATS_CONSTANTS.NO_CONTACT, noContactCount + 1);
        }
        if (reasonForClosedCase === REASONS_FOR_CLOSED_CASE[3]
          || reasonForClosedCase === REASONS_FOR_CLOSED_CASE[4]
          || reasonForClosedCase === REASONS_FOR_CLOSED_CASE[5]) {
          const terminatedCount :number = mutator.get(CASES_STATS_CONSTANTS.TERMINATED, 0);
          mutator.set(CASES_STATS_CONSTANTS.TERMINATED, terminatedCount + 1);
        }
      });
    });

    yield put(getCasesStats.success(id, casesStats));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getCasesStats.failure(id, error));
  }
  finally {
    yield put(getCasesStats.finally(id));
  }
  return workerResponse;
}

function* getCasesStatsWatcher() :Saga<*> {

  yield takeEvery(GET_CASES_STATS, getCasesStatsWorker);
}

export {
  getCasesStatsWatcher,
  getCasesStatsWorker,
};
