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
import { getNeighborDetails, getNeighborESID } from '../../../utils/data';
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
  CIRCLE,
  CLOSED,
  INTAKE,
  RESOLUTION,
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
  DATETIME_RECEIVED,
  DUE_DATE,
  EFFECTIVE_DATE,
  NAME,
  NOTES,
} = PropertyTypes;

const LOG = new Logger('DashboardSagas');

const HEADERS = {
  personName: 'Name',
  dateAssigned: 'Date Assigned',
  intake: 'Intake',
  circle: 'Circle',
  rhExpirationDate: 'RH Expiration Date',
  notes: 'Notes',
  caseManager: 'Case Manager',
};

function* downloadCasesWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(downloadCases.request(id));

    const { closedCasesIncluded, openCasesIncluded, selectedStaffMember } = action.value;

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

    const staffByCRCEKID :Map = crcCaseNeighbors.map((neighborsList :List) => neighborsList
      .filter((neighbor :Map) => getNeighborESID(neighbor) === staffESID)
      .map((neighbor :Map) => getNeighborDetails(neighbor)));

    let crcCasesToInclude :List = crcCases.filter((crcCase :Map) => {
      const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
      const statusList :List = statusesByCRCEKID.get(crcCaseEKID, List());
      const statusIndicatingCompletion = statusList
        .find((status :Map) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CLOSED
        || getPropertyValue(status, [PropertyTypes.STATUS, 0]) === RESOLUTION);
      if (!openCasesIncluded && closedCasesIncluded) return isDefined(statusIndicatingCompletion);
      if (!closedCasesIncluded && openCasesIncluded) return !isDefined(statusIndicatingCompletion);
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
        const dateTimeCaseCreated = getPropertyValue(crcCase, [DATETIME_RECEIVED, 0]);
        const dateCaseCreated = formatAsDate(dateTimeCaseCreated);
        const notes = getPropertyValue(crcCase, [NOTES, 0]);

        const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
        const caseNeighbors = crcCaseNeighbors.get(crcCaseEKID, List());

        const personNeighbor :Map = caseNeighbors.find((neighbor :Map) => getNeighborESID(neighbor) === peopleESID);
        const personName :string = getPersonName(getNeighborDetails(personNeighbor));

        const staffList :List = staffByCRCEKID.get(crcCaseEKID, List());
        const staffPersonName :string = getPersonName(staffList.get(0));

        const statusList :List = statusesByCRCEKID.get(crcCaseEKID, List());
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
          .set(HEADERS.dateAssigned, dateCaseCreated)
          .set(HEADERS.intake, intakeDate)
          .set(HEADERS.circle, circleDate)
          .set(HEADERS.rhExpirationDate, rhExpirationDate)
          .set(HEADERS.notes, notes)
          .set(HEADERS.caseManager, staffPersonName);
        mutator.push(tableRow);
      });
    });

    const csv = Papa.unparse(dataTable.toJS());
    const blob = new Blob([csv], {
      type: 'application/json'
    });

    let fileName = '';
    if ((openCasesIncluded && closedCasesIncluded)
        || (!openCasesIncluded && !closedCasesIncluded)) fileName = 'CRC_All_Cases';
    else if (!openCasesIncluded) fileName = 'CRC_Closed_Cases';
    else if (!closedCasesIncluded) fileName = 'CRC_Open_Cases';
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
