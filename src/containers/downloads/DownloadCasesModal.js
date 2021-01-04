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

import { DOWNLOAD_CASES, downloadCases } from './actions';

import { resetRequestState } from '../../core/redux/actions';
import { DownloadsReduxConstants, REQUEST_STATE } from '../../core/redux/constants';
import { getPersonName } from '../../utils/people';
import { useDispatch, useSelector } from '../app/AppProvider';

const { isSuccess } = ReduxUtils;
const { DOWNLOADS } = DownloadsReduxConstants;

type Props = {
  isVisible :boolean;
  onClose :() => void;
  staff :List;
};

const DownloadCasesModal = ({ isVisible, onClose, staff } :Props) => {

  const [selectedStaffMember, setStaffMember] = useState('');
  const [hasOpenCases, setHasOpenCases] = useState(false);
  const [hasClosedCases, setHasClosedCases] = useState(false);

  const staffOptions = staff.map((staffMember :Map) => {
    const staffMemberName = getPersonName(staffMember);
    return {
      label: staffMemberName,
      value: staffMemberName,
    };
  });

  const dispatch = useDispatch();
  const downloadReport = () => {
    dispatch(downloadCases({ hasClosedCases, hasOpenCases, selectedStaffMember }));
  };

  const downloadRequestState = useSelector((store) => store.getIn([DOWNLOADS, DOWNLOAD_CASES, REQUEST_STATE]));

  useEffect(() => {
    if (isSuccess(downloadRequestState)) {
      setStaffMember('');
      setHasOpenCases(false);
      setHasClosedCases(false);
      dispatch(resetRequestState([DOWNLOAD_CASES]));
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
        textTitle="Download Cases"
        viewportScrolling>
      <Label>Include:</Label>
      <Checkbox
          label="Open Cases"
          onChange={() => setHasOpenCases(!hasOpenCases)} />
      <Checkbox
          label="Closed Cases"
          onChange={() => setHasClosedCases(!hasClosedCases)} />
      <Label>Optional: Choose a staff member to select only their cases.</Label>
      <Select onChange={(option) => setStaffMember(option.value)} options={staffOptions} />
    </ActionModal>
  );
};

export default DownloadCasesModal;
