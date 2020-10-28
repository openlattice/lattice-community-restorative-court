// @flow
import React from 'react';

import styled from 'styled-components';
import { StyleUtils } from 'lattice-ui-kit';

import CaseParticipation from './caseparticipation/CaseParticipation';

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

const ProfileBody = () => (
  <BodyWrapper>
    <CaseParticipation />
  </BodyWrapper>
);

export default ProfileBody;
