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
import { DateTime } from 'luxon';
import type { Saga } from '@redux-saga/core';
import type { UUID } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { selectEntitySetId, selectPropertyTypeId } from '../../../core/redux/selectors';
import { getNeighborDetails, getNeighborESID } from '../../../utils/data';
import { getPersonName } from '../../../utils/people';
import { getUTCDateRangeSearchString } from '../../../utils/search';
import { CaseStatusConstants } from '../../profile/src/constants';
import { DOWNLOAD_REFERRALS, downloadReferrals } from '../actions';
import { DownloadReferralsUtils } from '../utils';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntityNeighborsWithFilter, searchEntitySetData } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker, searchEntitySetDataWorker } = SearchApiSagas;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;
const { isDefined } = LangUtils;
const {
  filterReferralRequestsByCharge,
  filterReferralRequestsByGender,
  filterReferralRequestsByPeople,
  filterReferralRequestsByRace,
  getPersonEKIDsWithMultipleReferrals,
} = DownloadReferralsUtils;
const { CLOSED, INTAKE } = CaseStatusConstants;
const {
  AGENCY,
  CHARGES,
  CRC_CASE,
  PEOPLE,
  PERSON_DETAILS,
  REFERRAL_REQUEST,
  STAFF,
  STATUS,
} = AppTypes;
const {
  DATETIME_COMPLETED,
  DOB,
  EFFECTIVE_DATE,
  GENDER,
  NAME,
  NOTES,
  RACE,
} = PropertyTypes;

const LOG = new Logger('DashboardSagas');

const HEADERS = {
  personName: 'Name',
  referralAgency: 'Referral Agency',
  dateReferred: 'Date Referred',
  charge: 'Charge',
  dateOfIntake: 'Date of Intake',
  outcome: 'Case Outcome',
  personRace: 'Race',
  personGender: 'Gender',
  ageAtReferral: 'Age of Time of Referral',
  staff: 'CRC Staff Assigned',
};

function* downloadReferralsWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(downloadReferrals.request(id));
    const {
      endDate,
      onlyRepeatReferrals,
      selectedAgency: agency,
      selectedCharge,
      selectedGender,
      selectedRace,
      startDate,
    } :Map = action.value;

    const agencyName = getPropertyValue(agency, [NAME, 0]);
    const agencyEKID :?UUID = getEntityKeyId(agency);
    const selectedChargeName = getPropertyValue(selectedCharge, [NAME, 0]);
    const startDateAsDateTime :DateTime = DateTime.fromISO(startDate);
    const endDateAsDateTime :DateTime = DateTime.fromISO(endDate);

    const agencyESID :UUID = yield select(selectEntitySetId(AGENCY));
    const referralRequestESID :UUID = yield select(selectEntitySetId(REFERRAL_REQUEST));

    let referralRequests :List = List();

    if (agency.isEmpty()) {
      if (!startDate.length && !endDate.length) {
        const response = yield call(getEntitySetDataWorker, getEntitySetData({ entitySetId: referralRequestESID }));
        if (response.error) throw response.error;
        referralRequests = fromJS(response.data);
      }
      else {
        const datetimeCompletedPTID :UUID = yield select(selectPropertyTypeId(DATETIME_COMPLETED));
        const searchOptions = {
          entitySetIds: [referralRequestESID],
          start: 0,
          maxHits: 10000,
          constraints: [{
            min: 1,
            constraints: [{
              searchTerm: getUTCDateRangeSearchString(
                datetimeCompletedPTID,
                'day',
                startDateAsDateTime,
                endDateAsDateTime
              ),
              fuzzy: false
            }]
          }]
        };

        const response = yield call(searchEntitySetDataWorker, searchEntitySetData(searchOptions));
        if (response.error) throw response.error;
        referralRequests = fromJS(response.data.hits);
      }
    }
    else if (!agency.isEmpty()) {
      const filter = {
        entityKeyIds: [agencyEKID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [referralRequestESID],
      };

      const response :Object = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId: agencyESID, filter })
      );
      if (response.error) throw response.error;
      referralRequests = fromJS(response.data[agencyEKID]).map((neighbor :Map) => getNeighborDetails(neighbor));

      if (startDate.length || endDate.length) {
        referralRequests = referralRequests.filter((referralRequest :Map) => {
          const referralDate = getPropertyValue(referralRequest, [DATETIME_COMPLETED, 0]);
          const referralDateAsDateTime :DateTime = DateTime.fromISO(referralDate);
          let referralWithinRange = true;
          if (!startDateAsDateTime.isValid && !endDateAsDateTime.isValid) return referralWithinRange;
          if (startDateAsDateTime.isValid && referralDateAsDateTime.valueOf() < startDateAsDateTime.valueOf()) {
            referralWithinRange = false;
          }
          if (endDateAsDateTime.isValid && endDateAsDateTime.valueOf() < referralDateAsDateTime.valueOf()) {
            referralWithinRange = false;
          }
          return referralWithinRange;
        });
      }
    }

    let referralRequestEKIDs :UUID[] = [];

    const referralRequestByEKID = Map().withMutations((mutator) => {
      referralRequests.forEach((referralRequest :Map) => {
        const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
        mutator.set(referralRequestEKID, referralRequest);
        if (referralRequestEKID) referralRequestEKIDs.push(referralRequestEKID);
      });
    });

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));
    const chargesESID :UUID = yield select(selectEntitySetId(CHARGES));
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const staffESID :UUID = yield select(selectEntitySetId(STAFF));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    const agencyNameByReferralRequestEKID :Map = Map().asMutable();
    let crcCaseEKIDByReferralRequestEKID :Map = Map();
    let crcCaseNeighborMap :Map = Map();
    let personGenderByPersonEKID :Map = Map();

    if (referralRequestEKIDs.length) {
      let filter = {
        entityKeyIds: referralRequestEKIDs,
        destinationEntitySetIds: [crcCaseESID],
        sourceEntitySetIds: [],
      };
      if (agency.isEmpty()) filter.destinationEntitySetIds.push(agencyESID);
      let response = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId: referralRequestESID, filter })
      );
      if (response.error) throw response.error;
      const crcCaseEKIDs :UUID[] = [];
      crcCaseEKIDByReferralRequestEKID = Map().withMutations((mutator) => {
        fromJS(response.data).forEach((neighborsList :List, referralRequestEKID :UUID) => {
          const crcCaseNeighbor = neighborsList.find((neighbor) => getNeighborESID(neighbor) === crcCaseESID);
          const crcCase :Map = getNeighborDetails(crcCaseNeighbor);
          const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
          mutator.set(referralRequestEKID, crcCaseEKID);
          if (crcCaseEKID) crcCaseEKIDs.push(crcCaseEKID);

          const agencyNeighbor = neighborsList.find((neighbor) => getNeighborESID(neighbor) === agencyESID);
          const referralAgency :Map = getNeighborDetails(agencyNeighbor);
          const referralAgencyName = getPropertyValue(referralAgency, [NAME, 0]);
          agencyNameByReferralRequestEKID.set(referralRequestEKID, referralAgencyName);
        });
      });

      filter = {
        entityKeyIds: crcCaseEKIDs,
        destinationEntitySetIds: [statusESID],
        sourceEntitySetIds: [chargesESID, peopleESID, staffESID],
      };
      response = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId: crcCaseESID, filter })
      );
      if (response.error) throw response.error;
      crcCaseNeighborMap = fromJS(response.data);

      const personEKIDs :UUID[] = [];
      crcCaseNeighborMap.forEach((neighborsList :List) => {
        const personNeighbor = neighborsList.find((neighbor) => getNeighborESID(neighbor) === peopleESID);
        if (isDefined(personNeighbor)) {
          const personEKID :?UUID = getEntityKeyId(getNeighborDetails(personNeighbor));
          if (personEKID) personEKIDs.push(personEKID);
        }
      });

      const personDetailsESID :UUID = yield select(selectEntitySetId(PERSON_DETAILS));

      filter = {
        entityKeyIds: personEKIDs,
        destinationEntitySetIds: [personDetailsESID],
        sourceEntitySetIds: [],
      };
      response = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId: peopleESID, filter })
      );
      if (response.error) throw response.error;
      personGenderByPersonEKID = fromJS(response.data).map((neighborsList :List) => {
        const personDetails = getNeighborDetails(neighborsList.get(0, Map()));
        const gender = getPropertyValue(personDetails, [GENDER, 0]);
        return gender;
      });
    }

    const personByCRCCaseEKID :Map = Map().withMutations((mutator) => {
      crcCaseNeighborMap.forEach((neighborsList :List, crcCaseEKID :UUID) => {
        const personNeighbor = neighborsList.find((neighbor) => getNeighborESID(neighbor) === peopleESID);
        if (isDefined(personNeighbor)) {
          mutator.set(crcCaseEKID, getNeighborDetails(personNeighbor));
        }
      });
    });

    referralRequestEKIDs = filterReferralRequestsByCharge(
      selectedChargeName,
      referralRequestEKIDs,
      crcCaseEKIDByReferralRequestEKID,
      crcCaseNeighborMap,
      chargesESID,
    );

    referralRequestEKIDs = filterReferralRequestsByRace(
      selectedRace,
      referralRequestEKIDs,
      crcCaseEKIDByReferralRequestEKID,
      personByCRCCaseEKID,
    );

    referralRequestEKIDs = filterReferralRequestsByGender(
      selectedGender,
      referralRequestEKIDs,
      crcCaseEKIDByReferralRequestEKID,
      personByCRCCaseEKID,
      personGenderByPersonEKID,
    );

    if (onlyRepeatReferrals) {
      const people :List = personByCRCCaseEKID.valueSeq().toList();
      const personEKIDsToInclude :UUID[] = getPersonEKIDsWithMultipleReferrals(people);

      referralRequestEKIDs = filterReferralRequestsByPeople(
        personEKIDsToInclude,
        referralRequestEKIDs,
        crcCaseEKIDByReferralRequestEKID,
        personByCRCCaseEKID,
      );
    }

    const dataTable :List = List().withMutations((mutator :List) => {
      referralRequestEKIDs.forEach((referralRequestEKID :UUID) => {

        const referralRequest = referralRequestByEKID.get(referralRequestEKID, Map());
        const dateTimeReferred = getPropertyValue(referralRequest, [DATETIME_COMPLETED, 0]);
        const dateReferred = formatAsDate(dateTimeReferred);

        const crcCaseEKID = crcCaseEKIDByReferralRequestEKID.get(referralRequestEKID, '');
        const crcCaseNeighbors :List = crcCaseNeighborMap.get(crcCaseEKID, List());

        const chargeNeighbor = crcCaseNeighbors.find((neighbor) => getNeighborESID(neighbor) === chargesESID);
        let chargeName = '';
        if (isDefined(chargeNeighbor)) {
          const charge = getNeighborDetails(chargeNeighbor);
          chargeName = getPropertyValue(charge, [NAME, 0]);
        }

        const person = personByCRCCaseEKID.get(crcCaseEKID, Map());
        const personEKID :?UUID = getEntityKeyId(person);
        const personName = getPersonName(person);
        const personRace = getPropertyValue(person, [RACE, 0]);
        const personGender = personGenderByPersonEKID.get(personEKID, '');
        let ageAtReferral = '';
        const dob = getPropertyValue(person, [DOB, 0]);
        const { years } = DateTime.fromISO(dateTimeReferred).diff(DateTime.fromISO(dob), 'years').toObject();
        if (years) ageAtReferral = Math.floor(years);

        const staffNeighbor = crcCaseNeighbors.find((neighbor) => getNeighborESID(neighbor) === staffESID);
        let staffName = '';
        if (isDefined(staffNeighbor)) {
          const staff = getNeighborDetails(staffNeighbor);
          staffName = getPersonName(staff);
        }

        const statuses = crcCaseNeighbors
          .filter((neighbor) => getNeighborESID(neighbor) === statusESID)
          .map((neighbor) => getNeighborDetails(neighbor));
        let dateOfIntake = '';
        const intakeStatus = statuses.find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === INTAKE);
        if (isDefined(intakeStatus)) {
          const dateTimeOfIntake = getPropertyValue(intakeStatus, [EFFECTIVE_DATE, 0]);
          dateOfIntake = formatAsDate(dateTimeOfIntake);
        }
        let outcome = '';
        const closedStatus = statuses.find((status) => getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CLOSED);
        if (isDefined(closedStatus)) {
          outcome = getPropertyValue(closedStatus, [NOTES, 0]);
        }

        let referralAgency = '';
        if (agencyName) referralAgency = agencyName;
        else referralAgency = agencyNameByReferralRequestEKID.get(referralRequestEKID, '');

        const tableRow = OrderedMap()
          .set(HEADERS.personName, personName)
          .set(HEADERS.referralAgency, referralAgency)
          .set(HEADERS.dateReferred, dateReferred)
          .set(HEADERS.charge, chargeName)
          .set(HEADERS.dateOfIntake, dateOfIntake)
          .set(HEADERS.outcome, outcome)
          .set(HEADERS.personRace, personRace)
          .set(HEADERS.personGender, personGender)
          .set(HEADERS.ageAtReferral, ageAtReferral)
          .set(HEADERS.staff, staffName);
        mutator.push(tableRow);
      });
    })
      .sortBy((row) => row.get(HEADERS.personName, '').split(' ')[1]);

    const csv = Papa.unparse(dataTable.toJS());
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    let fileName = 'Referrals';
    if (agencyName) fileName = `${agencyName}_${fileName}`;
    FS.saveAs(blob, fileName.concat('.csv'));

    yield put(downloadReferrals.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(downloadReferrals.failure(id, error));
  }
  finally {
    yield put(downloadReferrals.finally(id));
  }
  return workerResponse;
}

function* downloadReferralsWatcher() :Saga<*> {

  yield takeEvery(DOWNLOAD_REFERRALS, downloadReferralsWorker);
}

export {
  downloadReferralsWatcher,
  downloadReferralsWorker,
};
