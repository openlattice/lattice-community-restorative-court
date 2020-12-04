// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { FormConstants } from '../../profile/src/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const { RESTITUTION_REFERRAL } = FormConstants;
const {
  CRC_CASE,
  FORM,
  PEOPLE,
  STAFF,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  DUE_DATE,
  GENERAL_DATETIME,
  GIVEN_NAME,
  MIDDLE_NAME,
  NAME,
  SURNAME,
  TEXT,
} = PropertyTypes;

const currentDateTime = DateTime.local().toISO();

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
      title: 'Restitution',
      properties: {
        [getEntityAddressKey(0, FORM, TEXT)]: {
          type: 'string',
          title: 'Amount of Restitution Owed',
        },
        [getEntityAddressKey(0, FORM, DUE_DATE)]: {
          type: 'string',
          title: 'Date Required of Completion',
          format: 'date'
        },
        [getEntityAddressKey(0, FORM, GENERAL_DATETIME)]: {
          type: 'string',
          title: 'Date of Disposition',
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
          title: 'CRC Staff Member',
          enum: [],
          enumNames: [],
        },
        [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
          type: 'string',
          title: 'Date of Form Completion',
          default: currentDateTime
        },
        [getEntityAddressKey(0, FORM, NAME)]: {
          type: 'string',
          title: 'Form Name',
          default: RESTITUTION_REFERRAL
        },
      },
      required: [
        getEntityAddressKey(0, FORM, TEXT),
        getEntityAddressKey(0, FORM, DUE_DATE),
        getEntityAddressKey(0, FORM, GENERAL_DATETIME),
        getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN),
        getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN),
      ]
    },
    [getPageSectionKey(1, 3)]: {
      type: 'object',
      title: 'Victim Information',
      properties: {
        [getEntityAddressKey(1, PEOPLE, OPENLATTICE_ID_FQN)]: {
          type: 'string',
          title: 'Choose the victim to whom restitution is owed',
          enum: [],
          enumNames: [],
        },
      },
      required: [getEntityAddressKey(1, PEOPLE, OPENLATTICE_ID_FQN)]
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
    },
    [getEntityAddressKey(0, FORM, DUE_DATE)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, FORM, GENERAL_DATETIME)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, CRC_CASE, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4'
    },
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
      'ui:widget': 'hidden',
    },
    [getEntityAddressKey(0, FORM, NAME)]: {
      'ui:widget': 'hidden',
    },
  },
  [getPageSectionKey(1, 3)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(1, PEOPLE, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-4',
    },
  },
};

export {
  dataSchema,
  uiSchema,
};
