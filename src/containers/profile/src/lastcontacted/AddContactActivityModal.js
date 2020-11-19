// @flow
import React, { useEffect, useState } from 'react';

import { Map, getIn, setIn } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Modal, ModalFooter } from 'lattice-ui-kit';
import { DataUtils, ReduxUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { resetRequestState } from '../../../../core/redux/actions';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  REQUEST_STATE,
} from '../../../../core/redux/constants';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { ADD_CONTACT_ACTIVITY, addContactActivity } from '../actions';
import { PERSON, PROFILE } from '../reducers/constants';
import { schema, uiSchema } from '../schemas/AddContactActivitySchemas';

const { CONTACT_ACTIVITY, PEOPLE, SENT_TO } = AppTypes;
const { CONTACT_DATETIME } = PropertyTypes;
const { isPending, isSuccess } = ReduxUtils;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { getEntityKeyId } = DataUtils;

type Props = {
  isVisible :boolean;
  onClose :() => void;
};

const AddContactActivityModal = ({ isVisible, onClose } :Props) => {

  const [formData, setFormData] = useState({});

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const person :Map = useSelector((store) => store.getIn([PROFILE, PERSON]));
  const personEKID :?UUID = getEntityKeyId(person);
  const dispatch = useDispatch();

  const onSubmit = () => {
    const contactDatetimePath = [getPageSectionKey(1, 1), getEntityAddressKey(0, CONTACT_ACTIVITY, CONTACT_DATETIME)];
    const date = getIn(formData, contactDatetimePath);
    const now = DateTime.local();
    const updatedFormData = setIn(
      formData,
      contactDatetimePath,
      DateTime.fromSQL(date.concat(' ', now.toISOTime())).toISO()
    );

    const entityData = processEntityData(updatedFormData, entitySetIds, propertyTypeIds);
    const associations = [
      [SENT_TO, 0, CONTACT_ACTIVITY, personEKID, PEOPLE, {}]
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);

    dispatch(addContactActivity({ associationEntityData, entityData }));
  };

  const submitRequestState = useSelector((store :Map) => store.getIn([PROFILE, ADD_CONTACT_ACTIVITY, REQUEST_STATE]));

  useEffect(() => {
    if (isSuccess(submitRequestState)) {
      dispatch(resetRequestState([ADD_CONTACT_ACTIVITY]));
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
        textTitle="Add Contact Activity"
        viewportScrolling
        withFooter={withFooter}>
      <div>Enter the date this person was contacted to appear in a circle and whether they attended a circle. </div>
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

export default AddContactActivityModal;
