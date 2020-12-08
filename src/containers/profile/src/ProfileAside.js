// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import ProfileCard from './ProfileCard';

import ChooseFormTypeModal from '../../../components/forms/ChooseFormTypeModal';
import { APP_PATHS } from '../../../core/redux/constants';
import { selectPerson } from '../../../core/redux/selectors';
import { PERSON_ID } from '../../../core/router/Routes';
import { goToRoute } from '../../../core/router/RoutingActions';
import { getRelativeRoot } from '../../../utils/router';
import { useDispatch, useSelector } from '../../app/AppProvider';

const { getEntityKeyId } = DataUtils;

const Centered = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
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
  const personEKID :?UUID = getEntityKeyId(person);
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);
  const dispatch = useDispatch();
  const goToEditProfileForm = () => {
    if (personEKID) {
      dispatch(goToRoute(`${relativeRoot}/edit`.replace(PERSON_ID, personEKID)));
    }
  };
  return (
    <Centered>
      <ProfileCard person={person} />
      <div>
        <ButtonWrapper>
          <Button onClick={goToEditProfileForm}>Edit Profile</Button>
          <Button color="primary" onClick={() => setFormChoiceModalVisibility(true)}>Add Form</Button>
        </ButtonWrapper>
      </div>
      <ChooseFormTypeModal isVisible={formChoiceModalIsVisible} onClose={() => setFormChoiceModalVisibility(false)} />
    </Centered>
  );
};

export default ProfileAside;
