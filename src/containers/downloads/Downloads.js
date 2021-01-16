// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { faDownload } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  CardSegment,
  CardStack,
  Colors,
} from 'lattice-ui-kit';
import type { UUID } from 'lattice';
import type { Match } from 'react-router';

import DownloadCasesModal from './DownloadCasesModal';
import DownloadReferralsModal from './DownloadReferralsModal';

import { APP_PATHS, ProfileReduxConstants, ReferralReduxConstants } from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';
import { initializeApplication } from '../app/actions';
import { getStaff } from '../profile/src/actions';
import { getAgencies, getCharges } from '../referral/actions';

const { NEUTRAL } = Colors;
const { AGENCIES, CHARGES, REFERRAL } = ReferralReduxConstants;
const { PROFILE, STAFF_MEMBERS } = ProfileReduxConstants;

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
      dispatch(getStaff());
      dispatch(getCharges());
    }
  }, [appConfig, dispatch]);

  const [referralsModalIsOpen, openReferralsModal] = useState(false);
  const [casesModalIsOpen, openCasesModal] = useState(false);

  const agencies :List = useSelector((store) => store.getIn([REFERRAL, AGENCIES], List()));
  const charges :List = useSelector((store) => store.getIn([REFERRAL, CHARGES], List()));
  const staff :List = useSelector((store) => store.getIn([PROFILE, STAFF_MEMBERS], List()));

  return (
    <CardStack>
      <DownloadCard onClick={() => openReferralsModal(true)}>
        <DownloadCardSegment padding="8px 16px" vertical={false}>
          <div>Download Referrals Report</div>
          <FontAwesomeIcon color={NEUTRAL.N700} icon={faDownload} />
        </DownloadCardSegment>
      </DownloadCard>
      <DownloadCard onClick={() => openCasesModal(true)}>
        <DownloadCardSegment padding="8px 16px" vertical={false}>
          <div>Download Cases Report</div>
          <FontAwesomeIcon color={NEUTRAL.N700} icon={faDownload} />
        </DownloadCardSegment>
      </DownloadCard>
      <DownloadReferralsModal
          agencies={agencies}
          charges={charges}
          isVisible={referralsModalIsOpen}
          onClose={() => openReferralsModal(false)} />
      <DownloadCasesModal
          isVisible={casesModalIsOpen}
          onClose={() => openCasesModal(false)}
          staff={staff} />
    </CardStack>
  );
};

export default Downloads;
