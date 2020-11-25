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
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, LangUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import AddStatusModal from './AddStatusModal';
import CaseDetailsModalHeader from './CaseDetailsModalHeader';

import {
  CRCTag,
  CaseTimeline,
  DocumentList,
  ModalInnerWrapper,
} from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants } from '../../../../core/redux/constants';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import { CaseStatusConstants, RoleConstants } from '../constants';

const {
  FORM_NEIGHBOR_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PROFILE,
  STAFF_MEMBER_BY_STATUS_EKID,
} = ProfileReduxConstants;
const { NEUTRAL } = Colors;
const { FORM, REFERRAL_REQUEST, STATUS } = AppTypes;
const { DATETIME_ADMINISTERED, EFFECTIVE_DATE } = PropertyTypes;
const { PEACEMAKER, RESPONDENT, VICTIM } = RoleConstants;
const { CLOSED, RESOLUTION } = CaseStatusConstants;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;

const ModalSection = styled.div`
  margin-bottom: 36px;

  header:first-child {
    display: flex;
    margin-bottom: 24px;
  }
`;

const ParticipantTile = styled.div`
  align-items: start;
  border: 1px solid ${NEUTRAL.N200};
  border-radius: 3px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 5px 0;
  justify-items: start;
  max-width: 280px;
  padding: 24px 32px;
`;

const ParticipantsTileGrid = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fit, 280px);
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
      <Typography>{getPersonName(person)}</Typography>
      <CRCTag background={role} borderRadius="31px" color={role} padding="10px 16px">
        <Typography color="inherit" variant="body2">{role}</Typography>
      </CRCTag>
    </ParticipantTile>
  );

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        viewportScrolling
        withHeader={modalHeader}>
      <ModalInnerWrapper>
        <Typography color={NEUTRAL.N800} variant="h2">{caseIdentifier}</Typography>
        <ModalSection>
          <header>
            <Typography color={NEUTRAL.N700} variant="h3">Status</Typography>
            <IconButton
                aria-label="Small Status Icon Button"
                color="success"
                size="small"
                onClick={() => setStatusModalVisibility(true)}>
              <FontAwesomeIcon fixedWidth icon={faPlus} />
            </IconButton>
          </header>
          <CaseTimeline
              caseStatuses={relevantStatuses}
              referralRequest={referralRequest}
              staffMemberByStatusEKID={staffMemberByStatusEKID} />
        </ModalSection>
        <ModalSection>
          <header>
            <Typography color={NEUTRAL.N700} variant="h3">Participants</Typography>
            <IconButton
                aria-label="Small Status Icon Button"
                color="success"
                size="small"
                onClick={() => setStatusModalVisibility(true)}>
              <FontAwesomeIcon fixedWidth icon={faPlus} />
            </IconButton>
          </header>
          <ParticipantsTileGrid>
            { respondentList.map((respondent :Map) => renderParticipantTile(respondent, RESPONDENT)) }
            { victimList.map((victim :Map) => renderParticipantTile(victim, VICTIM)) }
            { peacemakerList.map((peacemaker :Map) => renderParticipantTile(peacemaker, PEACEMAKER)) }
          </ParticipantsTileGrid>
        </ModalSection>
        <ModalSection>
          <header><Typography color={NEUTRAL.N700} variant="h3">Documents</Typography></header>
          <DocumentList caseIdentifier={caseIdentifier} forms={relevantForms} formNeighborMap={formNeighborMap} />
        </ModalSection>
      </ModalInnerWrapper>
      <AddStatusModal
          caseEKID={caseEKID}
          isVisible={statusModalIsVisible}
          onClose={() => setStatusModalVisibility(false)} />
    </Modal>
  );
};

export default CaseDetailsModal;
