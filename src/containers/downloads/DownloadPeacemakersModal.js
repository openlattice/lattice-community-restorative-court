// @flow
import React, { useEffect, useState } from 'react';

import {
  ActionModal,
  DatePicker,
  Label,
  Select,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import { DOWNLOAD_PEACEMAKERS, downloadPeacemakers } from './actions';
import { DatePickerGrid } from './styled';

import { resetRequestState } from '../../core/redux/actions';
import { DownloadsReduxConstants, REQUEST_STATE } from '../../core/redux/constants';
import { RACES } from '../../utils/people/constants';
import { useDispatch, useSelector } from '../app/AppProvider';
import { PeacemakerStatusConstants } from '../peacemaker/constants';

const { isSuccess } = ReduxUtils;
const { DOWNLOADS } = DownloadsReduxConstants;
const { ACTIVE, INACTIVE } = PeacemakerStatusConstants;

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const DownloadPeacemakersModal = ({ isVisible, onClose } :Props) => {

  const [selectedRace, setRace] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStatus, setStatus] = useState('');

  const dispatch = useDispatch();
  const downloadReport = () => {
    dispatch(downloadPeacemakers({
      endDate,
      selectedRace,
      selectedStatus,
      startDate,
    }));
  };

  const raceOptions = RACES.map((race :string) => ({ label: race, value: race }));
  const statusOptions = [ACTIVE, INACTIVE].map((status :string) => ({ label: status, value: status }));

  const downloadRequestState = useSelector((store) => store.getIn([DOWNLOADS, DOWNLOAD_PEACEMAKERS, REQUEST_STATE]));

  useEffect(() => {
    if (isSuccess(downloadRequestState)) {
      setRace('');
      setStartDate('');
      setEndDate('');
      setStatus('');
      dispatch(resetRequestState([DOWNLOAD_PEACEMAKERS]));
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
        textTitle="Download Peacemakers"
        viewportScrolling>
      <Label>Selecting any of the following filters is optional. The default is always to show all values.</Label>
      <Label>Race</Label>
      <Select
          onChange={(option) => setRace(option.value)}
          options={raceOptions}
          placeholder="Select race..." />
      <Label>Date range for date trained:</Label>
      <DatePickerGrid>
        <DatePicker onChange={(date) => setStartDate(date)} />
        <DatePicker onChange={(date) => setEndDate(date)} />
      </DatePickerGrid>
      <Label>Current Peacemaker Status:</Label>
      <Select
          onChange={(option) => setStatus(option.value)}
          options={statusOptions}
          placeholder="Select status..." />
    </ActionModal>
  );
};

export default DownloadPeacemakersModal;
