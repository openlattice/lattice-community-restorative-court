// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';
import { FormConstants } from '../../profile/src/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { FORM, PERSON_DETAILS } = AppTypes;
const {
  DATETIME_ADMINISTERED,
  NAME,
  PREFERRED_PRONOUNS,
  RELIGION,
} = PropertyTypes;
const { PEACEMAKER_INFORMATION_FORM } = FormConstants;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, PERSON_DETAILS, PREFERRED_PRONOUNS)]: {
          type: 'string',
          title: 'Preferred Pronouns',
        },
        [getEntityAddressKey(0, PERSON_DETAILS, RELIGION)]: {
          type: 'string',
          title: 'Faith Information',
        },
      },
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
      },
    },
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, PERSON_DETAILS, PREFERRED_PRONOUNS)]: {
      classNames: 'column-span-4',
    },
    [getEntityAddressKey(0, PERSON_DETAILS, RELIGION)]: {
      classNames: 'column-span-4',
    },
  },
  [getPageSectionKey(1, 2)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, FORM, DATETIME_ADMINISTERED)]: {
      'ui:widget': 'hidden',
    },
    [getEntityAddressKey(0, FORM, NAME)]: {
      'ui:widget': 'hidden',
    },
  },
};

export {
  schema,
  uiSchema,
};
