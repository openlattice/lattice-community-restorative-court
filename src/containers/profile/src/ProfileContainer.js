// @flow
import React, { useEffect } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { StyleUtils } from 'lattice-ui-kit';

import ProfileAside from './ProfileAside';
import ProfileBody from './ProfileBody';
import { loadProfile } from './actions';
import { PERSON, PROFILE } from './reducers/constants';

import { CrumbItem, Crumbs } from '../../../components/crumbs';
import { useDispatch, useSelector } from '../../app/AppProvider';

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

const ProfileContainer = ({ name, personId } :Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProfile(personId));
  }, [dispatch, personId]);

  const person :Map = useSelector((store :Map) => store.getIn([PROFILE, PERSON]));

  return (
    <div>
      <Crumbs>
        <CrumbItem>{ name }</CrumbItem>
      </Crumbs>
      <ProfileGrid>
        <ProfileAside />
        <ProfileBody personId={personId} />
      </ProfileGrid>
    </div>
  );
};

ProfileContainer.defaultProps = {
  name: ''
};

export default ProfileContainer;
