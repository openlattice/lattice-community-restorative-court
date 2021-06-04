// @flow
import React, { useEffect, useMemo, useState } from 'react';

import { List, Map, setIn } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DataUtils, LangUtils, ReduxUtils } from 'lattice-utils';
import type { FQN, UUID } from 'lattice';

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
import { SUBMIT_ADDRESS, editAddress, submitAddress } from '../actions';
import { schema, uiSchema } from '../schemas/EditAddressSchemas';

const { LOCATION, LOCATED_AT, PEOPLE } = AppTypes;
const {
  LOCATION_ADDRESS,
  LOCATION_ADDRESS_LINE_2,
  LOCATION_CITY,
  LOCATION_STATE,
  LOCATION_ZIP,
} = PropertyTypes;
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

const EditAddressForm = () => {
  const dispatch = useDispatch();

  const addressList :List = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP, LOCATION], List()));
  const address :Map = addressList.get(0, Map());

  const populatedFormData = useMemo(() => {
    const fqns = [LOCATION_ADDRESS, LOCATION_ADDRESS_LINE_2, LOCATION_CITY, LOCATION_STATE, LOCATION_ZIP];
    let result = {};
    const page1section1 = getPageSectionKey(1, 1);
    fqns.forEach((fqn :FQN) => {
      const entityAddressKey = getEntityAddressKey(0, LOCATION, fqn);
      result = setIn(result, [page1section1, entityAddressKey], getPropertyValue(address, [fqn, 0]));
    });
    return result;
  }, [address]);

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
    const associations :any[][] = [
      [LOCATED_AT, personEKID, PEOPLE, 0, LOCATION, {}]
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(submitAddress({ associationEntityData, entityData }));
  };

  const handleEdit = (params) => {
    dispatch(editAddress(params));
  };

  const addressEKID :?UUID = getEntityKeyId(address);

  const entityIndexToIdMap :Map = Map().withMutations((mutator :Map) => {
    mutator.set(LOCATION, List([addressEKID]));
  });

  const formContext = {
    editAction: handleEdit,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  const submitRequestState = useSelector((store :Map) => store
    .getIn([PROFILE, SUBMIT_ADDRESS, REQUEST_STATE]));

  return (
    <Form
        disabled={isDefined(address) && !address.isEmpty()}
        formContext={formContext}
        formData={formData}
        isSubmitting={isPending(submitRequestState)}
        onChange={onChange}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default EditAddressForm;
