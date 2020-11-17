// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import { AppTypes, PropertyTypes } from '../../../../core/edm/constants';
import { CaseStatusConstants } from '../constants';

const { OPENLATTICE_ID_FQN } = Constants;

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { STAFF, STATUS } = AppTypes;
const { DESCRIPTION, EFFECTIVE_DATE } = PropertyTypes;
const {
  ACCEPTANCE,
  CIRCLE,
  CLOSED,
  RESOLUTION,
} = CaseStatusConstants;

const STATUS_EAK :string = getEntityAddressKey(0, STATUS, PropertyTypes.STATUS);

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [STATUS_EAK]: {
          type: 'string',
          title: 'Status',
          enum: [ACCEPTANCE, CIRCLE, CLOSED, RESOLUTION]
        },
        [getEntityAddressKey(0, STATUS, EFFECTIVE_DATE)]: {
          type: 'string',
          title: 'Effective date',
          format: 'date',
          default: DateTime.local().toISODate()
        },
        [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
          type: 'string',
          title: 'Staff member',
          enum: [],
          enumNames: [],
        },
      },
      required: [
        STATUS_EAK,
        getEntityAddressKey(0, STATUS, EFFECTIVE_DATE),
        getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)
      ],
      dependencies: {
        [STATUS_EAK]: {
          oneOf: [
            {
              properties: {
                [STATUS_EAK]: {
                  enum: [CLOSED]
                },
                [getEntityAddressKey(0, STATUS, DESCRIPTION)]: {
                  type: 'string',
                  title: 'Reason for closing case',
                }
              }
            },
            {
              properties: {
                [STATUS_EAK]: {
                  enum: [ACCEPTANCE]
                },
              },
            },
            {
              properties: {
                [STATUS_EAK]: {
                  enum: [CIRCLE]
                },
              },
            },
            {
              properties: {
                [STATUS_EAK]: {
                  enum: [RESOLUTION]
                },
              },
            }
          ]
        }
      }
    },
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [STATUS_EAK]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, STATUS, DESCRIPTION)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, STATUS, EFFECTIVE_DATE)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, STAFF, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-12',
    },
  }
};

export {
  schema,
  uiSchema,
};
