// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { FormConstants } from '../../profile/src/constants';
import { REPAIR_HARM_CONDITIONS } from '../constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { REPAIR_HARM_AGREEMENT } = FormConstants;
const {
  CRC_CASE,
  FORM,
  PEOPLE,
  STAFF,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  DUE_DATE,
  GIVEN_NAME,
  MIDDLE_NAME,
  NAME,
  SURNAME,
  TEXT,
} = PropertyTypes;

const dataSchema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Respondent Information',
      properties: {
        [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
          type: 'string',
          title: 'First Name',
        },
        [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
          type: 'string',
          title: 'Middle Name',
        },
        [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
          type: 'string',
          title: 'Last Name',
        },
      }
    },
    [getPageSectionKey(1, 2)]: {
      type: 'object',
      title: 'Conditions',
      properties: {
        [getEntityAddressKey(0, FORM, TEXT)]: {
          type: 'array',
          title: 'Conditions',
          items: {
            type: 'string',
            enum: REPAIR_HARM_CONDITIONS,
          },
          uniqueItems: true,
        },
        [getEntityAddressKey(0, FORM, DUE_DATE)]: {
          type: 'string',
          title: 'Required Date of Completion',
          format: 'date'
        },
        [getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN)]: {
          type: 'string',
          title: 'CRC Case',
          enum: [],
          enumNames: [],
        },
        [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
          type: 'string',
          title: 'Staff Member',
          enum: [],
          enumNames: [],
        },
        [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
          type: 'string',
          title: 'Repair Harm Agreement Date',
          format: 'date',
        },
        [getEntityAddressKey(0, FORM, NAME)]: {
          type: 'string',
          title: 'Form Name',
          default: REPAIR_HARM_AGREEMENT
        },
      },
      required: [
        getEntityAddressKey(0, FORM, TEXT),
        getEntityAddressKey(0, FORM, DUE_DATE),
        getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN),
        getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN),
      ]
    },
  },
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    'ui:disabled': true,
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, PEOPLE, GIVEN_NAME)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, PEOPLE, MIDDLE_NAME)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, PEOPLE, SURNAME)]: {
      classNames: 'column-span-4',
    },
  },
  [getPageSectionKey(1, 2)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, FORM, TEXT)]: {
      classNames: 'column-span-4',
      'ui:options': { multiple: true }
    },
    [getEntityAddressKey(0, FORM, DUE_DATE)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, FORM, NAME)]: {
      'ui:widget': 'hidden',
    },
  }
};

export {
  dataSchema,
  uiSchema,
};
