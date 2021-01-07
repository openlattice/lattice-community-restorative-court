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
  AGENCY,
  CHARGES,
  CHARGE_EVENT,
  DA_CASE,
  OFFICERS,
  ORGANIZATIONS,
  PEOPLE,
  REFERRAL_REQUEST,
} = AppTypes;
const {
  CASE_NUMBER,
  DATETIME_COMPLETED,
  DA_CASE_NUMBER,
  DOB,
  ETHNICITY,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  NAME,
  ORGANIZATION_NAME,
  RACE,
  ROLE,
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
  const datetimeOfReferral = getPropertyValue(referralRequest, [DATETIME_COMPLETED, 0], EMPTY_VALUE);
  const dateOfReferral = DateTime.fromISO(datetimeOfReferral).toISODate();

  const agencyList = referralRequestNeighborMap.getIn([AGENCY, referralRequestEKID], List());
  const agency :Map = agencyList.get(0, Map());
  const agencyName = getPropertyValue(agency, [NAME, 0], EMPTY_VALUE);

  const officerList = referralRequestNeighborMap.getIn([OFFICERS, referralRequestEKID], List());
  const officer :Map = officerList.get(0, Map());
  const officerFirstName = getPropertyValue(officer, [GIVEN_NAME, 0], EMPTY_VALUE);
  const officerLastName = getPropertyValue(officer, [SURNAME, 0], EMPTY_VALUE);

  const daCaseList = referralRequestNeighborMap.getIn([DA_CASE, referralRequestEKID], List());
  const daCase :Map = daCaseList.get(0, Map());
  const daCaseNumber = getPropertyValue(daCase, [DA_CASE_NUMBER, 0], EMPTY_VALUE);
  const caseNumber = getPropertyValue(daCase, [CASE_NUMBER, 0], EMPTY_VALUE);
  const datetimeOfIncident = getPropertyValue(daCase, [GENERAL_DATETIME, 0], EMPTY_VALUE);
  const dateOfIncidentDateTimeObj = DateTime.fromISO(datetimeOfIncident);
  const dateOfIncident = dateOfIncidentDateTimeObj.isValid ? dateOfIncidentDateTimeObj.toISODate() : undefined;

  const chargesList :List = personCaseNeighborMap.getIn([CHARGES, selectedCaseEKID], List());
  const charge :Map = chargesList.get(0, Map());
  const chargeName = getPropertyValue(charge, [NAME, 0], EMPTY_VALUE);

  const chargeEventsList :List = personCaseNeighborMap.getIn([CHARGE_EVENT, selectedCaseEKID], List());
  const chargeEvent :Map = chargeEventsList.get(0, Map());
  const chargeEventDateTime = getPropertyValue(chargeEvent, [DATETIME_COMPLETED, 0]);
  const chargeEventDateTimeObj = DateTime.fromISO(chargeEventDateTime);
  const chargeEventDate = chargeEventDateTimeObj.isValid ? chargeEventDateTimeObj.toISODate() : undefined;

  const victims :List = personCaseNeighborMap.getIn([ROLE, selectedCaseEKID, VICTIM], List());
  const victimPeople :List = victims.filter((victim :Map) => !victim.has(ORGANIZATION_NAME));
  const victimPeopleFormData = victimPeople.toJS().map((victim :Object) => getPersonData(victim, -1));
  const victimOrgs :List = victims.filter((victim :Map) => victim.has(ORGANIZATION_NAME));
  const victimOrgsFormData = victimOrgs.toJS().map((victim :Object) => {
    const orgName = getPropertyValue(victim, [ORGANIZATION_NAME, 0], EMPTY_VALUE);
    return {
      [getEntityAddressKey(-1, ORGANIZATIONS, ORGANIZATION_NAME)]: orgName,
    };
  });

  const formData = {
    [getPageSectionKey(1, 2)]: getPersonData(person, 0),
    [getPageSectionKey(1, 3)]: victimPeopleFormData,
    [getPageSectionKey(1, 4)]: victimOrgsFormData,
    [getPageSectionKey(1, 5)]: {
      [getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)]: dateOfReferral,
      [getEntityAddressKey(0, OFFICERS, GIVEN_NAME)]: officerFirstName,
      [getEntityAddressKey(0, OFFICERS, SURNAME)]: officerLastName,
      [getEntityAddressKey(0, AGENCY, NAME)]: agencyName,
      [getEntityAddressKey(0, DA_CASE, DA_CASE_NUMBER)]: daCaseNumber,
      [getEntityAddressKey(0, DA_CASE, CASE_NUMBER)]: caseNumber,
      [getEntityAddressKey(0, DA_CASE, GENERAL_DATETIME)]: dateOfIncident,
      [getEntityAddressKey(0, CHARGES, NAME)]: chargeName,
      [getEntityAddressKey(0, CHARGE_EVENT, DATETIME_COMPLETED)]: chargeEventDate,
    },
  };

  return formData;
};

/* eslint-disable import/prefer-default-export */
export {
  populateFormData
};
