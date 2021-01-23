// @flow
import React, { useEffect, useState } from 'react';

import { List, Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Modal } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';

import { addStaff } from './actions';
import { schema, uiSchema } from './schemas/AddStaffSchemas';

import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
} from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';

const { STAFF } = AppTypes;
const { GIVEN_NAME, SURNAME } = PropertyTypes;
const { ENTITY_SET_IDS } = APP_REDUX_CONSTANTS;
const { getPropertyValue } = DataUtils;
const { getEntityAddressKey, getPageSectionKey, processEntityData } = DataProcessingUtils;

type Props = {
  isVisible :boolean;
  onClose :() => void;
  staffMembers :List;
};

const AddStaffModal = ({ isVisible, onClose, staffMembers } :Props) => {

  const [formData, setFormData] = useState({});

  useEffect(() => {
    const populatedData = {
      [getPageSectionKey(1, 1)]: staffMembers.map((staffMember :Map) => {
        const firstName = getPropertyValue(staffMember, [GIVEN_NAME, 0]);
        const lastName = getPropertyValue(staffMember, [SURNAME, 0]);
        return {
          [getEntityAddressKey(-1, STAFF, GIVEN_NAME)]: firstName,
          [getEntityAddressKey(-1, STAFF, SURNAME)]: lastName,
        };
      }).toJS()
    };
    setFormData(populatedData);
  }, [staffMembers]);

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const dispatch = useDispatch();

  const onSubmit = ({ formData: submittedData }) => {
    const staffDataList :Object[] = submittedData[getPageSectionKey(1, 1)];
    const newStaffMember = staffDataList[staffDataList.length - 1];
    const entityData = processEntityData(
      { [getPageSectionKey(1, 1)]: [newStaffMember] },
      entitySetIds,
      propertyTypeIds
    );
    dispatch(addStaff({ associationEntityData: {}, entityData }));
  };

  const entityIndexToIdMap = Map();

  const formContext = {
    addActions: {
      addStaff: onSubmit
    },
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  return (
    <Modal
        isVisible={isVisible}
        onClickSecondary={onClose}
        onClose={onClose}
        textSecondary="Close"
        textTitle="Add Staff Members"
        viewportScrolling>
      <Form
          disabled={!staffMembers.isEmpty()}
          formContext={formContext}
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

export default AddStaffModal;
