// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Colors, IconButton, StyleUtils } from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { useSelector } from '../../../app/AppProvider';
import { Header } from '../../typography';
import { ContactConstants } from '../constants';
import { PERSON_NEIGHBOR_MAP, PROFILE } from '../reducers/constants';

const { CONTACT_ACTIVITY } = AppTypes;
const { CONTACT_DATETIME, OUTCOME } = PropertyTypes;
const { GREEN, NEUTRAL, RED } = Colors;
const { FAILURE, SUCCESS } = ContactConstants;
const { getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;
const { getStyleVariation } = StyleUtils;

const getBackgroundColor = getStyleVariation('outcome', {
  [FAILURE]: RED.R00,
  [SUCCESS]: GREEN.G00,
}, RED.R00);

const getFontColor = getStyleVariation('outcome', {
  [FAILURE]: RED.R400,
  [SUCCESS]: GREEN.G400,
}, RED.R400);

const ContactTag = styled.div`
  background-color: ${getBackgroundColor};
  border-radius: 5px;
  color: ${getFontColor};
  font-size: 16px;
  font-weight: 600;
  padding: 8px;
`;

const SectionWrapper = styled.div`
  margin-top: 36px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-gap: 24px 16px;
  grid-template-columns: repeat(auto-fit, 98px);
  margin-bottom: 36px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LastContacted = () => {

  const [modalIsVisible, setModalVisibility] = useState(false);
  const contactActivity :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, CONTACT_ACTIVITY], List()));
  const sortedContactActivity :List = contactActivity.sortBy((contactMade :Map) => contactMade.get(CONTACT_DATETIME));
  return (
    <SectionWrapper>
      <HeaderRow>
        <Header>Last Contacted</Header>
        <IconButton onClick={() => setModalVisibility(true)}>
          <FontAwesomeIcon color={NEUTRAL.N700} fixedWidth icon={faPlus} />
        </IconButton>
      </HeaderRow>
      <ContactGrid>
        {
          sortedContactActivity.map((contactMade :Map) => {
            const datetime = getPropertyValue(contactMade, [CONTACT_DATETIME, 0]);
            const date = formatAsDate(datetime);
            const outcome = getPropertyValue(contactMade, [OUTCOME, 0]);
            return (
              <ContactTag outcome={outcome}>{date}</ContactTag>
            );
          })
        }
      </ContactGrid>
    </SectionWrapper>
  );
};

export default LastContacted;
