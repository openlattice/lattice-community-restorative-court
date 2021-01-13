// @flow
import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import {
  ActionModal,
  DatePicker,
  Label,
  Select,
} from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import { DOWNLOAD_REFERRALS, downloadReferrals } from './actions';

import { PropertyTypes } from '../../core/edm/constants';
import { resetRequestState } from '../../core/redux/actions';
import { DownloadsReduxConstants, REQUEST_STATE } from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';

const { getPropertyValue } = DataUtils;
const { isSuccess } = ReduxUtils;
const { DOWNLOADS } = DownloadsReduxConstants;
const { NAME } = PropertyTypes;

const DatePickerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 10px;
  width: 100%;
`;

type Props = {
  agencies :List;
  charges :List;
  isVisible :boolean;
  onClose :() => void;
};

const DownloadReferralsByAgencyModal = ({
  agencies,
  charges,
  isVisible,
  onClose,
} :Props) => {

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAgency, setAgency] = useState(Map());
  const [selectedCharge, setCharge] = useState(Map());

  const agencyOptions = agencies.map((agency :Map) => {
    const agencyName = getPropertyValue(agency, [NAME, 0]);
    return {
      label: agencyName,
      value: agency,
    };
  });

  const chargeOptions = charges.map((charge :Map) => {
    const chargeName = getPropertyValue(charge, [NAME, 0]);
    return {
      label: chargeName,
      value: charge,
    };
  });

  const dispatch = useDispatch();
  const downloadReport = () => {
    dispatch(downloadReferrals({
      endDate,
      selectedAgency,
      selectedCharge,
      startDate,
    }));
  };

  const downloadRequestState = useSelector((store) => store
    .getIn([DOWNLOADS, DOWNLOAD_REFERRALS, REQUEST_STATE]));
  useEffect(() => {
    if (isSuccess(downloadRequestState)) {
      setStartDate('');
      setEndDate('');
      setAgency(Map());
      dispatch(resetRequestState([DOWNLOAD_REFERRALS]));
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
        textTitle="Download Referrals"
        viewportScrolling>
      <Label>Optional: Choose an agency to download a report of all its referrals.</Label>
      <Select onChange={(option) => setAgency(option.value)} options={agencyOptions} />
      <Label>Optional: Date range for referral date:</Label>
      <DatePickerGrid>
        <DatePicker onChange={(date) => setStartDate(date)} />
        <DatePicker onChange={(date) => setEndDate(date)} />
      </DatePickerGrid>
      <Label>Optional: Choose a charge to download all referrals with that charge.</Label>
      <Select onChange={(option) => setCharge(option.value)} options={chargeOptions} />
    </ActionModal>
  );
};

export default DownloadReferralsByAgencyModal;
