// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Button, Colors, Modal } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';

import { useDispatch, useSelector } from '../../containers/app/AppProvider';
import { APP_PATHS } from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import {
  PEACEMAKER_INFORMATION_ROUTE_END,
  PERSON_ID,
  REFERRAL_ROUTE_END,
  REPAIR_HARM_AGREEMENT_ROUTE_END,
} from '../../core/router/Routes';
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
  const person :Map = useSelector(selectPerson());
  const personName :string = getPersonName(person);
  const personEKID = getEntityKeyId(person);
  const text = `For: ${personName}`;
  const Icon = <IconWrapper><FontAwesomeIcon color={NEUTRAL.N700} icon={faFileAlt} /></IconWrapper>;

  const dispatch = useDispatch();
  const root = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const goToReferral = () => {
    if (personEKID) dispatch(goToRoute(`${root}/${REFERRAL_ROUTE_END}`.replace(PERSON_ID, personEKID)));
  };
  const goToRepairHarm = () => {
    if (personEKID) {
      dispatch(goToRoute(`${root}/${REPAIR_HARM_AGREEMENT_ROUTE_END}`.replace(PERSON_ID, personEKID)));
    }
  };
  const goToPeacemakerInformation = () => {
    if (personEKID) {
      dispatch(goToRoute(`${root}/${PEACEMAKER_INFORMATION_ROUTE_END}`.replace(PERSON_ID, personEKID)));
    }
  };
  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        textTitle="Select Form Type"
        viewportScrolling>
      <div>{text}</div>
      <ButtonsWrapper>
        <Button aria-label="Form Button" onClick={goToReferral}>
          {Icon}
          Referral
        </Button>
        <Button aria-label="Form Button">
          {Icon}
          Intake
        </Button>
        <Button aria-label="Form Button" onClick={goToRepairHarm}>
          {Icon}
          Repair Harm Agreement
        </Button>
        <Button aria-label="Form Button">
          {Icon}
          Restitution Referral
        </Button>
        <Button aria-label="Form Button" onClick={goToPeacemakerInformation}>
          {Icon}
          Peacemaker Information Form
        </Button>
      </ButtonsWrapper>
    </Modal>
  );
};

export default ChooseFormTypeModal;
