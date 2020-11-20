// @flow
import React from 'react';

import styled from 'styled-components';
import { StyleUtils } from 'lattice-ui-kit';
import type { UUID } from 'lattice';

import ProfileAside from './ProfileAside';

const { media } = StyleUtils;

const ProfileGrid = styled.div`
  display: grid;
  grid-gap: 18px;
  grid-template-columns: auto 1fr;
  ${media.phone`
    grid-template-columns: auto;
  `}
`;

type Props = {
  personId :UUID;
};

const ProfileContainer = ({ personId } :Props) => (
  <div>
    <ProfileGrid>
      <ProfileAside personId={personId} />
    </ProfileGrid>
  </div>
);

export default ProfileContainer;
