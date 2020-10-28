// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  Colors,
  StyleUtils,
  Tag,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue, getPropertyValuesLU } from '../../../../utils/data';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import {
  PEOPLE_IN_CASE_BY_ROLE_EKID_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_ROLE_BY_CASE_EKID,
  PROFILE,
} from '../reducers/constants';

const { getStyleVariation } = StyleUtils;
const {
  BLUE,
  GREEN,
  NEUTRAL,
  RED,
} = Colors;

const { getEntityKeyId } = DataUtils;
const { formatAsDate } = DateTimeUtils;

const { ROLE } = AppTypes;
const { DATETIME_START, DESCRIPTION, TYPE } = PropertyTypes;

const getBackgroundColor = getStyleVariation('roleName', {
  peacemaker: BLUE.B00,
  respondent: RED.R00,
  victim: GREEN.G00,
}, RED.R00);

const getFontColor = getStyleVariation('roleName', {
  peacemaker: BLUE.B400,
  respondent: RED.R400,
  victim: GREEN.G400,
}, RED.R400);

const RoleTag = styled(Tag)`
  background-color: ${getBackgroundColor};
  border-radius: 31px;
  color: ${getFontColor};
  font-size: 16px;
  font-weight: 600;
  padding: 10.5px 16.25px;
  text-transform: capitalize;
`;

const ListItemCardSegment = styled(CardSegment)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const Date = styled.div`
  color: ${NEUTRAL.N600};
  font-size: 14px;
  font-weight: 600;
`;

const CaseNumberAndName = styled.div`
  color: ${NEUTRAL.N800};
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
`;

type Props = {
  personCase :Map;
};

const CaseParticipationListItem = ({ personCase } :Props) => {

  const caseRoles :List = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE]));
  const respondent = caseRoles.find((role :Map) => {
    const roleName = getPropertyValue(role, TYPE);
    return roleName === 'Respondent';
  });
  const respondentEKID = getEntityKeyId(respondent);
  const respondentPerson :Map = useSelector((store) => store.getIn([
    PROFILE,
    PEOPLE_IN_CASE_BY_ROLE_EKID_MAP,
    respondentEKID
  ]));
  const respondentPersonName = getPersonName(respondentPerson);

  const { [DATETIME_START]: dateTimeStart, [DESCRIPTION]: caseNumber } = getPropertyValuesLU(
    personCase,
    [DATETIME_START, DESCRIPTION]
  );
  const caseDate :string = formatAsDate(dateTimeStart);

  const caseEKID :?UUID = getEntityKeyId(personCase);
  const personRoleInCase = useSelector((store) => store.getIn([PROFILE, PERSON_ROLE_BY_CASE_EKID, caseEKID]));
  const caseIdentifier = `Case #: ${caseNumber} - ${respondentPersonName}`;

  return (
    <Card>
      <ListItemCardSegment padding="20px 30px">
        <div>
          <Date>{caseDate}</Date>
          <CaseNumberAndName>{caseIdentifier}</CaseNumberAndName>
        </div>
        <RoleTag roleName={personRoleInCase}>{personRoleInCase}</RoleTag>
      </ListItemCardSegment>
    </Card>
  );
};

export default CaseParticipationListItem;
