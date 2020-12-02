// @flow
import React, { useState } from 'react';

import styled from 'styled-components';
import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Colors,
  IconButton,
  Typography,
} from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';

import AddContactActivityModal from './AddContactActivityModal';

import { CRCTag } from '../../../../components';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { useSelector } from '../../../app/AppProvider';
import { PERSON_NEIGHBOR_MAP, PROFILE } from '../reducers/constants';
import { SectionHeaderWithColor } from '../styled';

const { CONTACT_ACTIVITY } = AppTypes;
const { CONTACT_DATETIME, OUTCOME } = PropertyTypes;
const { NEUTRAL } = Colors;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;

const SectionWrapper = styled.div`
  margin-top: 36px;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-gap: 24px 16px;
  grid-template-columns: repeat(auto-fit, minmax(98px, max-content));
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
              <CRCTag
                  background={outcome}
                  borderRadius="5px"
                  color={outcome}
                  key={getEntityKeyId(contactMade)}
                  padding="8px">
                <Typography color="inherit" variant="body2">{date}</Typography>
              </CRCTag>
            );
          })
        }
      </ContactGrid>
      <AddContactActivityModal isVisible={modalIsVisible} onClose={() => setModalVisibility(false)} />
    </SectionWrapper>
  );
};

export default LastContacted;
