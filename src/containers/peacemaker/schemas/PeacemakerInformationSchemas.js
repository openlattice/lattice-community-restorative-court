// @flow
import ISO6391 from 'iso-639-1';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { FormConstants } from '../../profile/src/constants';
import { PeacemakerStatusConstants } from '../constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  COMMUNICATION,
  FORM,
  PEACEMAKER_STATUS,
  PERSON_DETAILS,
} = AppTypes;
const {
  DATETIME_ADMINISTERED,
  EFFECTIVE_DATE,
  GENERAL_DATETIME,
  LANGUAGE,
  INTERESTS_AND_HOBBIES,
  NAME,
  RELIGION,
  STATUS,
  TEXT,
} = PropertyTypes;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;
const { ACTIVE, INACTIVE } = PeacemakerStatusConstants;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, COMMUNICATION, LANGUAGE)]: {
          type: 'array',
          title: 'Languages Spoken',
          items: {
            type: 'string',
            enum: ISO6391.getAllNames(),
          },
          uniqueItems: true,
        },
        [getEntityAddressKey(0, PERSON_DETAILS, INTERESTS_AND_HOBBIES)]: {
          type: 'string',
          title: 'Interests and Hobbies',
        },
        [getEntityAddressKey(0, PERSON_DETAILS, RELIGION)]: {
          type: 'string',
          title: 'Faith Information',
        },
        [getEntityAddressKey(0, FORM, GENERAL_DATETIME)]: {
          type: 'string',
          title: 'Date Trained',
          format: 'date',
        },
        [getEntityAddressKey(0, PEACEMAKER_STATUS, STATUS)]: {
          type: 'string',
          title: 'Current Peacemaker Status',
          enum: [ACTIVE, INACTIVE],
        },
        [getEntityAddressKey(0, FORM, TEXT)]: {
          type: 'string',
          title: 'Why would you like to be a peacemaker?',
        },
      },
      required: [
        getEntityAddressKey(0, COMMUNICATION, LANGUAGE),
        getEntityAddressKey(0, PERSON_DETAILS, INTERESTS_AND_HOBBIES),
        getEntityAddressKey(0, PERSON_DETAILS, RELIGION),
        getEntityAddressKey(0, PEACEMAKER_STATUS, STATUS),
        getEntityAddressKey(0, FORM, TEXT),
      ]
    },
    [getPageSectionKey(1, 2)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
          type: 'string',
          title: 'Datetime Administered',
          default: DateTime.local().toISO()
        },
        [getEntityAddressKey(0, FORM, NAME)]: {
          type: 'string',
          title: 'Form Name',
          default: PEACEMAKER_INFORMATION_FORM
        },
        [getEntityAddressKey(0, PEACEMAKER_STATUS, EFFECTIVE_DATE)]: {
          type: 'string',
          title: 'Peacemaker Status Date',
          default: DateTime.local().toISO()
        }
      },
      required: [
        getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED),
        getEntityAddressKey(0, FORM, NAME),
      ]
    },
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': { editable: true },
    [getEntityAddressKey(0, COMMUNICATION, LANGUAGE)]: {
      classNames: 'column-span-6',
      'ui:options': { multiple: true }
    },
    [getEntityAddressKey(0, PERSON_DETAILS, INTERESTS_AND_HOBBIES)]: {
      classNames: 'column-span-6',
    },
    [getEntityAddressKey(0, PERSON_DETAILS, RELIGION)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, FORM, GENERAL_DATETIME)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, PEACEMAKER_STATUS, STATUS)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, FORM, TEXT)]: {
      classNames: 'column-span-12',
    }
  },
  [getPageSectionKey(1, 2)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
      'ui:widget': 'hidden',
    },
    [getEntityAddressKey(0, FORM, NAME)]: {
      'ui:widget': 'hidden',
    },
    [getEntityAddressKey(0, PEACEMAKER_STATUS, EFFECTIVE_DATE)]: {
      'ui:widget': 'hidden',
    }
  },
};

export {
  schema,
  uiSchema,
};
