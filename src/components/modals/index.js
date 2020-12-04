// @flow
import styled from 'styled-components';

const ModalInnerWrapper = styled.div`
  padding-top: 24px;

  /* these responsive styles will need to be tested when the module is loaded into CARE */
  @media only screen and (min-width: 584px) {
    width: 584px;
  }

  @media only screen and (min-width: 900px) {
    width: 900px;
  }
`;

/* eslint-disable import/prefer-default-export */
export {
  ModalInnerWrapper,
};
