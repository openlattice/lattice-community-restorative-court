import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

const Header = styled.h2`
  color: ${NEUTRAL.N700};
  font-size: 1.375rem;
  font-weight: 600;
  margin: 0 0 24px;
`;

const FormHeader = styled.h1`
  color: ${NEUTRAL.N900};
  font-size: 28px;
  font-weight: 600;
  padding-left: 30px;
  padding-right: 30px;
`;

const FormDescription = styled.div`
  color: ${NEUTRAL.N500};
  display: flex;
  font-size: 16px;
  padding-left: 30px;
  padding-right: 30px;
`;

/* eslint-disable import/prefer-default-export */
export {
  FormDescription,
  FormHeader,
  Header,
};
