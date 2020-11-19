// @flow
import React, { useState } from 'react';

import { List, Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DataUtils, LangUtils, ReduxUtils } from 'lattice-utils';
import type { UUID } from 'lattice';

import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation, editPeacemakerInformation } from './actions';
import { PEACEMAKER } from './reducers/constants';
import { schema, uiSchema } from './schemas/PeacemakerInformationSchemas';
import { prepopulateForm } from './utils';

import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  ProfileReduxConstants,
  REQUEST_STATE,
} from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';
import { FormConstants } from '../profile/src/constants';

const {
  COMMUNICATION,
  FORM,
  HAS,
  PEOPLE,
  PERSON_DETAILS,
  SCREENED_WITH,
} = AppTypes;
const { NAME } = PropertyTypes;
const { PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;
const { processAssociationEntityData, processEntityData } = DataProcessingUtils;
const { isPending } = ReduxUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;

type Props = {
  personId :UUID;
};

const PeacemakerInformationForm = ({ personId } :Props) => {
  const dispatch = useDispatch();

  const personNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP], Map()));

  const forms :List = personNeighborMap.get(FORM, List());
  const personInformationForm :?Map = forms
    .find((form :Map) => getPropertyValue(form, [NAME, 0]) === PEACEMAKER_INFORMATION_FORM);
  const formEKID :?UUID = isDefined(personInformationForm) ? getEntityKeyId(personInformationForm) : '';

  let prepopulatedFormData = {};
  if (isDefined(personInformationForm)) {
    prepopulatedFormData = prepopulateForm(personNeighborMap);
  }
  const [formData, setFormData] = useState(prepopulatedFormData);

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));

  const onSubmit = () => {
    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    const associations = [
      [SCREENED_WITH, personId, PEOPLE, 0, FORM, {}],
      [HAS, personId, PEOPLE, 0, PERSON_DETAILS, {}],
      [HAS, personId, PEOPLE, 0, COMMUNICATION, {}],
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(addPeacemakerInformation({ associationEntityData, entityData }));
  };

  const handleEdit = (params) => {
    dispatch(editPeacemakerInformation({ ...params }));
  };

  const communication :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, COMMUNICATION], List()));
  const personDetails :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, PERSON_DETAILS], List()));

  const entityIndexToIdMap :Map = Map.withMutations((mutator :Map) => {
    mutator.set(COMMUNICATION, List([getEntityKeyId(communication.get(0))]));
    mutator.set(FORM, List([formEKID]));
    mutator.set(PERSON_DETAILS, List([getEntityKeyId(personDetails.get(0))]));
  });

  const formContext = {
    editAction: handleEdit,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  const submitRequestState = useSelector((store :Map) => store
    .getIn([PEACEMAKER, ADD_PEACEMAKER_INFORMATION, REQUEST_STATE]));

  return (
    <Form
        disabled={isDefined(personInformationForm) && !personInformationForm.isEmpty()}
        formContext={formContext}
        formData={formData}
        isSubmitting={isPending(submitRequestState)}
        onChange={onChange}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default PeacemakerInformationForm;
