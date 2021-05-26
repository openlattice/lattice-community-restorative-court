// @flow
import React, { useEffect, useMemo, useState } from 'react';

import { List, Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DataUtils } from 'lattice-utils';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  ProfileReduxConstants,
} from '../../../../core/redux/constants';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { editCRCCase } from '../actions';
import { schema, uiSchema } from '../schemas/CaseNotesSchemas';

const { PROFILE, SELECTED_CASE } = ProfileReduxConstants;
const { CRC_CASE } = AppTypes;
const { DESCRIPTION } = PropertyTypes;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const CaseNotes = () => {

  const selectedCase :Map = useSelector((store) => store.getIn([PROFILE, SELECTED_CASE]));

  const populatedFormData = useMemo(() => ({
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(0, CRC_CASE, DESCRIPTION)]: getPropertyValue(selectedCase, [DESCRIPTION, 0], ''),
    }
  }), [selectedCase]);

  const [formData, setFormData] = useState(populatedFormData);

  useEffect(() => {
    setFormData(populatedFormData);
  }, [populatedFormData]);

  const onChange = ({ formData: updatedFormData }) => {
    setFormData(updatedFormData);
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const entityIndexToIdMap :Map = Map().withMutations((mutator :Map) => {
    mutator.set(CRC_CASE, List([getEntityKeyId(selectedCase)]));
  });

  const dispatch = useDispatch();

  const handleEdit = (params) => {
    dispatch(editCRCCase(params));
  };

  const formContext = {
    editAction: handleEdit,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  return (
    <Form
        disabled
        formContext={formContext}
        formData={formData}
        hideSubmit
        noPadding
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default CaseNotes;
