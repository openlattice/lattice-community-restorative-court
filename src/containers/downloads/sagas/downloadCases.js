// @flow
import FS from 'file-saver';
import Papa from 'papaparse';
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  OrderedMap,
  fromJS,
} from 'immutable';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import {
  DataUtils,
  DateTimeUtils,
  LangUtils,
  Logger,
} from 'lattice-utils';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { selectEntitySetId } from '../../../core/redux/selectors';
import { getAssociationDetails, getNeighborDetails, getNeighborESID } from '../../../utils/data';
import { getPersonName } from '../../../utils/people';
import { CaseStatusConstants, FormConstants } from '../../profile/src/constants';
import { DOWNLOAD_CASES, downloadCases } from '../actions';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;
const { isDefined } = LangUtils;
const {
  ACCEPTANCE,
  CIRCLE,
  CLOSED,
  INTAKE,
  REFERRAL,
} = CaseStatusConstants;
const { REPAIR_HARM_AGREEMENT } = FormConstants;
const {
  CRC_CASE,
  FORM,
  PEOPLE,
  STAFF,
  STATUS,
} = AppTypes;
const {
  DUE_DATE,
  EFFECTIVE_DATE,
  GENERAL_DATETIME,
  NAME,
  NOTES,
} = PropertyTypes;

const LOG = new Logger('DashboardSagas');

const HEADERS = {
  personName: 'Name',
  referralDate: 'Referral Date',
  dateAssigned: 'Date Assigned',
  intake: 'Intake',
  circle: 'Circle',
  rhExpirationDate: 'RH Expiration Date',
  caseNumber: 'Case Number',
  caseManager: 'Case Manager',
};

const getStatus = (status :Map) => getPropertyValue(status, [PropertyTypes.STATUS, 0]);

function* downloadCasesWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(downloadCases.request(id));

    const { hasClosedCases, hasOpenCases, selectedStaffMember } = action.value;

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));

    let response :Object = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId: crcCaseESID }));
    if (response.error) throw response.error;
    const crcCases :List = fromJS(response.data);

    const crcCaseEKIDs :UUID[] = [];
    crcCases.forEach((crcCase :Map) => {
      const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
      if (crcCaseEKID) crcCaseEKIDs.push(crcCaseEKID);
    });

    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const staffESID :UUID = yield select(selectEntitySetId(STAFF));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    const filter = {
      entityKeyIds: crcCaseEKIDs,
      destinationEntitySetIds: [statusESID],
      sourceEntitySetIds: [formESID, peopleESID, staffESID],
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

    const staffNeighbors :Map = crcCaseNeighbors.map((neighborsList :List) => neighborsList
      .filter((neighbor :Map) => getNeighborESID(neighbor) === staffESID));
    const dateStaffAssignedByCRCEKID = Map().withMutations((mutator) => {
      staffNeighbors.forEach((neighborsList :List, crcCaseEKID) => {
        const staffNeighbor = neighborsList.get(0, Map());
        const associationDetails = getAssociationDetails(staffNeighbor);
        const dateTimeAssigned = getPropertyValue(associationDetails, [GENERAL_DATETIME, 0]);
        const dateAssigned = formatAsDate(dateTimeAssigned);
        mutator.set(crcCaseEKID, dateAssigned);
      });
    });
    const staffByCRCEKID :Map = staffNeighbors
      .map((neighborsList) => neighborsList.map((neighbor :Map) => getNeighborDetails(neighbor)));

    let crcCasesToInclude :List = crcCases.filter((crcCase :Map) => {
      const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
      const statusList :List = statusesByCRCEKID.get(crcCaseEKID, List());
      const statusIndicatingCompletion = statusList
        .find((status :Map) => getStatus(status) === CLOSED);
      if (!hasOpenCases && hasClosedCases) return isDefined(statusIndicatingCompletion);
      if (!hasClosedCases && hasOpenCases) return !isDefined(statusIndicatingCompletion);

      if (selectedStatus) {
        let hasReferral = false;
        let hasIntake = false;
        let hasAcceptance = false;
        let hasCircle = false;
        const hasClosed = isDefined(statusIndicatingCompletion);

        statusList.forEach((status :Map) => {
          const statusName = getStatus(status);
          if (statusName === REFERRAL) hasReferral = true;
          if (statusName === INTAKE) hasIntake = true;
          if (statusName === ACCEPTANCE) hasAcceptance = true;
          if (statusName === CIRCLE) hasCircle = true;
        });

        if (selectedStatus === REFERRAL) {
          return hasReferral && !hasIntake && !hasAcceptance && !hasCircle && !hasClosed;
        }
        if (selectedStatus === INTAKE) {
          return hasReferral && hasIntake && !hasAcceptance && !hasCircle && !hasClosed;
        }
        if (selectedStatus === ACCEPTANCE) {
          return hasReferral && hasIntake && hasAcceptance && !hasCircle && !hasClosed;
        }
        if (selectedStatus === CIRCLE) {
          return hasReferral && hasIntake && hasAcceptance && hasCircle && !hasClosed;
        }
      }
      return crcCase;
    });

    if (selectedStaffMember.length) {
      crcCasesToInclude = crcCasesToInclude.filter((crcCase :Map) => {
        const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
        const staffList :List = staffByCRCEKID.get(crcCaseEKID, List());
        const staffPersonName :string = getPersonName(staffList.get(0));
        return staffPersonName === selectedStaffMember;
      });
    }

    const dataTable :List = List().withMutations((mutator :List) => {
      crcCasesToInclude.forEach((crcCase :Map) => {
        const caseNumber = getPropertyValue(crcCase, [NOTES, 0]);

        const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
        const caseNeighbors = crcCaseNeighbors.get(crcCaseEKID, List());

        const personNeighbor :Map = caseNeighbors.find((neighbor :Map) => getNeighborESID(neighbor) === peopleESID);
        const personName :string = getPersonName(getNeighborDetails(personNeighbor));

        const staffList :List = staffByCRCEKID.get(crcCaseEKID, List());
        const staffPersonName :string = getPersonName(staffList.get(0));

        const dateStaffAssigned = dateStaffAssignedByCRCEKID.get(crcCaseEKID, '');

        const statusList :List = statusesByCRCEKID.get(crcCaseEKID, List());
        let referralDate = '';
        const referral = statusList
          .find((status :Map) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === REFERRAL);
        if (isDefined(referral)) {
          const referralDateTime = getPropertyValue(referral, [EFFECTIVE_DATE, 0]);
          referralDate = formatAsDate(referralDateTime);
        }
        const intake = statusList.find((status :Map) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === INTAKE);
        let intakeDate = '';
        if (isDefined(intake)) {
          const intakeDateTime = getPropertyValue(intake, [EFFECTIVE_DATE, 0]);
          intakeDate = formatAsDate(intakeDateTime);
        }
        const circle = statusList.find((status :Map) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CIRCLE);
        let circleDate = '';
        if (isDefined(circle)) {
          const circleDateTime = getPropertyValue(circle, [EFFECTIVE_DATE, 0]);
          circleDate = formatAsDate(circleDateTime);
        }

        const forms :List = caseNeighbors
          .filter((neighbor :Map) => getNeighborESID(neighbor) === formESID)
          .map((neighbor :Map) => getNeighborDetails(neighbor));
        const repairHarmAgreement :?Map = forms
          .find((form :Map) => getPropertyValue(form, [NAME, 0]) === REPAIR_HARM_AGREEMENT);
        let rhExpirationDate = '';
        if (isDefined(repairHarmAgreement)) {
          const expirationDateTime = getPropertyValue(repairHarmAgreement, [DUE_DATE, 0]);
          rhExpirationDate = formatAsDate(expirationDateTime);
        }

        const tableRow = OrderedMap()
          .set(HEADERS.personName, personName)
          .set(HEADERS.referralDate, referralDate)
          .set(HEADERS.dateAssigned, dateStaffAssigned)
          .set(HEADERS.intake, intakeDate)
          .set(HEADERS.circle, circleDate)
          .set(HEADERS.rhExpirationDate, rhExpirationDate)
          .set(HEADERS.caseNumber, caseNumber)
          .set(HEADERS.caseManager, staffPersonName);
        mutator.push(tableRow);
      });
    })
      .sortBy((row) => row.get(HEADERS.personName, '').split(' ')[1]);

    const csv = Papa.unparse(dataTable.toJS());
    const blob = new Blob([csv], {
      type: 'text/csv'
    });

    let fileName = '';
    if ((hasOpenCases && hasClosedCases)
        || (!hasOpenCases && !hasClosedCases)) fileName = 'CRC_All_Cases';
    else if (!hasOpenCases) fileName = 'CRC_Closed_Cases';
    else if (!hasClosedCases) fileName = 'CRC_Open_Cases';
    if (selectedStaffMember.length) fileName = `${fileName}_${selectedStaffMember.split(' ').join('_')}`;

    FS.saveAs(blob, fileName.concat('.csv'));

    yield put(downloadCases.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(downloadCases.failure(id, error));
  }
  finally {
    yield put(downloadCases.finally(id));
  }
  return workerResponse;
}

function* downloadCasesWatcher() :Saga<*> {

  yield takeEvery(DOWNLOAD_CASES, downloadCasesWorker);
}

export {
  downloadCasesWatcher,
  downloadCasesWorker,
};
