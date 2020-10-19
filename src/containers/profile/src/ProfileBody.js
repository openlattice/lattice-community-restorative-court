// @flow
import React from 'react';

import styled from 'styled-components';
import { Spinner, StyleUtils } from 'lattice-ui-kit';

import CaseParticipation from './CaseParticipation';
import { CenterWrapper } from './styled';

import { APP, REQUEST_STATE } from '../../../core/redux/constants';
import { requestIsPending } from '../../../utils/redux';
import { useSelector } from '../../app/AppProvider';
import { INITIALIZE_APPLICATION } from '../../app/actions';

const { media } = StyleUtils;

const BodyWrapper = styled.div`
  padding: 0 16px;

  .MuiTabPanel-root {
    padding: 16px 0;
  }

  ${media.phone`
    padding: 0;
  `}
`;

type Props = {
  personId :UUID;
};

const ProfileBody = ({ personId } :Props) => {

  const initializeState = useSelector((state) => state.getIn([APP, INITIALIZE_APPLICATION, REQUEST_STATE]));
  if (requestIsPending(initializeState)) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  return (
    <BodyWrapper>
      <CaseParticipation personId={personId} />
    </BodyWrapper>
  );
};

export default ProfileBody;
