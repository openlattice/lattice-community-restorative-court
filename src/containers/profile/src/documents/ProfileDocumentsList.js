// @flow
import React from 'react';

import { List, Map } from 'immutable';

import { DocumentList } from '../../../../components';
import { AppTypes } from '../../../../core/edm/constants';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { FORM_NEIGHBOR_MAP, PERSON_NEIGHBOR_MAP, PROFILE } from '../reducers/constants';

const { FORM } = AppTypes;

const CaseParticipation = () => {
  const forms :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, FORM], List()));
  const formNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, FORM_NEIGHBOR_MAP], Map()));
  return (
    <div>
      <Header>Documents</Header>
      <DocumentList forms={forms} formNeighborMap={formNeighborMap} />
    </div>
  );
};

export default CaseParticipation;
