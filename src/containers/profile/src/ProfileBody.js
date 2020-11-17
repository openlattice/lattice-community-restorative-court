// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { StyleUtils } from 'lattice-ui-kit';

import CaseParticipation from './caseparticipation/CaseParticipation';
import LastContacted from './lastcontacted/LastContacted';
import { RoleConstants } from './constants';
import { PERSON_NEIGHBOR_MAP, PROFILE } from './reducers/constants';

import { PropertyTypes } from '../../../core/edm/constants';
import { useSelector } from '../../app/AppProvider';

const { PEACEMAKER } = RoleConstants;
const { ROLE } = PropertyTypes;
const { media } = StyleUtils;

const BodyWrapper = styled.div`
  padding: 0 16px;

  .MuiTabPanel-root {
    padding: 16px 0;
  }

  ${media.phone`
    padding: 0;
  `}
`;

const ProfileBody = () => {
  const personRoleMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, ROLE], Map()));
  const personIsPeacemaker = personRoleMap.valueSeq().toList().includes(PEACEMAKER);
  return (
    <BodyWrapper>
      <CaseParticipation />
      {personIsPeacemaker && <LastContacted />}
    </BodyWrapper>
  );
};

export default ProfileBody;
