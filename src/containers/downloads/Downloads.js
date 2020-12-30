// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { faDownload } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List } from 'immutable';
import {
  Card,
  CardSegment,
  CardStack,
  Colors,
} from 'lattice-ui-kit';
import type { Match } from 'react-router';

import DownloadReferralsByAgencyModal from './DownloadReferralsByAgencyModal';

import { APP_PATHS, ReferralReduxConstants } from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';
import { initializeApplication } from '../app/actions';
import { getAgencies } from '../referral/actions';

const { NEUTRAL } = Colors;
const { AGENCIES, REFERRAL } = ReferralReduxConstants;

const DownloadCard = styled(Card)`
  background-color: ${NEUTRAL.N50};
  color: ${NEUTRAL.N700};
  font-size: 16px;
  font-weight: 600;

  &:hover {
    cursor: pointer;
  }
`;

const DownloadCardSegment = styled(CardSegment)`
  align-items: center;
  justify-content: space-between;
`;

type Props = {
  match :Match;
  organizationId :UUID;
  root :string;
};

const Downloads = ({ match, organizationId, root } :Props) => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeApplication({ match, organizationId, root }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, organizationId, root]);

  const appConfig = useSelector((store :Map) => store.getIn(APP_PATHS.APP_CONFIG));
  useEffect(() => {
    if (appConfig) {
      dispatch(getAgencies());
    }
  }, [appConfig, dispatch]);

  const [referralsByAgencyModalIsOpen, openReferralsByAgencyModal] = useState(false);

  const agencies :List = useSelector((store) => store.getIn([REFERRAL, AGENCIES], List()));

  return (
    <CardStack>
      <DownloadCard onClick={() => openReferralsByAgencyModal(true)}>
        <DownloadCardSegment padding="8px 16px" vertical={false}>
          <div>Download Referrals by Agency Report</div>
          <FontAwesomeIcon color={NEUTRAL.N700} icon={faDownload} />
        </DownloadCardSegment>
      </DownloadCard>
      <DownloadReferralsByAgencyModal
          agencies={agencies}
          isVisible={referralsByAgencyModalIsOpen}
          onClose={() => openReferralsByAgencyModal(false)} />
    </CardStack>
  );
};

export default Downloads;
