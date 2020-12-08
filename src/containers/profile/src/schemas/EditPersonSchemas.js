// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ETHNICITIES, RACES } from '../../../../utils/people/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { PEOPLE } = AppTypes;
const {
  DOB,
  ETHNICITY,
  GIVEN_NAME,
  MIDDLE_NAME,
  RACE,
  SURNAME,
} = PropertyTypes;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
          type: 'string',
          title: 'First Name'
        },
        [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
          type: 'string',
          title: 'Middle Name'
        },
        [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
          type: 'string',
          title: 'Last Name'
        },
        [getEntityAddressKey(0, PEOPLE, DOB)]: {
          type: 'string',
          title: 'Date of Birth',
          format: 'date'
        },
        [getEntityAddressKey(0, PEOPLE, RACE)]: {
          type: 'string',
          title: 'Race',
          enum: RACES
        },
        [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: {
          type: 'string',
          title: 'Ethnicity',
          enum: ETHNICITIES
        },
      },
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': { editable: true },
    [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, DOB)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, RACE)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, PEOPLE, ETHNICITY)]: {
      classNames: 'column-span-4'
    },
  },
};

export {
  schema,
  uiSchema
};
