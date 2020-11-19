// @flow
import React from 'react';

import styled from 'styled-components';

import ProfileCard from './ProfileCard';

import { selectPerson } from '../../../core/redux/selectors';
import { useSelector } from '../../app/AppProvider';

const Centered = styled.div`
  align-items: center;
`;

const ProfileAside = () => {
  const person = useSelector(selectPerson());
  return (
    <Centered>
      <ProfileCard person={person} />
    </Centered>
  );
};

export default ProfileAside;
