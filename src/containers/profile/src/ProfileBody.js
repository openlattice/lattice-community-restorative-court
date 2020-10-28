// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { StyleUtils } from 'lattice-ui-kit';

import CaseParticipation from './caseparticipation/CaseParticipation';
import LastContacted from './lastcontacted/LastContacted';
import { RoleConstants } from './constants';
import { PERSON_NEIGHBOR_MAP, PROFILE } from './reducers/constants';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { getPropertyValue } from '../../../utils/data';
import { useSelector } from '../../app/AppProvider';

const { PEACEMAKER } = RoleConstants;
const { ROLE } = AppTypes;
const { TYPE } = PropertyTypes;
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
  const personRoles :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, ROLE], List()));
  const personIsPeacemaker = personRoles.includes((role :Map) => getPropertyValue(role, TYPE) === PEACEMAKER);
  return (
    <BodyWrapper>
      <CaseParticipation />
      {personIsPeacemaker && <LastContacted />}
    </BodyWrapper>
  );
};

export default ProfileBody;
