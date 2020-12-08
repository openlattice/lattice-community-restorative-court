// @flow
import React, { useEffect, useMemo, useState } from 'react';

import { List, Map, setIn } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import type { UUID, FQN } from 'lattice';

import { CrumbItem, CrumbLink, Crumbs } from '../../../../components/crumbs';
import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import {
  APP,
  APP_PATHS,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
} from '../../../../core/redux/constants';
import { selectPerson } from '../../../../core/redux/selectors';
import { getPersonName } from '../../../../utils/people';
import { getRelativeRoot } from '../../../../utils/router';
import { useDispatch, useSelector } from '../../../app/AppProvider';
import { editPerson } from '../actions';
import { schema, uiSchema } from '../schemas/EditPersonSchemas';

const { PEOPLE } = AppTypes;
const {
  DOB,
  ETHNICITY,
  GIVEN_NAME,
  MIDDLE_NAME,
  RACE,
  SURNAME,
} = PropertyTypes;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const EditPersonForm = () => {
  const dispatch = useDispatch();

  const person :Map = useSelector(selectPerson());

  const populatedFormData = useMemo(() => {
    const fqns = [GIVEN_NAME, MIDDLE_NAME, SURNAME, DOB, RACE, ETHNICITY];
    let result = {};
    const page1section1 = getPageSectionKey(1, 1);
    fqns.forEach((fqn :FQN) => {
      const entityAddressKey = getEntityAddressKey(0, PEOPLE, fqn);
      result = setIn(result, [page1section1, entityAddressKey], getPropertyValue(person, [fqn, 0]));
    });
    return result;
  }, [person]);

  const [formData, setFormData] = useState(populatedFormData);

  useEffect(() => {
    setFormData(populatedFormData);
  }, [populatedFormData]);

  const onChange = ({ formData: updatedFormData } :Object) => {
    setFormData(updatedFormData);
  };

  const handleEdit = (params) => {
    dispatch(editPerson(params));
  };

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));
  const personEKID :?UUID = getEntityKeyId(person);

  const entityIndexToIdMap :Map = Map().withMutations((mutator :Map) => {
    mutator.set(PEOPLE, List([personEKID]));
  });

  const formContext = {
    editAction: handleEdit,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  const personName :string = getPersonName(person);

  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  return (
    <>
      <CardSegment>
        <Crumbs>
          <CrumbItem>
            <CrumbLink to={relativeRoot}>
              <Typography color="inherit" variant="body2">{ personName }</Typography>
            </CrumbLink>
          </CrumbItem>
          <CrumbItem>
            <Typography color="inherit" variant="body2">Edit Profile</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Edit Profile</Typography>
        <Typography variant="body1">Edit the information below to update the person profile.</Typography>
      </CardSegment>
      <Form
          disabled
          formContext={formContext}
          formData={formData}
          hideSubmit
          onChange={onChange}
          schema={schema}
          uiSchema={uiSchema} />
    </>
  );
};

export default EditPersonForm;
