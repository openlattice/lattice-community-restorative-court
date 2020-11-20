// @flow
import React from 'react';

import { List } from 'immutable';
import { CardStack, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';

import CaseParticipationListItem from './CaseParticipationListItem';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants } from '../../../../core/redux/constants';
import { useSelector } from '../../../app/AppProvider';
import { SectionHeaderWithColor } from '../styled';

const { PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { CRC_CASE } = AppTypes;
const { getEntityKeyId } = DataUtils;

const CaseParticipation = () => {
  const personCases :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, CRC_CASE], List()));
  return (
    <div>
      <SectionHeaderWithColor margin="0 0 24px">
        <Typography color="inherit" variant="h3">Case Participation</Typography>
      </SectionHeaderWithColor>
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
