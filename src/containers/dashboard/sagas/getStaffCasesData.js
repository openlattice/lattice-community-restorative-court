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
const { NAME, NOTES } = PropertyTypes;
const { REPAIR_HARM_AGREEMENT } = FormConstants;
const {
  CIRCLE,
  CLOSED,
  INTAKE,
  REFERRAL,
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

    let statusesByCRCEKID :Map = Map();
    let repairHarmAgreementByCRCEKID :Map = Map();

    if (crcCaseEKIDs.length) {
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

      statusesByCRCEKID = crcCaseNeighbors.map((neighborsList :List) => neighborsList
        .filter((neighbor :Map) => getNeighborESID(neighbor) === statusESID)
        .map((neighbor :Map) => getNeighborDetails(neighbor)));
      repairHarmAgreementByCRCEKID = crcCaseNeighbors.map((neighborsList :List) => neighborsList
        .filter((neighbor :Map) => getNeighborESID(neighbor) === formESID)
        .map((neighbor :Map) => {
          const form :Map = getNeighborDetails(neighbor);
          if (getPropertyValue(form, [NAME, 0]) === REPAIR_HARM_AGREEMENT) {
            return form;
          }
          return Map();
        }));
    }

    const staffCasesTableData = List().withMutations((mutator) => {

      let totalPendingIntake :number = 0;
      let totalPendingCircle :number = 0;
      let totalRepairHarmAgreementsCompleted :number = 0;
      let totalOpenCases :number = 0;
      let totalSuccessfulCases :number = 0;
      let totalUnsuccessfulCases :number = 0;

      staff.forEach((staffMember :Map) => {
        const staffEKID :?UUID = getEntityKeyId(staffMember);
        const personName :string = getPersonName(staffMember);
        const crcCases :List = crcCasesByStaffEKID.get(staffEKID, List());

        let pendingIntake :number = 0;
        let pendingCircle :number = 0;
        let repairHarmAgreementsCompleted :number = 0;
        let openCases :number = 0;
        let successfulCases :number = 0;
        let unsuccessfulCases :number = 0;

        crcCases.forEach((crcCase :Map) => {
          const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
          const statuses :List = statusesByCRCEKID.get(crcCaseEKID, List());
          const referral :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === REFERRAL);
          const intake :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === INTAKE);
          const circle :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CIRCLE);
          const closed :Map = statuses
            .find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CLOSED);

          if (isDefined(referral) && !isDefined(intake)) pendingIntake += 1;
          if (isDefined(referral) && isDefined(intake) && !isDefined(circle)) {
            pendingCircle += 1;
          }
          if (!isDefined(closed)) openCases += 1;
          if (isDefined(closed)) {
            const reasonForClosingCase = getPropertyValue(closed, [NOTES, 0]);
            if (reasonForClosingCase.includes('Successful')) successfulCases += 1;
            else unsuccessfulCases += 1;
          }

          const repairHarmAgreement = repairHarmAgreementByCRCEKID.getIn([crcCaseEKID, 0], Map());
          if (isDefined(repairHarmAgreement) && !repairHarmAgreement.isEmpty() && !isDefined(closed)) {
            repairHarmAgreementsCompleted += 1;
          }
        });

        const tableRow = Map({
          [STAFF_CASES_TABLE_HEADERS.get('STAFF')]: personName,
          [STAFF_CASES_TABLE_HEADERS.get('PENDING_INTAKE')]: pendingIntake,
          [STAFF_CASES_TABLE_HEADERS.get('PENDING_CIRCLE')]: pendingCircle,
          [STAFF_CASES_TABLE_HEADERS.get('RH_AGREEMENT_COMPLETED')]: repairHarmAgreementsCompleted,
          [STAFF_CASES_TABLE_HEADERS.get('TOTAL_OPEN_CASES')]: openCases,
          [STAFF_CASES_TABLE_HEADERS.get('TOTAL_SUCCESSFUL_CASES')]: successfulCases,
          [STAFF_CASES_TABLE_HEADERS.get('TOTAL_UNSUCCESSFUL_CASES')]: unsuccessfulCases,
        });
        mutator.push(tableRow);

        totalPendingIntake += pendingIntake;
        totalPendingCircle += pendingCircle;
        totalRepairHarmAgreementsCompleted += repairHarmAgreementsCompleted;
        totalOpenCases += openCases;
        totalSuccessfulCases += successfulCases;
        totalUnsuccessfulCases += unsuccessfulCases;
      });

      mutator.push(Map({
        [STAFF_CASES_TABLE_HEADERS.get('STAFF')]: 'All Staff',
        [STAFF_CASES_TABLE_HEADERS.get('PENDING_INTAKE')]: totalPendingIntake,
        [STAFF_CASES_TABLE_HEADERS.get('PENDING_CIRCLE')]: totalPendingCircle,
        [STAFF_CASES_TABLE_HEADERS.get('RH_AGREEMENT_COMPLETED')]: totalRepairHarmAgreementsCompleted,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_OPEN_CASES')]: totalOpenCases,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_SUCCESSFUL_CASES')]: totalSuccessfulCases,
        [STAFF_CASES_TABLE_HEADERS.get('TOTAL_UNSUCCESSFUL_CASES')]: totalUnsuccessfulCases,
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
