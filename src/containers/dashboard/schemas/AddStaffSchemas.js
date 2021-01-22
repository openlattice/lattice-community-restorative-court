// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import { AppTypes, PropertyTypes } from '../../../core/edm/constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const { STAFF } = AppTypes;
const { GIVEN_NAME, SURNAME } = PropertyTypes;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'array',
      title: '',
      items: {
        type: 'object',
        properties: {
          [getEntityAddressKey(-1, STAFF, GIVEN_NAME)]: {
            type: 'string',
            title: 'First Name',
          },
          [getEntityAddressKey(-1, STAFF, SURNAME)]: {
            type: 'string',
            title: 'Last Name',
          },
        },
      }
    },
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addActionKey: 'addStaff',
      addButtonText: '+ Add New Staff Member',
      // addable: true,
      editable: true,
      orderable: false,
      removable: false,
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, STAFF, GIVEN_NAME)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, STAFF, SURNAME)]: {
        classNames: 'column-span-4'
      },
    }
  },
};

export {
  schema,
  uiSchema,
};
