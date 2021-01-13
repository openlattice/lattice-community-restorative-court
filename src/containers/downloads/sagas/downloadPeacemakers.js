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
const { ATTENDED } = ContactActivityConstants;
const {
  CONTACT_ACTIVITY,
  CRC_CASE,
  FORM,
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

    const formESID :UUID = yield select(selectEntitySetId(FORM));
    const namePTID :UUID = yield select(selectPropertyTypeId(NAME));

    const searchOptions = {
      entitySetIds: [formESID],
      start: 0,
      maxHits: 10000,
      constraints: [{
        constraints: [{
          type: 'advanced',
          searchFields: [
            { searchTerm: PEACEMAKER_INFORMATION_FORM, property: namePTID },
          ],
        }]
      }]
    };

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
    const people :List = List().asMutable();

    formNeighbors.forEach((neighborsList :List) => {
      const person :Map = getNeighborDetails(neighborsList.get(0, Map()));
      people.push(person);
      const personEKID :?UUID = getEntityKeyId(person);
      if (personEKID) personEKIDs.push(personEKID);
    });

    const crcCaseESID :UUID = yield select(selectEntitySetId(CRC_CASE));
    const contactActivityESID :UUID = yield select(selectEntitySetId(CONTACT_ACTIVITY));

    filter = {
      entityKeyIds: personEKIDs,
      destinationEntitySetIds: [crcCaseESID],
      sourceEntitySetIds: [contactActivityESID],
    };
    response = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter({ entitySetId: peopleESID, filter })
    );
    if (response.error) throw response.error;
    const personNeighbors :Map = fromJS(response.data);

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
          const circleDateTime = getPropertyValue(circleStatus, [EFFECTIVE_DATE, 0]);
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
        const form = peacemakerInfoFormsByEKID.get(personEKID, Map());
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
        const participated = contactOutcome === ATTENDED ? 'Yes' : 'No';

        const mostRecentCircleDateTime = mostRecentCircleDateTimeByPersonEKID.get(personEKID, '');
        const mostRecentCircle = formatAsDate(mostRecentCircleDateTime);

        const tableRow = OrderedMap()
          .set(HEADERS.personName, personName)
          .set(HEADERS.race, race)
          .set(HEADERS.dateTrained, dateTrained)
          .set(HEADERS.mostRecentCircle, mostRecentCircle)
          .set(HEADERS.mostRecentlyContacted, mostRecentlyContacted)
          .set(HEADERS.participated, participated);
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
