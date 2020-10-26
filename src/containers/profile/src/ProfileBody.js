// @flow
import React from 'react';

import styled from 'styled-components';
import { Spinner, StyleUtils } from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';

import CaseParticipation from './caseparticipation/CaseParticipation';
import { CenterWrapper } from './styled';

import { APP, REQUEST_STATE } from '../../../core/redux/constants';
import { useSelector } from '../../app/AppProvider';
import { INITIALIZE_APPLICATION } from '../../app/actions';

const { media } = StyleUtils;
const { isPending } = ReduxUtils;

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
  if (isPending(initializeState)) {
    return <CenterWrapper><Spinner size="3x" /></CenterWrapper>;
  }

  return (
    <BodyWrapper>
      <CaseParticipation personId={personId} />
    </BodyWrapper>
  );
};

export default ProfileBody;
