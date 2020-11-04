// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  PEOPLE,
  REFERRAL_REQUEST,
} = AppTypes;
const {
  DATETIME_COMPLETED,
  DOB,
  ETHNICITY,
  GIVEN_NAME,
  MIDDLE_NAME,
  RACE,
  SOURCE,
  SURNAME,
} = PropertyTypes;

const schema = {
  type: 'object',
  title: 'Respondent Profile',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, REFERRAL_REQUEST, DATETIME_COMPLETED)]: {
          type: 'string',
          title: 'Date of Referral',
        },
        [getEntityAddressKey(0, REFERRAL_REQUEST, SOURCE)]: {
          type: 'string',
          title: 'Referring Agency',
        },
      }
    },
    [getPageSectionKey(1, 2)]: {
      type: 'object',
      title: 'Victim Information',
      properties: {
        [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
          type: 'string',
          title: 'Last Name',
        },
        [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
          type: 'string',
          title: 'First Name',
        },
        [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
          type: 'string',
          title: 'Middle Name',
        },
        [getEntityAddressKey(0, PEOPLE, DOB)]: {
          type: 'string',
          title: 'Date of Birth',
        },
        [getEntityAddressKey(0, PEOPLE, RACE)]: {
          type: 'string',
          title: 'Race',
        },
        [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: {
          type: 'string',
          title: 'Ethnicity',
        },
      }
    },
  },
};

const uiSchema = {

};

export {
  schema,
  uiSchema,
};
