// @flow
import React from 'react';

import { List } from 'immutable';
import { CardStack } from 'lattice-ui-kit';

import CaseParticipationListItem from './CaseParticipationListItem';

import { AppTypes } from '../../../../core/edm/constants';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { PERSON_NEIGHBOR_MAP, PROFILE } from '../reducers/constants';

const { CASE } = AppTypes;

const CaseParticipation = () => {
  const personCases :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, CASE], List()));
  return (
    <div>
      <Header>Case Participation</Header>
      <CardStack>
        {
          personCases.map((personCase) => (
            <CaseParticipationListItem personCase={personCase} />
          ))
        }
      </CardStack>
    </div>
  );
};

export default CaseParticipation;
