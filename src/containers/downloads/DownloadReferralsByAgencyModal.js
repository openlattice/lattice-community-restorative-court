// @flow
import React, { useEffect, useState } from 'react';

import { List } from 'immutable';
import { ActionModal, Select } from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import { DOWNLOAD_REFERRALS_BY_AGENCY, downloadReferralsByAgency } from './actions';

import { PropertyTypes } from '../../core/edm/constants';
import { resetRequestState } from '../../core/redux/actions';
import { DownloadsReduxConstants } from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';

const { getPropertyValue } = DataUtils;
const { isSuccess } = ReduxUtils;
const { DOWNLOADS } = DownloadsReduxConstants;
const { NAME } = PropertyTypes;

type Props = {
  agencies :List;
  isVisible :boolean;
  onClose :() => void;
};

const DownloadReferralsByAgencyModal = ({ agencies, isVisible, onClose } :Props) => {
  const [selectedAgency, selectAgency] = useState('');
  const agencyOptions = agencies.map((agency :Map) => {
    const agencyName = getPropertyValue(agency, [NAME, 0]);
    return {
      label: agencyName,
      value: agency,
    };
  });

  const dispatch = useDispatch();
  const downloadReport = () => {
    dispatch(downloadReferralsByAgency(selectedAgency));
  };

  const downloadRequestState = useSelector((store) => store.getIn([DOWNLOADS, DOWNLOAD_REFERRALS_BY_AGENCY]));

  useEffect(() => {
    if (isSuccess(downloadRequestState)) {
      dispatch(resetRequestState([DOWNLOAD_REFERRALS_BY_AGENCY]));
      onClose();
    }
  }, [downloadRequestState, dispatch, onClose]);

  return (
    <ActionModal
        isVisible={isVisible}
        onClickPrimary={downloadReport}
        onClickSecondary={onClose}
        onClose={onClose}
        requestState={downloadRequestState}
        requestStateComponents={{ [RequestStates.STANDBY]: <></> }}
        textPrimary="Download"
        textSecondary="Close"
        textTitle="Download Referrals By Agency"
        viewportScrolling>
      <div>Choose an agency to download a report of all its referrals.</div>
      <Select onChange={(option) => selectAgency(option.value)} options={agencyOptions} />
    </ActionModal>
  );
};

export default DownloadReferralsByAgencyModal;
