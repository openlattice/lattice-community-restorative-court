// @flow
import { List, Map } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DataUtils } from 'lattice-utils';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { FormConstants } from '../../profile/src/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { COMMUNICATION, FORM, PERSON_DETAILS } = AppTypes;
const {
  DATETIME_ADMINISTERED,
  LANGUAGE,
  INTERESTS_AND_HOBBIES,
  NAME,
  RELIGION,
  TEXT,
} = PropertyTypes;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;
const { getPropertyValue } = DataUtils;

export default function prepopulateForm(personNeighborMap :Map) :Object {

  const forms :List = personNeighborMap.get(FORM, List());
  const personInformationForm :?Map = forms
    .find((form :Map) => getPropertyValue(form, [NAME, 0]) === PEACEMAKER_INFORMATION_FORM);
  const datetimeAdministered = getPropertyValue(personInformationForm, [DATETIME_ADMINISTERED, 0]);
  const text = getPropertyValue(personInformationForm, [TEXT, 0]);

  const communication :Map = personNeighborMap.getIn([COMMUNICATION, 0], Map());
  const language = getPropertyValue(communication.toJS(), LANGUAGE);

  const personDetails :Map = personNeighborMap.getIn([PERSON_DETAILS, 0], Map());
  const interestsAndHobbies = getPropertyValue(personDetails, [INTERESTS_AND_HOBBIES, 0]);
  const religion = getPropertyValue(personDetails, [RELIGION, 0]);

  const formData = {
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, COMMUNICATION, LANGUAGE)]: language,
      [getEntityAddressKey(0, PERSON_DETAILS, INTERESTS_AND_HOBBIES)]: interestsAndHobbies,
      [getEntityAddressKey(0, PERSON_DETAILS, RELIGION)]: religion,
      [getEntityAddressKey(0, FORM, TEXT)]: text,
    },
    [getPageSectionKey(1, 2)]: {
      [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: datetimeAdministered,
      [getEntityAddressKey(0, FORM, NAME)]: PEACEMAKER_INFORMATION_FORM,
    },
  };

  return formData;
}
