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
import { getAssociationDetails, getNeighborDetails, getNeighborESID } from '../../../utils/data';
import { getPersonName } from '../../../utils/people';
import { getSearchTerm, getUTCDateRangeSearchString } from '../../../utils/search';
import {
  CaseStatusConstants,
  ContactActivityConstants,
  FormConstants,
  RoleConstants
} from '../../profile/src/constants';
import { DOWNLOAD_PEACEMAKERS, downloadPeacemakers } from '../actions';

const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;
const { isDefined } = LangUtils;
const { CIRCLE } = CaseStatusConstants;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;
const { PEACEMAKER } = RoleConstants;
const { ATTENDED, DID_NOT_ATTEND } = ContactActivityConstants;
const {
  CONTACT_ACTIVITY,
  CRC_CASE,
  FORM,
  PEACEMAKER_STATUS,
  PEOPLE,
  STATUS,
} = AppTypes;
const {
  CONTACT_DATETIME,
  EFFECTIVE_DATE,
  GENERAL_DATETIME,
  NAME,
  OUTCOME,
  RACE,
  ROLE,
} = PropertyTypes;

const LOG = new Logger('DashboardSagas');

const HEADERS = {
  personName: 'Peacemaker Name',
  race: 'Race',
  dateTrained: 'Date Trained',
  mostRecentCircle: 'Most Recent Circle',
  mostRecentlyContacted: 'Most Recently Contacted',
  participated: 'Participated after Most Recent Contact',
  status: 'Status',
};

function* downloadPeacemakersWorker(action :SequenceAction) :Saga<*> {

  const { id } = action;
  const workerResponse = {};

  try {
    yield put(downloadPeacemakers.request(id));

    const {
      endDate,
      selectedRace,
      selectedStatus,
      startDate,
    } = action.value;

    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const namePTID :UUID = yield select(selectPropertyTypeId(NAME));
    const generalDateTimePTID :UUID = yield select(selectPropertyTypeId(GENERAL_DATETIME));
    const startDateAsDateTime :DateTime = DateTime.fromISO(startDate);
    const endDateAsDateTime :DateTime = DateTime.fromISO(endDate);

    const searchOptions = {
      entitySetIds: [formESID],
      start: 0,
      maxHits: 10000,
      constraints: [{
        min: 1,
        constraints: [{
          searchTerm: getSearchTerm(namePTID, PEACEMAKER_INFORMATION_FORM),
          fuzzy: false
        }]
      }]
    };

    if (startDate && endDate) {
      searchOptions.constraints.push({
        min: 1,
        constraints: [{
          searchTerm: getUTCDateRangeSearchString(
            generalDateTimePTID,
            'day',
            startDateAsDateTime,
            endDateAsDateTime
          ),
          fuzzy: false
        }]
      });
    }

    let response = yield call(searchEntitySetDataWorker, searchEntitySetData(searchOptions));
    if (response.error) throw response.error;
    const peacemakerInfoForms = fromJS(response.data.hits);

    const peacemakerInfoFormsByEKID = Map().withMutations((mutator) => {
      peacemakerInfoForms.forEach((form :Map) => {
        mutator.set(getEntityKeyId(form), form);
      });
    });

    const peacemakerInfoFormEKIDs :UUID[] = peacemakerInfoForms.map((form :Map) => getEntityKeyId(form)).toJS();
    const peopleESID :UUID = yield select(selectEntitySetId(PEOPLE));

    let filter = {
      entityKeyIds: peacemakerInfoFormEKIDs,
      destinationEntitySetIds: [],
      sourceEntitySetIds: [peopleESID],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: formESID, filter })
    );
    if (response.error) throw response.error;
    const formNeighbors :Map = fromJS(response.data);
    const personEKIDs :UUID[] = [];
    let people :List = List().asMutable();

    const formEKIDByPersonEKID = Map().withMutations((mutator) => {
      formNeighbors.forEach((neighborsList :List, formEKID :UUID) => {
        const person :Map = getNeighborDetails(neighborsList.get(0, Map()));
        people.push(person);
        const personEKID :?UUID = getEntityKeyId(person);
        if (personEKID) personEKIDs.push(personEKID);

        mutator.set(personEKID, formEKID);
      });
    });

    if (selectedRace) {
      people = people.filter((person :Map) => {
        const race = getPropertyValue(person, [RACE, 0]);
        return race === selectedRace;
      });
    }

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));
    const contactActivityESID :UUID = yield select(selectEntitySetId(CONTACT_ACTIVITY));
    const peacemakerStatusESID :UUID = yield select(selectEntitySetId(PEACEMAKER_STATUS));

    filter = {
      entityKeyIds: personEKIDs,
      destinationEntitySetIds: [crcCaseESID, peacemakerStatusESID],
      sourceEntitySetIds: [contactActivityESID],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: peopleESID, filter })
    );
    if (response.error) throw response.error;

    let personNeighbors :Map = fromJS(response.data);
    if (selectedStatus) {
      const personEKIDsToInclude :UUID[] = [];
      personNeighbors = personNeighbors.filter((neighborsList :List, personEKID :UUID) => {
        const statusNeighbors = neighborsList
          .filter((neighbor :Map) => getNeighborESID(neighbor) === peacemakerStatusESID);
        if (isDefined(statusNeighbors)) {
          const mostRecentStatus = statusNeighbors
            .sortBy((status :Map) => DateTime.fromISO(
              getPropertyValue(getNeighborDetails(status), [EFFECTIVE_DATE, 0])
            ).valueOf())
            .last();
          const statusName = getPropertyValue(getNeighborDetails(mostRecentStatus), [PropertyTypes.STATUS, 0]);
          const statusMatchesSelected = statusName === selectedStatus;
          if (statusMatchesSelected) personEKIDsToInclude.push(personEKID);
          return statusMatchesSelected;
        }
        return false;
      });
      people = people.filter((person :Map) => personEKIDsToInclude.includes(getEntityKeyId(person)));
    }

    const statusByPersonEKID :Map = Map().withMutations((mutator) => {
      personNeighbors.forEach((neighborsList :List, personEKID :UUID) => {
        const statusList :List = neighborsList
          .filter((neighbor :Map) => getNeighborESID(neighbor) === peacemakerStatusESID)
          .map((neighbor :Map) => getNeighborDetails(neighbor));
        mutator.set(personEKID, statusList);
      });
    });

    const contactActivityByPersonEKID :Map = Map().withMutations((mutator) => {
      personNeighbors.forEach((neighborsList :List, personEKID :UUID) => {
        const contactActivityList :List = neighborsList
          .filter((neighbor :Map) => getNeighborESID(neighbor) === contactActivityESID)
          .map((neighbor :Map) => getNeighborDetails(neighbor));
        mutator.set(personEKID, contactActivityList);
      });
    });

    const caseEKIDsToSearch :UUID[] = [];

    const peacemakerCasesByPersonEKID :Map = Map().withMutations((mutator) => {
      personNeighbors.forEach((neighborsList :List, personEKID :UUID) => {
        const caseNeighbors = neighborsList.filter((neighbor :Map) => getNeighborESID(neighbor) === crcCaseESID);
        const casesPersonWasAPeacemakerFor = caseNeighbors.filter((caseNeighbor :Map) => {
          const association = getAssociationDetails(caseNeighbor);
          const role = getPropertyValue(association, [ROLE, 0]);
          return role === PEACEMAKER;
        }).map((caseNeighbor :Map) => getNeighborDetails(caseNeighbor));
        mutator.set(personEKID, casesPersonWasAPeacemakerFor);

        casesPersonWasAPeacemakerFor.forEach((crcCase :Map) => {
          const caseEKID :?UUID = getEntityKeyId(crcCase);
          if (caseEKID) caseEKIDsToSearch.push(caseEKID);
        });
      });
    });

    const statusESID :UUID = yield select(selectEntitySetId(STATUS));

    filter = {
      entityKeyIds: caseEKIDsToSearch,
      destinationEntitySetIds: [statusESID],
      sourceEntitySetIds: [],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: crcCaseESID, filter })
    );
    if (response.error) throw response.error;
    const crcCaseNeighbors :Map = fromJS(response.data);

    const circleDateTimeByCaseEKID :Map = Map().withMutations((mutator) => {
      crcCaseNeighbors.forEach((statusNeighborsList :List, crcCaseEKID :UUID) => {
        const circleStatus = statusNeighborsList.find((neighbor :Map) => {
          const status = getNeighborDetails(neighbor);
          return getPropertyValue(status, [PropertyTypes.STATUS, 0]) === CIRCLE;
        });

        if (isDefined(circleStatus)) {
          const circleDateTime = getPropertyValue(getNeighborDetails(circleStatus), [EFFECTIVE_DATE, 0]);
          mutator.set(crcCaseEKID, circleDateTime);
        }
        else {
          mutator.set(crcCaseEKID, '');
        }
      });
    });

    const mostRecentCircleDateTimeByPersonEKID :Map = Map().withMutations((mutator) => {
      peacemakerCasesByPersonEKID.forEach((peacemakerCases :List, personEKID :UUID) => {
        let mostRecentDate = '';
        peacemakerCases.forEach((peacemakerCase :Map) => {
          const peacemakerCaseEKID :?UUID = getEntityKeyId(peacemakerCase);
          const circleDateTime = circleDateTimeByCaseEKID.get(peacemakerCaseEKID, '');
          if (!mostRecentDate) mostRecentDate = circleDateTime;
          else if (DateTime.fromISO(circleDateTime).valueOf() > DateTime.fromISO(mostRecentDate).valueOf()) {
            mostRecentDate = circleDateTime;
          }
        });
        mutator.set(personEKID, mostRecentDate);
      });
    });

    const dataTable :List = List().withMutations((mutator :List) => {

      people.forEach((person :Map) => {
        const personName = getPersonName(person);
        const race = getPropertyValue(person, [RACE, 0]);

        const personEKID :?UUID = getEntityKeyId(person);
        const formEKID = formEKIDByPersonEKID.get(personEKID, '');
        const form = peacemakerInfoFormsByEKID.get(formEKID, Map());
        const dateTimeTrained = getPropertyValue(form, [GENERAL_DATETIME, 0]);
        const dateTrained = formatAsDate(dateTimeTrained);

        const contactActivity :List = contactActivityByPersonEKID.get(personEKID, List());
        const mostRecentContact :List = contactActivity
          .sortBy((contact :Map) => DateTime.fromISO(
            getPropertyValue(contact, [CONTACT_DATETIME, 0])
          ).valueOf())
          .last();
        const contactDateTime = getPropertyValue(mostRecentContact, [CONTACT_DATETIME, 0]);
        const mostRecentlyContacted = formatAsDate(contactDateTime);
        const contactOutcome = getPropertyValue(mostRecentContact, [OUTCOME, 0]);
        let participated = contactOutcome === ATTENDED ? 'Yes' : '';
        if (contactOutcome === DID_NOT_ATTEND) participated = 'No';

        const mostRecentCircleDateTime = mostRecentCircleDateTimeByPersonEKID.get(personEKID, '');
        const mostRecentCircle = formatAsDate(mostRecentCircleDateTime);

        const peacemakerStatuses = statusByPersonEKID.get(personEKID, List());
        const mostRecentStatus = peacemakerStatuses
          .sortBy((status :Map) => DateTime.fromISO(getPropertyValue(status, [EFFECTIVE_DATE, 0])).valueOf())
          .last();
        const status = getPropertyValue(mostRecentStatus, [PropertyTypes.STATUS, 0]);

        const tableRow = OrderedMap()
          .set(HEADERS.personName, personName)
          .set(HEADERS.race, race)
          .set(HEADERS.dateTrained, dateTrained)
          .set(HEADERS.mostRecentCircle, mostRecentCircle)
          .set(HEADERS.mostRecentlyContacted, mostRecentlyContacted)
          .set(HEADERS.participated, participated)
          .set(HEADERS.status, status);
        mutator.push(tableRow);
      });
    })
      .sortBy((row) => row.get(HEADERS.personName, '').split(' ')[1]);

    const csv = Papa.unparse(dataTable.toJS());
    const blob = new Blob([csv], {
      type: 'text/csv'
    });

    const fileName :string = 'CRC_Peacemakers';
    FS.saveAs(blob, fileName.concat('.csv'));

    yield put(downloadPeacemakers.success(id));
  }
  catch (error) {
    workerResponse.error = error;
    LOG.error(action.type, error);
    yield put(downloadPeacemakers.failure(id, error));
  }
  finally {
    yield put(downloadPeacemakers.finally(id));
  }
  return workerResponse;
}

function* downloadPeacemakersWatcher() :Saga<*> {

  yield takeEvery(DOWNLOAD_PEACEMAKERS, downloadPeacemakersWorker);
}

export {
  downloadPeacemakersWatcher,
  downloadPeacemakersWorker,
};
