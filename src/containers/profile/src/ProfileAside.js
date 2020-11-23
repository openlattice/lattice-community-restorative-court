// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';

import ProfileCard from './ProfileCard';

import ChooseFormTypeModal from '../../../components/forms/ChooseFormTypeModal';
import { selectPerson } from '../../../core/redux/selectors';
import { useSelector } from '../../app/AppProvider';

const Centered = styled.div`
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: grid;
  grid-gap: 0 10px;
  grid-template-columns: 1fr 1fr;
  margin-top: 16px;
`;

const ProfileAside = () => {
  const [formChoiceModalIsVisible, setFormChoiceModalVisibility] = useState(false);
  const person = useSelector(selectPerson());
  return (
    <Centered>
      <ProfileCard person={person} />
      <div>
        <ButtonWrapper>
          <Button>Edit Profile</Button>
          <Button color="primary" onClick={() => setFormChoiceModalVisibility(true)}>Add Form</Button>
        </ButtonWrapper>
      </div>
      <ChooseFormTypeModal isVisible={formChoiceModalIsVisible} onClose={() => setFormChoiceModalVisibility(false)} />
    </Centered>
  );
};

export default ProfileAside;
