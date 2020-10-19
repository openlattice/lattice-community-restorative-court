import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

const Header = styled.h2`
  color: ${NEUTRAL.N700};
  font-size: 1.375rem;
  font-weight: 600;
  margin: 0 0 24px;
`;

/* eslint-disable import/prefer-default-export */
export {
  Header,
};
