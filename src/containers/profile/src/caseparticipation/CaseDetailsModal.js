// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Colors,
  IconButton,
  Label,
  Modal,
} from 'lattice-ui-kit';
import { DataUtils, LangUtils } from 'lattice-utils';

import AddStatusModal from './AddStatusModal';
import CaseDetailsModalHeader from './CaseDetailsModalHeader';

import {
  CaseTimeline,
  DocumentList,
  ModalInnerWrapper,
  RoleTag,
} from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { CaseStatusConstants, RoleConstants } from '../constants';
import {
  FORM_NEIGHBOR_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PROFILE,
  STAFF_MEMBER_BY_STATUS_EKID,
} from '../reducers/constants';

const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;
const { NEUTRAL } = Colors;
const { FORM, REFERRAL_REQUEST, STATUS } = AppTypes;
const { DATETIME_ADMINISTERED, EFFECTIVE_DATE } = PropertyTypes;
const { PEACEMAKER, RESPONDENT, VICTIM } = RoleConstants;
const { CLOSED, RESOLUTION } = CaseStatusConstants;

const CaseHeader = styled(Header)`
  padding-top: 24px;
`;

const HeaderAndButtonWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

const SmallHeader = styled(Header)`
  font-size: 22px;
  margin-right: 12px;
  margin-bottom: 0;
`;

const SmallHeaderWithExtraMargin = styled(SmallHeader)`
  margin-bottom: 24px;
`;

const Name = styled.div`
  margin-bottom: 16px;
`;

const ParticipantTile = styled.div`
  align-items: start;
  border: 1px solid ${NEUTRAL.N200};
  border-radius: 3px;
  display: grid;
  justify-items: start;
  max-width: 280px;
  padding: 24px 32px;
`;

const ParticipantsTileGrid = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fit, 280px);
  margin-bottom: 36px;
`;

type Props = {
  caseEKID :?UUID;
  caseIdentifier :string;
  caseRoleMap :Map;
  isVisible :boolean;
  onClose :() => void;
};

const CaseDetailsModal = ({
  caseEKID,
  caseIdentifier,
  caseRoleMap,
  isVisible,
  onClose,
} :Props) => {

  const [statusModalIsVisible, setStatusModalVisibility] = useState(false);

  const caseStatusMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, STATUS], Map()));
  const relevantStatuses :List = caseStatusMap.get(caseEKID, List())
    .sortBy((status :Map) => status.getIn([EFFECTIVE_DATE, 0])).reverse();

  const staffMemberByStatusEKID :Map = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBER_BY_STATUS_EKID]));
  const referralRequest :?Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, REFERRAL_REQUEST], List())).get(0);
  const formMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, FORM], Map()));
  const relevantForms :List = formMap.get(caseEKID, List())
    .sortBy((form :Map) => form.getIn([DATETIME_ADMINISTERED, 0])).reverse();
  const formNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, FORM_NEIGHBOR_MAP], Map()));

  const respondentList :List = caseRoleMap.get(RESPONDENT, List());
  const victimList :List = caseRoleMap.get(VICTIM, List());
  const peacemakerList :List = caseRoleMap.get(PEACEMAKER, List());

  const caseIsResolvedOrClosed = relevantStatuses.find((caseStatus :Map) => {
    const statusType = getPropertyValue(caseStatus, [PropertyTypes.STATUS, 0]);
    return statusType === CLOSED || statusType === RESOLUTION;
  });
  const mode :string = isDefined(caseIsResolvedOrClosed) ? 'closed' : 'open';
  const modalHeader = <CaseDetailsModalHeader mode={mode} onClose={onClose} />;

  const renderParticipantTile = (person :Map, role :string) => (
    <ParticipantTile key={getEntityKeyId(person)}>
      <Label subtle>Name</Label>
      <Name>{getPersonName(person)}</Name>
      <RoleTag roleName={role}>{role}</RoleTag>
    </ParticipantTile>
  );

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        viewportScrolling
        withHeader={modalHeader}>
      <ModalInnerWrapper>
        <CaseHeader>{caseIdentifier}</CaseHeader>
        <HeaderAndButtonWrapper>
          <SmallHeader>Status</SmallHeader>
          <IconButton
              aria-label="Small Status Icon Button"
              color="success"
              size="small"
              onClick={() => setStatusModalVisibility(true)}>
            <FontAwesomeIcon fixedWidth icon={faPlus} />
          </IconButton>
        </HeaderAndButtonWrapper>
        <CaseTimeline
            caseStatuses={relevantStatuses}
            referralRequest={referralRequest}
            staffMemberByStatusEKID={staffMemberByStatusEKID} />
        <SmallHeaderWithExtraMargin>Participants</SmallHeaderWithExtraMargin>
        <ParticipantsTileGrid>
          { respondentList.map((respondent :Map) => renderParticipantTile(respondent, RESPONDENT)) }
          { victimList.map((victim :Map) => renderParticipantTile(victim, VICTIM)) }
          { peacemakerList.map((peacemaker :Map) => renderParticipantTile(peacemaker, PEACEMAKER)) }
        </ParticipantsTileGrid>
        <SmallHeaderWithExtraMargin>Documents</SmallHeaderWithExtraMargin>
        <DocumentList caseIdentifier={caseIdentifier} forms={relevantForms} formNeighborMap={formNeighborMap} />
      </ModalInnerWrapper>
      <AddStatusModal
          caseEKID={caseEKID}
          isVisible={statusModalIsVisible}
          onClose={() => setStatusModalVisibility(false)} />
    </Modal>
  );
};

export default CaseDetailsModal;
