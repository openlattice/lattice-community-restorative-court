// @flow
import React, { useEffect, useState } from 'react';

import { Map } from 'immutable';
import { Form } from 'lattice-fabricate';
import { Modal, ModalFooter, Typography } from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { PropertyTypes } from '../../../../core/edm/constants';
import { resetRequestState } from '../../../../core/redux/actions';
import { ProfileReduxConstants, REQUEST_STATE } from '../../../../core/redux/constants';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { ADD_PERSON_OR_ORG_TO_CASE, addPersonOrOrgToCase } from '../actions';
import { SearchContextConstants } from '../constants';
import { schema, uiSchema } from '../schemas/AddPersonToCaseSchemas';

const { NOTES } = PropertyTypes;
const { PROFILE, SELECTED_CASE } = ProfileReduxConstants;
const { ORGS_CONTEXT } = SearchContextConstants;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isPending, isSuccess } = ReduxUtils;

type Props = {
  isVisible :boolean;
  onClose :() => void;
  searchContext :string;
  selectedOrganization :Map;
  selectedPerson :Map;
};

const AddPersonToCaseModal = ({
  isVisible,
  onClose,
  searchContext,
  selectedOrganization,
  selectedPerson,
} :Props) => {

  const [formData, setFormData] = useState({});

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const personCase :Map = useSelector((store) => store.getIn([PROFILE, SELECTED_CASE]));
  const caseEKID :?UUID = getEntityKeyId(personCase);
  const caseNumber = getPropertyValue(personCase, [NOTES, 0]);
  const caseIdentifier = `Case #: ${caseNumber}`;
  const entityEKID :?UUID = searchContext === ORGS_CONTEXT
    ? getEntityKeyId(selectedOrganization)
    : getEntityKeyId(selectedPerson);

  const dispatch = useDispatch();

  const onSubmit = () => {
    dispatch(addPersonOrOrgToCase({
      caseEKID,
      entityEKID,
      formData,
      searchContext,
      selectedPerson,
    }));
  };

  const submitRequestState = useSelector((store) => store.getIn([PROFILE, ADD_PERSON_OR_ORG_TO_CASE, REQUEST_STATE]));

  useEffect(() => {
    if (isSuccess(submitRequestState)) {
      dispatch(resetRequestState([ADD_PERSON_OR_ORG_TO_CASE]));
      onClose();
    }
  }, [dispatch, onClose, submitRequestState]);

  const withFooter = (
    <ModalFooter
        isPendingPrimary={isPending(submitRequestState)}
        onClickPrimary={onSubmit}
        onClickSecondary={onClose}
        textPrimary="Submit"
        textSecondary="Discard" />
  );

  return (
    <Modal
        isVisible={isVisible}
        onClose={onClose}
        textTitle="Add Person to Case"
        viewportScrolling
        withFooter={withFooter}>
      <Typography variant="body2" gutterBottom>{ caseIdentifier }</Typography>
      <Typography gutterBottom>Select the role this person plays in the case.</Typography>
      <Form
          formData={formData}
          hideSubmit
          noPadding
          onChange={onChange}
          onSubmit={onSubmit}
          schema={schema}
          uiSchema={uiSchema} />
    </Modal>
  );
};

export default AddPersonToCaseModal;
