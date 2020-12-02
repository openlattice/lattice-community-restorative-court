// @flow
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

const Body = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-auto-flow: row;
`;

const CenterWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`;

const SectionHeaderWithColor = styled.div`
  color: ${NEUTRAL.N800};
  margin: ${(props) => props.margin || '0'};
`;

export {
  Body,
  CenterWrapper,
  SectionHeaderWithColor,
};
