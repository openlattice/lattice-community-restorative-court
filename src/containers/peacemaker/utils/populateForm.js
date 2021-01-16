// @flow
import { List, Map } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DataUtils } from 'lattice-utils';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { FormConstants } from '../../profile/src/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { getPropertyValue } = DataUtils;
const {
  COMMUNICATION,
  FORM,
  PEACEMAKER_STATUS,
  PERSON_DETAILS,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  EFFECTIVE_DATE,
  GENERAL_DATETIME,
  LANGUAGE,
  INTERESTS_AND_HOBBIES,
  NAME,
  RELIGION,
  STATUS,
  TEXT,
} = PropertyTypes;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;

export default function populateForm(
  personInformationForm :Map,
  personNeighborMap :Map,
  mostRecentStatus :Map
) :Object {

  const datetimeAdministered = getPropertyValue(personInformationForm, [DATETIME_ADMINISTERED, 0]);
  const dateTimeTrained = getPropertyValue(personInformationForm, [GENERAL_DATETIME, 0]);
  const dateTrained = DateTime.fromISO(dateTimeTrained).toISODate();
  const text = getPropertyValue(personInformationForm, [TEXT, 0]);

  const communication :Map = personNeighborMap.getIn([COMMUNICATION, 0], Map());
  const language :List = getPropertyValue(communication, LANGUAGE);
  const languageAsJSArray = List.isList(language) ? language.toJS() : language;

  const personDetailsList :List = personNeighborMap.get(PERSON_DETAILS, List());
  const personDetails :Map = personDetailsList
    .find((details :Map) => details.has(INTERESTS_AND_HOBBIES) || details.has(RELIGION));
  const interestsAndHobbies = getPropertyValue(personDetails, [INTERESTS_AND_HOBBIES, 0]);
  const religion = getPropertyValue(personDetails, [RELIGION, 0]);

  const peacemakerStatus = getPropertyValue(mostRecentStatus, [STATUS, 0]);
  const peacemakerStatusDateTime = getPropertyValue(mostRecentStatus, [EFFECTIVE_DATE, 0]);

  const formData = {
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, COMMUNICATION, LANGUAGE)]: languageAsJSArray,
      [getEntityAddressKey(0, PERSON_DETAILS, INTERESTS_AND_HOBBIES)]: interestsAndHobbies,
      [getEntityAddressKey(0, PERSON_DETAILS, RELIGION)]: religion,
      [getEntityAddressKey(0, FORM, GENERAL_DATETIME)]: dateTrained,
      [getEntityAddressKey(0, PEACEMAKER_STATUS, STATUS)]: peacemakerStatus,
      [getEntityAddressKey(0, FORM, TEXT)]: text,
    },
    [getPageSectionKey(1, 2)]: {
      [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: datetimeAdministered,
      [getEntityAddressKey(0, FORM, NAME)]: PEACEMAKER_INFORMATION_FORM,
      [getEntityAddressKey(0, PEACEMAKER_STATUS, STATUS)]: peacemakerStatusDateTime,
    },
  };

  return formData;
}
