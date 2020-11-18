// @flow
import React from 'react';

import { Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { ReduxUtils } from 'lattice-utils';

import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation } from './actions';
import { PEACEMAKER } from './reducers/constants';
import { schema, uiSchema } from './schemas/PeacemakerInformationSchemas';

import { AppTypes } from '../../core/edm/constants';
import { EDM, PROPERTY_TYPE_IDS, REQUEST_STATE } from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';
import { APP, ENTITY_SET_IDS } from '../app/constants';

const {
  FORM,
  HAS,
  PEOPLE,
  PERSON_DETAILS,
  SCREENED_WITH,
} = AppTypes;
const { processAssociationEntityData, processEntityData } = DataProcessingUtils;
const { isPending } = ReduxUtils;

type Props = {
  personId :UUID;
};

const PeacemakerInformationForm = ({ personId } :Props) => {

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const dispatch = useDispatch();

  const onSubmit = ({ formData }) => {
    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    const associations = [
      [SCREENED_WITH, personId, PEOPLE, 0, FORM, {}],
      [HAS, personId, PEOPLE, 0, PERSON_DETAILS, {}],
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(addPeacemakerInformation({ associationEntityData, entityData }));
  };

  const submitRequestState = useSelector((store :Map) => store
    .getIn([PEACEMAKER, ADD_PEACEMAKER_INFORMATION, REQUEST_STATE]));

  return (
    <Form
        isSubmitting={isPending(submitRequestState)}
        onSubmit={onSubmit}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

export default PeacemakerInformationForm;
