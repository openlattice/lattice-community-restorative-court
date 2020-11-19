// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Colors,
  IconButton,
  StyleUtils,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';

import AddContactActivityModal from './AddContactActivityModal';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { useSelector } from '../../../app/AppProvider';
import { ContactActivityConstants } from '../constants';
import { PERSON_NEIGHBOR_MAP, PROFILE } from '../reducers/constants';
import { SectionHeaderWithColor } from '../styled';

const { CONTACT_ACTIVITY } = AppTypes;
const { CONTACT_DATETIME, OUTCOME } = PropertyTypes;
const { GREEN, NEUTRAL, RED } = Colors;
const { DID_NOT_ATTEND, ATTENDED } = ContactActivityConstants;
const { getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;
const { getStyleVariation } = StyleUtils;

const getBackgroundColor = getStyleVariation('outcome', {
  [ATTENDED]: GREEN.G00,
  [DID_NOT_ATTEND]: RED.R00,
}, RED.R00);

const getFontColor = getStyleVariation('outcome', {
  [ATTENDED]: GREEN.G400,
  [DID_NOT_ATTEND]: RED.R400,
}, RED.R400);

const ContactTag = styled.div`
  background-color: ${getBackgroundColor};
  border-radius: 5px;
  color: ${getFontColor};
  display: flex;
  justify-content: center;
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
  align-items: center;
  display: flex;
  margin-bottom: 24px;
`;

const LastContacted = () => {

  const [modalIsVisible, setModalVisibility] = useState(false);
  const contactActivity :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, CONTACT_ACTIVITY], List()));
  const sortedContactActivity :List = contactActivity.sortBy((contactMade :Map) => contactMade.get(CONTACT_DATETIME));
  return (
    <SectionWrapper>
      <HeaderRow>
        <SectionHeaderWithColor margin="0 14px 0 0">
          <Typography color="inherit" variant="h3">Last Contacted</Typography>
        </SectionHeaderWithColor>
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
              <ContactTag outcome={outcome}>
                <Typography color="inherit" variant="body2">{date}</Typography>
              </ContactTag>
            );
          })
        }
      </ContactGrid>
      <AddContactActivityModal isVisible={modalIsVisible} onClose={() => setModalVisibility(false)} />
    </SectionWrapper>
  );
};

export default LastContacted;
