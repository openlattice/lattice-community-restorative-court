// @flow

import {
  List,
  Map,
  get,
  getIn,
  remove,
  removeIn,
  setIn,
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DataUtils, LangUtils, ValidationUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { updateFormWithDateAsDateTime } from '../../../utils/form';
import { RoleConstants } from '../../profile/src/constants';

const { OPENLATTICE_ID_FQN } = Constants;
const {
  AGENCY,
  APPEARS_IN,
  CHARGES,
  CHARGE_EVENT,
  CRC_CASE,
  DA_CASE,
  HAS,
  OFFICERS,
  ORGANIZATIONS,
  PEOPLE,
  PERSON_DETAILS,
  REFERRAL_REQUEST,
  REGISTERED_FOR,
  SENT_FROM,
  STAFF,
} = AppTypes;
const {
  CASE_NUMBER,
  DATETIME_COMPLETED,
  GENERAL_DATETIME,
  NAME,
  NOTES,
  ROLE,
} = PropertyTypes;
const { VICTIM } = RoleConstants;
const { getEntityAddressKey, getPageSectionKey, parseEntityAddressKey } = DataProcessingUtils;
const { isDefined } = LangUtils;
const { getEntityKeyId } = DataUtils;
const { isValidUUID } = ValidationUtils;

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
 * ReferralFormUtils.updateFormWithCharges
 */

const updateFormWithCharges = (formData :Object, charges :List) => {

  let updatedFormData = formData;

  const chargeEKIDs = charges.map((charge :Map) => getEntityKeyId(charge));

  const page1Section1 = getPageSectionKey(1, 1);
  const chargesNamePath = [page1Section1, getEntityAddressKey(0, CHARGES, NAME)];
  const chargeEventDatePath = [page1Section1, getEntityAddressKey(0, CHARGE_EVENT, DATETIME_COMPLETED)];
  const datetimeOfIncidentPath = [page1Section1, getEntityAddressKey(0, DA_CASE, GENERAL_DATETIME)];

  const chargeSelected = getIn(updatedFormData, chargesNamePath);
  let selectedChargeEKID = '';
  if (isDefined(chargeSelected)) {
    if (isValidUUID(chargeSelected) && chargeEKIDs.includes(chargeSelected)) {
      updatedFormData = removeIn(updatedFormData, chargesNamePath);
      selectedChargeEKID = chargeSelected;
    }

    const chargeEventDate = getIn(updatedFormData, chargeEventDatePath);

    if (!isDefined(chargeEventDate)) {
      updatedFormData = setIn(
        updatedFormData,
        chargeEventDatePath,
        getIn(updatedFormData, datetimeOfIncidentPath)
      );
    }
    else {
      updatedFormData = updateFormWithDateAsDateTime(updatedFormData, chargeEventDatePath);

    }
  }
  else {
    updatedFormData = removeIn(updatedFormData, chargesNamePath);
    updatedFormData = removeIn(updatedFormData, chargeEventDatePath);
  }
  return { selectedChargeEKID, updatedFormData };
};

/*
 * ReferralFormUtils.updateFormWithAgency
 */

const updateFormWithAgency = (formData :Object, agencies :List) => {

  let updatedFormData = formData;

  const agencyEKIDs = agencies.map((agency :Map) => getEntityKeyId(agency));

  const page1Section1 = getPageSectionKey(1, 1);
  const agencyNamePath = [page1Section1, getEntityAddressKey(0, AGENCY, NAME)];

  const agencySelected = getIn(updatedFormData, agencyNamePath);
  let selectedAgencyEKID = '';
  if (isDefined(agencySelected)) {
    if (isValidUUID(agencySelected) && agencyEKIDs.includes(agencySelected)) {
      updatedFormData = removeIn(updatedFormData, agencyNamePath);
      selectedAgencyEKID = agencySelected;
    }
  }
  else {
    updatedFormData = removeIn(updatedFormData, agencyNamePath);
  }
  return { selectedAgencyEKID, updatedFormData };
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
    [getPageSectionKey(1, 4), getEntityAddressKey(0, ORGANIZATIONS, OPENLATTICE_ID_FQN)]
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
    // $FlowFixMe
    associations.push([APPEARS_IN, ekid, ORGANIZATIONS, 0, CRC_CASE, { [ROLE]: [VICTIM] }]);
  });

  const newVictimOrgs = get(formData, getPageSectionKey(1, 5));
  if (isDefined(newVictimOrgs)) {
    newVictimOrgs.forEach((person :Object, index :number) => {
      // $FlowFixMe
      associations.push([APPEARS_IN, index, ORGANIZATIONS, 0, CRC_CASE, { [ROLE]: [VICTIM] }]);
    });
  }

  return associations;
};

/*
 * ReferralFormUtils.getOptionalAssociations
 */

const getOptionalAssociations = (formData :Object, selectedChargeEKID :UUID) :Array<Array<*>> => {

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

  const chargeEventKey = section1Keys.find((eak :string) => {
    const { entitySetName } = parseEntityAddressKey(eak);
    return entitySetName === CHARGE_EVENT.toString();
  });
  const chargeKey = section1Keys.find((eak :string) => {
    const { entitySetName } = parseEntityAddressKey(eak);
    return entitySetName === CHARGES.toString();
  });
  if (isDefined(chargeEventKey)) {
    associations.push([APPEARS_IN, 0, CHARGE_EVENT, 0, DA_CASE, {}]);
    associations.push([APPEARS_IN, 0, CHARGE_EVENT, 0, CRC_CASE, {}]);

    const chargeIndexOrEKID = isDefined(chargeKey) ? 0 : selectedChargeEKID;
    associations.push([APPEARS_IN, chargeIndexOrEKID, CHARGES, 0, DA_CASE, {}]);
    associations.push([APPEARS_IN, chargeIndexOrEKID, CHARGES, 0, CRC_CASE, {}]);
    associations.push([REGISTERED_FOR, 0, CHARGE_EVENT, chargeIndexOrEKID, CHARGES, {}]);
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
  updateFormWithAgency,
  updateFormWithCharges,
};
