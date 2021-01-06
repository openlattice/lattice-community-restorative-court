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
import {
  DataUtils,
  LangUtils,
  Logger,
} from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { getNeighborDetails, getNeighborESID } from '../../../utils/data';
import { getPersonName } from '../../../utils/people';
import { CaseStatusConstants, FormConstants } from '../../profile/src/constants';
import { GET_STAFF_CASES_DATA, getStaffCasesData } from '../actions';
import { STAFF_CASES_TABLE_HEADERS } from '../constants';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;
const {
  CRC_CASE,
  FORM,
  STAFF,
  STATUS,
} = AppTypes;
const { NAME } = PropertyTypes;
const { REPAIR_HARM_AGREEMENT } = FormConstants;
const {
  ACCEPTANCE,
  CIRCLE,
  CLOSED,
  INTAKE,
  RESOLUTION,
} = CaseStatusConstants;

const LOG = new Logger('DashboardSagas');

function* getStaffCasesDataWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(getStaffCasesData.request(id));

    const staffESID :UUID = yield select(selectEntitySetId(STAFF));

    let response :Object = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId: staffESID }));
    if (response.error) throw response.error;
    const staff :List = fromJS(response.data);
    const staffEKIDs :UUID[] = staff.map((staffMember :Map) => getEntityKeyId(staffMember)).toJS();

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));

    let filter = {
      entityKeyIds: staffEKIDs,
      destinationEntitySetIds: [crcCaseESID],
      sourceEntitySetIds: [],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: staffESID, filter })
    );
    if (response.error) throw response.error;

    const staffNeighbors :Map = fromJS(response.data);

    const crcCaseEKIDs :UUID[] = [];
    const crcCasesByStaffEKID :Map = Map().withMutations((mutator) => {
      staffNeighbors.forEach((neighborsList :List, staffEKID :UUID) => {
        neighborsList.forEach((crcCaseNeighbor :Map) => {
          const crcCase :Map = getNeighborDetails(crcCaseNeighbor);
          const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
          if (crcCaseEKID) crcCaseEKIDs.push(crcCaseEKID);

          const crcCaseList :List = mutator.get(staffEKID, List()).push(crcCase);
          mutator.set(staffEKID, crcCaseList);
        });
      });
    });

    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    filter = {
      entityKeyIds: crcCaseEKIDs,
      destinationEntitySetIds: [statusESID],
      sourceEntitySetIds: [formESID],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: crcCaseESID, filter })
    );
    if (response.error) throw response.error;

    const crcCaseNeighbors :Map = fromJS(response.data);

    const statusesByCRCEKID :Map = crcCaseNeighbors.map((neighborsList :List) => neighborsList
      .filter((neighbor :Map) => getNeighborESID(neighbor) === statusESID)
      .map((neighbor :Map) => getNeighborDetails(neighbor)));
    const repairHarmAgreementByCRCEKID :Map = crcCaseNeighbors.map((neighborsList :List) => neighborsList
      .filter((neighbor :Map) => getNeighborESID(neighbor) === formESID)
      .map((neighbor :Map) => {
        const form :Map = getNeighborDetails(neighbor);
        if (getPropertyValue(form, [NAME, 0]) === REPAIR_HARM_AGREEMENT) {
          return form;
        }
        return Map();
      }));

    const staffCasesTableData = List().withMutations((mutator) => {

      let totalPendingIntake :number = 0;
      let totalPendingCircle :number = 0;
      let totalRepairHarmAgreementsCompleted :number = 0;
      let totalOpenCases :number = 0;
      let totalClosedCases :number = 0;

      staff.forEach((staffMember :Map) => {
        const staffEKID :?UUID = getEntityKeyId(staffMember);
        const personName :string = getPersonName(staffMember);
        const crcCases :List = crcCasesByStaffEKID.get(staffEKID, List());

        let pendingIntake :number = 0;
        let pendingCircle :number = 0;
        let repairHarmAgreementsCompleted :number = 0;
        let openCases :number = 0;
        let closedCases :number = 0;

        crcCases.forEach((crcCase :Map) => {
          const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
          const statuses :List = statusesByCRCEKID.get(crcCaseEKID, List());
          const intake :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === INTAKE);
          const acceptance :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === ACCEPTANCE);
          const circle :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CIRCLE);
          const closed :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CLOSED);
          const resolution :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === RESOLUTION);

          if (isDefined(intake) && !isDefined(acceptance)) pendingIntake += 1;
          if (isDefined(acceptance) && !isDefined(circle)) pendingCircle += 1;
          if (!isDefined(closed) && !isDefined(resolution)) openCases += 1;
          if (isDefined(closed) || isDefined(resolution)) closedCases += 1;

          const repairHarmAgreement = repairHarmAgreementByCRCEKID.get(crcCaseEKID, Map());
          if (isDefined(repairHarmAgreement) && !repairHarmAgreement.isEmpty()) {
            repairHarmAgreementsCompleted += 1;
          }
        });

        const tableRow = Map({
          [STAFF_CASES_TABLE_HEADERS.get('STAFF')]: personName,
          [STAFF_CASES_TABLE_HEADERS.get('PENDING_INTAKE')]: pendingIntake,
          [STAFF_CASES_TABLE_HEADERS.get('PENDING_CIRCLE')]: pendingCircle,
          [STAFF_CASES_TABLE_HEADERS.get('RH_AGREEMENT_COMPLETED')]: repairHarmAgreementsCompleted,
          [STAFF_CASES_TABLE_HEADERS.get('TOTAL_OPEN_CASES')]: openCases,
          [STAFF_CASES_TABLE_HEADERS.get('TOTAL_CLOSED_CASES')]: closedCases,
        });
        mutator.push(tableRow);

        totalPendingIntake += pendingIntake;
        totalPendingCircle += pendingCircle;
        totalRepairHarmAgreementsCompleted += repairHarmAgreementsCompleted;
        totalOpenCases += openCases;
        totalClosedCases += closedCases;
      });

      mutator.push(Map({
        [STAFF_CASES_TABLE_HEADERS.get('STAFF')]: 'All Staff',
        [STAFF_CASES_TABLE_HEADERS.get('PENDING_INTAKE')]: totalPendingIntake,
        [STAFF_CASES_TABLE_HEADERS.get('PENDING_CIRCLE')]: totalPendingCircle,
        [STAFF_CASES_TABLE_HEADERS.get('RH_AGREEMENT_COMPLETED')]: totalRepairHarmAgreementsCompleted,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_OPEN_CASES')]: totalOpenCases,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_CLOSED_CASES')]: totalClosedCases,
      }));
    });

    yield put(getStaffCasesData.success(id, staffCasesTableData));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(getStaffCasesData.failure(id, error));
  }
  finally {
    yield put(getStaffCasesData.finally(id));
  }
  return workerResponse;
}

function* getStaffCasesDataWatcher() :Saga<*> {

  yield takeEvery(GET_STAFF_CASES_DATA, getStaffCasesDataWorker);
}

export {
  getStaffCasesDataWatcher,
  getStaffCasesDataWorker,
};
