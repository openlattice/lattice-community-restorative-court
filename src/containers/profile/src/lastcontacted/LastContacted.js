// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Colors, StyleUtils } from 'lattice-ui-kit';
import { DateTimeUtils } from 'lattice-utils';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { getPropertyValuesLU } from '../../../../utils/data';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { PERSON_NEIGHBOR_MAP, PROFILE } from '../reducers/constants';

const { CONTACT_ACTIVITY } = AppTypes;
const { CONTACT_DATETIME, OUTCOME } = PropertyTypes;
const { GREEN, RED } = Colors;
const { formatAsDate } = DateTimeUtils;
const { getStyleVariation } = StyleUtils;

const getBackgroundColor = getStyleVariation('outcome', {
  failure: RED.R00,
  success: GREEN.G00,
}, RED.R00);

const getFontColor = getStyleVariation('outcome', {
  failure: RED.R400,
  success: GREEN.G400,
}, RED.R400);

const ContactTag = styled.div`
  background-color: ${getBackgroundColor};
  border-radius: 5px;
  color: ${getFontColor};
  display: grid;
  grid-gap: 24px 16px;
  padding: 8px;
`;

const ContactGrid = styled.div`
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(98px, 1fr));
`;

const LastContacted = () => {
  const contactActivity :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, CONTACT_ACTIVITY], List()));
  const sortedContactActivity :List = contactActivity.sortBy((contactMade :Map) => contactMade.get(CONTACT_DATETIME));
  return (
    <div>
      <Header>Last Contacted</Header>
      <ContactGrid>
        {
          sortedContactActivity.map((contactMade :Map) => {
            const { [CONTACT_DATETIME]: datetime, [OUTCOME]: outcome } = getPropertyValuesLU(
              contactMade,
              [CONTACT_DATETIME, OUTCOME]
            );
            const date = formatAsDate(datetime);
            return (
              <ContactTag outcome={outcome}>{date}</ContactTag>
            );
          })
        }
      </ContactGrid>
    </div>
  );
};

export default LastContacted;
