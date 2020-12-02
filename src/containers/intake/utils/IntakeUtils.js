// @flow
import { List, Map } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DataUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { FQN, UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { EMPTY_VALUE, RoleConstants } from '../../profile/src/constants';

const { VICTIM } = RoleConstants;
const {
  DA_CASE,
  OFFENSE,
  OFFICERS,
  PEOPLE,
  REFERRAL_REQUEST,
} = AppTypes;
const {
  CASE_NUMBER,
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

const getPersonData = (person :Map, index :number) => {
  const fqns = [GIVEN_NAME, MIDDLE_NAME, SURNAME, DOB, RACE, ETHNICITY];
  const result = {};
  fqns.forEach((fqn :FQN) => {
    const value = getPropertyValue(person, [fqn, 0], EMPTY_VALUE);
    result[getEntityAddressKey(index, PEOPLE, fqn)] = value;
  });
  return result;
};

const populateFormData = (
  person :Map,
  selectedCaseEKID :?UUID,
  referralRequest :Map,
  personCaseNeighborMap :Map,
  referralRequestNeighborMap :Map
) :Object => {

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
  const victimFormData = victims.toJS().map((victim :Object) => getPersonData(victim, -1));

  const formData = {
    [getPageSectionKey(1, 1)]: getPersonData(person, 0),
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
