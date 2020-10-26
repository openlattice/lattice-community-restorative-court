// @flow
import React from 'react';

import { List } from 'immutable';
import { CardStack } from 'lattice-ui-kit';

import CaseParticipationListItem from './CaseParticipationListItem';

import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { PERSON_CASES, PROFILE } from '../reducers/constants';

const CaseParticipation = () => {
  const personCases :List = useSelector((store) => store.getIn([PROFILE, PERSON_CASES]));
  return (
    <div>
      <Header>Case Participation</Header>
      <CardStack>
        {
          personCases.map((crcCase) => (
            <CaseParticipationListItem crcCase={crcCase} />
          ))
        }
      </CardStack>
    </div>
  );
};

export default CaseParticipation;
