// @flow
import React from 'react';

import styled from 'styled-components';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CardSegment, Colors } from 'lattice-ui-kit';

const { GREEN, NEUTRAL } = Colors;

const ModalCardSegment = styled(CardSegment)`
  align-items: center;
  background-color: ${(props) => (props.mode === 'open' ? GREEN.G300 : NEUTRAL.N700)};
  color: white;
  justify-content: center;
  padding: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  height: 32px;
  width: 32px;
  position: absolute;
  right: 20px;
`;

type HeaderProps = {
  mode :string;
  onClose :() => void;
};

const CaseDetailsModalHeader = ({ mode, onClose } :HeaderProps) => (
  <ModalCardSegment mode={mode} vertical={false}>
    { mode === 'open' && <div>This case is currently ongoing.</div> }
    { mode === 'closed' && <div>This case is closed.</div> }
    <CloseButton onClick={onClose}>
      <FontAwesomeIcon color="white" icon={faTimes} size="2x" />
    </CloseButton>
  </ModalCardSegment>
);

export default CaseDetailsModalHeader;
