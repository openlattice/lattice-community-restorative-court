// @flow
import React, { useEffect, useState } from 'react';

import { List, Map } from 'immutable';
import {
  ActionModal,
  Checkbox,
  DatePicker,
  Label,
  Select,
} from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import { DOWNLOAD_REFERRALS, downloadReferrals } from './actions';
import { DatePickerGrid } from './styled';

import { PropertyTypes } from '../../core/edm/constants';
import { resetRequestState } from '../../core/redux/actions';
import { DownloadsReduxConstants, REQUEST_STATE } from '../../core/redux/constants';
import { GENDERS, RACES } from '../../utils/people/constants';
import { useDispatch, useSelector } from '../app/AppProvider';

const { getPropertyValue } = DataUtils;
const { isSuccess } = ReduxUtils;
const { DOWNLOADS } = DownloadsReduxConstants;
const { NAME } = PropertyTypes;

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
  const [selectedRace, setRace] = useState('');
  const [selectedGender, setGender] = useState('');
  const [onlyRepeatReferrals, setRepeatReferrals] = useState(false);

  const agencyOptions = agencies.map((agency :Map) => {
    const agencyName = getPropertyValue(agency, [NAME, 0]);
    return { label: agencyName, value: agency };
  });
  const chargeOptions = charges.map((charge :Map) => {
    const chargeName = getPropertyValue(charge, [NAME, 0]);
    return { label: chargeName, value: charge };
  });
  const raceOptions = RACES.map((race :string) => ({ label: race, value: race }));
  const genderOptions = GENDERS.map((gender :string) => ({ label: gender, value: gender }));

  const dispatch = useDispatch();
  const downloadReport = () => {
    dispatch(downloadReferrals({
      endDate,
      onlyRepeatReferrals,
      selectedAgency,
      selectedCharge,
      selectedGender,
      selectedRace,
      startDate,
    }));
  };

  const downloadRequestState = useSelector((store) => store
    .getIn([DOWNLOADS, DOWNLOAD_REFERRALS, REQUEST_STATE]));
  useEffect(() => {
    if (isSuccess(downloadRequestState)) {
      setAgency(Map());
      setCharge(Map());
      setEndDate('');
      setGender('');
      setRace('');
      setRepeatReferrals(true);
      setStartDate('');
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
      <Label>Selecting any of the following filters is optional. The default is always to show all values.</Label>
      <Label>Agency</Label>
      <Select
          onChange={(option) => setAgency(option.value)}
          options={agencyOptions}
          placeholder="Select agency..." />
      <Label>Date range for referral date:</Label>
      <DatePickerGrid>
        <DatePicker onChange={(date) => setStartDate(date)} />
        <DatePicker onChange={(date) => setEndDate(date)} />
      </DatePickerGrid>
      <Label>Charge</Label>
      <Select
          onChange={(option) => setCharge(option.value)}
          options={chargeOptions}
          placeholder="Select charge..." />
      <Label>Race</Label>
      <Select
          onChange={(option) => setRace(option.value)}
          options={raceOptions}
          placeholder="Select race..." />
      <Label>Gender</Label>
      <Select
          onChange={(option) => setGender(option.value)}
          options={genderOptions}
          placeholder="Select gender..." />
      <Checkbox
          label="Select to see only referrals where the person has been referred multiple times"
          onChange={() => setRepeatReferrals(!onlyRepeatReferrals)} />
    </ActionModal>
  );
};

export default DownloadReferralsByAgencyModal;
