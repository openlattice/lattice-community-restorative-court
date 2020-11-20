import React from 'react';

import styled from 'styled-components';

import ProfileCard from './ProfileCard';

import { useSelector } from '../../app/AppProvider';

const Centered = styled.div`
  align-items: center;
`;

const ProfileAside = () => {
  const person = useSelector((store) => store.getIn(['profile', 'person']));

  return (
    <Centered>
      <ProfileCard person={person} />
    </Centered>
  );
};

export default ProfileAside;
