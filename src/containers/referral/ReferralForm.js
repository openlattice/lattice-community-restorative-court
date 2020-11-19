// @flow
import React from 'react';

import { Map, getIn, setIn } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { Typography } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import type { UUID } from 'lattice';

import { schema, uiSchema } from './schemas/ReferralFormSchemas';

import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import {
  APP,
  APP_REDUX_CONSTANTS,
  EDM,
  PROPERTY_TYPE_IDS,
} from '../../core/redux/constants';
import { useDispatch, useSelector } from '../app/AppProvider';

const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const {
  APPEARS_IN,
  CRC_CASE,
  DA_CASE,
  FORM,
  OFFENSE,
  OFFICERS,
  PEOPLE,
  REFERRAL_REQUEST,
  REGISTERED_FOR,
  RELATED_TO,
  RESULTS_IN,
  SCREENED_WITH,
  SENT_FROM,
  STATUS,
  SUBJECT_OF,
} = AppTypes;
const { DATETIME_COMPLETED } = PropertyTypes;

type Props = {
  personId :UUID;
};

const ReferralForm = ({ personId } :Props) => {

  const dispatch = useDispatch();

  const entitySetIds :Map = useSelector((store) => store.getIn([APP, APP_REDUX_CONSTANTS.ENTITY_SET_IDS]));
  const propertyTypeIds :Map = useSelector((store) => store.getIn([EDM, PROPERTY_TYPE_IDS]));

  const onSubmit = ({ formData } :Object) => {

    const dateOfReferralPath = [getPageSectionKey(1, 1), getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)];
    const dateOfReferral = getIn(formData, dateOfReferralPath);
    const now = DateTime.local();
    const updatedFormData = setIn(
      formData,
      dateOfReferralPath,
      DateTime.fromSQL(dateOfReferral.concat(' ', now.toISOTime()))
    ).toISO();

    const entityData = processEntityData(updatedFormData, entitySetIds, propertyTypeIds);
    const associations = [
      [APPEARS_IN, 0, DA_CASE, 0, REFERRAL_REQUEST, {}],
      [RESULTS_IN, 0, REFERRAL_REQUEST, 0, CRC_CASE, {}],
      [SUBJECT_OF, personId, PEOPLE, 0, REFERRAL_REQUEST, {}],
      [APPEARS_IN, 0, OFFENSE, 0, REFERRAL_REQUEST, {}],
      [REGISTERED_FOR, 0, STATUS, 0, REFERRAL_REQUEST, {}],
      [SENT_FROM, 0, REFERRAL_REQUEST, 0, OFFICERS, {}],
      [SCREENED_WITH, 0, PEOPLE, 0, FORM, {}],
      [RELATED_TO, 0, FORM, 0, REFERRAL_REQUEST, {}],
    ];
    const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);
    // dispatch(submitReferralForm({ associationEntityData, entityData }));
  };
  return (
    <>
      <Typography variant="h3">Referral Information</Typography>
      <Typography>
        Enter the respondent and victim information below to add a new referral for this person.
      </Typography>
      <Form
          onSubmit={onSubmit}
          schema={schema}
          uiSchema={uiSchema} />
    </>
  );
};

export default ReferralForm;
