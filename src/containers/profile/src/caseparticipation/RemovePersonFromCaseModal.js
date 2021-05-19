// @flow
import React, { useEffect } from 'react';

import { Map } from 'immutable';
import { Modal, ModalFooter, Typography } from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { BasicErrorComponent } from '../../../../components/errors';
import { resetRequestState } from '../../../../core/redux/actions';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { getPersonName } from '../../../../utils/people';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { REMOVE_PERSON_FROM_CASE, removePersonFromCase } from '../actions';

const { PROFILE } = ProfileReduxConstants;
const { getEntityKeyId } = DataUtils;
const { isFailure, isPending, isSuccess } = ReduxUtils;

type Props = {
  caseEKID :UUID;
  isVisible :boolean;
  onClose :() => void;
  selectedPerson :Map;
};

const RemovePersonFromCaseModal = ({
  caseEKID,
  isVisible,
  onClose,
  selectedPerson
} :Props) => {

  const dispatch = useDispatch();

  const onDelete = () => {
    dispatch(removePersonFromCase({ caseEKID, personEKID: getEntityKeyId(selectedPerson) }));
  };

  const deleteRequestState = useSelector((store) => store.getIn([PROFILE, REMOVE_PERSON_FROM_CASE, REQUEST_STATE]));

  useEffect(() => {
    if (isSuccess(deleteRequestState)) {
      dispatch(resetRequestState([REMOVE_PERSON_FROM_CASE]));
      onClose();
    }
  }, [deleteRequestState, dispatch, onClose]);

  const withFooter = (
    <ModalFooter
        isPendingPrimary={isPending(deleteRequestState)}
        onClickPrimary={onDelete}
        onClickSecondary={onClose}
        textPrimary="Yes"
        textSecondary="No" />
  );

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        textTitle="Remove Person from Case"
        viewportScrolling
        withFooter={withFooter}>
      <Typography gutterBottom>Are you sure you want to remove this person from the case?</Typography>
      <Typography gutterBottom>{getPersonName(selectedPerson)}</Typography>
      { isFailure(deleteRequestState) && <BasicErrorComponent />}
    </Modal>
  );
};

export default RemovePersonFromCaseModal;
