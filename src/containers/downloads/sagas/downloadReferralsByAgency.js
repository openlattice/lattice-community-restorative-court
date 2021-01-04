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
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
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
import { CaseStatusConstants } from '../../profile/src/constants';
import { DOWNLOAD_REFERRALS_BY_AGENCY, downloadReferralsByAgency } from '../actions';

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;
const { isDefined } = LangUtils;
const { INTAKE } = CaseStatusConstants;
const {
  AGENCY,
  CHARGES,
  CRC_CASE,
  PEOPLE,
  REFERRAL_REQUEST,
  STAFF,
  STATUS,
} = AppTypes;
const { DATETIME_COMPLETED, EFFECTIVE_DATE, NAME } = PropertyTypes;

const LOG = new Logger('DashboardSagas');

const HEADERS = {
  personName: 'Name',
  referralAgency: 'Referral Agency',
  dateReferred: 'Date Referred',
  charge: 'Charge',
  dateOfIntake: 'Date of Intake',
  staff: 'CRC Staff Assigned',
};

function* downloadReferralsByAgencyWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(downloadReferralsByAgency.request(id));
    const agency :Map = action.value;
    const agencyName = getPropertyValue(agency, [NAME, 0]);
    const agencyEKID :?UUID = getEntityKeyId(agency);

    const agencyESID :UUID = yield select(selectEntitySetId(AGENCY));
    const referralRequestESID :UUID = yield select(selectEntitySetId(REFERRAL_REQUEST));

    let filter = {
      entityKeyIds: [agencyEKID],
      destinationEntitySetIds: [],
      sourceEntitySetIds: [referralRequestESID],
    };

    let response :Object = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: agencyESID, filter })
    );
    if (response.error) throw response.error;
    console.log('response.data ', response.data);
    const referralRequestEKIDs :UUID[] = [];
    const referralRequestByEKID = Map().withMutations((mutator) => {
      fromJS(response.data[agencyEKID]).forEach((neighbor :Map) => {
        const referralRequest :Map = getNeighborDetails(neighbor);
        const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
        mutator.set(referralRequestEKID, referralRequest);
        if (referralRequestEKID) referralRequestEKIDs.push(referralRequestEKID);
      });
    });
    console.log('referralRequestEKIDs ', referralRequestEKIDs);
    console.log('referralRequestByEKID ', referralRequestByEKID.toJS());

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));

    filter = {
      entityKeyIds: referralRequestEKIDs,
      destinationEntitySetIds: [crcCaseESID],
      sourceEntitySetIds: [],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: referralRequestESID, filter })
    );
    if (response.error) throw response.error;
    const crcCaseEKIDs :UUID[] = [];
    console.log('crcCaseEKIDs ', crcCaseEKIDs);
    const crcCaseEKIDByReferralRequestEKID = Map().withMutations((mutator) => {
      fromJS(response.data).forEach((neighborsList :List, referralRequestEKID :UUID) => {
        const crcCase :Map = getNeighborDetails(neighborsList.get(0));
        const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
        mutator.set(referralRequestEKID, crcCaseEKID);
        if (crcCaseEKID) crcCaseEKIDs.push(crcCaseEKID);
      });
    });

    const chargesESID :UUID = yield select(selectEntitySetId(CHARGES));
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));
    const staffESID :UUID = yield select(selectEntitySetId(STAFF));
    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

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
    const crcCaseNeighborMap = fromJS(response.data);

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

        const personNeighbor = crcCaseNeighbors.find((neighbor) => getNeighborESID(neighbor) === peopleESID);
        let personName = '';
        if (isDefined(personNeighbor)) {
          const person = getNeighborDetails(personNeighbor);
          personName = getPersonName(person);
        }

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

        const tableRow = OrderedMap()
          .set(HEADERS.personName, personName)
          .set(HEADERS.referralAgency, agencyName)
          .set(HEADERS.dateReferred, dateReferred)
          .set(HEADERS.charge, chargeName)
          .set(HEADERS.dateOfIntake, dateOfIntake)
          .set(HEADERS.staff, staffName);
        mutator.push(tableRow);
      });
    })
      .sortBy((row) => row[HEADERS.personName].split(' ')[1]);

    const csv = Papa.unparse(dataTable.toJS());
    const blob = new Blob([csv], {
      type: 'application/json'
    });
    const name = `${agencyName}_Referrals`;
    FS.saveAs(blob, name.concat('.csv'));

    yield put(downloadReferralsByAgency.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(downloadReferralsByAgency.failure(id, error));
  }
  finally {
    yield put(downloadReferralsByAgency.finally(id));
  }
  return workerResponse;
}

function* downloadReferralsByAgencyWatcher() :Saga<*> {

  yield takeEvery(DOWNLOAD_REFERRALS_BY_AGENCY, downloadReferralsByAgencyWorker);
}

export {
  downloadReferralsByAgencyWatcher,
  downloadReferralsByAgencyWorker,
};
