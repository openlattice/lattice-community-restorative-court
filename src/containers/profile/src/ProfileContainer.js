// @flow
import React from 'react';

import styled from 'styled-components';
import { StyleUtils } from 'lattice-ui-kit';
import type { UUID } from 'lattice';

import ProfileAside from './ProfileAside';

import { CrumbItem, Crumbs } from '../../../components/crumbs';

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
  name ?:string;
  personId :UUID;
};

const ProfileContainer = ({ name, personId } :Props) => (
  <div>
    <Crumbs>
      <CrumbItem>{ name }</CrumbItem>
    </Crumbs>
    <ProfileGrid>
      <ProfileAside personId={personId} />
    </ProfileGrid>
  </div>
);

ProfileContainer.defaultProps = {
  name: ''
};

export default ProfileContainer;
