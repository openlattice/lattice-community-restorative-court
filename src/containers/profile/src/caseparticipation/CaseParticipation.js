// @flow
import React from 'react';

import styled from 'styled-components';
import { List } from 'immutable';
import { CardStack, Colors, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';

import CaseParticipationListItem from './CaseParticipationListItem';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants } from '../../../../core/redux/constants';
import { useSelector } from '../../../app/AppProvider';

const { PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { CRC_CASE } = AppTypes;
const { NEUTRAL } = Colors;
const { getEntityKeyId } = DataUtils;

const Header = styled(Typography)`
  color: ${NEUTRAL.N800};
  margin-bottom: 24px;
`;

const CaseParticipation = () => {
  const personCases :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, CRC_CASE], List()));
  return (
    <div>
      <Header variant="h3">Case Participation</Header>
      <CardStack>
        {
          personCases.map((personCase) => (
            <CaseParticipationListItem key={getEntityKeyId(personCase)} personCase={personCase} />
          ))
        }
      </CardStack>
    </div>
  );
};

export default CaseParticipation;
