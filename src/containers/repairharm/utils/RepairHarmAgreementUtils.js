// @flow
import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DataUtils, LangUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { getPersonName } from '../../../utils/people';
import { EMPTY_VALUE, RoleConstants } from '../../profile/src/constants';

const {
  CRC_CASE,
  FORM,
  PEOPLE,
  STAFF,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  DUE_DATE,
  GIVEN_NAME,
  MIDDLE_NAME,
  NOTES,
  ROLE,
  SURNAME,
  TEXT,
} = PropertyTypes;
const { OPENLATTICE_ID_FQN } = Constants;
const { PEACEMAKER, RESPONDENT } = RoleConstants;
const { isDefined } = LangUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const prepopulateForm = (person :Map) => {

  const personFirstName :string = getPropertyValue(person, [GIVEN_NAME, 0], EMPTY_VALUE);
  const personMiddleName :string = getPropertyValue(person, [MIDDLE_NAME, 0], EMPTY_VALUE);
  const personLastName :string = getPropertyValue(person, [SURNAME, 0], EMPTY_VALUE);

  return {
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: personFirstName,
      [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: personMiddleName,
      [getEntityAddressKey(0, PEOPLE, SURNAME)]: personLastName,
    },
  };
};

const populateCompletedForm = (selectedForm :Map, formNeighborMap :Map, person :Map, personCaseNeighborMap :Map) => {

  const personFirstName :string = getPropertyValue(person, [GIVEN_NAME, 0], EMPTY_VALUE);
  const personMiddleName :string = getPropertyValue(person, [MIDDLE_NAME, 0], EMPTY_VALUE);
  const personLastName :string = getPropertyValue(person, [SURNAME, 0], EMPTY_VALUE);

  const conditions :List = getPropertyValue(selectedForm, TEXT);
  const dueDate :string = getPropertyValue(selectedForm, [DUE_DATE, 0], EMPTY_VALUE);
  const datetimeAdministered :string = getPropertyValue(selectedForm, [DATETIME_ADMINISTERED, 0]);
  const dateAdministered = isDefined(datetimeAdministered)
    ? DateTime.fromISO(datetimeAdministered).toISODate()
    : EMPTY_VALUE;

  const formEKID :?UUID = getEntityKeyId(selectedForm);
  const staffList :List = formNeighborMap.getIn([formEKID, STAFF], List());
  const staffMember :Map = staffList.get(0, Map());
  const staffMemberName :string = getPersonName(staffMember);

  const crcCaseList :List = formNeighborMap.getIn([formEKID, CRC_CASE], List());
  const crcCase :Map = crcCaseList.get(0, Map());
  const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
  const crcCaseNumber = getPropertyValue(crcCase, [NOTES, 0]);
  const respondent :Map = personCaseNeighborMap.getIn([ROLE, crcCaseEKID, RESPONDENT, 0], Map());
  const respondentName = getPersonName(respondent);
  const caseIdentifier = `${crcCaseNumber} - ${respondentName}`;

  const peacemakers :List = personCaseNeighborMap.getIn([ROLE, crcCaseEKID, PEACEMAKER], List());
  const peacemakerFormData = peacemakers.toJS().map((peacemaker :Object) => {
    const lastName = getPropertyValue(peacemaker, [SURNAME, 0], EMPTY_VALUE);
    const firstName = getPropertyValue(peacemaker, [GIVEN_NAME, 0], EMPTY_VALUE);
    const middleName = getPropertyValue(peacemaker, [MIDDLE_NAME, 0], EMPTY_VALUE);
    return {
      [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: firstName,
      [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: middleName,
      [getEntityAddressKey(-1, PEOPLE, SURNAME)]: lastName,
    };
  });

  return {
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: personFirstName,
      [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: personMiddleName,
      [getEntityAddressKey(0, PEOPLE, SURNAME)]: personLastName,
    },
    [getPageSectionKey(1, 2)]: {
      [getEntityAddressKey(0, FORM, TEXT)]: conditions.toJS(),
      [getEntityAddressKey(0, FORM, DUE_DATE)]: dueDate,
      [getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN)]: caseIdentifier,
      [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: staffMemberName,
      [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: dateAdministered,
    },
    [getPageSectionKey(1, 3)]: peacemakerFormData,
  };
};

export {
  populateCompletedForm,
  prepopulateForm,
};
