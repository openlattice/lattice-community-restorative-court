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
import { DownloadsReduxConstants } from '../../core/redux/constants';
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

  const [selectedStaffMember, selectStaffMember] = useState('');
  const [openCasesIncluded, includeOpenCases] = useState(false);
  const [closedCasesIncluded, includeClosedCases] = useState(false);

  const staffOptions = staff.map((staffMember :Map) => {
    const staffMemberName = getPersonName(staffMember);
    return {
      label: staffMemberName,
      value: staffMemberName,
    };
  });

  const dispatch = useDispatch();
  const downloadReport = () => {
    dispatch(downloadCases({ closedCasesIncluded, openCasesIncluded, selectedStaffMember }));
  };

  const downloadRequestState = useSelector((store) => store.getIn([DOWNLOADS, DOWNLOAD_CASES]));

  useEffect(() => {
    if (isSuccess(downloadRequestState)) {
      selectStaffMember('');
      includeOpenCases(false);
      includeClosedCases(false);
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
          onChange={() => includeOpenCases(!openCasesIncluded)} />
      <Checkbox
          label="Closed Cases"
          onChange={() => includeClosedCases(!closedCasesIncluded)} />
      <Label>Optional: Choose a staff member to select only their cases.</Label>
      <Select onChange={(option) => selectStaffMember(option.value)} options={staffOptions} />
    </ActionModal>
  );
};

export default DownloadCasesModal;
