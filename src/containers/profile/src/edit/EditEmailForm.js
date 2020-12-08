// @flow
import React, { useEffect, useMemo, useState } from 'react';

import { List, Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DataUtils, LangUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  ProfileReduxConstants,
  REQUEST_STATE,
} from '../../../../core/redux/constants';
import { selectPerson } from '../../../../core/redux/selectors';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { SUBMIT_CONTACT, editContact, submitContact } from '../actions';
import { schema, uiSchema } from '../schemas/EditEmailSchemas';

const { CONTACT_INFO, CONTACTED_VIA, PEOPLE } = AppTypes;
const { EMAIL } = PropertyTypes;
const { PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { isDefined } = LangUtils;
const { isPending } = ReduxUtils;

const EditEmailForm = () => {
  const dispatch = useDispatch();

  const contactInfoList :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, CONTACT_INFO], List()));
  const emailEntity = contactInfoList.find((contact :Map) => contact.has(EMAIL));

  const populatedFormData = useMemo(() => (
    isDefined(emailEntity) ? {
      [getPageSectionKey(1, 1)]: {
        [getEntityAddressKey(0, CONTACT_INFO, EMAIL)]: getPropertyValue(emailEntity, [EMAIL, 0]),
      }
    } : {}), [emailEntity]);

  const [formData, setFormData] = useState(populatedFormData);

  useEffect(() => {
    setFormData(populatedFormData);
  }, [populatedFormData]);

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const person :Map = useSelector(selectPerson());
  const personEKID :?UUID = getEntityKeyId(person);

  const onSubmit = () => {
    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    const associations = [
      [CONTACTED_VIA, personEKID, PEOPLE, 0, CONTACT_INFO, {}]
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(submitContact({ associationEntityData, entityData }));
  };

  const handleEdit = (params) => {
    dispatch(editContact(params));
  };

  const emailEKID :?UUID = getEntityKeyId(emailEntity);

  const entityIndexToIdMap :Map = Map().withMutations((mutator :Map) => {
    mutator.set(CONTACT_INFO, List([emailEKID]));
  });

  const formContext = {
    editAction: handleEdit,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  const submitRequestState = useSelector((store :Map) => store
    .getIn([PROFILE, SUBMIT_CONTACT, REQUEST_STATE]));

  return (
    <Form
        disabled={isDefined(emailEntity) && !emailEntity.isEmpty()}
        formContext={formContext}
        formData={formData}
        isSubmitting={isPending(submitRequestState)}
        onChange={onChange}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default EditEmailForm;
