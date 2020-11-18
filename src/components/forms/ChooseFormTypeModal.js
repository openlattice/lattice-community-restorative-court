// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Button, Colors, Modal } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';

import { useDispatch, useSelector } from '../../containers/app/AppProvider';
import { APP_PATHS } from '../../containers/app/constants';
import { PERSON, PROFILE } from '../../containers/profile/src/reducers/constants';
import { PERSON_ID, REFERRAL } from '../../core/router/Routes';
import { goToRoute } from '../../core/router/RoutingActions';
import { getPersonName } from '../../utils/people';

const { NEUTRAL } = Colors;
const { getEntityKeyId } = DataUtils;

const ButtonsWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 10px;
  padding: 30px 0;
`;

const IconWrapper = styled.div`
  margin-right: 10px;
`;

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const ChooseFormTypeModal = ({ isVisible, onClose } :Props) => {
  const person :Map = useSelector((store) => store.getIn([PROFILE, PERSON]));
  const personName :string = getPersonName(person);
  const personEKID = getEntityKeyId(person);
  const text = `For: ${personName}`;
  const Icon = <IconWrapper><FontAwesomeIcon color={NEUTRAL.N700} icon={faFileAlt} /></IconWrapper>;

  const dispatch = useDispatch();
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const goToReferral = () => {
    if (personEKID) dispatch(goToRoute(`${root}/${PERSON_ID}/${REFERRAL}`.replace(PERSON_ID, personEKID)));
  };
  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        textTitle="Select Form Type"
        viewportScrolling>
      <div>{text}</div>
      <ButtonsWrapper>
        <Button onClick={goToReferral}>
          {Icon}
          Referral
        </Button>
        <Button onClick={() => {}}>
          {Icon}
          Intake
        </Button>
        <Button onClick={() => {}}>
          {Icon}
          Repair Harm Agreement
        </Button>
        <Button onClick={() => {}}>
          {Icon}
          Restitution Referral
        </Button>
        <Button onClick={() => {}}>
          {Icon}
          Peacemaker Information Form
        </Button>
      </ButtonsWrapper>
    </Modal>
  );
};

export default ChooseFormTypeModal;