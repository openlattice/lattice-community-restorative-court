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
  CONTACT_INFO,
  CRC_CASE,
  FORM,
  OFFENSE,
  PEOPLE,
  PERSON_DETAILS,
  REFERRAL_REQUEST,
  STAFF,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  DESCRIPTION,
  DOB,
  DUE_DATE,
  EMAIL,
  ETHNICITY,
  GENDER,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  NOTES,
  PHONE_NUMBER,
  PRONOUN,
  RACE,
  ROLE,
  SURNAME,
  TEXT,
} = PropertyTypes;
const { OPENLATTICE_ID_FQN } = Constants;
const { RESPONDENT } = RoleConstants;
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

const populateCompletedForm = (
  selectedForm :Map,
  formNeighborMap :Map,
  person :Map,
  personCaseNeighborMap :Map,
  personNeighborMap :Map,
  referralRequestNeighborMap :Map,
  personEKID :?UUID,
) => {

  const personFirstName :string = getPropertyValue(person, [GIVEN_NAME, 0], EMPTY_VALUE);
  const personMiddleName :string = getPropertyValue(person, [MIDDLE_NAME, 0], EMPTY_VALUE);
  const personLastName :string = getPropertyValue(person, [SURNAME, 0], EMPTY_VALUE);
  const personDOB :string = getPropertyValue(person, [DOB, 0], EMPTY_VALUE);
  const personRace :string = getPropertyValue(person, [RACE, 0], EMPTY_VALUE);
  const personEthnicity :string = getPropertyValue(person, [ETHNICITY, 0], EMPTY_VALUE);

  const personDetailsList :List = personNeighborMap.get(PERSON_DETAILS, List());
  const personDetails :Map = personDetailsList.get(0, Map());
  const personGender :string = getPropertyValue(personDetails, [GENDER, 0], EMPTY_VALUE);
  const personPronoun :string = getPropertyValue(personDetails, [PRONOUN, 0], EMPTY_VALUE);

  const restitutionOwed :string = getPropertyValue(selectedForm, [TEXT, 0], EMPTY_VALUE);
  const dueDate :string = getPropertyValue(selectedForm, [DUE_DATE, 0], EMPTY_VALUE);
  const dispositionDatetime :string = getPropertyValue(selectedForm, [GENERAL_DATETIME, 0], EMPTY_VALUE);
  const dispositionDate = isDefined(dispositionDatetime)
    ? DateTime.fromISO(dispositionDatetime).toISODate()
    : EMPTY_VALUE;
  const datetimeAdministered :string = getPropertyValue(selectedForm, [DATETIME_ADMINISTERED, 0]);
  const dateAdministered = isDefined(datetimeAdministered)
    ? DateTime.fromISO(datetimeAdministered).toISODate()
    : EMPTY_VALUE;

  const staffList :List = formNeighborMap.get(STAFF, List());
  const staffMember :Map = staffList.get(0, Map());
  const staffMemberName :string = getPersonName(staffMember);

  const crcCaseList :List = formNeighborMap.get(CRC_CASE, List());
  const crcCase :Map = crcCaseList.get(0, Map());
  const crcCaseEKID :?UUID = getEntityKeyId(crcCase);
  const crcCaseNumber = getPropertyValue(crcCase, [NOTES, 0]);
  const respondent :Map = personCaseNeighborMap.getIn([ROLE, crcCaseEKID, RESPONDENT, 0], Map());
  const respondentName = getPersonName(respondent);
  const caseIdentifier = `${crcCaseNumber} - ${respondentName}`;

  const peopleAssociatedWithForm = formNeighborMap.get(PEOPLE, List());
  const victim = peopleAssociatedWithForm.find((formPerson :Map) => getEntityKeyId(formPerson) !== personEKID);
  const victimName = getPersonName(victim);

  const contactInfoList :List = personNeighborMap.get(CONTACT_INFO, List());
  const phone = contactInfoList.find((contact :Map) => contact.has(PHONE_NUMBER));
  const phoneNumber = getPropertyValue(phone, [PHONE_NUMBER, 0]);
  const email = contactInfoList.find((contact :Map) => contact.has(EMAIL));
  const emailAddress = getPropertyValue(email, [EMAIL, 0]);

  const referralRequestList :List = personCaseNeighborMap.getIn([REFERRAL_REQUEST, 0, crcCaseEKID], List());
  const referralRequest :Map = referralRequestList.get(0, Map());
  const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
  const offenseList :List = referralRequestNeighborMap.getIn([OFFENSE, referralRequestEKID], List());
  const offense :Map = offenseList.get(0, Map());
  const offenseDescription = getPropertyValue(offense, [DESCRIPTION, 0], EMPTY_VALUE);

  return {
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: personFirstName,
      [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: personMiddleName,
      [getEntityAddressKey(0, PEOPLE, SURNAME)]: personLastName,
      [getEntityAddressKey(0, PEOPLE, DOB)]: personDOB,
      [getEntityAddressKey(0, PEOPLE, RACE)]: personRace,
      [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: personEthnicity,
      [getEntityAddressKey(0, PERSON_DETAILS, GENDER)]: personGender,
      [getEntityAddressKey(0, PERSON_DETAILS, PRONOUN)]: personPronoun,
    },
    [getPageSectionKey(1, 4)]: {
      [getEntityAddressKey(0, CONTACT_INFO, PHONE_NUMBER)]: phoneNumber,
      [getEntityAddressKey(0, CONTACT_INFO, EMAIL)]: emailAddress,
    },
    [getPageSectionKey(1, 2)]: {
      [getEntityAddressKey(0, FORM, TEXT)]: restitutionOwed,
      [getEntityAddressKey(0, FORM, DUE_DATE)]: dueDate,
      [getEntityAddressKey(0, FORM, GENERAL_DATETIME)]: dispositionDate,
      [getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN)]: caseIdentifier,
      [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: staffMemberName,
      [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: dateAdministered,
      [getEntityAddressKey(0, OFFENSE, DESCRIPTION)]: offenseDescription,
    },
    [getPageSectionKey(1, 3)]: {
      [getEntityAddressKey(1, PEOPLE, OPENLATTICE_ID_FQN)]: victimName,
    },
  };
};

export {
  populateCompletedForm,
  prepopulateForm,
};
