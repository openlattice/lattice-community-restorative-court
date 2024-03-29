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
import { Link } from 'react-router-dom';
import type { UUID } from 'lattice';

import AddStatusModal from './AddStatusModal';
import CaseDetailsModalHeader from './CaseDetailsModalHeader';
import CaseNotes from './CaseNotes';

import {
  CRCTag,
  CaseTimeline,
  DocumentList,
  ModalInnerWrapper,
} from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { APP_PATHS, ProfileReduxConstants, ReferralReduxConstants } from '../../../../core/redux/constants';
import { ADD_PEOPLE_TO_CASE, CASE_ID } from '../../../../core/router/Routes';
import { goToRoute } from '../../../../core/router/RoutingActions';
import { getPersonName } from '../../../../utils/people';
import { getRelativeRoot } from '../../../../utils/router';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { CaseStatusConstants, RoleConstants } from '../constants';

const {
  PERSON,
  PERSON_CASE_NEIGHBOR_MAP,
  PROFILE,
  STAFF_MEMBER_BY_STATUS_EKID,
} = ProfileReduxConstants;
const { REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP } = ReferralReduxConstants;
const { NEUTRAL } = Colors;
const {
  AGENCY,
  FORM,
  REFERRAL_REQUEST,
  STATUS,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  EFFECTIVE_DATE,
  NAME,
  ORGANIZATION_NAME,
} = PropertyTypes;
const {
  CASE_MANAGER,
  PEACEMAKER,
  RESPONDENT,
  VICTIM,
} = RoleConstants;
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

const ParticipantTile = styled(Link)`
  align-items: start;
  border: 1px solid ${NEUTRAL.N200};
  border-radius: 3px;
  color: ${NEUTRAL.N700};
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 5px 0;
  justify-items: start;
  max-width: 280px;
  padding: 24px 32px;
  text-decoration: none;
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
  dateAssignedToCaseMap :Map;
  isVisible :boolean;
  onClose :() => void;
  personCase :Map;
};

const CaseDetailsModal = ({
  caseEKID,
  caseIdentifier,
  caseRoleMap,
  dateAssignedToCaseMap,
  isVisible,
  onClose,
  personCase,
} :Props) => {

  const [statusModalIsVisible, setStatusModalVisibility] = useState(false);

  const caseStatusMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, STATUS], Map()));
  const relevantStatuses :List = caseStatusMap.get(caseEKID, List())
    .sortBy((status :Map) => status.getIn([EFFECTIVE_DATE, 0])).reverse();

  const staffMemberByStatusEKID :Map = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBER_BY_STATUS_EKID]));
  const referralRequest :?Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, REFERRAL_REQUEST, caseEKID], List())).get(0);
  const formMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, FORM], Map()));
  const relevantForms :List = formMap.get(caseEKID, List())
    .sortBy((form :Map) => form.getIn([DATETIME_ADMINISTERED, 0])).reverse();

  const personCaseNeighborMap = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP]));
  const referralRequestNeighborMap = useSelector((store) => store.getIn([REFERRAL, REFERRAL_REQUEST_NEIGHBOR_MAP]));
  const referralRequestEKID :?UUID = getEntityKeyId(referralRequest);
  const agencyList = referralRequestNeighborMap.getIn([AGENCY, referralRequestEKID], List());
  const agency :Map = agencyList.get(0, Map());
  const agencyName = getPropertyValue(agency, [NAME, 0]);

  const respondentList :List = caseRoleMap.get(RESPONDENT, List());
  const victimList :List = caseRoleMap.get(VICTIM, List());
  const peacemakerList :List = caseRoleMap.get(PEACEMAKER, List());

  const caseManagerList :List = caseRoleMap.get(CASE_MANAGER, List());
  const caseManager :Map = caseManagerList.get(0, Map());
  const caseManagerName = getPersonName(caseManager);
  const caseManagerEKID :?UUID = getEntityKeyId(caseManager);
  const dateAssignedByPersonOrOrgEKID = dateAssignedToCaseMap.get(CASE_MANAGER, Map());
  const dateAssigned = dateAssignedByPersonOrOrgEKID.get(caseManagerEKID, '');

  const caseIsResolvedOrClosed = relevantStatuses.find((caseStatus :Map) => {
    const statusType = getPropertyValue(caseStatus, [PropertyTypes.STATUS, 0]);
    return statusType === CLOSED || statusType === RESOLUTION;
  });
  const mode :string = isDefined(caseIsResolvedOrClosed) ? 'closed' : 'open';
  const modalHeader = <CaseDetailsModalHeader mode={mode} onClose={onClose} />;

  const dispatch = useDispatch();
  const person :Map = useSelector((store) => store.getIn([PROFILE, PERSON]));
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const goToAddPeopleForm = () => {
    if (caseEKID) {
      dispatch(goToRoute(`${root}/${ADD_PEOPLE_TO_CASE}`.replace(CASE_ID, caseEKID)));
    }
  };

  const getNewProfileUrl = (personEKID :?UUID, isPerson :boolean) => {
    if (personEKID && isPerson) {
      const currentlySelectedPersonEKID :?UUID = getEntityKeyId(person);
      if (currentlySelectedPersonEKID) return `${relativeRoot}`.replace(currentlySelectedPersonEKID, personEKID);
    }
    return relativeRoot;
  };

  const renderTile = (participantOrOrg :Map, role :string) => {
    const participantOrOrgEKID :?UUID = getEntityKeyId(participantOrOrg);
    const isOrganization = participantOrOrg.has(ORGANIZATION_NAME);
    const name = isOrganization
      ? getPropertyValue(participantOrOrg, [ORGANIZATION_NAME, 0])
      : getPersonName(participantOrOrg);
    return (
      <ParticipantTile
          key={getEntityKeyId(participantOrOrg)}
          to={getNewProfileUrl(participantOrOrgEKID, !isOrganization)}>
        <Label subtle>Name</Label>
        <Typography>{name}</Typography>
        <CRCTag background={role} borderRadius="31px" color={role} padding="10px 16px">
          <Typography color="inherit" variant="body2">{role}</Typography>
        </CRCTag>
      </ParticipantTile>
    );
  };

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        viewportScrolling
        withHeader={modalHeader}>
      <ModalInnerWrapper>
        <Typography variant="h2">{caseIdentifier}</Typography>
        <Typography variant="h4" gutterBottom>
          {`Case Manager: ${caseManagerName} (Date Assigned: ${dateAssigned})`}
        </Typography>
        <ModalSection>
          <header>
            <Typography variant="h3">Status</Typography>
            <IconButton
                aria-label="Small Status Icon Button"
                color="success"
                size="small"
                onClick={() => setStatusModalVisibility(true)}>
              <FontAwesomeIcon fixedWidth icon={faPlus} />
            </IconButton>
          </header>
          <CaseTimeline
              agencyName={agencyName}
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
                onClick={goToAddPeopleForm}>
              <FontAwesomeIcon fixedWidth icon={faPlus} />
            </IconButton>
          </header>
          <ParticipantsTileGrid>
            { respondentList.map((respondent :Map) => renderTile(respondent, RESPONDENT)) }
            { victimList.map((victim :Map) => renderTile(victim, VICTIM)) }
            { peacemakerList.map((peacemaker :Map) => renderTile(peacemaker, PEACEMAKER)) }
            { caseManagerList.map((staffMember :Map) => renderTile(staffMember, CASE_MANAGER)) }
          </ParticipantsTileGrid>
        </ModalSection>
        <ModalSection>
          <header><Typography color={NEUTRAL.N700} variant="h3">Documents</Typography></header>
          <DocumentList
              caseIdentifier={caseIdentifier}
              forms={relevantForms}
              personCaseNeighborMap={personCaseNeighborMap} />
        </ModalSection>
        <ModalSection>
          <Typography color={NEUTRAL.N700} variant="h3">Notes</Typography>
          <CaseNotes crcCase={personCase} />
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
