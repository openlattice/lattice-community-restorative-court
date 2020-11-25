// @flow
import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DataUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { getPersonName } from '../../../utils/people';
import { EMPTY_VALUE, RoleConstants } from '../../profile/src/constants';

const { OPENLATTICE_ID_FQN } = Constants;
const { VICTIM } = RoleConstants;
const {
  CRC_CASE,
  DA_CASE,
  FORM,
  OFFENSE,
  OFFICERS,
  PEOPLE,
  REFERRAL_REQUEST,
  STAFF,
} = AppTypes;
const {
  CASE_NUMBER,
  DATETIME_ADMINISTERED,
  DATETIME_COMPLETED,
  DA_CASE_NUMBER,
  DESCRIPTION,
  DOB,
  ETHNICITY,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  RACE,
  ROLE,
  SOURCE,
  SURNAME,
} = PropertyTypes;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;

const populateFormData = (
  person :Map,
  selectedCaseEKID :UUID,
  referralRequest :Map,
  personCaseNeighborMap :Map,
  referralRequestNeighborMap :Map
) :Object => {

  const personFirstName :string = getPropertyValue(person, [GIVEN_NAME, 0], EMPTY_VALUE);
  const personMiddleName :string = getPropertyValue(person, [MIDDLE_NAME, 0], EMPTY_VALUE);
  const personLastName :string = getPropertyValue(person, [SURNAME, 0], EMPTY_VALUE);
  const personDOB :string = getPropertyValue(person, [DOB, 0], EMPTY_VALUE);
  const personRace :string = getPropertyValue(person, [RACE, 0], EMPTY_VALUE);
  const personEthnicity :string = getPropertyValue(person, [ETHNICITY, 0], EMPTY_VALUE);

  const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
  const referringSource = getPropertyValue(referralRequest, [SOURCE, 0], EMPTY_VALUE);
  const datetimeOfReferral = getPropertyValue(referralRequest, [DATETIME_COMPLETED, 0], EMPTY_VALUE);
  const dateOfReferral = DateTime.fromISO(datetimeOfReferral).toISODate();

  const officerList = referralRequestNeighborMap.getIn([OFFICERS, referralRequestEKID], List());
  const officer :Map = officerList.get(0, Map());
  const officerFirstName = getPropertyValue(officer, [GIVEN_NAME, 0], EMPTY_VALUE);
  const officerLastName = getPropertyValue(officer, [SURNAME, 0], EMPTY_VALUE);

  const daCaseList = referralRequestNeighborMap.getIn([DA_CASE, referralRequestEKID], List());
  const daCase :Map = daCaseList.get(0, Map());
  const daCaseNumber = getPropertyValue(daCase, [DA_CASE_NUMBER, 0], EMPTY_VALUE);
  const caseNumber = getPropertyValue(daCase, [CASE_NUMBER, 0], EMPTY_VALUE);
  const datetimeOfIncident = getPropertyValue(daCase, [GENERAL_DATETIME, 0], EMPTY_VALUE);
  const dateOfIncident = DateTime.fromISO(datetimeOfIncident).toISODate();

  const offenseList = referralRequestNeighborMap.getIn([OFFENSE, referralRequestEKID], List());
  const offense :Map = offenseList.get(0, Map());
  const offenseDescription = getPropertyValue(offense, [DESCRIPTION, 0], EMPTY_VALUE);

  const victims :List = personCaseNeighborMap.getIn([ROLE, selectedCaseEKID, VICTIM], List());
  const victimFormData = victims.toJS().map((victim :Object) => {
    const firstName = getPropertyValue(victim, [GIVEN_NAME, 0], EMPTY_VALUE);
    const middleName = getPropertyValue(victim, [MIDDLE_NAME, 0], EMPTY_VALUE);
    const lastName = getPropertyValue(victim, [SURNAME, 0], EMPTY_VALUE);
    const dob = getPropertyValue(victim, [DOB, 0], EMPTY_VALUE);
    const race = getPropertyValue(victim, [RACE, 0], EMPTY_VALUE);
    const ethnicity = getPropertyValue(victim, [ETHNICITY, 0], EMPTY_VALUE);
    return {
      [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: firstName,
      [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: middleName,
      [getEntityAddressKey(-1, PEOPLE, SURNAME)]: lastName,
      [getEntityAddressKey(-1, PEOPLE, DOB)]: dob,
      [getEntityAddressKey(-1, PEOPLE, RACE)]: race,
      [getEntityAddressKey(-1, PEOPLE, ETHNICITY)]: ethnicity,
    };
  });

  const formData = {
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: personFirstName,
      [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: personMiddleName,
      [getEntityAddressKey(0, PEOPLE, SURNAME)]: personLastName,
      [getEntityAddressKey(0, PEOPLE, DOB)]: personDOB,
      [getEntityAddressKey(0, PEOPLE, RACE)]: personRace,
      [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: personEthnicity,
    },
    [getPageSectionKey(1, 2)]: victimFormData,
    [getPageSectionKey(1, 3)]: {
      [getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)]: dateOfReferral,
      [getEntityAddressKey(0, OFFICERS, GIVEN_NAME)]: officerFirstName,
      [getEntityAddressKey(0, OFFICERS, SURNAME)]: officerLastName,
      [getEntityAddressKey(0, REFERRAL_REQUEST, SOURCE)]: referringSource,
      [getEntityAddressKey(0, DA_CASE, DA_CASE_NUMBER)]: daCaseNumber,
      [getEntityAddressKey(0, DA_CASE, CASE_NUMBER)]: caseNumber,
      [getEntityAddressKey(0, DA_CASE, GENERAL_DATETIME)]: dateOfIncident,
      [getEntityAddressKey(0, OFFENSE, DESCRIPTION)]: offenseDescription,
    },
  };

  return formData;
};

export {
  populateFormData
};
