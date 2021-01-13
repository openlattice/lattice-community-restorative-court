// @flow
import React, { useEffect, useState } from 'react';

import { List, Map } from 'immutable';
import {
  ActionModal,
  Checkbox,
  Label,
  Select,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

import { DOWNLOAD_PEACEMAKERS, downloadPeacemakers } from './actions';

import { resetRequestState } from '../../core/redux/actions';
import { DownloadsReduxConstants, REQUEST_STATE } from '../../core/redux/constants';
import { getPersonName } from '../../utils/people';
import { RACES } from '../../utils/people/constants';
import { useDispatch, useSelector } from '../app/AppProvider';

const { isSuccess } = ReduxUtils;
const { DOWNLOADS } = DownloadsReduxConstants;

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const DownloadPeacemakersModal = ({ isVisible, onClose } :Props) => {

  const [selectedRace, setRace] = useState('');

  const dispatch = useDispatch();
  const downloadReport = () => {
    dispatch(downloadPeacemakers());
  };

  const raceOptions = RACES.map((race :string) => ({ label: race, value: race }));

  const downloadRequestState = useSelector((store) => store.getIn([DOWNLOADS, DOWNLOAD_PEACEMAKERS, REQUEST_STATE]));

  useEffect(() => {
    if (isSuccess(downloadRequestState)) {
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
      <Label>Race</Label>
      <Select
          onChange={(option) => setRace(option.value)}
          options={raceOptions}
          placeholder="Select race..." />
    </ActionModal>
  );
};

export default DownloadPeacemakersModal;
