// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Colors, Label, Modal } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';

import CaseDetailsModalHeader from './CaseDetailsModalHeader';

import { CaseTimeline, DocumentList, RoleTag } from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValue } from '../../../../utils/data';
import { getPersonName } from '../../../../utils/people';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { RoleConstants } from '../constants';
import {
  FORM_NEIGHBOR_MAP,
  PEOPLE_IN_CASE_BY_ROLE_EKID_MAP,
  PERSON_CASE_NEIGHBOR_MAP,
  PERSON_NEIGHBOR_MAP,
  PROFILE,
  STAFF_MEMBER_BY_STATUS_EKID,
} from '../reducers/constants';

const { getEntityKeyId } = DataUtils;
const { NEUTRAL } = Colors;
const { FORM, REFERRAL_REQUEST, STATUS } = AppTypes;
const { TYPE } = PropertyTypes;
const { PEACEMAKER, RESPONDENT } = RoleConstants;

const SmallHeader = styled(Header)`
  font-size: 22px;
`;

const ParticipantTile = styled.div`
  align-items: start;
  border: 1px solid ${NEUTRAL.N200};
  border-radius: 3px;
  display: grid;
  grid-gap: 24px;
  justify-items: start;
  max-width: 280px;
  padding: 24px 32px;
`;

const ParticipantsTileGrid = styled.div`
  align-items: stretch;

  @media only screen and (min-width: 420px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

type Props = {
  caseIdentifier :string;
  caseRoles :List;
  isVisible :boolean;
  onClose :() => void;
};

const CaseDetailsModal = ({
  caseIdentifier,
  caseRoles,
  isVisible,
  onClose,
} :Props) => {

  const peopleInCaseByRoleEKIDMap = useSelector((store) => store.getIn([PROFILE, PEOPLE_IN_CASE_BY_ROLE_EKID_MAP]));
  const caseStatuses :List = useSelector((store) => store.getIn([PROFILE, PERSON_CASE_NEIGHBOR_MAP, STATUS], List()));
  const staffMemberByStatusEKID :Map = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBER_BY_STATUS_EKID]));
  const referralRequest :?Map = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, REFERRAL_REQUEST], List())).get(0);
  const forms :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, FORM], List()));
  const formNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, FORM_NEIGHBOR_MAP], Map()));

  const modalHeader = <CaseDetailsModalHeader mode="open" onClose={onClose} />;
  const sortedRoles = caseRoles.sort((role :Map) => {
    const roleName :string = getPropertyValue(role, TYPE);
    if (roleName === RESPONDENT) return -1;
    if (roleName === PEACEMAKER) return 1;
    return 0;
  });

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        viewportScrolling
        withHeader={modalHeader}>
      <Header>{caseIdentifier}</Header>
      <SmallHeader>Status</SmallHeader>
      <CaseTimeline
          caseStatuses={caseStatuses}
          referralRequest={referralRequest}
          staffMemberByStatusEKID={staffMemberByStatusEKID} />
      <SmallHeader>Participants</SmallHeader>
      <ParticipantsTileGrid>
        {
          sortedRoles.map((role :Map) => {
            const roleName :string = getPropertyValue(role, TYPE);
            const roleEKID :?UUID = getEntityKeyId(role);
            const person :Map = peopleInCaseByRoleEKIDMap.get(roleEKID, Map());
            const personName :string = getPersonName(person);
            return (
              <ParticipantTile>
                <Label subtle>Name</Label>
                {personName}
                <RoleTag>{roleName}</RoleTag>
              </ParticipantTile>
            );
          })
        }
      </ParticipantsTileGrid>
      <SmallHeader>Documents</SmallHeader>
      <DocumentList caseIdentifier={caseIdentifier} forms={forms} formNeighborMap={formNeighborMap} />
    </Modal>
  );
};

export default CaseDetailsModal;
