// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { ContactActivityConstants } from '../constants';

const { FAILURE, SUCCESS } = ContactActivityConstants;
const { CONTACT_ACTIVITY } = AppTypes;
const { CONTACT_DATETIME, OUTCOME } = PropertyTypes;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, CONTACT_ACTIVITY, CONTACT_DATETIME)]: {
          type: 'string',
          title: 'Date contacted',
          format: 'date',
          default: DateTime.local().toISODate()
        },
        [getEntityAddressKey(0, CONTACT_ACTIVITY, OUTCOME)]: {
          type: 'string',
          title: 'Outcome',
          enum: [SUCCESS, FAILURE]
        },
      },
      required: [
        getEntityAddressKey(0, CONTACT_ACTIVITY, CONTACT_DATETIME),
        getEntityAddressKey(0, CONTACT_ACTIVITY, OUTCOME)
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, CONTACT_ACTIVITY, CONTACT_DATETIME)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, CONTACT_ACTIVITY, OUTCOME)]: {
      classNames: 'column-span-12',
    },
  }
};

export {
  schema,
  uiSchema,
};
