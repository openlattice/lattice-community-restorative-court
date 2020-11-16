// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Colors, Label, Modal } from 'lattice-ui-kit';

import CaseDetailsModalHeader from './CaseDetailsModalHeader';

import { CaseTimeline, DocumentList, RoleTag } from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { RoleConstants } from '../constants';
import {
  FORM_NEIGHBOR_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
  PROFILE,
  STAFF_MEMBER_BY_STATUS_EKID,
} from '../reducers/constants';

const { NEUTRAL } = Colors;
const { FORM, REFERRAL_REQUEST, STATUS } = AppTypes;
const { DATETIME_ADMINISTERED, EFFECTIVE_DATE } = PropertyTypes;
const { PEACEMAKER, RESPONDENT, VICTIM } = RoleConstants;

const ModalInnerWrapper = styled.div`
  /* these responsive styles will need to be tested when the module is loaded into CARE */
  @media only screen and (min-width: 584px) {
    width: 584px;
  }

  @media only screen and (min-width: 900px) {
    width: 900px;
  }
`;

const CaseHeader = styled(Header)`
  padding-top: 24px;
`;

const SmallHeader = styled(Header)`
  font-size: 22px;
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
  caseEKID :UUID;
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

  const modalHeader = <CaseDetailsModalHeader mode="open" onClose={onClose} />;
  const renderParticipantTile = (person :Map, role :string) => (
    <ParticipantTile>
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
        <SmallHeader>Status</SmallHeader>
        <CaseTimeline
            caseStatuses={relevantStatuses}
            referralRequest={referralRequest}
            staffMemberByStatusEKID={staffMemberByStatusEKID} />
        <SmallHeader>Participants</SmallHeader>
        <ParticipantsTileGrid>
          { respondentList.map((respondent :Map) => renderParticipantTile(respondent, RESPONDENT)) }
          { victimList.map((victim :Map) => renderParticipantTile(victim, VICTIM)) }
          { peacemakerList.map((peacemaker :Map) => renderParticipantTile(peacemaker, PEACEMAKER)) }
        </ParticipantsTileGrid>
        <SmallHeader>Documents</SmallHeader>
        <DocumentList caseIdentifier={caseIdentifier} forms={relevantForms} formNeighborMap={formNeighborMap} />
      </ModalInnerWrapper>
    </Modal>
  );
};

export default CaseDetailsModal;
