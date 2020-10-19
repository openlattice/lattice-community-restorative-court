import React from 'react';

import styled from 'styled-components';

import ProfileCard from './ProfileCard';
import { PERSON, PROFILE } from './reducers/constants';

import { useSelector } from '../../app/AppProvider';

const Centered = styled.div`
  align-items: center;
`;

const ProfileAside = () => {
  const person = useSelector((store) => store.getIn([PROFILE, PERSON]));

  return (
    <Centered>
      <ProfileCard person={person} />
    </Centered>
  );
};

export default ProfileAside;
