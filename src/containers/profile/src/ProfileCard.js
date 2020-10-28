// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
  Label,
  StyleUtils,
} from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';

import Portrait from './Portrait';
import { EMPTY_VALUE } from './constants';

import PROPERTY_TYPE_FQNS from '../../../core/edm/constants/PropertyTypes';
import { getPropertyValuesLU } from '../../../utils/data';

const { media } = StyleUtils;

const { formatAsDate } = DateTimeUtils;

const {
  DOB,
  GIVEN_NAME,
  SURNAME,
} = PROPERTY_TYPE_FQNS;

const InlineCard = styled(Card)`
  display: inline-block;
  ${media.phone`
    width: 100%;
  `}
`;

const CardDetails = styled(CardSegment)`
  padding-top: 0;
  word-break: word-wrap;

  label:not(:first-of-type) {
    margin-top: 30px;
  }
`;

const PortraitSegment = styled(CardSegment)`
  border-bottom: none;
  place-items: center;
`;

type Props = {
  person :Map;
  imageUrl ? :string;
};

const ProfileCard = ({ imageUrl, person } :Props) => {
  const { [DOB]: dob, [GIVEN_NAME]: firstName, [SURNAME]: lastName } = getPropertyValuesLU(
    person,
    [DOB, GIVEN_NAME, SURNAME]
  );

  const formattedDob = formatAsDate(dob);

  return (
    <InlineCard>
      <PortraitSegment>
        <Portrait imageUrl={imageUrl} />
      </PortraitSegment>
      <CardDetails>
        <Label subtle>Last Name</Label>
        <div>{lastName || EMPTY_VALUE}</div>
        <Label subtle>First Name</Label>
        <div>{firstName || EMPTY_VALUE}</div>
        <Label subtle>Date of Birth</Label>
        <div>{formattedDob}</div>
      </CardDetails>
    </InlineCard>
  );
};

ProfileCard.defaultProps = {
  imageUrl: undefined,
  person: Map(),
};

export default ProfileCard;
