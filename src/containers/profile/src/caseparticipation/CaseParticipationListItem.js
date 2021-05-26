// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  Colors,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils, LangUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import CaseDetailsModal from './CaseDetailsModal';

import { CRCTag } from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants, ReferralReduxConstants } from '../../../../core/redux/constants';
import { getPersonName } from '../../../../utils/people';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { selectCase } from '../actions';
import { RoleConstants } from '../constants';

const { DA_CASE, REFERRAL_REQUEST } = AppTypes;
const {
  DATETIME_RECEIVED,
  DA_CASE_NUMBER,
  GENERAL_DATETIME,
  NOTES,
  ROLE,
} = PropertyTypes;
const { NEUTRAL } = Colors;
const { RESPONDENT } = RoleConstants;
const { PERSON_CASE_NEIGHBOR_MAP, PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;
const { formatAsDate } = DateTimeUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;

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
  const dispatch = useDispatch();

  const caseEKID :?UUID = getEntityKeyId(personCase);

  const caseRoleMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, ROLE, caseEKID], Map()));
  const respondentPerson = caseRoleMap.getIn([RESPONDENT, 0], Map());
  const respondentPersonName = getPersonName(respondentPerson);

  const dateTimeReceived = getPropertyValue(personCase, [DATETIME_RECEIVED, 0]);
  let caseNumber = getPropertyValue(personCase, [NOTES, 0]);
  const caseDate :string = formatAsDate(dateTimeReceived);

  const referralRequestList :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, REFERRAL_REQUEST, caseEKID], List()));
  const referralRequest :Map = referralRequestList.get(0, Map());
  const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
  const daCase :Map = useSelector((store) => store
    .getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP, DA_CASE, referralRequestEKID, 0], Map()));
  if (isDefined(daCase) && !daCase.isEmpty()) {
    const daCaseNumber = getPropertyValue(daCase, [DA_CASE_NUMBER, 0]);
    if (daCaseNumber) caseNumber = daCaseNumber;
  }

  const personRoleInCase = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, ROLE, caseEKID], ''));
  const dateAssignedToCaseMap :Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, GENERAL_DATETIME, caseEKID], Map()));

  const caseIdentifier = `Case #: ${caseNumber} - ${respondentPersonName}`;

  const onCaseClick = () => {
    setModalVisibility(true);
    dispatch(selectCase(personCase));
  };

  return (
    <>
      <Card onClick={onCaseClick}>
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
