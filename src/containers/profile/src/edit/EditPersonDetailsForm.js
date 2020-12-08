// @flow
import React, { useEffect, useMemo, useState } from 'react';

import { List, Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DataUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  ProfileReduxConstants,
} from '../../../../core/redux/constants';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { editPersonDetails } from '../actions';
import { schema, uiSchema } from '../schemas/EditPersonDetailsSchemas';

const { PERSON_DETAILS } = AppTypes;
const { GENDER, PRONOUN } = PropertyTypes;
const { PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const EditPersonDetailsForm = () => {
  const dispatch = useDispatch();

  const personDetailsList :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, PERSON_DETAILS], List));
  const personDetails :Map = personDetailsList.get(0, Map());

  const populatedFormData = useMemo(() => ({
    [getPageSectionKey(1, 1)]: {
      [getEntityAddressKey(-1, PERSON_DETAILS, GENDER)]: getPropertyValue(personDetails, [GENDER, 0]),
      [getEntityAddressKey(-1, PERSON_DETAILS, PRONOUN)]: getPropertyValue(personDetails, [PRONOUN, 0]),
    }
  }), [personDetails]);

  const [formData, setFormData] = useState(populatedFormData);

  useEffect(() => {
    setFormData(populatedFormData);
  }, [populatedFormData]);

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const handleEdit = (params) => {
    dispatch(editPersonDetails(params));
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const personDetailsEKID :?UUID = getEntityKeyId(personDetails);

  const entityIndexToIdMap :Map = Map().withMutations((mutator :Map) => {
    mutator.set(PERSON_DETAILS, List([personDetailsEKID]));
  });

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
        onChange={onChange}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default EditPersonDetailsForm;
