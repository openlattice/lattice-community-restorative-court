// @flow
import { List, Map } from 'immutable';
import { DataUtils, LangUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { PropertyTypes } from '../../../core/edm/constants';
import { getNeighborDetails, getNeighborESID } from '../../../utils/data';

const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;
const { GENDER, NAME, RACE } = PropertyTypes;

/*
 * getPersonEKIDsWithMultipleReferrals
 */

const getPersonEKIDsWithMultipleReferrals = (people :List) :UUID[] => {
  const repeatPersonEKIDs :UUID[] = [];
  const personEKIDCountMap = Map().asMutable();

  people.forEach((person :Map) => {
    const personEKID :?UUID = getEntityKeyId(person);
    const personEKIDCount = personEKIDCountMap.get(personEKID);
    if (isDefined(personEKIDCount)) {
      if (personEKIDCount === 1) {
        if (personEKID) repeatPersonEKIDs.push(personEKID);
      }
      personEKIDCountMap.set(personEKID, personEKIDCount + 1);
    }
    else {
      personEKIDCountMap.set(personEKID, 1);
    }
  });
  return repeatPersonEKIDs;
};

/*
 * filterReferralRequestsByPeople
 */

const filterReferralRequestsByPeople = (
  personEKIDsToInclude :UUID[],
  referralRequestEKIDs :UUID[],
  crcCaseEKIDByReferralRequestEKID :Map,
  personByCRCCaseEKID :Map,
) :UUID[] => (

  referralRequestEKIDs.filter((referralRequestEKID :UUID) => {
    const crcCaseEKID = crcCaseEKIDByReferralRequestEKID.get(referralRequestEKID, '');
    const person = personByCRCCaseEKID.get(crcCaseEKID, Map());
    const personEKID :?UUID = getEntityKeyId(person);
    return personEKIDsToInclude.includes(personEKID);
  }));

/*
 * filterReferralRequestsByCharge
 */

const filterReferralRequestsByCharge = (
  selectedChargeName :string,
  referralRequestEKIDs :UUID[],
  crcCaseEKIDByReferralRequestEKID :Map,
  crcCaseNeighborMap :Map,
  chargesESID :UUID,
) :UUID[] => (

  referralRequestEKIDs.filter((referralRequestEKID) => {
    const crcCaseEKID = crcCaseEKIDByReferralRequestEKID.get(referralRequestEKID, '');
    const crcCaseNeighbors :List = crcCaseNeighborMap.get(crcCaseEKID, List());
    const chargeNeighbor = crcCaseNeighbors.find((neighbor) => getNeighborESID(neighbor) === chargesESID);
    if (isDefined(chargeNeighbor)) {
      const charge = getNeighborDetails(chargeNeighbor);
      if (selectedChargeName) return getPropertyValue(charge, [NAME, 0]) === selectedChargeName;
    }
    return true;
  }));

/*
 * filterReferralRequestsByRace
 */

const filterReferralRequestsByRace = (
  selectedRace :string,
  referralRequestEKIDs :UUID[],
  crcCaseEKIDByReferralRequestEKID :Map,
  personByCRCCaseEKID :Map,
) :UUID[] => (

  referralRequestEKIDs.filter((referralRequestEKID :UUID) => {
    const crcCaseEKID = crcCaseEKIDByReferralRequestEKID.get(referralRequestEKID, '');
    const person = personByCRCCaseEKID.get(crcCaseEKID, Map());
    if (selectedRace) return getPropertyValue(person, [RACE, 0]) === selectedRace;
    return true;
  }));

/*
 * filterReferralRequestsByGender
 */

const filterReferralRequestsByGender = (
  selectedGender :string,
  referralRequestEKIDs :UUID[],
  crcCaseEKIDByReferralRequestEKID :Map,
  personByCRCCaseEKID :Map,
  personGenderByPersonEKID :Map,
) :UUID[] => (

  referralRequestEKIDs.filter((referralRequestEKID :UUID) => {
    const crcCaseEKID = crcCaseEKIDByReferralRequestEKID.get(referralRequestEKID, '');
    const person = personByCRCCaseEKID.get(crcCaseEKID, Map());
    const personEKID :?UUID = getEntityKeyId(person);
    const personDetails = personGenderByPersonEKID.get(personEKID, '');
    if (selectedGender) return getPropertyValue(personDetails, [GENDER, 0]) === selectedGender;
    return true;
  }));

export {
  filterReferralRequestsByCharge,
  filterReferralRequestsByGender,
  filterReferralRequestsByPeople,
  filterReferralRequestsByRace,
  getPersonEKIDsWithMultipleReferrals,
};
