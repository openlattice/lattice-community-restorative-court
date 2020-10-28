// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  Colors,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';

import CaseDetailsModal from './CaseDetailsModal';

import { RoleTag } from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue, getPropertyValuesLU } from '../../../../utils/data';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import { RoleConstants } from '../constants';
import {
  PEOPLE_IN_CASE_BY_ROLE_EKID_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_ROLE_BY_CASE_EKID,
  PROFILE,
} from '../reducers/constants';

const { DATETIME_START, DESCRIPTION, TYPE } = PropertyTypes;
const { NEUTRAL } = Colors;
const { RESPONDENT } = RoleConstants;
const { ROLE } = AppTypes;
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

  const caseRoles :List = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE], List()));
  const respondent = caseRoles.find((role :Map) => {
    const roleName = getPropertyValue(role, TYPE);
    return roleName === RESPONDENT;
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
    <Card onClick={() => setModalVisibility(true)}>
      <ListItemCardSegment padding="20px 30px">
        <div>
          <Date>{caseDate}</Date>
          <CaseNumberAndName>{caseIdentifier}</CaseNumberAndName>
        </div>
        <RoleTag roleName={personRoleInCase}>{personRoleInCase}</RoleTag>
      </ListItemCardSegment>
      <CaseDetailsModal
          caseIdentifier={caseIdentifier}
          caseRoles={caseRoles}
          isVisible={modalIsVisible}
          onClose={() => setModalVisibility(false)} />
    </Card>
  );
};

export default CaseParticipationListItem;
