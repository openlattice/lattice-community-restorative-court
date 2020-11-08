// @flow
import React from 'react';

import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';

import ProfileCard from './ProfileCard';
import { PERSON, PROFILE } from './reducers/constants';

import { useSelector } from '../../app/AppProvider';

const Centered = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-content: stretch;
  margin-top: 16px;
`;

const ProfileAside = () => {
  const person = useSelector((store) => store.getIn([PROFILE, PERSON]));

  return (
    <Centered>
      <ProfileCard person={person} />
      <ButtonWrapper>
        <Button color="primary" onClick={() => {}}>Add Form</Button>
      </ButtonWrapper>
    </Centered>
  );
};

export default ProfileAside;
