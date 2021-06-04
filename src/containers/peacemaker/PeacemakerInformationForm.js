// @flow
import React, { useEffect, useMemo, useState } from 'react';

import { List, Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Button, CardSegment, Typography } from 'lattice-ui-kit';
import { DataUtils, LangUtils, ReduxUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

import { ADD_PEACEMAKER_INFORMATION, addPeacemakerInformation, editPeacemakerInformation } from './actions';
import { PEACEMAKER } from './reducers/constants';
import { schema, uiSchema } from './schemas/PeacemakerInformationSchemas';
import { populateForm } from './utils';

import { CrumbItem, CrumbLink, Crumbs } from '../../components/crumbs';
import { SubmissionFieldsGrid } from '../../components/forms';
import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import {
  APP,
  APP_PATHS,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
  ProfileReduxConstants,
  REQUEST_STATE,
} from '../../core/redux/constants';
import { selectPerson } from '../../core/redux/selectors';
import { goToRoute } from '../../core/router/RoutingActions';
import { updateFormWithDateAsDateTime } from '../../utils/form';
import { getPersonName } from '../../utils/people';
import { getRelativeRoot } from '../../utils/router';
import { useDispatch, useSelector } from '../app/AppProvider';
import { FormConstants } from '../profile/src/constants';

const {
  COMMUNICATION,
  FORM,
  HAS,
  PEACEMAKER_STATUS,
  PEOPLE,
  PERSON_DETAILS,
  SCREENED_WITH,
} = AppTypes;
const { GENERAL_DATETIME, NAME, STATUS } = PropertyTypes;
const { PERSON_NEIGHBOR_MAP, PROFILE } = ProfileReduxConstants;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { isPending, isSuccess } = ReduxUtils;
const { getEntityKeyId, getPropertyValue } = DataUtils;
const { isDefined } = LangUtils;

const PeacemakerInformationForm = () => {
  const dispatch = useDispatch();

  const personNeighborMap :Map = useSelector((store) => store.getIn([PROFILE, PERSON_NEIGHBOR_MAP], Map()));

  const forms :List = personNeighborMap.get(FORM, List());
  const personInformationForm :?Map = forms
    .find((form :Map) => getPropertyValue(form, [NAME, 0]) === PEACEMAKER_INFORMATION_FORM);
  const formEKID :?UUID = isDefined(personInformationForm) ? getEntityKeyId(personInformationForm) : undefined;

  const peacemakerStatuses :List = personNeighborMap.get(PEACEMAKER_STATUS, List());
  const mostRecentStatus :Map = peacemakerStatuses
    .sortBy((status :Map) => DateTime.fromISO(getPropertyValue(status, [STATUS, 0])).valueOf())
    .last();
  const peacemakerStatusEKID :?UUID = isDefined(mostRecentStatus) ? getEntityKeyId(mostRecentStatus) : undefined;

  const populatedFormData = useMemo(() => (
    isDefined(personInformationForm) ? populateForm(personInformationForm, personNeighborMap, mostRecentStatus) : {}
  ), [mostRecentStatus, personInformationForm, personNeighborMap]);

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
    const updatedFormData = updateFormWithDateAsDateTime(
      formData,
      [getPageSectionKey(1, 1), getEntityAddressKey(0, FORM, GENERAL_DATETIME)]
    );
    const entityData = processEntityData(updatedFormData, entitySetIds, propertyTypeIds);
    const associations :any[][] = [
      [SCREENED_WITH, personEKID, PEOPLE, 0, FORM, {}],
      [HAS, personEKID, PEOPLE, 0, PERSON_DETAILS, {}],
      [HAS, personEKID, PEOPLE, 0, COMMUNICATION, {}],
      [HAS, personEKID, PEOPLE, 0, PEACEMAKER_STATUS, {}],
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    dispatch(addPeacemakerInformation({ associationEntityData, entityData }));
  };

  const handleEdit = (params) => {
    dispatch(editPeacemakerInformation({
      ...params,
      formEKID,
      peacemakerStatusEKID,
      personEKID,
    }));
  };

  const communication :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, COMMUNICATION], List()));
  const personDetails :List = useSelector((store) => store
    .getIn([PROFILE, PERSON_NEIGHBOR_MAP, PERSON_DETAILS], List()));

  const entityIndexToIdMap :Map = Map().withMutations((mutator :Map) => {
    mutator.set(COMMUNICATION, List([getEntityKeyId(communication.get(0))]));
    mutator.set(FORM, List([formEKID]));
    mutator.set(PERSON_DETAILS, List([getEntityKeyId(personDetails.get(0))]));
    mutator.set(PEACEMAKER_STATUS, List([peacemakerStatusEKID]));
  });

  const formContext = {
    editAction: handleEdit,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  };

  const submitRequestState = useSelector((store :Map) => store
    .getIn([PEACEMAKER, ADD_PEACEMAKER_INFORMATION, REQUEST_STATE]));

  const personName :string = getPersonName(person);

  const root :string = useSelector((store) => store.getIn(APP_PATHS.ROOT));
  const match = useSelector((store) => store.getIn(APP_PATHS.MATCH));
  const relativeRoot = getRelativeRoot(root, match);

  const goToProfile = () => {
    dispatch(goToRoute(relativeRoot));
  };

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
            <Typography color="inherit" variant="body2">Peacemaker Information</Typography>
          </CrumbItem>
        </Crumbs>
        <Typography variant="h1">Peacemaker Information</Typography>
        <Typography variant="body1">Enter the information below to add details for the peacemaker.</Typography>
      </CardSegment>
      <Form
          disabled={isDefined(personInformationForm) && !personInformationForm.isEmpty()}
          formContext={formContext}
          formData={formData}
          isSubmitting={isPending(submitRequestState)}
          onChange={onChange}
          onSubmit={onSubmit}
          schema={schema}
          uiSchema={uiSchema} />
      {isSuccess(submitRequestState) && (
        <CardSegment>
          <SubmissionFieldsGrid>
            <Typography gutterBottom>Submitted!</Typography>
            <Button
                arialabelledby="peacemakerInformationForm backToProfile"
                color="success"
                onClick={goToProfile}
                variant="outlined">
              Back to Profile
            </Button>
          </SubmissionFieldsGrid>
        </CardSegment>
      )}
    </>
  );
};

export default PeacemakerInformationForm;
