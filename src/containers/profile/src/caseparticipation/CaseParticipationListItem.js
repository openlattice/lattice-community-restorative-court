// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  Colors,
  StyleUtils,
  Tag,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';

const { getStyleVariation } = StyleUtils;
const {
  BLUE,
  GREEN,
  NEUTRAL,
  RED,
} = Colors;

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
  crcCase :Map;
};

const CaseParticipationListItem = ({ crcCase } :Props) => {
  const caseDate = DateTime.fromISO(crcCase.get('date')).toLocaleString(DateTime.DATE_SHORT);
  const caseIdentifier = `Case #: ${crcCase.get('caseNumber')} - ${crcCase.get('person')}`;
  return (
    <Card>
      <ListItemCardSegment padding="20px 30px">
        <div>
          <Date>{caseDate}</Date>
          <CaseNumberAndName>{caseIdentifier}</CaseNumberAndName>
        </div>
        <RoleTag roleName={crcCase.get('role')}>{crcCase.get('role')}</RoleTag>
      </ListItemCardSegment>
    </Card>
  );
};

export default CaseParticipationListItem;
