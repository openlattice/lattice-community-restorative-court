// @flow

import {
  get,
  getIn,
  remove,
  setIn,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { LangUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { RoleConstants } from '../../profile/src/constants';

const { OPENLATTICE_ID_FQN } = Constants;
const {
  APPEARS_IN,
  CRC_CASE,
  DA_CASE,
  HAS,
  OFFENSE,
  OFFICERS,
  ELECTRONIC_SIGNATURE, // change to ORGANIZATIONS
  PEOPLE,
  PERSON_DETAILS,
  REFERRAL_REQUEST,
  SENT_FROM,
  STAFF,
} = AppTypes;
const { CASE_NUMBER, NOTES, ROLE } = PropertyTypes;
const { VICTIM } = RoleConstants;
const { getEntityAddressKey, getPageSectionKey, parseEntityAddressKey } = DataProcessingUtils;
const { isDefined } = LangUtils;

/*
 * ReferralFormUtils.getStaffInformation
 */

const getStaffInformation = (formData :Object) :Object => {

  let selectedStaffEKID = '';

  const staffEKID = getIn(
    formData,
    [getPageSectionKey(1, 6), getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]
  );
  if (isDefined(staffEKID) && staffEKID.length) {
    selectedStaffEKID = staffEKID;
  }

  const formDataWithoutStaff = remove(formData, getPageSectionKey(1, 6));

  return { formDataWithoutStaff, selectedStaffEKID };
};

/*
 * ReferralFormUtils.getVictimInformation
 */

const getVictimInformation = (formData :Object) :Object => {

  let existingVictimEKIDs = [];
  let existingVictimOrgEKIDs = [];

  const existingPeopleSelected = getIn(
    formData,
    [getPageSectionKey(1, 2), getEntityAddressKey(0, PEOPLE, OPENLATTICE_ID_FQN)]
  );
  if (isDefined(existingPeopleSelected) && existingPeopleSelected.length) {
    existingVictimEKIDs = existingPeopleSelected;
  }

  let formDataWithoutVictimsArray = remove(formData, getPageSectionKey(1, 2));

  const existingOrgsSelected = getIn(
    formData,
    // change to ORGANIZATIONS:
    [getPageSectionKey(1, 4), getEntityAddressKey(0, ELECTRONIC_SIGNATURE, OPENLATTICE_ID_FQN)]
  );
  if (isDefined(existingOrgsSelected) && existingOrgsSelected.length) {
    existingVictimOrgEKIDs = existingOrgsSelected;
  }

  formDataWithoutVictimsArray = remove(formDataWithoutVictimsArray, getPageSectionKey(1, 4));

  return { existingVictimEKIDs, existingVictimOrgEKIDs, formDataWithoutVictimsArray };
};

/*
 * ReferralFormUtils.getVictimAssociations
 */

const getVictimAssociations = (
  formData :Object,
  existingVictimEKIDs :string[],
  existingVictimOrgEKIDs :string[],
) :Array<Array<*>> => {

  const associations = [];
  existingVictimEKIDs.forEach((ekid :UUID) => {
    // $FlowFixMe
    associations.push([APPEARS_IN, ekid, PEOPLE, 0, CRC_CASE, { [ROLE]: [VICTIM] }]);
  });

  const newVictimPeople = get(formData, getPageSectionKey(1, 3));
  if (isDefined(newVictimPeople)) {
    newVictimPeople.forEach((person :Object, index :number) => {
      // $FlowFixMe
      associations.push([APPEARS_IN, index, PEOPLE, 0, CRC_CASE, { [ROLE]: [VICTIM] }]);
      associations.push([HAS, index, PEOPLE, 0, PERSON_DETAILS]);
    });
  }

  existingVictimOrgEKIDs.forEach((ekid :UUID) => {
    // change to ORGANIZATIONS:
    // $FlowFixMe
    associations.push([APPEARS_IN, ekid, ELECTRONIC_SIGNATURE, 0, CRC_CASE, { [ROLE]: [VICTIM] }]);
  });

  const newVictimOrgs = get(formData, getPageSectionKey(1, 3));
  if (isDefined(newVictimOrgs)) {
    newVictimOrgs.forEach((person :Object, index :number) => {
      // change to ORGANIZATIONS:
      // $FlowFixMe
      associations.push([APPEARS_IN, index, ELECTRONIC_SIGNATURE, 0, CRC_CASE, { [ROLE]: [VICTIM] }]);
    });
  }

  return associations;
};

/*
 * ReferralFormUtils.getOptionalAssociations
 */

const getOptionalAssociations = (formData :Object) :Array<Array<*>> => {

  const associations = [];

  const section1Data = get(formData, getPageSectionKey(1, 1));
  const section1Keys = Object.keys(section1Data);

  const officerKey = section1Keys.find((eak :string) => {
    const { entitySetName } = parseEntityAddressKey(eak);
    return entitySetName === OFFICERS.toString();
  });
  if (isDefined(officerKey)) {
    associations.push([SENT_FROM, 0, REFERRAL_REQUEST, 0, OFFICERS, {}]);
  }

  const offenseKey = section1Keys.find((eak :string) => {
    const { entitySetName } = parseEntityAddressKey(eak);
    return entitySetName === OFFENSE.toString();
  });
  if (isDefined(offenseKey)) {
    associations.push([APPEARS_IN, 0, OFFENSE, 0, REFERRAL_REQUEST, {}]);
  }

  return associations;
};

/*
 * ReferralFormUtils.addCRCCaseNumberToFormData
 */

const addCRCCaseNumberToFormData = (formData :Object) :Object => {

  const daCaseNumber = getIn(
    formData,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, DA_CASE, CASE_NUMBER)]
  );

  const updatedFormData = setIn(
    formData,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, CRC_CASE, NOTES)],
    daCaseNumber
  );

  return updatedFormData;
};

export {
  addCRCCaseNumberToFormData,
  getOptionalAssociations,
  getStaffInformation,
  getVictimAssociations,
  getVictimInformation,
};
