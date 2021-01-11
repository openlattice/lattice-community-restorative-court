// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  Colors,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import CaseDetailsModal from './CaseDetailsModal';

import { CRCTag } from '../../../../components';
import { PropertyTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants } from '../../../../core/redux/constants';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import { RoleConstants } from '../constants';

const {
  DATETIME_RECEIVED,
  GENERAL_DATETIME,
  NOTES,
  ROLE,
} = PropertyTypes;
const { NEUTRAL } = Colors;
const { RESPONDENT } = RoleConstants;
const { PERSON_CASE_NEIGHBOR_MAP, PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { formatAsDate } = DateTimeUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;

const ListItemCardSegment = styled(CardSegment)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const Date = styled(Typography)`
  color: ${NEUTRAL.N600};
`;

const CaseNumberAndName = styled(Typography)`
  color: ${NEUTRAL.N800};
  margin-top: 8px;
`;

type Props = {
  personCase :Map;
};

const CaseParticipationListItem = ({ personCase } :Props) => {

  const [modalIsVisible, setModalVisibility] = useState(false);

  const caseEKID :?UUID = getEntityKeyId(personCase);

  const caseRoleMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID], Map()));
  const respondentPerson = caseRoleMap.getIn([RESPONDENT, 0], Map());
  const respondentPersonName = getPersonName(respondentPerson);

  const dateTimeReceived = getPropertyValue(personCase, [DATETIME_RECEIVED, 0]);
  const caseNumber = getPropertyValue(personCase, [NOTES, 0]);
  const caseDate :string = formatAsDate(dateTimeReceived);

  const personRoleInCase = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, ROLE, caseEKID], ''));
  const dateAssignedToCaseMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, GENERAL_DATETIME, caseEKID], Map()));

  const caseIdentifier = `Case #: ${caseNumber} - ${respondentPersonName}`;

  return (
    <>
      <Card onClick={() => setModalVisibility(true)}>
        <ListItemCardSegment padding="20px 30px">
          <div>
            <Date variant="subtitle2">{caseDate}</Date>
            <CaseNumberAndName variant="body2">{caseIdentifier}</CaseNumberAndName>
          </div>
          <CRCTag background={personRoleInCase} borderRadius="31px" color={personRoleInCase} padding="10px 16px">
            <Typography color="inherit" variant="body2">{personRoleInCase}</Typography>
          </CRCTag>
        </ListItemCardSegment>
      </Card>
      <CaseDetailsModal
          caseEKID={caseEKID}
          caseIdentifier={caseIdentifier}
          caseRoleMap={caseRoleMap}
          dateAssignedToCaseMap={dateAssignedToCaseMap}
          isVisible={modalIsVisible}
          onClose={() => setModalVisibility(false)}
          personCase={personCase} />
    </>
  );
};

export default CaseParticipationListItem;
