// @flow
import { List, Map } from 'immutable';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { RoleConstants } from '../../containers/profile/src/constants';
import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import { getPersonName } from '../people';

const { RESPONDENT } = RoleConstants;
const { DA_CASE } = AppTypes;
const { DA_CASE_NUMBER, NOTES, SURNAME } = PropertyTypes;
const { getEntityKeyId, getPropertyValue } = DataUtils;

export default function formatCasesForDropdown(
  personCases :List,
  caseRoleMap :Map,
  referralRequestsByCRCCaseEKID :Map,
  referralRequestNeighborMap :Map
) {

  return personCases.map((personCase :Map) => {
    const roles = caseRoleMap.get(getEntityKeyId(personCase));
    const respondentPerson = roles.getIn([RESPONDENT, 0], Map());
    const respondentPersonName = getPersonName(respondentPerson);
    // doesn't matter what property type to save respondent name under; just need one for hydrateSchema
    let mappedPersonCase = personCase.set(SURNAME, List([`- ${respondentPersonName}`]));

    const crcCaseEKID :?UUID = getEntityKeyId(personCase);
    const referralRequest :Map = referralRequestsByCRCCaseEKID.getIn([crcCaseEKID, 0], Map());
    const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
    const daCase :Map = referralRequestNeighborMap.getIn([DA_CASE, referralRequestEKID, 0], Map());
    const daCaseNumber = getPropertyValue(daCase, [DA_CASE_NUMBER, 0]);
    if (daCaseNumber) {
      // reset case number to be DA case number because that should be the default
      mappedPersonCase = mappedPersonCase.set(NOTES, List([daCaseNumber]));
    }

    return mappedPersonCase;
  });
}
