// @flow
import React from 'react';

import { List } from 'immutable';
import { CardStack } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';

import CaseParticipationListItem from './CaseParticipationListItem';

import { AppTypes } from '../../../../core/edm/constants';
import { ProfileReduxConstants } from '../../../../core/redux/constants';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';

const { PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { CASE } = AppTypes;
const { getEntityKeyId } = DataUtils;

const CaseParticipation = () => {
  const personCases :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, CASE], List()));
  return (
    <div>
      <Header>Case Participation</Header>
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
