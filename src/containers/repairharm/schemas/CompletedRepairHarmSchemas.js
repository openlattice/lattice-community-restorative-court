// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { dataSchema, uiSchema } from './RepairHarmSchemas';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { FORM, PEOPLE } = AppTypes;
const {
  DATETIME_ADMINISTERED,
  GIVEN_NAME,
  MIDDLE_NAME,
  SURNAME,
} = PropertyTypes;

const data = JSON.parse(JSON.stringify(dataSchema));
const ui = JSON.parse(JSON.stringify(uiSchema));

// Add form date

data.properties[getPageSectionKey(1, 2)]
  .properties[getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]
  .format = 'date';

ui[getPageSectionKey(1, 2)][getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)] = {
  classNames: 'column-span-4'
};

// Add Peacemakers

data.properties[getPageSectionKey(1, 3)] = {
  type: 'array',
  title: 'Peacemakers',
  items: {
    type: 'object',
    properties: {
      [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: {
        type: 'string',
        title: 'First Name',
      },
      [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: {
        type: 'string',
        title: 'Middle Name',
      },
      [getEntityAddressKey(-1, PEOPLE, SURNAME)]: {
        type: 'string',
        title: 'Last Name',
      },
    },
  },
};

ui[getPageSectionKey(1, 3)] = {
  'ui:disabled': true,
  classNames: 'column-span-12',
  'ui:options': {
    addable: false,
    orderable: false,
    removable: false,
  },
  items: {
    classNames: 'grid-container',
    [getEntityAddressKey(-1, PEOPLE, GIVEN_NAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(-1, PEOPLE, MIDDLE_NAME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(-1, PEOPLE, SURNAME)]: {
      classNames: 'column-span-4'
    },
  }
};

export {
  data as schema,
  ui as uiSchema,
};
