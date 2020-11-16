// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  Colors,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';

import CaseDetailsModal from './CaseDetailsModal';

import { RoleTag } from '../../../../components';
import { PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValuesLU } from '../../../../utils/data';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import { RoleConstants } from '../constants';
import { PERSON_CASE_NEIGHBOR_MAP, PERSON_NEIGHBOR_MAP, PROFILE } from '../reducers/constants';

const {
  DATETIME_START,
  DESCRIPTION,
  ROLE,
} = PropertyTypes;
const { NEUTRAL } = Colors;
const { RESPONDENT } = RoleConstants;
const { formatAsDate } = DateTimeUtils;
const { getEntityKeyId } = DataUtils;

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

  const [modalIsVisible, setModalVisibility] = useState(false);

  const caseEKID :?UUID = getEntityKeyId(personCase);

  const caseRoleMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID], Map()));
  const respondentPerson = caseRoleMap.getIn([RESPONDENT, 0], Map());
  const respondentPersonName = getPersonName(respondentPerson);

  const { [DATETIME_START]: dateTimeStart, [DESCRIPTION]: caseNumber } = getPropertyValuesLU(
    personCase,
    [DATETIME_START, DESCRIPTION]
  );
  const caseDate :string = formatAsDate(dateTimeStart);

  const personRoleInCase = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, ROLE, caseEKID], ''));

  const caseIdentifier = `Case #: ${caseNumber} - ${respondentPersonName}`;

  return (
    <>
      <Card onClick={() => setModalVisibility(true)}>
        <ListItemCardSegment padding="20px 30px">
          <div>
            <Date>{caseDate}</Date>
            <CaseNumberAndName>{caseIdentifier}</CaseNumberAndName>
          </div>
          <RoleTag roleName={personRoleInCase}>{personRoleInCase}</RoleTag>
        </ListItemCardSegment>
      </Card>
      <CaseDetailsModal
          caseEKID={caseEKID}
          caseIdentifier={caseIdentifier}
          caseRoleMap={caseRoleMap}
          isVisible={modalIsVisible}
          onClose={() => setModalVisibility(false)} />
    </>
  );
};

export default CaseParticipationListItem;
