// @flow
import React from 'react';

import styled from 'styled-components';
import { getIn } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { schema, uiSchema } from './schemas/ReferralFormSchemas';

import { AppTypes, PropertyTypes } from '../../core/edm/constants';
import { FormDescription, FormHeader } from '../profile/typography';

const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;
const { REFERRAL_REQUEST } = AppTypes;
const { DATETIME_COMPLETED } = PropertyTypes;

const ReferralForm = () => {
  const onSubmit = ({ formData } :Object) => {
    const dateOfReferralPath = [getPageSectionKey(1, 1), getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)];
    const dateOfReferral = getIn(formData, dateOfReferralPath);
    const now = DateTime.local();
    const updatedFormData = setIn(formData, dateOfReferralPath, DateTime.fromSQL(dateOfReferral.concat(' ', now.toISOTime()))).toISO();
  };
  return (
    <>
      <FormHeader>Referral Information</FormHeader>
      <FormDescription>
        Enter the respondent and victim information below to add a new referral for this person.
      </FormDescription>
      <Form
          onSubmit={onSubmit}
          schema={schema}
          uiSchema={uiSchema} />
    </>
  );
};

export default ReferralForm;
